/*
 * 学生管理功能模块
 * 文档参考: doc/dbtables/student.md
 * 支持的操作为: 新增, 编辑, 删除
 */
'use strict';

var express = require('express'),
  router = express.Router(),
  mongo = require('mongodb'),
  fs = require('fs'),
  path = require('path'),
  multer = require('multer'),
  upload = multer({dest: 'public/uploads/'});

// 连接数据库
var MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test_system';
MongoClient.connect(url)
  .then(function(db) {
    var collection = db.collection('students');
    Router(collection);
  })
  .catch(function(err) {
    console.log("connected db failed!");
  });

function Router(collection) {
  /*
  * 获取所有的学生信息
  * 前端传递的筛选条件: name, sex, grade
  * */
  router.get('/info', function(req, res) {
    var name = req.query.name,
      sex = req.query.sex,
      grade = req.query.grade,
      search_cond = {};
    if (name) search_cond['name'] = {'$regex': name};
    if (sex && (sex == '0' || sex == '1')) search_cond['sex'] = sex;
    if (!isNaN(+grade)) search_cond['grade'] = +grade;

    collection.find(search_cond).toArray()
      .then(function(students) {
        res.render('admin/students_info', {students: students, name: name, sex: sex, grade: grade});
      })
      .catch(function(err) {
        res.send({status: false, msg: '获取学生信息失败!'});
      });
  });

  /*
  * 上传学生个人头像
  * */
  router.post('/info/addimg', upload.single('file'), function(req, res) {
    var _id = req.body._id;
    if ("" == _id) {
      res.send({status: false, msg: '所传递的学生_id不可为空!'});
      return;
    }
    _id = new mongo.ObjectID(_id);
    collection.findOne({_id: _id})
      .then(function(student) {
        var tempPath = req.file.path,
          suffix_index = req.file.originalname.indexOf("."),
          suffix = req.file.originalname.substring(suffix_index),
          targetPath = path.resolve(req.file.destination + '/' + student.name + suffix);
        fs.rename(tempPath, targetPath, function(err) {
          if (err) {
            res.send({status: false, msg: '上传照片失败!'});
          } else {
            collection.update({_id: _id}, {$set: {pic: student.name + suffix}})
              .then(function() {})
              .catch(function(err) {
                res.send({status: true, msg: '更新用户头像失败!'});
              });
            res.send({status: true, msg: '上传照片成功!'});
          }
        });
      })
      .catch(function(err) {
        res.send({status: false, msg: '查询数据库有误!'});
      });
  });

  /*
  * 获取单个学生的信息
  * */
  router.get('/info/one', function(req, res) {
    var _id = req.query._id;
    if ("" == _id) {
      res.send({status: false, msg: '所传递的_id不可为空!'});
      return;
    }
    _id = new mongo.ObjectID(_id);
    collection.findOne({_id: _id})
      .then(function(student) {
        res.send({status: true, student: student});
      })
      .catch(function(err) {
        res.send({status: false, msg: '获取单个学生信息失败!'});
      });
  });

  /*
  * 删除单个学生的信息
  * */
  router.post('/info/del', function(req, res) {
    var _id = req.body._id;
    if ("" == _id) {
      res.send({status: false, msg: '所传递的_id不可为空!'});
      return;
    }
    _id = new mongo.ObjectID(_id);
    collection.deleteOne({_id: _id})
      .then(function(){
        res.send({status: true, msg: '删除成功!'});
      })
      .catch(function(err) {
        res.send({status: false, msg: '删除失败!'});
      });
  });

  /*
  * 更新单个学生的信息
  * */
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
      collection.find({_id: _id, name: name}).count()
        .then(function (count) {
          if (1 != count) {
            return {status: false, msg: '编辑情况下, 名称不可更改!'};
          }
        })
        .catch(function (err) {
          return {status: false, msg: '数据库查询未知错误!'};
        });
    } else {
      collection.find({name: name}).count()
        .then(function (count) {
          if (0 != count) {
            return {status: false, msg: '新增情况下, 数据库中已经存在此名称!'};
          }
        })
        .catch(function (err) {
          return {status: false, msg: '数据库查询未知错误!'};
        });
    }

    return {status: true, msg: '正确'};
  }
  router.post('/info/update', function(req, res) {
    var _id = req.body._id,
      sex = req.body.sex,
      grade = +req.body.grade,
      name = req.body.name,
      age = +req.body.age,
      email = req.body.email;
    if (_id) _id = new mongo.ObjectID(_id);
    var result = check_info(_id, name, age, grade);
    if (!result.status) {
      res.send({status: false, msg: result.msg});
      return;
    }
    if (!_id) {
      collection.insertOne({name: name, sex: sex, grade: grade, age: age, email: email})
        .then(function() {
          res.send({status: true, msg: '新增成功!'});
        })
        .catch(function(err) {
          res.send({status: false, msg: '新增失败!'});
        });
    } else {
      collection.update({_id: _id}, {$set: {name: name, age: age, grade: grade, sex: sex, email: email}})
        .then(function() {
          res.send({status: true, msg: '编辑成功!'});
        })
        .catch(function(err) {
          res.send({status: false, msg: '编辑失败!'});
        });
    }
  });
}

module.exports = router;
