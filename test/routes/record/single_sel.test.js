/*
* routes/record/single_sel.js测试文件
* 数据库使用test
* */
'use strict';

var chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test',
  base_server = 'http://localhost:3000/record/single_sel',
  server = require('../../../app');

chai.use(chaiHttp);

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
  it('访问' + base_server + '情况下应该放回200状态码', function(done) {
    chai.request(server)
      .get('/record/single_sel')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/info情况下应该放回200状态码', function(done) {
    chai.request(server)
      .get('/record/single_sel/info')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('访问' + base_server + '/del情况下应该放回200状态码', function(done) {
    chai.request(server)
      .post('/record/single_sel/del')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  // GET
  it('访问' + base_server + '/info情况下, 传递空的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .get('/record/single_sel/info')
      .query({_id: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/info情况下, 传递错误的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .get('/record/single_sel/info')
      .query({_id: '42412443'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });

  // POST
  it('访问' + base_server + '/del情况下, 传递空的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/record/single_sel/del')
      .send({_id: ''})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.status).to.be.equal(false);
        done();
      });
  });
  it('访问' + base_server + '/del情况下, 传递错误的_id, 应该返回错误的信息', function(done) {
    chai.request(server)
      .post('/record/single_sel/del')
      .send({_id: '3214213'})
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