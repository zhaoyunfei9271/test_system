/*
* 挑战记录.单选题挑战记录
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
  * 获取所有的挑战记录
  * */
  router.get('/', function(req, res) {
    var fight_col = db.collection('fight_single_sel'),
      student_col = db.collection('students');
    fight_col.find({}).toArray()
      .then(function(records) {
        student_col.find({}).toArray()
          .then(function(students) {
            var students_id_name = {};
            for (var i = 0; i < students.length; i++) {
              students_id_name[students[i]._id.toString()] = students[i].name;
            }
            res.render('record/single_sel.html', {records: records, students_id_name: students_id_name});
          });
      })
      .catch(function(err) {
        res.send({status: false, msg: '查询数据库有误!'});
      });
  });

  /*
  * 获取特定挑战记录的所有单选题
  * */
  router.get('/info', function(req, res) {
    var fight_col = db.collection('fight_single_sel'),
      single_sel_col = db.collection('single_sel'),
      _id = req.query._id;
    if ("" == _id) {
      res.send({status: false, msg: '所传递的_id不可为空!'});
      return;
    }
    fight_col.findOne({_id: new mongo.ObjectID(_id)})
      .then(function(record) {
        var single_sels_ids = record.single_sels || [];
        for (var i = 0; i < single_sels_ids.length; i++) {
          single_sels_ids[i] = new mongo.ObjectID(single_sels_ids[i]);
        }
        single_sel_col.find({_id: {'$in': single_sels_ids}}).toArray()
          .then(function(single_sels) {
            res.send({status: true, single_sels: single_sels});
          })
          .catch(function(err) {
            res.send({status: false, msg: '查询记录的单选题有误!'});
          });
      })
      .catch(function(err) {
        res.send({status: false, msg: '查询记录有误!'});
      });
  });

  /*
  * 删除单选题挑战记录
  * */
  router.post('/del', function(req, res) {
    var _id = req.query._id,
      collection = db.collection('fight_single_sel');
    if ("" == _id) {
      res.send({status: false, msg: '所传递的_id不可为空!'});
      return;
    }
    collection.deleteOne({_id: new mongo.ObjectID(_id)})
      .then(function() {
        res.send({status: true, msg: '删除成功!'});
      })
      .catch(function() {
        res.send({status: false, msg: '删除失败!'});
      });
  });
}

module.exports = router;
