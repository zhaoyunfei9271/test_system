$(function() {
  // 计算界面上可显示多少个图像, 每个图像的宽度标准为100px
  var width = $('.all_students').width();
  var n = parseInt(width / 100 - 1);
  var len = $('.all_students li').length;
  for (var i = 0; i < len; i++) {
    $('.all_students li')[i].style.display = i < n ? 'inline-block' : 'none';
  }
  // 点击向左的按钮
  $('.control-next').on('click', function() {
    $('.all_students li')[0].style.display = 'none';
    $('.all_students ul').append($('.all_students li')[0]);
    var tail = parseInt(width / 100 - 1) - 1;
    if (tail >= len) {
      $('.all_students li')[len - 1].style.display = 'inline-block';
    } else {
      $('.all_students li')[tail].style.display = 'inline-block';
    }
  });
  // 点击向右的按钮
  $('.control-prev').on('click', function() {
    $('.all_students li')[len - 1].style.display = 'inline-block';
    $('.all_students ul').prepend($('.all_students li')[len - 1]);
    var tail = parseInt(width / 100 - 1);
    if (tail < len) {
      $('.all_students li')[tail].style.display = 'none';
    }
  });
});
