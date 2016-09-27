## 单选题数据表single_sel

### 字段列表
- question: 问题, 字符串,
- selection: 选项, 字典 {"A": "答案A", "B": "答案B", ..},
- answer: 答案, 字符串
- check: 是否已被测试过, "1"测试过, 非"1"则没有测试.

### 备注
- question具有唯一性
- check字段的含义在于: 在 **英语挑战系列** . **单选题挑战** 中, 要随机出一个单选题, 则保证不能重复, 已出的单选题则check为"1". 设置定时器, 每天凌晨清空check.

### 具体实例
```
{
	"_id" : ObjectId("57e720e84324733cbaaae90d"),
	"answer" : "A",
	"selection" : {
		"A" : "are going to have",
		"C" : "is going to have",
		"B" : "is going to be",
		"D" : "are going to be"
	},
	"question" : "—Tony, why are you so glad?\r\n—Oh, you know, there ___________ a football match tomorrow."
}
```
