/*
* routes/admin/students.js测试文件
* 数据库使用test
* */
'use strict';

var chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test',
  base_server = 'http://localhost:3000/admin/students',
  server = require('../../../app');

chai.use(chaiHttp);

describe('学生管理功能模块 - 测试', function() {
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
  it('访问' + base_server + '/info情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .get('/admin/students/info')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/info/addimg情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .post('/admin/students/info/addimg')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/info/one情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .get('/admin/students/info/one')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/info/del情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .post('/admin/students/info/del')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/info/update情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .post('/admin/students/info/update')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  // GET
  it('访问' + base_server + '/info/one情况下, 传递空的_id, 应该返回错误信息', function(done) {
    chai.request(server)
      .get('/admin/students/info/one')
      .query({_id: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/one情况下, 传递错误的_id, 应该返回错误信息', function(done) {
    chai.request(server)
      .get('/admin/students/info/one')
      .query({_id: '23542342'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });

  // POST
  it('访问' + base_server + '/info/addimg情况下, 传递空的_id, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/addimg')
      .send({_id: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/addimg情况下, 传递错误的_id, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/addimg')
      .send({_id: '3124123'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/del情况下, 传递空的_id, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/del')
      .send({_id: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/del情况下, 传递错误的_id, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/del')
      .send({_id: '421342'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/update情况下, 传递错误的_id, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/update')
      .send({_id: '421342'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/update情况下, 传递空的name, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/update')
      .send({name: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/update情况下, 传递非整数的年龄, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/update')
      .send({age: 'aa'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/update情况下, 传递空的年龄, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/update')
      .send({age: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/update情况下, 传递非整数的年级, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/update')
      .send({grade: 'aa'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/update情况下, 传递空的年级, 应该返回错误信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/update')
      .send({grade: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info/update情况下, 传递正确的名称, 年龄和年级, 应该返回正确信息', function(done) {
    chai.request(server)
      .post('/admin/students/info/update')
      .send({name: 'leicj', age: 26, grade: 7})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(true);
        done();
      });
  });

  //数据库关闭
  after(function(done) {
    if (db) db.close();
    done();
  });

});

