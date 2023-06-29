const express = require('express');
const router = express.Router();

// 메인 페이지 이동
router.get('/main', async (req, res) => {
  res.render('main');
});

module.exports = router;
