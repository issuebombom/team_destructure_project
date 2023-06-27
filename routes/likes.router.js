const express = require('express');
const { Likes } = require('../models'); // likes 모델 ?
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { Op } = require('sequelize');
const router = express.Router();

// 게시글 좋아요 API
router.post('/posts/:postId/like', async (req, res) => {
  try {
    const { title, content } = req.body;
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const like = new Likes({});
  } catch (error) {}
});

// 게시글 좋아요 취소 API
router.delete('/post/:postId/like', async (req, res) => {});
module.exports = router;
