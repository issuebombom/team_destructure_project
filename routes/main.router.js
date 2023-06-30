const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // html이 아닌 노드 안에서 fetch하려면 필요함

// 메인 페이지 이동
router.get('/main', async (req, res) => {
    try {
      const response = await fetch('http://localhost:3000/posts/newPost');
      const data = await response.json();

    res.render('main', {
      data,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
