/*
* 挑战赛.单选题挑战功能模块
* */

'use strict';

var express = require('express'),
  router = express.Router(),
  mongo = require('mongodb'),
  logger = require('../log/logger'),
  os = require('os'),
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test_system',
  logic_func = require('../logic/common');

MongoClient.connect(url)
  .then(function(db) {
    Router(db);
  })
  .catch(function(err) {
    logger.log('error', JSON.stringify({ip: logic_func.get_ipv4(), msg: '连接数据库失败!', status: "0"}));
  });

function Router(db) {
  /*
  * 获取所有学生数据
  * */
  router.get('/', function(req, res) {
    var collection = db.collection('students');
    collection.find({}).toArray()
      .then(function(students) {
        logger.log('info', JSON.stringify({
          ip: logic_func.get_ipv4(),
          method: 'GET',
          url: '/fight/single_sel',
          params: req.query,
          msg: '获取学生信息成功!',
          status: "1"
        }));
        res.render('fight/single_sel.html', {students: students});
      })
      .catch(function(err) {
        logger.log('error', JSON.stringify({
          ip: logic_func.get_ipv4(),
          method: 'GET',
          url: '/fight/single_sel',
          params: req.query,
          msg: '获取学生信息失败!',
          status: "0"
        }));
        res.send({status: false, msg: '查询数据库有误!'});
      });
  });

  /*
  * 获取单个未选中的单选题
  * check='1'代表此单选题已经被选过; 如果全部单选题都被选中过, 则设置所有单选题中check=''
  * */
  router.post('/one', function(req, res) {
    logger.log('info', JSON.stringify({
      ip: logic_func.get_ipv4(),
      method: 'POST',
      url: '/fight/single_sel/one',
      params: req.body,
      msg: '获取单个未选中的单选题!',
      status: "1"
    }));
    var collection = db.collection('single_sel');
    collection.findOne({check: {'$ne': '1'}})
      .then(function(one_single_sel) {
        collection.findOneAndUpdate({_id: one_single_sel._id}, {$set: {check: '1'}})
          .then(function() {})
          .catch(function() {});
        res.send({status: true, one_single_sel: one_single_sel});
      })
      .catch(function(err) {
        collection.updateMany({}, {$set: {check: ''}})
          .then(function() {
            collection.findOne({check: {'$ne': '1'}})
              .then(function(one_single_sel) {
                collection.findOneAndUpdate({_id: one_single_sel._id}, {$set: {check: '1'}})
                  .then(function() {})
                  .catch(function() {});
                res.send({status: true, one_single_sel: one_single_sel});
              })
              .catch(function(err) {
                res.send({status: false, msg: '查询数据库有误!'});
              });
          })
          .catch(function(err) {
            res.send({status: false, msg: '更新数据库有误!'});
          });
      });
  });

  /*
  * 更新单选题挑战记录
  * */
  router.post('/update', function(req, res) {
    logger.log('info', JSON.stringify({
      ip: logic_func.get_ipv4(),
      method: 'POST',
      url: '/fight/single_sel/update',
      params: req.body,
      msg: '更新单选题挑战记录!',
      status: "1"
    }));
    var _id = req.body._id,
      ts = Date.parse(new Date()) / 1000,
      addon = logic_func.time_format(ts),
      student = req.body.student,
      limit_time = req.body.limit_time,
      right = +(req.body.right || 0),
      wrong = +(req.body.wrong || 0),
      single_sel = req.body.single_sel,
      collection = db.collection('fight_single_sel');

    if (!_id) {
      limit_time = parseInt(limit_time);
      if (isNaN(limit_time)) {
        res.send({status: false, msg: '所传递的定时时间有误!'});
        return;
      }
      collection.insertOne({ts: ts, addon: addon, limit_time: limit_time})
        .then(function(r) {
          res.send({status: true, _id: r.insertedId});
        })
        .catch(function(err) {
          res.send({status: false, msg: '新增挑战记录失败!'});
        });
    } else {
      if (!student) {
        res.send({status: false, msg: '所传递的学生id不可为空!'});
        return;
      }
      try {
        new mongo.ObjectID(_id);
      } catch (e) {
        res.send({status: false, msg: '所传递的_id不是标准的数据库_id'});
        return;
      }
      collection.find({_id: new mongo.ObjectID(_id), 'record.student': student}).count()
        .then(function(count) {
          if (0 == count) {
            collection.update({_id: new mongo.ObjectID(_id)},
              {'$addToSet': {record: {student: student, right: right, wrong: wrong}}})
              .then(function() {})
              .catch(function(err) {
                res.send({status: false, msg: '更新挑战记录失败!'});
              });
          } else {
            collection.findOne({_id: new mongo.ObjectID(_id)})
              .then(function(_fight_single_sel) {
                var _right = 0,
                  _wrong = 0,
                  record = _fight_single_sel.record || [];
                for (var i = 0; i < record.length; i++) {
                  if (record[i].student == student) {
                    _right = record[i].right;
                    _wrong = record[i].wrong;
                    break;
                  }
                }
                collection.update({_id: new mongo.ObjectID(_id), 'record.student': student},
                  {$set: {'record.$.right': right + _right, 'record.$.wrong': wrong + _wrong}})
                  .then(function() {
                  })
                  .catch(function(err) {
                    res.send({status: false, msg: '更新学生挑战记录失败!'});
                  });
              })
              .catch(function(err) {
                res.send({status: false, msg: '查询挑战记录失败!'});
              });
          }
        })
        .then(function() {
          if (single_sel) {
            collection.findOne({_id: new mongo.ObjectID(_id)})
              .then(function(one_fight_single_sel) {
                var single_sels = one_fight_single_sel.single_sels || [];
                single_sels.push(single_sel);
                var filter_single_sels = single_sels.filter(function(item, pos) {
                  return single_sels.indexOf(item) == pos;
                });
                collection.update({_id: new mongo.ObjectID(_id)}, {$set: {single_sels: filter_single_sels}})
                  .then(function () {
                    res.send({status: true, msg: '更新单选题成功!'});
                  })
                  .catch(function(err) {});
              })
              .catch(function(err) {
                res.send({status: false, msg: '更新单选题失败!'});
              });
          }
        })
        .catch(function(err) {
          res.send({status: false, msg: '查询学生挑战记录失败!'});
        });
    }
  });

  /*
  * 获取单选题挑战记录
  * */
  router.get('/info', function(req, res) {
    logger.log('info', JSON.stringify({
      ip: logic_func.get_ipv4(),
      method: 'GET',
      url: '/fight/single_sel/info',
      params: req.query,
      msg: '获取单选题挑战记录!',
      status: "1"
    }));
    var _id = req.query._id;
    if (!_id) {
      res.send({status: false, msg: '所传递的_id不可为空!'});
      return;
    }
    try {
      _id = new mongo.ObjectID(_id);
    } catch (e) {
      res.send({status: false, msg: '所传递的_id不是数据库的_id!'});
      return;
    }
    var fight_col = db.collection('fight_single_sel'),
      student_col = db.collection('students');
    fight_col.findOne({_id: _id})
      .then(function(fight_single_sel) {
        var record = fight_single_sel.record || [];
        student_col.find({}).toArray()
          .then(function(students) {
            var students_id_name = {};
            for (var i = 0; i < students.length; i++) {
              students_id_name[students[i]._id.toString()] = students[i].name;
            }
            for (var i = 0; i < record.length; i++) {
              record[i].name = students_id_name[record[i].student];
            }
            res.send({status: true, record: record});
          })
          .catch(function(err) {});
      })
      .catch(function(err) {});
  });
}

module.exports = router;