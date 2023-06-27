const express = require('express');
const { Posts } = require('../models');

const { Op } = require('sequelize');
const router = express.Router();

// 최신 게시글 조회 API
router.get('/posts', async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: ['UserId', 'category', 'title', 'content', 'likes'], // 조회 할 목록들입니다.
      order: [['createdAt', 'DESC']], // 내림차순으로 조회합니다.
    });
    if (!posts) return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    return res.status(200).json({ data: posts });
  } catch (error) {
    res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
  }
});

// 게시글 상세 조회 API
router.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({
      where: { postId },
      attributes: [
        'userId',
        'nickname',
        'title',
        'category',
        'content',
        'likes',
        'img',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!postId) return res.status(403).json({ message: '해당 게시글이 없습니다.' });
    return res.status(200).json({ data: post });
  } catch (err) {
    res.status(404).json({ message: '게시글 조회 실패' });
  }
});

// 관심 게시글 조회      // if category === userId.category가 같을때 한번에 조회하는 방법 => 작성 필요
router.get('/posts/category', async (req, res) => {
  try {
    const { category } = req.params;
    const { userId } = res.locals.user;
    const { likePost } = await Posts.findAll({
      where: { category },
    });
    if (!likePost) return res.status(403).json({ message: '해당하는 카테고리가 x' });
    return res.status(200).json({ data: likePost });
  } catch (error) {
    res.status(400).json({ message: '관심 게시글 조회에 실패하였습니다.' });
  }
});

// 게시글 작성 API
router.post('/posts', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const { userId } = res.locals.user;
    const post = await Posts.create({
      UserId: userId,
      title,
      content,
      category,
      likes,
    });
    if (!post) return res.status(400).json({ message: '게시글 작성에 실패하였습니다.' });
    return res.status(200).json({ data: { post } });
  } catch (error) {
    res.status(400).json({ message: '게시글 생성에 실패하였습니다.' });
  }
});

//게시글 수정 API
router.put('/posts/:postId', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const rePost = await Posts.findById({
      where: { postId },
    });
    if (!rePost) res.status(403).json({ message: '해당 게시글을 찾을수 없습니다.' });
    await Posts.update({
      where: { [Op.and]: [{ postId }, { UserId: userId }, { title, content, category }] },
    });
    if (!content || !title)
      return res.status(403).json({ message: '제목 또는 내용을 입력해주세요.' });

    return res.status(200).json({ message: '수정이 완료되었습니다.' });
  } catch (error) {
    res.status(400).json({ message: '수정에 실패하였습니다.' });
  }
});

// 게시글 삭제 API
router.delete('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const deletePost = await Posts.findOne({
      where: { postId: postId },
    });

    if (!deletePost) return res.status(403).json({ message: '게시글 존재x' });
    // 게시글 삭제하는 단계
    await Posts.destroy({
      where: {
        // 어떤 데이터를 삭제할지
        [Op.and]: [{ postId }, { UserId: userId }], // 게시글의 아이디와 유저아이디가 일치시 삭제
      },
    });
    return res.status(204).json();
  } catch (err) {
    res.status(400).json({ error: '게시글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
