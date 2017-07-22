const db = require('./mongo.js');
const verify = require('./sdk/verify.js');
var userSchema = db.hexo.Schema({
  uid: Number,
  token: Number,
  name: String,
  email: String,
  detail: String,
  web: String,
  sex: Number,
  level: Number,
  exp: Number,
  class: Number,
}, { collection: 'users' });
var userDB = db.hexo.model('users', userSchema);
exports.db = userDB;

exports.login = (req, res, next) => {
  verify.getUserInfo(req.body.code, (data) => {
    if (data.state == 'ok') {
      userDB.findOne({ uid: data.userData.uid }, (err, val) => { //更新用户信息
        res.locals.userLevel = 0;
        res.locals.userExp = 0;
        res.locals.userClass = 0;
        res.locals.myData = data.userData;
        if (val === null) {
          db.insertDate(userDB, {
            uid: data.userData.uid,
            token: 0,
            name: data.userData.name,
            email: data.userData.email,
            detail: data.userData.detail,
            web: data.userData.web,
            sex: data.userData.sex,
            level: 0,
            exp: 0,
            class: 0,
          }, () => {
            next();
          });
        } else {
          res.locals.userClass = val.class;
          res.locals.userExp = val.exp;
          res.locals.userLevel = val.level;
          val.name = data.userData.name;
          val.email = data.userData.email;
          val.detail = data.userData.detail;
          val.web = data.userData.web;
          val.sex = data.userData.sex;
          val.save(() => { next(); });
        }
      });
    } else {
      res.send(data); //登陆失败
    }
  });
};

exports.login_send = (req, res, next) => {
  verify.makeNewToken(req, res, res.locals.myData.uid, () => {
    res.send({
      state: 'ok',
      name: res.locals.myData.name,
      email: res.locals.myData.email,
      detail: res.locals.myData.detail,
      web: res.locals.myData.web,
      sex: res.locals.myData.sex,
      level: res.locals.userLevel,
      exp: res.locals.userExp,
      class: res.locals.userClass,
    });
  });
}