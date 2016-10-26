/*
* 挑战赛.单选题挑战功能模块
* */

'use strict';

var express = require('express'),
  router = express.Router(),
  mongo = require('mongodb'),
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test_system';

MongoClient.connect(url)
  .then(function(db) {
    Router(db);
  })
  .catch(function(err) {
    console.log("connected db failed!");
  });

function Router(db) {
  /*
  * 获取所有学生数据
  * */
  router.get('/', function(req, res) {
    var collection = db.collection('student');
    collection.find({}).toArray()
      .then(function(students) {
        res.render('fight/single_sel.html', {students: students});
      })
      .catch(function(err) {
        res.send({status: false, msg: '查询数据库有误!'});
      });
  });
}

module.exports = router;