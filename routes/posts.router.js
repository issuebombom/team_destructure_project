const express = require('express');
const { Op } = require('sequelize');
const { Posts } = require('../models');
const { verifyAccessToken, replaceAccessToken } = require('./middleware/auth.middleware');
const router = express.Router();

// 게시글 작성
// img 경로에 대한 확인이 필요
router.post('/posts', async (req, res) => {
  try {
    const userId = res.locals.user;
    const { category, nickname, title, content } = req.body;

    if (!title || !content) {
      res.status(412).json({
        message: '제목 또는 내용을 입력해주세요',
      });
      return;
    }

    await Posts.create({
      UserId: userId.userId,
      nickname: nickname,
      category,
      title,
      content,
      likes,
    });

    res.status(201).json({
      message: '게시글 생성완료',
    });
  } catch {
    return res.status(412).json({
      message: '데이터 형식이 올바르지 않아 생성에 실패했습니다.',
    });
  }
});

// 최신 게시글 조회 API
// res는 추후 수정필요 (하나의 파일로 관리하여 오류메세지 통일)
router.get('/posts', async (req, res) => {
  try {
    const postList = await Posts.findAll({
      attributes: ['nickname', 'category', 'title', 'content'],
      order: [['createdAt', 'DESC']],
    });

    if (!postList.length) {
      return res.status(404).json({
        message: '조회할 게시글이 없습니다.',
      });
    }

    res.status(200).json({
      postList: postList,
    });
  } catch {
    return res.status(400).json({
      message: '게시글 조회에 실패하였습니다.',
    });
  }
});

// 관심사 게시글 조회
router.get('/posts/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    // userId.category와 DB에서찾아온 category값을 비교하여 맞는 데이터를 출력해주는 느낌으로
    // const { userId } = res.locals.user;
    if (!category) {
      return res.status(404).json({
        message: '설정된 관심사가 없습니다. 마이페이지에서 관심사를 등록해주세요.',
      });
    }

    const interests = await Posts.findAll({ where: { category } });

    res.status(200).json({
      interests: interests,
    });
  } catch {
    return res.status(400).json({
      message: '게시글 조회에 실패하였습니다.',
    });
  }
});

// 게시글 상세 조회
router.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const postDetail = await Posts.findOne({
      attributes: [
        'postId',
        'userId',
        'category',
        'nickname',
        'title',
        'content',
        'img',
        'createdAt',
        'updatedAt',
      ],
      where: { postId },
    });

    if (!postDetail) {
      return res.status(404).json({
        message: '해당 게시글을 찾을 수 없습니다.',
      });
    }

    res.status(200).json({
      Detail: postDetail,
    });
  } catch {
    return res.status(400).json({
      message: '게시글 조회에 실패하였습니다.',
    });
  }
});

// 게시글 수정
// 수정&삭제버튼은 작성자에게만 보이는 기능인지?  있다면 아래 주석 삭제
router.put('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { category, title, content } = req.body;

    const modifyPost = await Posts.findOne({ where: { postId } });
    if (!modifyPost) {
      return res.status(404).json({ message: '해당 게시글을 찾을 수 없습니다.' });
    } else if (!category || !title || !content) {
      return res.status(400).json({ message: '카테고리, 제목, 내용을 입력해주세요.' });
    } // else if (modifyPost.UserId !== userId) {
    //return res.status(401).json({ message : "수정권한이 없습니다."})
    else {
      await Posts.update(
        { category, title, content },
        { where: { [Op.and]: [{ postId }, { UserId: userId }] } }
      );
      return res.status(201).json({
        message: '게시글 수정 완료',
      });
    }
  } catch {
    return res.status(400).json({
      message: '게시글 수정에 실패하였습니다.',
    });
  }
});

// 게시글 삭제
// 수정과 마찬가지로 작성자에게만 보이는 버튼이라면 아래 주석 삭제
router.delete('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const deletePost = await Posts.findOne({ where: { postId } });

    if (!deletePost) {
      return res.status(404).json({ message: '해당 게시글을 찾을 수 없습니다.' });
    } //else if (deletePost.UserId !== userId) {
    //return res.status(400).json({ message : "삭제권한이 없습니다."})
    else {
      await Posts.destroy({
        where: {
          [Op.and]: [{ postId }, { UserId: userId }],
        },
      });
      res.status(204).json();
    }
  } catch {
    return res.status(400).json({
      message: '게시글 삭제에 실패하였습니다.',
    });
  }
});

module.exports = router;
