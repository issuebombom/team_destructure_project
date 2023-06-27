require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');

const mypageRouter = require('./routes/mypage.route');
const usersRouter = require('./routes/users.router');
const postsRouter = require('./routes/posts.router');
// const commentsRouter = require('./routes/comments.router');

const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser()); // npm i cookie-parser

app.use('/', [usersRouter, postsRouter, mypageRouter]);

app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
