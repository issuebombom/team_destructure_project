const express = require('express');
const { Comments } = require('../models');
const router = express.Router();
const errors = require('../assets/errors.js');

//댓글 불러오기
router.get('/:postId', async (req, res) => {
  const postId = req.params.postId;

  const comments = await Comments.findAll({ where: { postId: postId } });
  const data = comments.map((comments) => {
    return {
      commentId: comments.commentId,
      content: comments.content,
      // userId: comments.userId
    };
  });
  res.json(data);
});

//댓글 작성
router.post('/:postId', async (req, res) => {
  const { PostId } = req.params;
  const { UserId } = res.locals.user;
  const { content } = req.body;
  try {
    await Comments.create({ content, PostId, UserId });
    res.status(200).json({ message: '댓글 작성 완료' });
  } catch {
    return res.status(errors.makecomment.status).send({ msg: errors.makecomment.msg });
  }
});

//댓글 수정
router.put('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const { userId } = res.locals.user;

  const comment = await Comments.findOne({ where: { commentId: commentId } });
  if (comment.userId !== userId) {
    return res.status(errors.theotherone.status).send({ msg: errors.theotherone.msg });
  } else {
    await Comments.update({ content: content }), //수정할 데이터
      { where: { commentId: commentId } }; //수정할 부분
  }
  res.status(201).json({ message: '댓글 수정 완료' });
});

//댓글 삭제
router.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { userId } = res.locals.user;

  const comment = await Comments.findOne({ where: { commentId: commentId } });
  if (comment.userId !== userId) {
    return res.status(errors.theotherone.status).send({ msg: errors.theotherone.msg });
  } else {
    await Comments.destroy({ where: { commentId: commentId } }); //수정할 부분
  }
  res.status(201).json({ message: '댓글 삭제 완료' });
});

module.exports = router;
