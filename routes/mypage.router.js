const express = require('express');
const { Op, Sequelize } = require('sequelize');
const { verifyAccessToken } = require('../middleware/auth.middleware.js');
const { Users, Posts, Comments } = require('../models');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/user/mypage/:userId', verifyAccessToken, async (req, res) => {
  const userData = res.locals.user;
  res.render('mypage.ejs', { userId: userData.userId });
});

// 유저 정보 조회 (유저정보 + 게시글 + 댓글)
router.get('/mypage/:userId', verifyAccessToken, async (req, res) => {
  const { userId } = req.params;
  const userData = res.locals.user;
  console.log(userData);

  try {
    if (userId === String(userData.userId)) {
      // 유저 정보 조회
      const user = await Users.findOne({
        attributes: [
          'nickname',
          'email',
          'interest',
          [Sequelize.fn('left', Sequelize.col('createdAt'), 10), 'date'],
        ],
        where: { userId },
      });

      // 유저의 게시글 조회
      const post = await Posts.findAll({
        attributes: [
          'title',
          'content',
          [Sequelize.fn('left', Sequelize.col('createdAt'), 10), 'date'],
        ],
        where: { UserId: userId },
      });

      // 유저의 댓글 조회
      const comment = await Comments.findAll({
        attributes: [
          'PostId',
          'content',
          [Sequelize.fn('left', Sequelize.col('createdAt'), 10), 'date'],
        ],
        where: { UserId: userId },
      });

      // 유저의 정보, 게시글, 댓글 조회
      return res.status(200).json({
        user,
        posts: post,
        comments: comment,
      });
    } else {
      return res.status(401).json({ errorMessage: '회원 정보에 접근권한이 없습니다.' });
    }
  } catch (err) {
    res.status(400).json({ errorMessage: '유저 정보 조회에 실패하였습니다.' });
  }
});

// 유저 정보 수정 (nickname,interest,password)

// 유저 닉네임 변경코드
router.put('/mypage/:userId/nickname', verifyAccessToken, async (req, res) => {
  const userData = res.locals.user;
  const { userId } = req.params;
  const { nickname } = req.body;

  // 닉네임 변경 권한 확인
  if (userData.userId !== Number(userId)) {
    return res.status(412).json({ errorMessage: '닉네임 변경권한이 없습니다.' });
  }

  // 닉네임 구성요소 확인
  try {
    const confirmedNickname = /^[a-zA-Z0-9]{3,}$/.test(nickname); // test() 메서드로 Boolean 값을 할당하고
    if (!confirmedNickname) {
      return res.status(412).json({
        errorMessage: '닉네임은 3글자 이상의 영문 대소문자, 숫자만 허용합니다.',
      });
    }

    // 닉네임 중복확인
    const existNickname = await Users.findAll({ where: { nickname } });
    // console.log(existNickname.length);
    if (existNickname.length !== 0) {
      return res.status(412).json({
        errorMessage: '이미 존재하는 닉네임 입니다.',
      });
    }

    await Users.update({ nickname }, { where: { [Op.and]: [{ userId: userData.userId }] } });
    return res.status(200).json({ message: '닉네임 수정이 정상적으로 완료되었습니다.' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: '닉네임 변경에 실패하였습니다.' });
  }
});

// 유저 관심사 변경코드
router.put('/mypage/:userId/interest', verifyAccessToken, async (req, res) => {
  const userData = res.locals.user;
  const { userId } = req.params;
  const { interest } = req.body;

  const interestArr = ['Music', 'Restaurant', 'Exercise', 'Movie', 'Travel'];

  try {
    // 관심사 변경 권한 확인
    if (userData.userId !== Number(userId)) {
      return res.status(412).json({ errorMessage: '관심사 변경권한이 없습니다.' });
    }

    // 관심사 형식 예외 처리
    if (!interest || interest.includes(' ') || interest === '' || interest === undefined) {
      return res.status(412).json({ errorMessage: '작성한 관심사의 형식이 올바르지 않습니다.' });
    }

    // 관심사 리스트 외의 요소들 예외 처리
    if (!interestArr.includes(interest)) {
      return res.status(412).json({ errorMessage: '작성한 관심사가 리스트에 존재하지 않습니다.' });
    }

    // 관심사 변경
    await Users.update({ interest }, { where: { [Op.and]: [{ userId: userData.userId }] } });
    return res.status(200).json({ message: '관심사 수정이 정상적으로 완료되었습니다.' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: '관심사 변경에 실패하였습니다.' });
  }
});

// 유저 패스워드 변경코드
router.put('/mypage/:userId/password', verifyAccessToken, async (req, res) => {
  const userData = res.locals.user;
  const { userId } = req.params;
  const { newPassword, confirm } = req.body;
  // console.log();

  // 바디에 입력받은 newPassword 해쉬화
  const saltRounds = 10;

  // 바디에 입력받은 newPassword를 단방향 암호화 시킨것
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  console.log(hashedPassword);

  // Users 모델에 저장되어 있는 userId의 패스워드
  const { password } = await Users.findOne({ where: { userId } });
  console.log(password);

  // 해쉬화 시킨 패스워드와, 로그인된 유저의 패스워드가 일치한지 확인
  const matchPassword = await bcrypt.compare(newPassword, password);
  console.log(matchPassword);

  try {
    // 패스워드 변경 권한 확인
    if (userData.userId !== Number(userId)) {
      return res.status(412).json({ errorMessage: '패스워드 변경권한이 없습니다.' });
    }

    // 패스워드형식 예외처리
    if (
      !newPassword ||
      newPassword.includes(' ') ||
      newPassword === '' ||
      newPassword === undefined
    ) {
      return res.status(412).json({ errorMessage: '패스워드의 형식이 올바르지 않습니다.' });
    }

    // 패스워드 구성요소 확인
    const checkPassword = /^[a-zA-Z0-9]{3,}$/.test(newPassword);
    if (!checkPassword) {
      return res.status(412).json({
        errorMessage: '패스워드는 영대소문자와 숫자로만 구성될 수 있습니다.',
      });
    }

    // 기존의 패스워드와 다른지 확인
    if (matchPassword) {
      return res.status(401).json({ errorMessage: '새로운 비밀번호를 입력해주세요.' });
    }

    // 패스워드 confirm값과 일치한지 확인
    if (newPassword !== confirm) {
      return res.status(412).json({
        errorMessage: '패스워드 확인값이 일치하지 않습니다.',
      });
    }

    // 패스워드 변경
    await Users.update(
      { password: hashedPassword }, // 변경하고자 하는 컬럼 및 데이터
      {
        where: { [Op.and]: [{ userId: userData.userId }] }, // 일치 조건
      }
    ).catch((err) => {
      console.log(err);
      return res.status(401).json({ errorMessage: '패스워드가 변경되지 않았습니다.' }); // 확인
    });
    return res.status(201).json({ message: '패스워드를 성공적으로 수정하였습니다.' }); // 확인
  } catch (error) {
    return res.status(400).json({ errorMessage: '패스워드 변경에 실패하였습니다.' });
  }
});

// 회원탈퇴
router.delete('/mypage/:userId', verifyAccessToken, async (req, res) => {
  const userData = res.locals.user;
  const { userId } = req.params;
  const { password, confirm } = req.body;

  try {
    // 회원탈퇴 권한 확인
    if (userData.userId !== Number(userId)) {
      return res.status(412).json({ errorMessage: '회원탈퇴 권한이 없습니다.' });
    }

    // password가 confirm값과 일치하면 회원탈퇴 진행.
    if (password !== confirm) {
      return res.status(412).json({ errorMessage: '패스워드 확인값이 일치하지 않습니다.' });
    }

    // 회원탈퇴
    await Users.destroy({ where: { userId } });
    return res.status(200).json({ message: '회원탈퇴가 정상적으로 완료되었습니다.' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ errorMessage: '회원탈퇴가 정상적으로 처리되지 않았습니다.' });
  }
});
module.exports = router;
