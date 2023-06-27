const jwt = require('jsonwebtoken');
const { Users, Posts, Comments } = require('../models');
const errors = require('../assets/errors');

// 엑세스 토큰 생성기
const getAccessToken = (nickname, userId, refreshToken) => {
  const accessToken = jwt.sign({ nickname, userId, refreshToken }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: '60s',
  });

  return accessToken;
};

// 리프레시 토큰 생성기
const getRefreshToken = (nickname, userId) => {
  const refreshToken = jwt.sign({ nickname, userId }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: '1d',
  });

  return refreshToken;
};

// 엑세스 토큰 검증을 위한 미들웨어
function verifyAccessToken(req, res, next) {
  // 쿠키에서 access token을 획득합니다.
  const cookies = req.cookies;

  // 쿠키가 없는 경우
  if (!cookies?.accessCookie)
    return res.status(errors.noCookie.status).send({ msg: errors.noCookie.msg });

  // access token 검증
  const accessToken = cookies.accessCookie;
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err) => {
    // access token이 만료된 경우 다음 미들웨어에 expired 전달
    if (err) {
      // 콘솔창에 만료됨을 알림
      req.expired = true;
      console.error(err.name, ':', err.message);
    }
    req.user = jwt.decode(accessToken); // 페이로드 전달
    next();
  });
}

// 엑세스 토큰 만료 시 재발급을 위한 미들웨어
async function replaceAccessToken(req, res, next) {
  if (req.expired) {
    try {
      // DB에 저장된 리프레시 토큰 확인
      const user = await Users.findByPk(req.user.userId);
      const innerDatabaseRefreshToken = user.refreshToken;

      // 엑세스 토큰에 저장된 리프레시 토큰 확인
      const innerCookieRefreshToken = req.user.refreshToken;

      // 토큰 일치 여부 확인
      if (innerDatabaseRefreshToken !== innerCookieRefreshToken)
        return res
          .status(errors.refreshTokenDiff.status)
          .send({ msg: errors.refreshTokenDiff.msg });

      // // jwt 토큰 검증(해당 검증 방법이 굳이 필요한가 싶어 아래 방식으로 대체함)
      // const refreshToken = user.refreshToken;
      // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err) => {
      //   // refresh token이 만료된 경우 재로그인 안내
      //   if (err)
      //     return res.status(errors.expiredRefresh.status).send({ msg: errors.expiredRefresh.msg });
      // });

      // 토큰 재발급 및 쿠키로 보냄
      res.cookie(
        'accessCookie',
        getAccessToken(user.nickname, user.userId, getRefreshToken(user.nickname, user.userId)),
        {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24시간
        }
      );
      console.log('엑세스 토큰 만료로 재발급 진행');
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(400).send({ msg: `${err.message}` });
    }
  }
  res.locals.user = req.user
  next();
}

// // 게시글 수정 권한 검증을 위한 미들웨어
// async function verificationForPosts(req, res, next) {
//   const postId = req.params.postId;
//   const password = req.body.password; // form 태그에서 받음
//   const userId = req.accessTokenInfo.userId; // 미들웨어 토큰에서 가져온 정보

//   try {
//     const findPost = await Post.findByPk(postId);

//     if (!findPost) return res.status(errors.noPost.status).send({ msg: errors.noPost.msg });

//     if (findPost.userId !== userId)
//       return res.status(errors.cantChangePost.status).send({ msg: errors.cantChangePost.msg });
//     next();
//   } catch (err) {
//     console.error(err.name, ':', err.message);
//     return res.status(400).send({ msg: `${err.message}` });
//   }
// }

// // 댓글 수정 권한 검증을 위한 미들웨어
// async function verificationForComments(req, res, next) {
//   const { postId, commentId } = req.params;
//   const password = req.body.password; // form태그에서 받음
//   const userId = req.accessTokenInfo.userId; // 미들웨어 토큰에서 가져온 정보

//   try {
//     const findPost = await Post.findByPk(postId);
//     const findComment = await Comment.findByPk(commentId);

//     if (!findPost) return res.status(errors.noPost.status).send({ msg: errors.noPost.msg });

//     if (!findComment)
//       return res.status(errors.noComment.status).send({ msg: errors.noComment.msg });

//     if (findComment.userId !== userId)
//       return res
//         .status(errors.cantChangeComment.status)
//         .send({ msg: errors.cantChangeComment.msg });
//     next();
//   } catch (err) {
//     console.error(err.name, ':', err.message);
//     return res.status(400).send({ msg: `${err.message}` });
//   }
// }

module.exports = {
  getAccessToken,
  getRefreshToken,
  verifyAccessToken,
  replaceAccessToken,
  // verificationForPosts,
  // verificationForComments,
};
