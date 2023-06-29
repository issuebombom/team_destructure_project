const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/uploadMiddleware');

// S3 이미지 업로드
router.post('/upload', uploadMiddleware.single('file'), (req, res) => {
  return res.json({ message: '이미지 업로드 성공' });
});
module.exports = router;
