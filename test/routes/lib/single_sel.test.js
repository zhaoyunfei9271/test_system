/*
* routes/lib/single_sel.js测试文件
* 数据库使用test
* */
'use strict';

var chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test',
  base_server = 'http://localhost:3000/lib/single_sel',
  server = require('../../../app');

chai.use(chaiHttp);

describe('挑战记录.单选题挑战记录 - 测试', function() {
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
      .get('/lib/single_sel')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/one情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .get('/lib/single_sel/one')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/del情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .post('/lib/single_sel/del')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 应该返回200状态码', function(done) {
    chai.request(server)
      .post('/lib/single_sel/update')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  // GET
  it('访问' + base_server + '/one情况下, 传递空的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .get('/lib/single_sel/one')
      .query({_id: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/one情况下, 传递错误的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .get('/lib/single_sel/one')
      .query({_id: '2342342'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });

  // POST
  it('访问' + base_server + '/del情况下, 传递空的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/lib/single_sel/del')
      .send({_id: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/del情况下, 传递错误的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/lib/single_sel/del')
      .send({_id: '2342342'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 不传递question字段, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/lib/single_sel/update')
      .send({A: 'a', B: 'b', C: 'c', D: 'd'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 不传递A字段, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/lib/single_sel/update')
      .send({question: 'question', B: 'b', C: 'c', D: 'd'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 不传递B字段, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/lib/single_sel/update')
      .send({question: 'question', A: 'a', C: 'c', D: 'd'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 不传递C字段, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/lib/single_sel/update')
      .send({question: 'question', A: 'a', B: 'b', D: 'd'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 不传递D字段, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/lib/single_sel/update')
      .send({question: 'question', A: 'a', B: 'b', C: 'c'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 不传递answer字段, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/lib/single_sel/update')
      .send({question: 'question', A: 'a', B: 'b', C: 'c', D: 'd'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 传递answer字段, 但answer不是A, B, C, D, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/lib/single_sel/update')
      .send({question: 'question', A: 'a', B: 'b', C: 'c', D: 'd', answer: 'e'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/update情况下, 传递answer, A, B, C, D, 但传递错误_id情况下, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/lib/single_sel/update')
      .send({question: 'question', A: 'a', B: 'b', C: 'c', D: 'd', answer: 'A', _id: '111'})
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