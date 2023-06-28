const express = require('express');
const { Op, Sequelize } = require('sequelize');
const { verifyAccessToken } = require('../middleware/auth.middleware.js');
const { Users, Posts, Comments } = require('../models');
const bcrypt = require('bcrypt');
const router = express.Router();

// 유저 정보 조회 (유저정보 + 게시글 + 댓글)
router.get('/mypage/:userId', verifyAccessToken, async (req, res) => {
  const { userId } = req.params;
  const userData = res.locals.user;

  try {
    if (userId === String(userData.userId)) {
      // 유저 정보 조회
      const user = await Users.findOne({
        attributes: [
          'nickname',
          'password',
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
        attributes: ['content', [Sequelize.fn('left', Sequelize.col('createdAt'), 10), 'date']],
        where: { UserId: userId },
      });

      // 유저 정보 조회
      return res.status(200).json({
        user,
        posts: post,
        comments: comment,
      });
    } else {
      return res.status(401).json({ errorMessage: '회원 정보를 찾을수 없습니다.' });
    }
  } catch (err) {
    res.status(400).json({ errorMessage: '유저 정보 조회에 실패하였습니다.' });
  }
});

// 유저 정보 수정
router.put('/mypage/:userId', verifyAccessToken, async (req, res) => {
  const { userId } = req.params;
  const { nickname, afterPassword, confirm, interest } = req.body;
  const userData = res.locals.user;
  // 비밀번호 해쉬화
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(afterPassword, saltRounds);
  const { password } = await Users.findOne({ where: { userId } });

  // console.log(password); // Users 모델에 저장되어 있는 userId의 패스워드
  // console.log(hashedPassword); // 바디에 입력받은 password를 단방향 암호화 시킨것
  const match = await bcrypt.compare(afterPassword, password);

  try {
    // nickname 체크
    if (nickname === '' || nickname === undefined) {
      return res.status(412).json({ errorMessage: '닉네임의 형식이 올바르지 않습니다.' });
    }
    // afterPassword 체크
    if (afterPassword === '' || afterPassword === undefined) {
      return res.status(412).json({ errorMessage: '비밀번호의 형식이 올바르지 않습니다.' });
    }
    // interest 체크
    if (interest === '' || interest === undefined) {
      return res.status(412).json({ errorMessage: '관심사의 형식이 올바르지 않습니다.' });
    }
    // afterPassword 일치 확인
    if (afterPassword !== confirm) {
      return res
        .status(401)
        .json({ errorMessage: '변경하고자 하는 비밀번호가 일치하지 않습니다.' });
    }
    // 이전 password와 변경할 password가 같은 값인지 확인.
    if (match) {
      return res.status(401).json({ errorMessage: '새로운 비밀번호를 입력해주세요.' });
    }
    await Users.update(
      { nickname, password: hashedPassword, interest }, // 변경하고자 하는 컬럼 및 데이터
      {
        where: { [Op.and]: [{ userId: String(userData.userId) }] }, // 일치 조건
      }
    ).catch((err) => {
      console.log(err);
      return res.status(401).json({ errorMessage: '유저정보가 정상적으로 수정되지 않았습니다.' }); // 확인
    });
    return res.status(201).json({ message: '유저정보를 성공적으로 수정하였습니다.' }); // 확인
  } catch (error) {
    return res.status(400).json({ errorMessage: '유저정보 수정에 실패하였습니다.' });
  }
});

module.exports = router;
