<template>
	<div class="daily">
		<div class="daily-menu">
			<div class="daily-menu-item"
				:class="{on: type === 'recommend'}"
				@click="handleToRecommend"
			>每日推荐</div>
			<div class="daily-menu-item"
				:class="{on: type === 'daily'}"
				@click="showThemes = !showThemes"
			>主题日报</div>
			<!-- “主题日报”下有子类列表 默认是收起的， 点击主题日报可以切换展开和收起的状态， 使用数据showThemes来控制， 并用themes来循环渲染子类目 -->
			<ul v-show="showThemes">
				<li v-for="item in themes">
					<a :class="{on: item.id === themeId && type === 'daily'}"
						@click="handleToTheme(item.id)"
					>{{ item.name }}</a>
				</li>
			</ul>
		</div>
		<div class="daily-list" ref="list">
			<template v-if="type === 'recommend'">
				<div v-for="(list, idx) in recommendList">
					<div class="daily-date">{{ formatDay(list.date)}}</div>
					<Item v-for="(item, idx) in list.stories"
						:data="item"
						:key="item.id"
					></Item>
				</div>
			</template>
			<template v-if="type === 'daily'">
				<Item v-for="item in list"
					:data="item"
					:key="item.id"
				></Item>
			</template>
		</div>
		<daily-article></daily-article>
	</div>
</template>

<script>
	import Item from './components/item.vue'
	import $ from './libs/util' // axios通用配置
	export default {
		components: {Item},
		data () {
			return {
				themes: [],
				showThems: false,
				type: 'recommend',
				list: [],
				recommendList: [],
				dailyTime: $.getTodayTime(),
				isLoading: false
				themeId: 0
			}
		},
		methods: {
			getThemes () {
				// axios 发起get请求
				$.ajax.get('themes').then(res => {
					console.log('res1', res)
					this.themes = res.others
				})
			},
			handleToTheme (id) {
				// 改变菜单分类
				this.type = 'daily'
				// 设置当前点击子类的主题日报id
				this.themeId = id
				// 清空中间栏的数据
				this.list = []
				
				$.ajax.get('theme/' + id)
					.then(res => {
						console.log('res2', res)
						// 过滤掉类型为1的文章， 该类型下的文章为空
						this.list = res.stories.filter(item => {
							return item.type !== 1
						})
						/* 
							文章列表list为数组， 结构如下
							"stories": [
								{
									"type": 0,
									"id": 7097426,
									"title": "人们在虚拟生活中投入的精力是否对现实生活的人际关系有积极意义？"
								},
								{
									"type": 0 , 
									"id": 7101963, 
									"title": "写给想成为 理咨询师的学生同仁"
									"images": [ "http : I /picl.zhimg.com/xxx.jpg"]
								}
							]
							* 文章列表中的id字段就是文章的id， 请求文章内容和评论列表时会用到，title为标题， image为封面图片。没用images字段就不显示封面图片
						 */
					})
			},
			handleToRecommend () {
				this.type = 'recommend'
				this.recommendList = []
				this.dailyTime = $.getTodayTime()
				this.getRecommendList()
			},
			getRecommendList () {
				// 加载时设置为true， 加载完成后设置为false
				this.isLoading = true
				const prevDay = $.prevDay(this.dailyTime + 86400000)
				$.ajax.get('news/before/' + prevDay)
					.then(res => {
						console.log('res3', res)
						this.recommendList.push(res)
						this.isLoading = false
					})
					/*
					* recommendList 为推荐文章列表的数据，在初始化和每次点击“每日推荐”菜单时都会请求数据。
					* dailyTime 默认获取今天 点的时间戳，请求时需要多加一天。
					* 因为推荐列表可能通过“主题日报”的子类切换而来 需要重新获取一遍数据，所以handleToRecommend方法每次都需要清空列表并重新设置 dailyTime
					 */
			},
			// 转换为带汉字的月日
			formatDay (date) {
				let month = date.substr(4, 2)
				let day = date.substr(6, 2)
				if (month.substr(0, 1) === '0') month = month.substr(1, 1)
				if (day.substr(0, 1) === '0') day = day.substr(1, 1)
				return `${month} 月 ${day} 日`
			}
		},
		creted () {
			// 初始化时调用
			this.getThemes()
		},
		mounted () {
			const $list = this.$refs.list
			// 监听中栏的滚动事件
			// $list的scroll是标准的DOM事件， 所以也可以用Vue的v-on指令。在div中@scroll="handleScroll"
			$list.addEventListener('scroll', () => {
				// 在‘主题日报’或正在加载推荐列表时停止操作
				if (this.type === 'daily' || this.isLoading) return
				
				// 已经滚动到距离 + 页面的高度等于整个内容区域高度时， 视为接触底部
				if ($list.scrollTop + document.body.clientHeight >= $list.scrollHeight) {
					// 时间相对减少一天
					this.dailyTime -= 86400000
					this.getRecommendList()
				}
			})
		}
	}
</script>

<style scoped>

</style>