const fs = require('fs');
const db = require('./mongo.js');
const verify = require('./sdk/verify.js');

let artSchema = db.hexo.Schema({
  url: String,
  readCounts: Number,
  comment: []
}, { collection: 'article' });
var artDB = db.hexo.model('article', artSchema);

exports.getReadCount = (req, res, next) => {
  var numData = [];
  artDB.find({}, (err, val) => {
    for (let data in val) {
      numData.push({
        url: val[data].url,
        readCounts: val[data].readCounts,
      });
    }
    numData.push({
      url: 'END',
      readCounts: 0,
    });
    res.send({ state: 'sure', data: numData });
  });
};

exports.addReading = (req, res, next) => {
  artDB.findOne({ url: req.body.url }, (err, val) => {
    if (val === null) {
      res.send({ state: 'ok', readCounts: 1 });
      db.insertDate(artDB, {
        url: req.body.url,
        readCounts: 1,
        comment: [],
      });
    } else {
      res.send({ state: 'ok', readCounts: val.readCounts + 1 });
      val.readCounts += 1;
      val.save((err) => {});
    }
  });
};

exports.getComments = (req, res, next) => {
  artDB.findOne({ url: req.body.url }, (err, val) => {
    if (val !== null) {
      res.send({ state: 'ok', comments: val.comment });
    } else {
      res.send({ state: 'nothing' });
    }
  });
};

exports.addComment = (req, res, next) => {
  artDB.findOne({ url: req.body.url }, (err, val) => {
    if (val !== null) {

      val.comment.push({
        user: verify.getUserData(res).name,
        time: getTime(),
        text: req.body.text,
      });
      val.save((err) => {
        res.send({ state: 'ok' });
      });
    } else {
      res.send({ state: 'failed' });
    }
  });
}

let getTime = () => {
  var date = new Date();
  var now = "";
  now = date.getFullYear() + "-";
  now = now + (date.getMonth() + 1) + "-";
  now = now + date.getDate() + " ";
  now = now + date.getHours() + ":";
  now = now + date.getMinutes() + ":";
  now = now + date.getSeconds() + "";
  return now;
};