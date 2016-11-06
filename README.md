# test_system
- 测试系统, 用于学生英语学习能力的检测, 以及学生检测后能力的可视化展示
- 基于Node.js + Express框架, 数据库使用MongoDB, 页面模板使用swig, 文件上传使用multer, 测试基于chai/chai-http/mocha,数据展示使用Plotly.js, 前端使用jQuery/Bootstrap, 日志记录使用winston, 定时器任务使用node-cron

# 运行
```
npm start
```

# 测试
```
mocha --recursive
```


# 系统文件分布如下
```
--doc(文档)
  |
  |--dbtables(数据库设计文档)
  |
  |--file_detail(一些功能模块的设计文档)
  |
  |--需求文档
--public(公共文件)
  |
  |--bootstrap(bootstrap库: 包含css/fonts/js)
  |
  |--fight(在英语挑战赛中使用的js/css文件)
  |
  |--images(实际要用到的一些图标)
  |
  |--javascripts(用到的一些基本js库)
  |
  |--stylesheets(用到的一些基本css文件)
  |
  |--uploads(用户上传头像所存储的目录)
--routes(路由层)
  |
  |--admin(学生管理功能模块, 包含学生信息和学生能力展示)
  |
  |--fight(挑战赛功能模块, 包含单选题挑战赛)
  |
  |--job(定时器任务功能模块)
  |
  |--lib(题库功能模块, 包含单选题题库)
  |
  |--log(日志系统功能模块)
  |
  |--logic(逻辑功能模块, 用于存储一些通用的函数)
  |
  |--record(挑战记录功能模块, 包含单选题挑战记录)
  |
  |--index.js
--views(展示层)
  |
  |--admin(学生管理功能模块, 包括学生信息和学生能力展示)
  |
  |--fight(挑战赛功能模块, 包含单选题挑战赛)
  |
  |--lib(题库功能模块, 包含单选题题库)
  |
  |--record(挑战记录功能模块, 包含单选题挑战记录)
--test(单元测试目录)
```
