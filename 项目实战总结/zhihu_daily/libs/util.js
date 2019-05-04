import axios from 'axios'

// 基本配置
const Util = {
	imgPath: 'http://127.0.0.1:8011/img/', 
	apiPath: 'http://127.0.0.1:8010/'
}

// 应用初始化和点击 ”每日推荐“，菜单时请求推荐的文章列表。
// 推荐列表的API相对地址为news/before/20170503, before后面时查询的日期。
// 这个日期比要查询的真实日期多一天， 比如要查2019年5月3日推荐的内容，就要请求20190504
// 每日推荐可以无限次地向前一天查询， 为了方便操作，定义以下两个时间方法

// 获取今天的时间戳
Util.getTodayTime = function () {
	const date = new Date()
	date.setHours(0)
	date.setMinutes(0)
	date.setSeconds(0)
	date.setMilliseconds(0)
	return date.getTime()
}
// 获取前一天的日期
// Util.prevDay 参数为前一天的时间戳，计算前一天的时间戳只 以今天 点的时间戳为基础，也就是通过 Util.getTodayTime 获取的时间戳减去 86400000 (2 吨。＊60*1000 ）。这种方法要比直接判断前一天的日期简单得多 ，因为每个月的日期是不固定的，另外还需特殊处理润年
Util.prevDay = function (timestamp = (new Date()).getTime()) {
	const date = new Date(timestamp)
	const year = date.getFullYear()
	const month = date.getMonth() + 1 < 10
		? '0' + (date.getMonth() + 1)
		: date.getMonth() + 1
	const day = date.getDate() < 10
		? '0' + date.getDate()
		: date.getDate()
	
	return year + month + day
}

// Ajax通用配置
Util.ajax = axios.create({
	baseURL: Util.apiPath
})

// 添加响应拦截器
Util.ajax.interceptors.response.use(res => {
	return res.data
})

export default Util
