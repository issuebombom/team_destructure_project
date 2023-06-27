require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const { verifyAccessToken, replaceAccessToken } = require('./middleware/auth.middleware');

// 각 라우트 파일 이름이 정해지면 변경해서 활성화하기
const usersRouter = require('./routes/users.router');
const postsRouter = require('./routes/posts.router');
// const commentsRouter = require('./routes/comments.router');

const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser()); // npm i cookie-parser

app.use('/', [usersRouter, postsRouter]);

app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
