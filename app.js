require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path')

const usersRouter = require('./routes/users.router');
const postsRouter = require('./routes/posts.router');
const uploadRouter = require('./routes/upload.router');
const mypageRouter = require('./routes/mypage.router');
const commentsRouter = require('./routes/comments.router');
const likeRouter = require('./routes/likes.router');

const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

/* 
express.static을 통해 설정해 둔 폴더에 한해서만 html에서 js나 css 등 static 파일들을
불러올 때 문제가 없다. 안그러면 아래 메시지를 만나게 된다.
'Refused to execute script from 'http://localhost:3000/login/login/login.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.

app.use(express.static(path.join(__dirname, 'assets')));

assets 폴더에 대해 static 등록을 해두면 이제 html head에 입력하는 css나 js를 아래와 같이 불러오면 된다.

/main/index.js

참고로 index.js파일은 assets폴더 내 main폴더 안에 있어야 한다. 즉 assets폴더는 경로 지정에서 제외되었음을 알 수 있다.
*/
app.use(express.static(path.join(__dirname, 'assets')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('assets', path.join(__dirname, 'assets'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // npm i cookie-parser

app.use('/', [usersRouter, postsRouter, mypageRouter, uploadRouter, commentsRouter, likeRouter]);

app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
