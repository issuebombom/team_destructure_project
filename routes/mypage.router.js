const express = require('express');
const { Op } = require('sequelize');


const { verifyAccessToken, replaceAccessToken } = require('../middleware/auth.middleware.js');
const Users = require('../models/users.js');
const Posts = require('../models/posts.js');

const Comments = require('../models/comments.js');
const router = express.Router();

router.get('/mypage', async (req, res) => {
  const post = await Users.findOne({ where: { userId: 3 } });
  // console.log(post);
  res.status(200).json({ msg: '연결 완료' });
});

// 유저 정보 조회
router.get('/mypage/:userId', verifyAccessToken,replaceAccessToken, async (req, res) => {
  const { userId } = req.params;
  const userData2 = res.locals.user;
  try {
    if (!userId) {
      return res.status(401).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }
    if (userId === String(userData2.userId)) {
      const user = await Users.findOne({ where: { userId } });
      return res
        .status(200)
        .json({ nickname: user.nickname, password: user.password, email: user.email });
    } else {
      return res.status(401).json({ errorMessage: '회원 정보를 찾을수 없습니다.' });
    }
  } catch (err) {
    res.status(400).json({ errorMessage: '유저 정보 조회에 실패하였습니다.' });
  }
});

// 유저 정보 수정
router.put('/mypage/:userId', verifyAccessToken, replaceAccessToken, async (req, res) => {
  const { userId } = req.params;
  const { nickname, email, password, category } = req.body;
  try {
    if (nickname === '' || nickname === undefined) {
      return res.status(412).json({ errorMessage: '닉네임의 형식이 올바르지 않습니다.' });
    }
    if (email === '' || email === undefined) {
      return res.status(412).json({ errorMessage: '이메일의 형식이 올바르지 않습니다.' });
    }
    if (password === '' || password === undefined) {
      return res.status(412).json({ errorMessage: '비밀번호의 형식이 올바르지 않습니다.' });
    }
    if (category === '' || category === undefined) {
      return res.status(412).json({ errorMessage: '카테고리의 형식이 올바르지 않습니다.' });
    }
    await Users.updateOne(
      { userId: userId },
      { $set: { nickname, email, password, category } }
    ).catch((err) => {
      res.status(401).json({ errorMessage: '유저정보가 정상적으로 수정되지 않았습니다.' });
    });
    res.status(201).json({ message: '유저정보를 성공적으로 수정하였습니다.' });
  } catch (error) {
    res.status(400).json({ errorMessage: '유저정보 수정에 실패하였습니다.' });
  }
});

module.exports = router;
