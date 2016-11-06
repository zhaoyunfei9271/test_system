/*
* 存储通用函数
* */
'use strict';

var os = require('os'),
  ifaces = os.networkInterfaces();

var logic_func = {
  time_format: function(time){
    function two_digits(num){
      if ((num + '').length == 1) {
        return '0' + num;
      }
      return num;
    }
    if (String(time).length == 10) {
      time = new Date(time * 1000);
    } else {
      time = new Date(time);
    }
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    return two_digits(year) + '-' + two_digits(month) + '-' + two_digits(date) + ' ' + two_digits(hours) + ':' + two_digits(minute) + ':' + two_digits(second);
  },
  get_ipv4: function() {
    var addr = {};
    for (var key in ifaces) {
      for (var i = 0; i < ifaces[key].length; i++) {
        if ('IPv4' === ifaces[key][i].family) {
          addr[key] = ifaces[key][i].address;
        }
      }
    }
    return addr;
  }
};

module.exports = logic_func;

