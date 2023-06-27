require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const { verifyAccessToken, replaceAccessToken } = require('./middleware/auth.middleware');
const postsRouter = require('./routes/posts.router');
const mypageRouter = require('./routes/mypage.route');
const usersRouter = require('./routes/users.router');
<<<<<<< HEAD

const postsRouter = require('./routes/posts.router');
=======
// const postsRouter = require('./routes/posts.router');
>>>>>>> f167487 (after merge)
// const commentsRouter = require('./routes/comments.router');


const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser()); // npm i cookie-parser

<<<<<<< HEAD

app.post('/signup', usersRouter.signup);
app.post('/login', usersRouter.login);
app.get('/logout/:userId', usersRouter.logout);
// app.get('/users/:userId', verifyAccessToken, replaceAccessToken, usersRouter.getUser); // 미들웨어 테스트용
app.use('/', [postsRouter, mypageRouter]);
app.use('/', [usersRouter, postsRouter]);
=======
// 각 라우트 파일 이름이 정해지면 변경해서 활성화하기
app.use('/', [postsRouter]);
>>>>>>> f167487 (after merge)


app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
