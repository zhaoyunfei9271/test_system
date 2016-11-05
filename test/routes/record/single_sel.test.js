/*
* routes/record/single_sel.js测试文件
* 数据库使用test
* */
'use strict';

var fetch = require('node-fetch'),
  chai = require('chai'),
  expect = chai.expect,
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test',
  base_server = 'http://localhost:3000/record/single_sel';

describe('挑战赛记录.单选题挑战记录', function() {
  var db = undefined;
  // 数据库连接
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
  it('访问' + base_server + '情况下应该放回200状态码', function() {
    return fetch(base_server)
      .then(function(res) {
        expect(res.status).to.be.equal(200);
      });
  });
  it('访问' + base_server + '/info情况下应该放回200状态码', function() {
    return fetch(base_server + '/info')
      .then(function(res) {
        expect(res.status).to.be.equal(200);
      });
  });
  it('访问' + base_server + '/del情况下应该放回200状态码', function() {
    return fetch(base_server + '/del', {method: 'POST'})
      .then(function(res) {
        expect(res.status).to.be.equal(200);
      });
  });

  //数据库关闭
  after(function(done) {
    if (db) db.close();
    done();
  });

});