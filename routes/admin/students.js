/*
 * 学生管理功能模块
 * 文档参考: doc/dbtables/student.md
 * 支持的操作为: 新增, 编辑, 修改, 批量删除
 */
var express = require('express');
var router = express.Router();
var init = function (callback) {
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:27017/test_system';
  MongoClient.connect(url, function (err, db) {
    console.log("Connected successfully to server");
    var collection = db.collection('students');
    callback(collection);
  });
};
var cal = function (collection) {
  router.get('/info', function (req, res, next) {
    collection.find({}).toArray(function (err, students) {
      if (!err) {
        res.render('students_test', {students: students});
      }
    });
  });
  // 检查所传入的数据是否有效
  function check_info(_id, name, age, grade) {
    if ("" == name) {
      return {status: false, msg: '名称不可为空'};
    }
    age = parseInt(age);
    grade = parseInt(grade);
    if (isNaN(age)) {
      return {status: false, msg: '年龄必须为整数'};
    }
    if (isNaN(grade)) {
      return {status: false, msg: '年级必须为整数'};
    }
    if (_id) {
      collection.find({_id: _id, name: name}).count(function (err, count) {
        if (1 != count) {
          return {status: false, msg: '编辑情况下, 名称不可更改!'};
        }
      });
    } else {
      collection.find({name: name}).count(function (err, count) {
        if (0 != count) {
          return {status: false, msg: '新增情况下, 数据库中已经存在此名称!'};
        }
      });
    }
    return {status: true, msg: '正确'};
  }

  // 更新学生数据
  router.post('/info/update', function (req, res) {
    var _id = req.body._id;
    var sex = req.body.sex;
    var grade = parseInt(req.body.grade);
    var name = req.body.name;
    var age = parseInt(req.body.age);
    var email = req.body.email;
    var result = check_info(_id, name, age, grade);
    if (!result.status) {
      res.send({status: false, msg: result.msg});
      return;
    }
    if (!_id) {
      collection.insertOne({name: name, sex: sex, grade: grade, age: age, email: email}, function (err, r) {
        if (err) {
          res.send({status: false, msg: '插入失败!'});
        } else {
          res.send({status: true, msg: '插入成功!'});
        }
      });
    } else {
      collection.update({_id: _id}, {name: name, age: age, grade: grade, sex: sex, email: email}, function (err, r) {
        if (err) {
          res.send({status: false, msg: '更新失败!'});
        } else {
          res.send({status: true, msg: '更新成功!'});
        }
      });
    }
  });
  // 删除学生数据
  router.post('/info/del', function (req, res) {
    var _id = req.body._id;
    if ("" == _id) {
      res.send({status: false, msg: '所传递的_id不可为空!'});
      return;
    }
    collection.deleteOne({_id: _id}, function (err, r) {
      if (err) {
        res.send({status: false, msg: '删除失败!'});
      } else {
        res.send({status: true, msg: '删除成功!'});
      }
    });
  });

};

init(cal);

module.exports = router;
