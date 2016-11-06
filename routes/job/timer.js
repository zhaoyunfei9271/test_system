/*
* 定时器任务文件
* */

'use strict';

var fs = require('fs'),
  CronJob = require('cron').CronJob,
  MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/test_system';

function insert_log(collection, data, cb, filename) {
  data = data.toString().split('\n');
  var insert_data = [];
  for (var i = 0; i < data.length; i++) {
    try {
      var _one_data = JSON.parse(data[i]);
    } catch (e) {
      continue;
    }
    try {
      _one_data.message = JSON.parse(_one_data.message);
    } catch (e) {
      _one_data.message = {};
    }
    insert_data.push({
      level: _one_data.level,
      timestamp: _one_data.timestamp,
      message: {
        ip: _one_data.message.ip,
        method: _one_data.message.method || '',
        url: _one_data.message.url || '',
        params: _one_data.message.params || '',
        msg: _one_data.message.msg || '',
        status: _one_data.message.status || ''
      }
    });
  }
  if (insert_data.length > 0) {
    collection.insertMany(insert_data)
      .then(function() {
        if (cb) cb(filename);
      })
      .catch(function(err) {
        console.log("插入日志信息有误!");
      });
  }
}

function clear_file(name) {
  fs.truncate(name, 0, function() {
    console.log('clear file ' + name);
  });
}
var job = new CronJob({
  cronTime: '00 00 01 * * 0-6',
  onTick: function() {
    MongoClient.connect(url)
      .then(function(db) {
        var collection = db.collection('log');
        fs.stat('filelog-info.log', function(err, stats) {
          if (err) console.log("no filelog-info.log file!");
          else {
            fs.readFile('filelog-info.log', function(err, data) {
              if (err) console.log("read filelog-info.log error!");
              else {
                insert_log(collection, data, clear_file, 'filelog-info.log');
              }
            });
          }
        });
        fs.stat('filelog-error.log', function(err, stats) {
          if (err) console.log("no filelog-error.log file!");
          else {
            fs.readFile('filelog-error.log', function(err, data) {
              if (err) console.log("read filelog-error.log error!");
              else {
                insert_log(collection, data, clear_file, 'filelog-error.log');
              }
            });
          }
        });
      })
      .catch(function(err) {});
  },
  start: false,
  timeZone: 'Asia/Shanghai'
});

job.start();



module.exports = job;