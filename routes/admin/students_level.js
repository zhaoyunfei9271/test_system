/*
* 学生能力展示
* */

var express = require('express'),
  router = express.Router(),
  mongo = require('mongodb'),
  logic_func = require('../logic/common');

var MongoClient = require('mongodb').MongoClient,
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
  * 学生能力展示
  * */
  router.get('/', function(req, res) {
    var name = req.query.name,
      sex = req.query.sex,
      grade = req.query.grade,
      search_cond = {},
      collection = db.collection('students');
    if (name) search_cond['name'] = {'$regex': name};
    if (sex && (sex == '0' || sex == '1')) search_cond['sex'] = sex;
    if (!isNaN(+grade)) search_cond['grade'] = +grade;
    collection.find(search_cond).toArray()
      .then(function(students) {
        res.render('admin/students_level.html', {students: students, name: name, sex: sex, grade: grade});
      })
      .catch(function(err) {
        res.send({status: false, msg: '获取学生信息失败!'});
      });
  });

  /*
  * 学生单选题能力展示
  * */
  router.get('/single_sel', function(req, res) {
    var _id = req.query._id,
      fight_col = db.collection('fight_single_sel'),
      students_col = db.collection('students');
    if ("" == _id) {
      res.send({status: false, msg: '所传递的_id不可为空!'});
      return;
    }
    var student = undefined;
    var records_ts = [];
    try {
      new mongo.ObjectID(_id);
    } catch (e) {
      res.send({status: false, msg: '所传递的_id不是数据库_id!'});
      return;
    }
    students_col.findOne({_id: new mongo.ObjectID(_id)})
      .then(function(_student) {
        student = _student;
      })
      .then(function() {
        fight_col.find({}).toArray()
          .then(function(fight_single_sels) {
            for (var i = 0; i < fight_single_sels.length; i++) {
              var item = fight_single_sels[i];
              if (item && item.record && item.record.length > 0) {
                for (var j = 0; j < item.record.length; j++) {
                  var r = item.record[j];
                  if (r.student == _id) {
                    var ts = item.ts,
                      addon = logic_func.time_format(ts),
                      right = r.right || 0,
                      wrong = r.wrong || 0;
                    records_ts.push({rs: ts, addon: addon, right: right, wrong: wrong});
                    break;
                  }
                }
              }
            }
            res.send({status: true, records_ts: records_ts, name: student.name});
          })
          .catch(function(err) {
            res.send({status: false, msg: '查询挑战赛记录有误!'});
          });
      })
      .catch(function(err) {
        res.send({status: false, msg: '查询学生信息有误!'});
      });
  });

  /*
  * 批量查看单选题能力展示
  * */
  router.get('/batch_single_sel', function(req, res) {
    var _ids = req.query._ids,
      fight_col = db.collection('fight_single_sel'),
      students_col = db.collection('students');
    if (!_ids) {
      res.send({status: false, msg: '所传递的_ids不可为空1'});
      return;
    }
    _ids = _ids.split(',');
    var _Objectids = [];
    try {
      for (var i = 0; i < _ids.length; i++) {
        _Objectids.push(new mongo.ObjectID(_ids[i]));
      }
    } catch (e) {
      res.send({status: false, msg: '所传递的_ids不是数据库_id!'});
      return;
    }
    var name = [],
      records_ts = [];
    students_col.find({_id: {'$in': _Objectids}}).toArray()
      .then(function(students) {
        for (var i = 0; i < students.length; i++) {
          name.push(students[i].name);
        }
      })
      .then(function() {
        fight_col.find({}).toArray()
          .then(function(fight_single_sels) {
            for (var i = 0; i < fight_single_sels.length; i++) {
              var item = fight_single_sels[i],
                ts = item.ts,
                addon = logic_func.time_format(ts),
                right = 0,
                wrong = 0;
              for (var j = 0; j < item.record.length; j++) {
                var r = item.record[j];
                if (_ids.indexOf(r.student) != -1) {
                  right += r.right || 0;
                  wrong += r.wrong || 0;
                }
              }

              if (right && wrong) {
                records_ts.push({ts: ts, addon: addon, right: right, wrong: wrong});
              }
            }
            res.send({status: true, records_ts: records_ts, name: name});
          })
          .catch(function(err) {
            res.send({status: false, msg: '查询挑战记录有误!'});
          });
      })
      .catch(function(err) {
        res.send({status: false, msg: '查询学生信息有误!'});
      });
  });

  /*
  * 产生模拟的单选题挑战记录
  * 前端传递需要模拟的学生id即可
  * */
  router.post('/joke', function(req, res) {
    var _ids = req.body._ids,
      ts = Date.parse(new Date()) / 1000,
      collection = db.collection('fight_single_sel');
    if (!_ids) {
      res.send({status: false, msg: '所传递的_ids不可为空1'});
      return;
    }
    _ids = _ids.split(',');
    for (var i = 0; i < 10; i++) {
      var record = [];
      for (var j = 0; j < _ids.length; j++) {
        var r = parseInt(Math.random() * (20 - 10) + 10);
        record.push({student: _ids[j], right: r, wrong: 20 - r});
      }
      collection.insertOne({ts: ts + i * (60 * 60 * 2), addon: logic_func.time_format(ts + i * (60 * 60 * 2)),
        limit_time: 300, record: record})
        .then(function() {})
        .catch(function(err) {})
    }
  });
}

module.exports = router;