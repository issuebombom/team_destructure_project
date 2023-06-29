require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');

const usersRouter = require('./routes/users.router');
const postsRouter = require('./routes/posts.router');
const uploadRouter = require('./routes/upload.router');
const mypageRouter = require('./routes/mypage.router');
const commentsRouter = require('./routes/comments.router');
const likeRouter = require('./routes/likes.router');

const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));
app.set('views', __dirname + '/views'); // 경로설정

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // npm i cookie-parser

app.use('/', [usersRouter, postsRouter, mypageRouter, uploadRouter, commentsRouter, likeRouter]);

app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
