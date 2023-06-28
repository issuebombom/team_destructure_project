const express = require('express');
const { Op } = require('sequelize');
const { Posts, Users, Likes } = require('../models');
const { verifyAccessToken } = require('../middleware/auth.middleware');

const router = express.Router();

// 게시글 좋아요 API
router.post('/posts/:postId/like', verifyAccessToken, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    console.log(userId, postId);
    console.log('hi');
    const createLike = await Likes.findOne({ where: { UserId: userId, PostId: postId } });
    if (createLike) {
      await createLike.destroy();
      return res.status(200).json({ message: '좋아요 취소완료' });
    }

    await Likes.create({ UserId: userId, PostId: postId });

    res.status(200).json({ message: '좋아요 완료!' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '좋아요 완료실패' });
  }
});
router.get('/posts/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await Likes.findAll({ where: { PostId: postId } });
    console.log(likes.length);
    return res.status(200).json({ message: '좋아요 조회 성공' });
  } catch (error) {
    console.log(error);
  }
});

// 게시글 다시 클릭시 취소? 삭제?  API
router.delete('/posts/:postId/delLike', verifyAccessToken, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { postId } = req.params.postId;

    const deleteLike = await Likes.findOne({ where: { userId, postId } });

    if (!deleteLike) return res.status(400).json({ message: '좋아요를 찾을수 없습니다.' });
    await deleteLike.destroy(userId, postId);
    res.status(200).json({ message: '좋아요 삭제완료' });
  } catch (error) {
    res.status(404).json({ message: '좋아요 삭제실패' });
  }
});

module.exports = router;
