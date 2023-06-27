const express = require('express');
const { Posts } = require('../models'); // likes 모델 ?

const { Op } = require('sequelize');
const router = express.Router();

// 게시글 좋아요 API
router.post('/posts/:postId/like', async (req, res) => {});

// 게시글 좋아요 취소 API
router.delete('/post/:postId/like', async (req, res) => {});
module.exports = router;
