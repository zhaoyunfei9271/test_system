## 日志记录数据表log

### 字段列表
- level: 日志等级(string)
- timestamp: 记录时间(string)
- message: 信息(dict)
    {
        - ip: 操作的ip地址
        - method: URL请求的方法
        - url: 所请求的url
        - params: 所请求的参数
        - msg: 信息
        - status: 状态
    }

### 备注
- level: 日志等级目前分为: info/error
- timestamp: 为库自动生成的日志时间
- status: "1"代表成功, "0"代表失败

### 日志记录规则
- 针对GET方法, 应该在函数的结尾执行日志记录, 因为在GET方法中, 一般不允许出错.
- 针对POST方法, 应该在函数的开头执行日志记录, 因为POST方法总会传递参数, 记录参数主要用于在实际项目中出错, 进行排错.
- 在GET方法中, 是否成功render是最重要的.
- 在POST方法中, 所传递的参数记录才有意义, 是否POST成功则不重要.