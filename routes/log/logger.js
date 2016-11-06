/*
* 日志文件
* 分为两种日志记录: info(用于记录各种基本的操作, 如get/post), error(用于记录异常情况, 例如数据库访问异常)
* */
'use strict';

var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'filelog-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error'
    })
  ]
});

module.exports = logger;