/*
* 题库.单选题功能模块
* 文档参考: doc/dbtables/single_sel.md
* 支持的操作为: 新增, 编辑, 删除
* */
'use strict';

var express = require('express'),
  router = express.Router(),
  mongo = require('mongodb'),
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test_system';

MongoClient.connect(url)
  .then(function(db) {
    var collection = db.collection('single_sel');
    Router(collection);
  })
  .catch(function(err) {
    console.log("connected db failed!");
  });

function Router(collection) {
  /*
  * 获取题库中所有的单选题
  * 前端可传递question
  * */
  router.get('/', function(req, res) {
    var question = req.query.question,
      search_cond = {};
    if (question) search_cond['question'] = {'$regex': question};

    collection.find(search_cond).toArray()
      .then(function(single_sels) {
        res.render('lib/single_sel.html', {single_sels: single_sels, question: question});
      })
      .catch(function(err) {
        res.send({status: false, msg: '获取题库中单选题失败!'});
      });
  });

  /*
  * 获取单个单选题的信息
  * */
  router.get('/one', function(req, res) {
    var _id = req.query._id;
    if ("" == _id) {
      res.send({status: false, msg: '所传递的_id不可为空!'});
      return;
    }
    _id = new mongo.ObjectID(_id);
    collection.findOne({_id: _id})
      .then(function(single_sel) {
        res.send({status: true, single_sel: single_sel});
      })
      .catch(function(err) {
        res.send({status: false, msg: '获取单条单选题失败!'});
      });
  });

  /*
  * 删除单个单选题
  * */
  router.post('/del', function(req, res) {
    var _id = req.body._id;
    if ("" == _id) {
      res.send({status: false, msg: '所传递的_id不可为空!'});
      return;
    }
    _id = new mongo.ObjectID(_id);
    collection.deleteOne({_id: _id})
      .then(function() {
        res.send({status: true, msg: '删除成功!'});
      })
      .catch(function(err) {
        res.send({status: false, msg: '删除失败!'});
      });
  });
  /*
  * 更新单选题信息
  * */
  function check_info(_id, question, a, b, c, d, answer) {
    if ("" == question) {
      return {status: false, msg: '问题不能为空!'};
    }
    if (!a && !b && !c && !d) {
      return {status: false, msg: '选项a,b,c,d都为空的情况不允许!'};
    }
    if (['A','B','C','D'].indexOf(answer) == -1) {
      return {status: false, msg: '答案必须为a,b,c,d'};
    }
    if ('A' == answer && !a) {
      return {status: false, msg: '正确答案为a, 但是答案a却为空!'};
    }
    if ('B' == answer && !b) {
      return {status: false, msg: '正确答案为b, 但是答案b却为空!'};
    }
    if ('C' == answer && !c) {
      return {status: false, msg: '正确答案为c, 但是答案c却为空!'};
    }
    if ('D' == answer && !d) {
      return {status: false, msg: '正确答案为d, 但是答案d却为空!'};
    }
    if (_id) {
      collection.find({_id: _id, question: question}).count()
        .then(function(count) {
          if (1 != count) {
            return {status: false, msg: '编辑情况下, 问题不可修改!'};
          }
        })
        .catch(function(err) {
          return {status: false, msg: '数据库查询未知错误!'};
        });
    } else {
      collection.find({question: question}).count()
        .then(function(count) {
          if (0 != count) {
            return {status: false, msg: '新增情况下, 数据库中已存在此问题!'};
          }
        })
        .catch(function(err) {
          return {status: false, msg: '数据库查询未知错误!'};
        });
    }

    return {status: true, msg: '正确'};
  }
  router.post('/update', function(req, res) {
    var _id = req.body._id,
      question = req.body.question.trim(),
      A = req.body.A.trim(),
      B = req.body.B.trim(),
      C = req.body.C.trim(),
      D = req.body.D.trim(),
      answer = req.body.answer;
    if (_id) _id = new mongo.ObjectID(_id);
    var result = check_info(_id, question, A, B, C, D, answer);
    if (!result.status) {
      res.send({status: false, msg: result.msg});
      return;
    }
    var update_values = {question: question, answer: answer},
      selection = {};
    if (A) selection['A'] = A;
    if (B) selection['B'] = B;
    if (C) selection['C'] = C;
    if (D) selection['D'] = D;
    update_values['selection'] = selection;
    if (!_id) {
      collection.insertOne(update_values)
        .then(function() {
          res.send({status: true, msg: '新增成功!'});
        })
        .catch(function(err) {
          res.send({status: false, msg: '新增失败!'});
        });
    } else {
      collection.update({_id: _id}, update_values)
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
