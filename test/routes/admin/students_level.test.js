/*
* routes/admin/students_level.js测试文件
* 数据库使用test
* */
'use strict';

var chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test',
  base_server = "http://localhost:3000/admin/students/level",
  server = require('../../../app');

chai.use(chaiHttp);

describe('学生能力展示功能模块 - 测试', function() {
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
  it('访问' + base_server + '情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .get('/admin/students/level')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/single_sel情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .get('/admin/students/level/single_sel')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/batch_single_sel情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .get('/admin/students/level/batch_single_sel')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/joke情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .post('/admin/students/level/joke')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  // GET
  it('访问' + base_server + '/single_sel情况下, 传递空的_id, 应该返回错误信息', function(done) {
    chai.request(server)
      .get('/admin/students/level/single_sel')
      .query({_id: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/single_sel情况下, 传递错误的_id, 应该返回错误信息', function(done) {
    chai.request(server)
      .get('/admin/students/level/single_sel')
      .query({_id: '43252432'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/batch_single_sel情况下, 传递空的_ids, 应该返回错误信息', function(done) {
    chai.request(server)
      .get('/admin/students/level/batch_single_sel')
      .query({_ids: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/batch_single_sel情况下, 传递错误的_ids, 应该返回错误信息', function(done) {
    chai.request(server)
      .get('/admin/students/level/batch_single_sel')
      .query({_ids: '43252432'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });

  // POST
  it('访问' + base_server + '/joke情况下, 传递空的_ids, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/level/joke')
      .query({_ids: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });


  //数据库关闭
  after(function(done) {
    if (db) db.close();
    done();
  });
});