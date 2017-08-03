const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // cookie模块
const verify = require('./sdk/verify.js');
const Article = require('./article.js');
const User = require('./user.js');
//const verify = require('./sdk/verify.js');

app.use(cookieParser()); // cookie模块
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = app.listen(30004, '127.0.0.1', function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
//日志处理
app.use((req, res, next) => {
  var nowTime = new Date();
  console.log('Time:' + nowTime + '|| Form' + req.url + '||' + req.headers.referer);
  next();
});

app.get('/', (req, res) => {
  res.send('Hexo auxiliary system is running');
});

app.post('/getReadCount', Article.getReadCount); //获取文章阅读人数
app.post('/addReading', Article.addReading); //增加文章阅读人数
app.post('/getComments', Article.getComments); //获取评论
app.post('/addComment', verify.checkToken, Article.addComment); //提交评论

app.post('/login', User.login, User.login_send); //用户登录
app.post('/logout', verify.logout); //退出登陆