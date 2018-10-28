# Juooo.com Summary



## 1.项目结构目录

```js
├── build                      			// Webpack打包相关配置
├── config                     			// 基本环境配置
├── index.html                 			// 通用HTML模板
├── package.json               			// 相关依赖
├── README.md                  			// README
├── src                        			// 源码目录
│   ├── App.vue                			// 入口页面
│   ├── assets                 			// 静态资源目录
│   ├── components             			// 全局公用组件目录
│   │   ├── Jubanner.vue       			// 首页轮播图
│   │   ├── Jucategory.vue     			// 首页分类
│   │   ├── Juconcert-tour.vue 			// 首页巡回演唱
│   │   ├── Jucontent.vue          		// 首页主要内容
│   │   ├── JuDetAdaptive.vue      		// 详情页自适应背景
│   │   ├── JuDetArtical.vue           	// 详情页标题
│   │   ├── JuDetFooter.vue         	// 详情页底部
│   │   ├── JuDetHead.vue       		// 详情页头部
│   │   ├── JuDetIntorduction.vue        // 详情页介绍
│   │   ├── JuDetTicketNotice.vue        // 详情页注意事项
│   │   ├── Jufooter.vue           		// 首页底部（现无用）
│   │   ├── Jufooter2.vue          		// 首页底部2（现用）
│   │   ├── Juheader.vue          		// 首页头部
│   │   ├── JuPlayGoods.vue          	// 列表页内容
│   │   └── JuPlayHead.vue        		// 列表页头部
│   ├── main.js                			// 应用初始化入口文件
│   ├── router                 			// 路由目录
│   │   └── index.js           			// 路由配置
│   ├── mock                  			// json文件目录
│   │   ├── region.json           		// 城市文件
│   └── views                  			// 视图目录
│       ├── CitylistView.vue       		// 城市视图
│       ├── DetailView.vue     			// 详情视图
│       ├── HomeView.vue      			// 主页视图
│       ├── LoginView.vue      			// 登录视图
│       ├── MineView.vue      			// 用户视图
│       ├── PagesView.vue      			// 综合视图
│       ├── RegisterView.vue   			// 注册视图
│       ├── SearchView.vue     			// 搜索视图
│       ├── StatusView.vue     			// 广播视图
│       ├── MineView.vue    			// 演出视图
└── static                     			// 静态文件目录
└── stylesheets 					   // 公共scss文件
│   ├── _base.scss					   // 公共样式,颜色,大小等等
│   ├── _common.scss 				   // 全局类名的scss
│   ├── _mixins.scss				 **// 这个我也不大懂 
│   ├── _reset.scss					   // 重置样式
│   ├── main.scss					   //引入以上四个文件汇总 @import

```

(1)我这里把一次性或者重用的放在`src/components` 我个人觉得不大好,最好的话,可以按照每个视图再细分一个文件夹,这样便于维护

(2)把完全不同或者是关联性不大的页面独立为不同的视图放在`src/views`里，这些包含了一个个子组件的视图同样可视为组件。

## 2.路由的配置

项目结构配置好后,接下来就是路由了.

```js
import Vue from 'vue'
import Router from 'vue-router'

import PageView from '@/views/PageView'
import HomeView from '@/views/HomeView'
import PlayView from '@/views/PlayView'
import MineView from '@/views/MineView'
import DetailView from '@/views/DetailView'
import LoginView from '@/views/LoginView'
import RegisterView from '@/views/RegisterView'
import CitylistView from '@/views/CitylistView'
import SearchView from '@/views/SearchView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/pages/' // 重定向
    },
    {
      path: '/pages',
      component: PageView, // 综合试图
      props: true,
      children: [
        {
          path: '',
          redirect: '/pages/home'
        },
        {
          path: 'home',
          name: 'HomeView',
          props: true,
          component: HomeView, // 主页视图
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'play',
          name: 'PlayView',
          component: PlayView // 演出库视图
        },
        {
          path: 'mine',
          name: 'MineView',
          component: MineView, // 用户视图
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'detail',
          name: 'DetailView',
          component: DetailView // 详情页
        },
        {
          path: '/citylist',
          name: 'CitylistView',
          props: true,
          component: CitylistView // 选择城市视图
        }
      ]
    },
    {
      path: '/search',
      name: 'SearchView',
      component: SearchView // 搜索视图
    },
    {
      path: '/login',
      name: 'LoginView',
      component: LoginView // 登陆视图
    },
    {
      path: '/register',
      name: 'RegisterView',
      component: RegisterView // 注册视图
    },
    {
      path: '*',
      redirect: '/pages/' // 路径错时跳转回首页
    }
  ]
})

```

**以上两步我觉得十分重要.尤其是路由的配置.一开始,或者说到现在掌握的也不是很好.因此做项目开始前.对项目有个大概的规划很有必要!!**	

## 3.一些必要的配置

```js
config/index.js
// 服务器代理
proxyTable: {
    '/api': {
        target: 'http://localhost:9999',
            changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
    }
}
```



## 4.组件重用

1.用`vue`开发项目,最重要的是组件化.路由的匹配规则是**自上而下**的，**第一条[1]规则对路由进行了重定向**。接着，第二条[2]，对应了组件**`PagesView`**，其中又包含了若干条子路由。这相当于上面描述的第一类模块，拥有统一的视图，子路由的路由出口为本组件`PagesView`中定义的`<router-view>`。而这一个聚合的拥有子路由和子视图的模块对应的路由出口为入口文件`App.vue`中定义的无名路由出口`<router-view class="view"></router-view>`。

```vue
<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<!-- 这里我用了v-if,是想尝试用keepAlive,如果想要缓存就从第一个router-view显示,否则从第二个
大概用法是在路由配置中添加meta: { keepAlive: true} 但使用了之后出现了一系列bug,最终还是没有达到想要的效果-->
          
<script>
export default {
  name: 'App',
}
```

2.**`PagesView`** 这里我的想法是,以底部为基准.通过点击切换不同的tab,更改视图内容.

```vue
<template>
    <div id="ju-home">
        <router-view/>
        <Jufooter />
    </div>
</template>
<script>
import Jufooter from '../components/Jufooter2'
export default {
  name: 'pages-view',
  components: { Jufooter },
}
</script>
```

3.因为我这次没有用到`vuex` 对状态管理不是很熟悉,这点接下来要花时间掌握

## 5.组件功能的解析

#### 1.	Jubanner.vue :  用到了**`swiper-ui`** 具体用法如下

```vue
<mt-swipe :auto="4000" class="load-img">
    <mt-swipe-item v-for="(item,idx) in lunbolist" :key="idx">
        <img :src="item.image | formatImage" />
    </mt-swipe-item>
</mt-swipe>
<!--
1.load-img是背景图片
	background: url('路径')no-repeat center center ;
     background-size: cover;
2.formatIamge: Vue.js允许自定义过滤器,用在 -|双花括号插值和 v-bind 表达式|-
    Vue.filter('formatImage', (url) => {
      let ext = path.extname(url)
      return url.replace(ext, '.thumb.600_0_c' + ext)
    })
-->
```

##### 2.	Jucategory.vue : 普通的组件.

#### 3.  `Juconcert-tour.vue` :轮播图 用了`swiper-ui` 

```vue
<div class="swiper-container" ref = "el">
    <div class="swiper-wrapper">
        <div class="swiper-slide"
             v-for="(arr,idx) in concerts" :key='idx'>
            <a class="tour" href="#">
                <img :src="arr.pic">
            </a>
        </div>
    </div>
</div>
<script>
import Swiper from 'swiper'  
methods: {
    getConcerts () {
        this.$http.post('/showlist/Tour/ShowList').then(res => {
            this.concerts = res.data.data
            Vue.nextTick(() => { // 如果想保证图片从最左边开始，必须用nextTick
                var swiper = new Swiper(this.$refs.el, {
                    initialSlide: 0,
                    slidesPerView: 3,
                    spaceBetween: 10,
                    // 下面的意思是：true时才能用数据驱动，否则只能写死
                    observer: true, // 修改swiper自己或子元素时,自动初始化swiper
                    observeParents: true// 修改swiper的父元素时,自动初始化swiper
                })
                Vue.use(swiper) //ESlint 建议不能直接new，用Vue.use
            })
        })
    }
</script> 
```

##### 4.Jucontent.vue 普通的组件

#### 5.JuDetAdaptive.vue： 自动识别图片颜色插件，以及post传参

```vue
<script>
import Qs from 'qs'
export default {
    getTourNum () {
        // loading
        this.$http({
            headers: { 'deviceCode': 'A95ZEF1-47B5-AC90BF3' },
            method: 'post',
            url: '/showlist/Ticket/getTourNum',
            data: Qs.stringify({ sid: this.showId })
        }).then(res => {
            this.tourNum = res.data.data.num
        })
    }
}
// 这里之所以要引入qs，是因为axios中post请求正常的传参是一个对象，而我们网页上大多是另一种格式，如果不用qs.有时会报错。以防万一，最好都这样写
</script>
<script>
import $ from 'jquery'
    这里需要注意1点。引入jquery插件，在webpack.base.conf.js文件中添加
    var webpack=require("webpack")，
    然后再module.exports中添加
      plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
      ],
  
import './js/jq.adaptive-bg' //文件模板我放在vue-summary中
	`插件的用法`
// <div class='img-wrap'>  html写在template中
	// <img src="../../assets/logo.png" id="img" data-adaptive-background>
// </div>
 methods: {
    test () {
      $('#img').ready(function () {
        $.adaptiveBackground.run()
      })
    }
 // 完成如上操作即可根据图片给父元素的盒子添加背景颜色
</script>
```

#### 6.JuDetArtical.vue：sessionStorage

```vue
sessionStorage/localStorage十分相似，都是setItem和getItem。移除是removeItem
区别在于sessionStorage是一关闭页面就消失
<script>
methods: {
    render () {
      this.obj = this.session
      console.log(this.obj)
    }
  },
computed: {
    session () {
      return JSON.parse(window.sessionStorage.getItem('goods'))
    }
  }
</script>
```

#### 7.JuDetFooter.vue：用了`vant-ui`

```
这个UI用法简单，按需加载即可，这里要提及的是样式重置，
因为是UI组件。因此我们想修改css的时候，首先不能用SCSS，其次。 必须加 >>> 在需要修改的类名前
```

#### 8.JuDetHead.vue: 数据驱动,滚动条监听吸顶

```vue
既然用了vue,那我们就应该数据驱动,以及尽可能少用jq把我认为
返回上一层可以用 window.history.go(-1)
吸顶:
<script>
methods: {
    scrollShow () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 90) {
        this.act = true
        this.titles.style.display = 'block'
      } else {
        this.act = false
        if (this.titles !== undefined) {
          this.titles.style.display = 'none'
        }
      }
    }
  },
mounted () {
  window.addEventListener('scroll', this.scrollShow)
  this.titles = document.querySelector('.mint-header-title')
},
destroyed () { // 如果离开该页面需要移除这个监听的事件，不然会报错。
  window.removeEventListener('scroll', this.scrollShow)
}
</script>
```

##### 9.JuDetIntorduction.vue: 普通的组件

##### 10.JuDetTicketNotice.vue: 普通的组件

#### 11.Jufooter.vue: `mint-ui` 	

```vue
最后没用,因为mint 和 vant ui 似乎有冲突,会报错
<template>
    <mt-tabbar id="ju-footer" >
        <mt-tabbar  v-model="currentTab" fixed> // v-model点击高亮
            <mt-tab-item :id="tab.id"
            v-for="(tab, idx) in tabs" :key="tab.id"
            class="footerwz"
            @click.native="go(tab.id, idx)"  // 跳路由
            >
                <img :src="tab.changeImg ? '../../static/image/homefooter/' + tab.icon2 + '.png' : tab.icon1" slot="icon">
                {{tab.title}}
            </mt-tab-item>
        </mt-tabbar>
    </mt-tabbar>
</template
```

#### 12.Jufooter2.vue: `vant-ui`

```vue
之所以最后选择用这款ui组件,因为它比上面的操作更加简洁,维护也方便
<template>
<div id="ju-footer">
<van-tabbar v-model="active">
      <van-tabbar-item v-for="(tab, index) in tabbar"
      :to="tab.path"
      :dot="tab.dot"
      :key="index"
      >
        <template slot="icon" slot-scope="props">
          <img :src="props.active ? tab.icon.active : tab.icon.normal" class="imgs"/>
        </template>
        <span>{{tab.name}}</span>
      </van-tabbar-item>
    </van-tabbar>
</div>
</template>
<script>
import Vue from 'vue'
import { Tabbar, TabbarItem } from 'vant'
Vue.use(Tabbar).use(TabbarItem)
    
export default {
  data () {
    return {
      active: 0,
      tabbar: [
        {
          name: '首页',
          path: 'home',
          pathName: 'HomeView',
          icon: {
            normal: require('../../static/image/homefooter/home1.png'), // 可以自定义图片
            active: require('../../static/image/homefooter/home2.png')
          },
          dot: false // 类似微信的小点点
        }
      ]
    }
  }
}
</script>
```



##### 13.Juheader.vue: 普通的组件

#### 14.JuPlayGoods.vue: 图片懒加载/下拉加载/loading的效果

```vue
<template>
<div class="hot-wrap">
    <mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoadeds" ref="loadmore" @bottom-status-change="handleBottomChange">
        <div class="list-wrap">
            <!-- <router-link to="/judetails" slot="left" class="link"> -->
            <span class="show-item clearfix"
            v-for="(showlist,idx) in showlists" :key="idx"
            @click="detail(idx)">
                <div class="show-left fl load-img2">
                    <img v-lazy="`http://image.juooo.com${showlist.pic}`" alt="">
                    <span v-html="showlist.ico"></span>
                </div>
            </span>
            <!-- </router-link> -->
        <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
        </div>
        </div>
    </mt-loadmore>
</div>
</template>

<script>
import Vue from 'vue'
import VueLazyload from 'vue-lazyload' // 图片懒加载 把img的 src 换成 v-lazy

// post请求如果不这样做的话无法成功传递参数到后端，后端识别不了
import Qs from 'qs'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '../assets/logo1.png',
  loading: '../assets/logo1.png',
  attempt: 1
}) // 或括号里面这些都可以不加，有默认值。这里是为了测试

export default {
  props: ['type', 'num'],
  data () {
    return {
      showlists: [],
      totalPage: 0, // 总数
      count: 20, // api接口所需
      page: 1, // api接口所需
      sort: 0, // 筛选切换
      categoryId: 0, // tab切换
      allLoadeds: false, // 向上加载ui所需
      bottomStatus: '' // 向上加载ui所需
    }
  },
  created () {
    this.categoryId = this.$route.query.caid
    this.getList()
  },
  watch: {
    type (newvalue) {
      // console.log(newvalue)
      if (newvalue === '时间排序') {
        this.sort = 1
        this.showlists = []
        this.getList()
      } else {
        this.sort = 0
        this.showlists = []
        this.getList()
      }
    },
    num (val) {
      // console.log(val)
      this.categoryId = val
      this.showlists = []
      this.getList()
    }
  },
  methods: {
    // 获取数据并渲染
    getList () {
      // loading 须在全局配置 1.import { Indicator } from 'mint-ui' 2.Vue.prototype.$loading = Indicator
      this.$loading.open()
      this.$http({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        method: 'post',
        url: '/showlist/Show/getShowList',
        data: Qs.stringify({
          'city_id': 0,
          'category': this.categoryId,
          'keywords': '',
          'activity_id': 0,
          'sort_type': this.sort,
          'page': this.page
        })
      }).then(res => {
        // console.log(res.data.data)
        let obj = res.data.data
        this.totalPage = Math.ceil(obj.total / this.count)
        this.showlists.push(...obj.list)
        // 去除loading的效果
        this.$loading.close()
      })
    },
    // UI
    loadBottom () {
      this.page++
      if (this.page > this.totalPage) {
        this.allLoaded = true
        return
      }
      //   console.log(this.page)
      this.getList()
    },
    // 下拉时的状态
    handleBottomChange (status) {
      this.bottomStatus = status
    },
    detail (idx) {
      var obj = JSON.stringify(this.showlists[idx])
      window.sessionStorage.setItem('goods', obj)
      this.$router.push({name: 'DetailView', params: {}})
    }
  }
}
</script>
```

#### 15.JuPlayHead.vue: 弹窗筛选框/ 兄弟间通讯

```vue
<template>
<header class="search-top border-bt">
    <div class="search-bar">
        <router-link :to="{ name: 'CitylistView' }" class="left">
            <span class="city">{{localCity}}</span>
            <span class="iconfont icon-menu-down"></span>
        </router-link>
        <!-- router-link 相当于a 标签 -->  <!-- 这里提一下,能少用a标签尽量少.因为a标签的默认href权重较高.如果非要用a标签,那么在点击跳转时,加上 .native.prevent -->
        <router-link to="/search" class="center">
            <span class="iconfont icon-search"></span>
            <span>搜索演出、艺人或场馆</span>
        </router-link>
        <a href="javascript:void(0)" class="right js-show-bg">
            <span class="iconfont icon-filter2"
            @click="popupVisible = !popupVisible"
            ></span>
        </a>
    </div>
    <div class="tri" v-show="popupVisible"></div>
    <div class="search-nav">
        <div class="search_nav_wrap js-search-nav">
            <a href="javascript:void(0);"
            class="search_nav_item"
            v-for="(nav,idx) in navs" :key="idx"
            :data-id="nav.dataId"
            :class="{active : nav.dataId == changePath}"
            v-text="nav.title"
            @click="highlight(idx);
            changeTab(nav.dataId);
            keepLight(nav.dataId)">
            </a>
        </div>
    </div>
    <mt-popup
    v-model="popupVisible"
    popup-transition="popup-fade"
    closeOnClickModal="true"
    position="top">
      <mt-picker :slots="slots" @change="onValuesChange">
      </mt-picker>
    </mt-popup>
</header>

</template>
<script>
export default {
  data () {
    return {
      popupVisible: false,
      navs: [
        {
          title: '全部',
          dataId: 0,
          isShow: true
        },
        {
          title: '演唱会',
          dataId: 35,
          isShow: false
        },
        {
          title: '音乐会',
          dataId: 36,
          isShow: false
        }
      ],
      slots: [{
        values: ['推荐排序', '时间排序']
      }],
      filter: '推荐排序',
      localCity: '广州'
    }
  },
  methods: {
    // 刷新保持当前标签高亮
    keepLight (num) {
      this.$router.push({name: 'PlayView', query: {caid: num}})
      // 为了可以在其他页面获取tab在哪个位置高亮
      window.sessionStorage.setItem('caid', num)
    },
    // 点击 子 -> 父 -> 子 通讯
    changeTab (num) {
      this.$emit('change', num) // 通过自定义change事件,把num传给父亲
    },
    // 点击高亮
    highlight (idx) {
      this.navs.map(item => {
        item.isShow = false
        this.navs[idx].isShow = true
      })
    },
    // 下拉触发事件
    onValuesChange (picker, values) {
      this.message = values
      this.$emit('sort', values)
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
      this.popupVisible = false
    }
  },
  computed: {
    changePath () {
      return this.$route.query.caid // 获取url ? 后的参数
    }
  },
  created () {
    if (window.sessionStorage.getItem('localCity')) {
      this.localCity = window.sessionStorage.getItem('localCity')
    } else {
      return this.localCity
    }
  }
}
</script>
```

#### 16.CitylistView.vue: 城市选择

```vue
<template>
<div class="citylist">
    <mt-header title="选择城市">
      <!-- to指定目标地址，默认渲染成a标签，可通过tag属性修改成其他标签 -->
        <a href="javascript:history.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </a>
    </mt-header>
    <mt-index-list>
        <mt-index-section
        :index="letter"
        v-for="(citylist,letter) in indexCity"
        v-if="citylist.length>0" :key="letter">
          <!-- ，父组件通过prop传递数据给子组件，子组件触发事件给父组件。但父组件想在子组件上监听自己的click的话,需要加上native修饰符，故写法就像下面这样。 -->
          <mt-cell
          :title="city.name"
          v-for="city in citylist"
          @click.native="setCurrentCity(city.name)"
          :key="city.id">
          </mt-cell>
        </mt-index-section>
    </mt-index-list>
</div>
</template>
<script>
import eventBus from '../components/vueBus/eventbus'
export default {
  data () {
    return {
      indexCity: []
    }
  },
  methods: {
    setCurrentCity (city) {
      city = city.replace(/市$/, '')
      window.sessionStorage.setItem('localCity', city)
      this.goback(city)
    },
    // 返回上一页并同时传参
    goback (city) {
      // 传递一个键值，choicecity是key，city是value
      eventBus.$emit('choicecity', city)
      // 调用router回退页面
      this.$router.go(-1)
    }
  },
  created () {
    // console.log(666)
    this.$http.get('static/mock/region.json').then(res => {
      let data = res.data

      let indexCity = {}

      // 以字母作为属性写入对象indexCity
      'abcdefghijklmnopqrstuvwxyz'
        .toUpperCase()
        .split('')
        .forEach(letter => {
          indexCity[letter] = []
          // console.log(indexCity)
        })

      function getCity (items) {
        for (let item of items) {
          if (item.id % 10000 === 0) {
            // 直辖市，特别行政区
            // console.log(item.name)
            if (item.municipality || item.special) {
              addCity(item)
            } else {
              // 省份进入递归调用
              getCity(item.regions)
            }
          } else {
            // 城市处理
            addCity(item)
          }
        }
      }

      function addCity (item) {
        let { id, name, pinyin } = item
        indexCity[item.pinyin[0]].push({
          id,
          name,
          pinyin
        })
      }

      getCity(data.regions)

      this.indexCity = indexCity

      // console.log(data)
      // console.log(indexCity)
    })
  }
}
</script>
<style scoped lang="scss">
  .mint-header-title{
    height:42px;
    line-height:42px;
    font-size:32px;
  }
  .mint-header-button{
    font-size:32px;
    height:32px;
    width:32px;
  }
  .mint-header .mint-button{
    font-size:32px;
  }
  .mint-cell-wrapper{
    height:87px;
  }
</style>

```

## 6.nodejs配置

我配置了三个文件.

​	**1.index.js**

```js
// 引入编写好的api
const api = require('./api'); 
// 引入文件模块
const fs = require('fs');
// 引入处理路径的模块
const path = require('path');
// 引入处理post数据的模块
const bodyParser = require('body-parser')
// 引入Express
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(api);
// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, '../dist')))
// 因为是单页应用 所有请求都走/dist/index.html
app.get('*', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
    res.send(html)
})
// 监听8088端口
app.listen(9999);
console.log('success listen…………');
```

**2.api.js**

```js
var express = require("express");
var request = require("request");
var app = express();

//引入module文件
const Server = require("./db.js");
let server = new Server();

app.get("/getImg", function (req, res) {
  function getBanner() {
    return new Promise(function (resolve, reject) {
      // res.append("Access-Control-Allow-Origin", "*")
      request('https://www.duitang.com/napi/mbanner/?app_code=mdt',
      function (err, response, body) {
        if (err) {throw err}
        
        // console.log(body)
        res.send(body)
        resolve(body)
      })
    })
  }
  function checkData(data) {
    return new Promise(function (resolve,reject){
      let datas = JSON.parse(data)
      let arr = datas.data.object_list

      server.find('jucoo',
        {//查询语句的时候不能用数组的形式,插入多个时倒是必须用数组的形式
        },
        function(res,docs) {
          if(docs.length == 0){
            resolve(JSON.stringify(arr))
          }else{
            // console.log(docs)//不存在的,返回空数组
            for(var i = 0; i<docs.length; i++){
              arr.map( (item,idx) => {
                if(item.album_id == docs[i].album_id){
                  arr.splice(idx,1)
                  console.log(arr.length)
                }
              })
            }
            resolve(JSON.stringify(arr))
          }
        }
      )
      
    })
  }

  function sendMongodb(obj) {
    // console.log(obj)
    return new Promise(resolve => {
      // console.log(obj)
      let res = JSON.parse(obj)
      // console.log(res)
      //server.insert(数据表名,需要插入的数据（键值对的对象）,回调函数);
      res.forEach((item, idx) => {
        server.insert('jucoo',
          [{
            album_id: item.album_id,
            image: item.image
          }],
          function (result) {
            console.log(result)
          }
        )
      })
    })
  }

  getBanner().then(checkData).then(sendMongodb)
})

module.exports = app

```

**3.db.js** 封装的`mongodb`

```js
function Mongo(options) {
    this.settings = {
        url: 'mongodb://localhost:27017',
        MongoClient:require('mongodb').MongoClient,
        assert:require('assert'),
        dbName:'jucoo'
    };

    for(let i in options){
        this.settings[i] = options[i];
    }

    this._run = function (fun) {
        let that = this;
        let settings = this.settings;
        this.settings.MongoClient.connect(this.settings.url, function (err, client) {
            settings.assert.equal(null, err);
            console.log("Connected correctly to server");

            const db = client.db(settings.dbName);
            // console.log(db)


            fun(db, function () {
                
                client.close();
            });
        });
    };

    this.insert = function (collectionName, data, func) {
        //增加数据
        let insertDocuments = function (db, callback) {
            // let collection = db.collection('kugouMusic');
            db.collection(collectionName).insertMany(
                data
            , function (err, result) {
                if (!err) {
                    func(result);
                } else {
                    func(false);
                }
                callback(result);
            });
        };

        this._run(insertDocuments);
    };

    this.update = function (collectionName, updateData, data, func) {
        //更新数据
        let updateDocument = function (db, callback) {
            let collection = db.collection(collectionName);
            collection.update(updateData
                , {$set: data},function (err, result) {
                    if (!err) {
                        func(true,err);
                    } else {
                        func(false,err);
                    }
                    callback(result);
                });
        };

        this._run(updateDocument);
    };

    this.delete = function (collectionName, data, func) {
        //删除数据
        let deleteDocument = function (db, callback) {
            let collection = db.collection(collectionName);
            collection.deleteOne(data, function (err, result) {
                if (!err) {
                    func(true);
                } else {
                    func(false);
                }
                callback(result);
            });
        };

        this._run(deleteDocument);
    };

    this.find = function (collectionName, data, func) {
        //查找数据
        let findDocuments = function (db, callback) {
            // Get the documents collection
            let collection = db.collection(collectionName);
            // Find some documents
            collection.find(data).toArray(function (err, docs) {
                if (!err) {
                    func(true,docs);
                }
                else {
                    func(false, err);
                }
                callback(docs);
            });
        };
        this._run(findDocuments);
    };
}

module.exports = Mongo;

/*我存入到了一个名字叫server.js的文件名内

使用
我们在需要使用页面先将模块引入，比如我在路由文件index.js里面引入：
const Server = require("../server.js");

然后需要实例化对象，如下：
let server = new Server();

如果需要配置相关信息，可以在实例化的时候传入一个对象配置，可以配置数据库的地址：
let server = new Server({url:"mongodb://localhost:27017/mydb"});

里面封装了四个方法，添删改查，分别是 
添加方法
server.insert(数据表名,需要插入的数据（键值对的对象）,回调函数);

更新方法
server.update(数据表名,查询的数据（对象）,更新的数据（对象）,回调函数);

删除方法
server.delete(数据表名,查询的数据（对象）,回调函数);

查找方法
server.find(数据表名,查询的数据（对象）,回调函数);

回调函数都会返回两个值，第一个布尔类型，是否处理成功，第二个值，查找返回查找到的个数，别的都返回处理成功的个数（现在一次只处理一条）

使用案例
比如我需要在一个路由里面查找数据，我就需要这样：

server.find("users",{username:"username"},function (bool,data) {
        if(bool){
            console.log("查询到数据为"+data.length+"条");
        }
        else{
            console.log(data);
        }
    });
});

上面的代码是查询了users表里面username为username的字段的数据，如果成功，后面data就会返回一个数组，如果出现错误，就直接返回data错误。
*/

```

