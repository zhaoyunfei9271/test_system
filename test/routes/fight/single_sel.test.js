/*
* routes/fight/single_sel.js测试文件
* 数据库使用test
* */
'use strict';

var chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test',
  base_server = 'http://localhost:3000/fight/single_sel',
  server = require('../../../app');

chai.use(chaiHttp);

describe('挑战赛.单选题挑战功能模块 - 测试', function() {
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
      .get('/fight/single_sel')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/one情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .post('/fight/single_sel/one')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .post('/fight/single_sel/update')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/info情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .get('/fight/single_sel/info')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  // GET
  it('访问' + base_server + '/info情况下, 传递空的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .get('/fight/single_sel/info')
      .query({_id: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info情况下, 传递错误的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .get('/fight/single_sel/info')
      .query({_id: '24325243'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });

  // POST
  it('访问' + base_server + '/update情况下, 传递错误的limit_time, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/fight/single_sel/update')
      .send({limit_time: 'aaa'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 传递正确的limit_time, 应该返回正确的信息', function(done) {
    chai.request(server)
      .post('/fight/single_sel/update')
      .send({limit_time: 300})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(true);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 在传递student信息下, 传递错误的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/fight/single_sel/update')
      .send({student: '1', _id: '42134214'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        console.log(res.body.msg);
        done();
      });
  });

  //数据库关闭
  after(function(done) {
    if (db) db.close();
    done();
  });
});