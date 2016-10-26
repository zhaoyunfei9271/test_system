## 英语挑战系列.单选题挑战记录表 fight_single_sel

### 字段列表
- ts: 挑战时间(时间戳)
- addon: 挑战时间(字符串)
- record: 挑战记录, 字典, 存储学生答题的正确数/错误数 数据格式如下:

  [{
    - student: 学生id
    - right: 正确数
    - wrong: 错误数

  }]

- limit_time: 限时, int, 单位秒
- single_sels: 所出的单选题, 数组, 存储单选题的id
