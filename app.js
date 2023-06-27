require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const Users = require('./models/users');

const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser()); // npm i cookie-parser

// 각 라우트 파일 이름이 정해지면 변경해서 활성화하기
// const usersRouter = require('./routes/users.router');
// const authorizationRouter = require('./routes/authorization.router');
const postsRouter = require('./routes/posts.router');

// app.use('/users', usersRouter);
// app.use('/auth', authorizationRouter);
app.use('/posts', postsRouter);

// 예시
app.get('/', async (req, res) => {
  try {
    const findUsers = await Users.findByPk(1);
  } catch {
    res.send({ msg: '데이터가 없음' });
  }
});

app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
