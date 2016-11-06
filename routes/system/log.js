/*
* 系统设置.操作日志功能模块
* 文档参考: doc/dbtables/log.md
* 支持的操作为: 查找
* */
'use strict';

var express = require('express'),
  router = express.Router(),
  logger = require('../log/logger'),
  logic_func = require('../logic/common'),
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test_system';

MongoClient.connect(url)
  .then(function(db) {
    var collection = db.collection('log');
    Router(collection);
  })
  .catch(function(err) {
    logger.log('error', JSON.stringify({ip: logic_func.get_ipv4(), msg: '连接数据库失败!', status: "0"}));
  });

function Router(collection) {
  /*
  * 获取所有的日志信息
  * */
  router.get('/', function(req, res) {
    var content = req.query.content,
      level = req.query.level,
      status = req.query.status,
      method = req.query.method,
      search_cond = {},
      and_cond = [],
      or_cond = [];
    if (level) and_cond.push({level: level});
    if (status) and_cond.push({'message.status': status});
    if (method) and_cond.push({'message.method': method});
    if (content) or_cond = [
      {'message.ip': {'$regex': content}},
      {'message.url': {'$regex': content}},
      {'message.params': {'$regex': content}},
      {'message.msg': {'$regex': content}}
    ];
    if (or_cond.length > 0) {
      and_cond.push({'$or': or_cond});
    }
    if (and_cond.length > 0) {
      search_cond['$and'] = and_cond;
    }
    console.log(search_cond);
    collection.find(search_cond).toArray()
      .then(function(logs) {
        logger.log('info', JSON.stringify({
          ip: logic_func.get_ipv4(),
          method: 'GET',
          url: '/system/log',
          params: req.query,
          msg: '获取日志信息成功!',
          status: "1"
        }));
        res.render('system/log.html', {logs: logs, content: content, level: level, status: status, method: method});
      })
      .catch(function(err) {
        logger.log('error', JSON.stringify({
          ip: logic_func.get_ipv4(),
          method: 'GET',
          url: '/system/log',
          params: req.query,
          msg: '获取日志信息失败!',
          status: "0"
        }));
        res.send({status: false, msg: '获取日志信息失败!'});
      });
  });
}

module.exports = router;