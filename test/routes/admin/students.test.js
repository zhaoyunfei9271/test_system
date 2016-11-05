/*
* routes/admin/students.js测试文件
* 数据库使用test
* */
'use strict';

var fetch = require('node-fetch'),
  chai = require('chai'),
  expect = chai.expect,
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test',
  base_server = 'http://localhost:3000/admin/students';

describe('学生管理功能模块 - 测试', function() {
  var db = undefined;
  before(function(done) {
    MongoClient.connect(url)
      .then(function(_db) {
        db = _db;
        done();
      });
  });
  it('数据库应该正确连接', function() {
    expect(db).to.be.an('object');
  });

  // 接口是否可访问
  it('访问/info情况下, 应该返回200状态码', function() {
    return fetch(base_server + '/info')
      .then(function(res) {
        expect(res.status).to.be.equal(200);
      });
  });
  it('访问/info/one情况下, 应该返回200状态码', function() {
    return fetch(base_server + '/info/one')
      .then(function(res) {
        expect(res.status).to.be.equal(200);
      });
  });
  it('访问/info/del情况下, 应该返回200状态码', function() {
    return fetch(base_server + '/info/del', {method: 'POST'})
      .then(function(res) {
        expect(res.status).to.be.equal(200);
      });
  });
  it('访问/info/update情况下, 应该返回200状态码', function() {
    return fetch(base_server + '/info/update', {method: 'POST'})
      .then(function(res) {
        expect(res.status).to.be.equal(200);
      });
  });

});

