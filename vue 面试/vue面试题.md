<h2>目录</h2>

&emsp;[1. 说一下Vue的双向绑定数据的原理](#k1)

&emsp;[2. 解释单向数据流和双向数据绑定](#k2)

&emsp;[3. Vue如何去除url中的 #](#k3)

&emsp;[4. 对 MVC、MVVM的理解](#k4)

&emsp;[5. 介绍虚拟DOM](#k5)

&emsp;[<s>6. vue生命周期的理解</s>(更新至No.26)](#k6)

&emsp;[7. 组件通信](#k7)

&emsp;[8. 路由实现](#k8)

&emsp;[9. v-if 和 v-show 区别 ](#k9)

&emsp;[10. $route和$router的区别](#k10)

&emsp;[11. NextTick 是做什么的](#k11)

&emsp;[12. Vue 组件 data 为什么必须是函数](#k12)

&emsp;[13. 计算属性computed 和事件 methods 和 watch 有什么区别](#k13)

&emsp;[14. 对比 jQuery ，Vue 有什么优缺点](#k14)

&emsp;[15. Vue 中怎么自定义指令](#k15)

&emsp;[16. Vue 中怎么自定义过滤器](#k16)

&emsp;[17. 对 keep-alive 的了解](#k17)

&emsp;[18. Vue 中 key 的作用](#k18)

&emsp;[19. 你觉得 Vue 的核心是什么](#k19)

&emsp;[20. vue 等单页面应用的优缺点](#k20)

&emsp;[21. vue中数组变异方法](#k21)

&emsp;[22. 移动端开发中.ios遮罩层下方内容滚动](#k22)

<<<<<<< HEAD
&emsp;[23. 路由根据开发状态懒加载](#k23)

&emsp;[24. 如何通过按钮控制一个或几个变量在不同状态下值的显示，不需申明多个变量](#k24)

=======
&emsp;[23. new Vue()做了什么?](#k23)
>>>>>>> 328c126d5115a76e10d73fe544ff696353fa2722

&emsp;[24. newVue()做了什么](#k24)

&emsp;[25. 什么阶段才能访问DOM？](#k25)

&emsp;[26. 谈谈你对Vue的生命周期的理解](#k26)

&emsp;[27. Vue-router 路由模式有几种？](#k27)

&emsp;[28. 谈谈你对 keep-alive的了解？](#k28)



<h5 id='k1' style="color:#007fff;">1. 说一下Vue的双向数据绑定原理</h5>

> `vue`实现数据双向绑定主要是： 采用数据劫持结合发布者-订阅者模式的方式。 通过`Object.defineProperty()` 来劫持各个属性的 `setter`, `getter`, 在数据变动时发布消息给订阅者， 触发相应监听回调  
> `Object.defineProperty(obj, prop, descriptor)`  
> obj: 要在其上定义属性的对象。  
> prop: 要定义或修改的属性的名称。  
> descriptor: 将被定义或修改的属性描述符。

<h5 id='k2' style="color:#007fff;">2.解释单向数据流和双向数据绑定</h5>

> 单向数据流： 顾名思义， 数据流是单向的。 数据流动方向可以跟踪， 流动单一， 追查问题的时候可以更加快捷， 缺点就是写起来不太方便， 要使UI发生变更就必须创建各种 `action`为维护对应的 `state`

> 双向数据绑定： 数据之间是想通的， 将数据变更的操作隐藏在框架内部。 优点是在表单交互较多的场景下， 会简化大量业务无关的代码。 缺点是无法追踪局部状态的变化， 增加了出错时 `debug`的难度

<h5 id='k3' style="color:#007fff;"> 3.如何去除url中的 </h5>

```js
new Router({
  mode: 'history',
  routes: [ ]
})
```

> 需要注意的是， 当我们启用 `history`模式的时候， 由于我们项目是一个单页面应用， 所以在路由跳转的时候， 就会出现访问不到静态资源而出现 `404`的情况， 这时候就需要服务端增加一个覆盖所有情况的候选资源： 如果`URL`匹配不到任何静态资源， 则应该返回同一个 `index.html` 页面

<h5 id='k4' style="color:#007fff;">4. 对MVC、MVVM的理解</h5>

![image](https://raw.githubusercontent.com/ltadpoles/web-document/master/Other/images/mvc.png)

特点： 

1. `View`传送指令到 `Controller`
2. `Controll`完成业务逻辑后， 要求`Model`改变状态
3. `Model`将新的数据发送到`View`, 用户得到反馈

**所有通信都是单向的**

> MVVM

![image](https://raw.githubusercontent.com/ltadpoles/web-document/master/Other/images/mvvm.png)

特点： 

1. 各部分之间的通信， 都是双向的
2. 采用双向绑定， `View`的变动， 自动反应在 `ViewModel`, 反之亦然

具体请移步 [这里](http://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html)

<h5 id=k5' style="color:#007fff;">5. 介绍虚拟DOM</h5>

[参考这里](https://www.jianshu.com/p/616999666920)

<h5 id='k6' style="color:#007fff;"> <s>6. vue生命周期的理解</s></h5>

<h5 id='k7' style="color:#007fff;">7. 组件通信</h5>

> 父组件向子组件通信

子组件通过props属性， 绑定父组件数据， 实现双方通信

> 子组件向父组件通信

将父组件的自定义事件在子组件中通过`$emit`触发

> 非父子组件、兄弟组件之间的数据传递

```js
/* 新建一个Vue实例作为中央事件总嫌 */
let event = new Vue()

/* 监听事件 */
event.$on('eventName', (val) => {
  // ...do something
})

/* 触发事件 */
event.$emit('eventName', 'this is a message.')
```

> Vuex数据管理

<h5 id='k8' style="color:#007fff;">8. vue-router 路由实现</h5>

> 路由就是用来跟后端服务器进行交互的一种方式， 通过不同的路径， 来请求不同的资源， 请求不同的页面是路由的其中一种功能

参考 [这里](https://zhuanlan.zhihu.com/p/37730038)

<h5 id='k9' style="color:#007fff;">9. v-if 和 v-show区别</h5>

> 使用了 `v-if`的时候， 如果值为`false`, 那么页面将不会有这个`html`标签生成。

> `v-show` 则是不管值为`true`还是`false`， `html` 元素都会存在，只是`css`中的`display`显示或隐藏

<h5 id='k10' style="color:#007fff;">10. $route和$router的区别</h5>

> `$router` 为 `VueRouter` 实例， 想要导航到不同的 `URL`， 则使用 `$router.push` 方法

> `$route` 为当前 `router` 跳转对象里面可以获取 `name`、 `path`、 `query` 、 `params` 等

<h5 id='k11' style="color:#007fff;">11. NextTick是做什么的</h5>

> `$nextTick` 是在下次 `DOM` 更新循环结束之后执行延迟回调， 在修改数据之后使用 `$nextTick`， 则可以在回调中获取更新后的 `DOM`

具体可参考官方文档 [深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)

<h5 id='k12' style="color:#007fff;">12. Vue 组件 data 为什么必须是函数</h5>

> 因为js本身的特性带来的， 如果 `data`是一个对象， 那么由于对象本身属于引用类型, 当我们修改其中一个属性时, 回影响到所有Vue实例的数据, 如果将 `data` 作为一个函数返回一个对象, 那么每一个实例的 `data` 属性都是独立的, 就不会互相影响了

<h5 id='k13' style="color:#007fff;">13. 计算属性computed 和事件 methods 和 监听 watch 有什么区别</h5>

我们可以将同一函数定义为一个 `method` 或者一个计算属性。对于最终的结果，两种方式是相同的

不同点:

> `computed`: 根据一条现有数据，去生成新数据，并且建立联系，当现有数据变化之后，新数据也会变化，计算属性是基于它们的依赖进行缓存的, 当其他数据变化的时候，直接设置为缓存里的值, 只有在它的相关依赖发生改变时才会重新求值

> 对于 `methods`, 在`methods`中定义方法，方法去返回想要的变化的数据，在视图表达式中使用函数就可以了, 但是, 这这样的话，当其他数据变化的时候，`vue`会重新编译模板，`methods`的方法域就会被重新执行

> 对于 `watch`: `watch` 在做这样的事情的时候, 需要先去定义新数据, 再去监听更改新数据, 其实`watch`跟时候做监听数变化后去执行某些操作

<h5 id='k14' style="color:#007fff;">14. 对比jQuery, Vue有什么不同</h5>

> `jQuery` 专注视图层, 通过操作`DOM`去实现页面的一些逻辑渲染, `Vue` 专注于数据层, 通过数据的双向绑定, 最终表现在 `DOM` 层面, 减少 `DOM` 操作

> `Vue` 使用了组件化思想, 使得项目子集职责清晰, 提高了开发效率, 方便重复利用, 便于协同开发

<h5 id='k15' style="color:#007fff;">15. Vue 中怎么自定义指令</h5>

> 全局注册

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到DOM中时...
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

> 局部注册

```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

参考 [官方文档-自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)

<h5 id='k16' style="color:#007fff;">16. Vue 中怎么自定义过滤器</h5>

> 可以用全局方法 `Vue.filter()` 注册一个自定义过滤器. 它接收两个参数, 过滤器 `ID` 和过滤器函数. 过滤器函数以值为参数, 返回转换后的值

```js
Vue.filter('reverse', function (value) {
  return value.split('').reverse().join('')
})
```

```html
<!-- 'abc' => 'cba' -->
<span v-text='message | reverse'></span>
```

过滤器也同样接受全局注册和局部注册

<h5 id='k17' style="color:#007fff;">17. 对 keep-alive 的了解</h5>

> `keep-alive` 是 `Vue` 内置的一个组件, 可以使被包含的组件保留状态, 或避免重新渲染

```html
<keep-alive>
  <component>
    <!-- 该组件将被缓存 -->
  </component>
</keep-alive>
```

> 可以使用API提供的props, 实现组件的动态缓存

具体参考 [官方API](https://cn.vuejs.org/v2/api/#keep-alive)

<h5 id='k18' style="color:#007fff;">18. Vue 中 key 的作用</h5>

> `key` 的特殊属性主要用在 `Vue` 的虚拟 `DOM` 算法, 在新旧 `nodes` 对比时辨识 `VNodes` . 如果不使用 `key` , `Vue` 会使用一种最大限度减少动态元素并且尽可能尝试修复/再利用相同类型元素的算法, 使用 `key`, 它会基于 `key` 的变化重新排列元素顺序, 并且会移除 `key` 不存在的元素.

> 有相同父元素的子元素必须有独特的 `key`, 重复的 `key` 会造成渲染错误

具体参考 [官方API](https://cn.vuejs.org/v2/api/#key)

<h5 id='k19' style="color:#007fff;">19. Vue 的核心是什么</h5>

> 数据驱动 组件通信

<h5 id='k20' style="color:#007fff;">20. vue 等单页面应用的优缺点</h5>

> 优点:

- 良好的交互体验
- 良好的前后端工作分离模式
- 减轻服务器压力

> 缺点:

- SEO难度较高
- 前进、后退管理
- 初次加载耗时多

<h5 id='k21' style="color:#007fff;">21. vue中数组变异方法</h5>

```js
push()
pop()
shift()
unshift()
splice()
sort()
reverse()
```

<h5 id="k22" style="color:#007fff;">22. 移动端开发中.ios遮罩层下方内容滚动</h5>

```js
  <div @touchmove.prevent>我是遮罩层</div>

```

```js

```

<h5 id="k23" style="color:#007fff;">23. 路由根据开发状态懒加载</h5>

- 1. 一般情况

```js
import Login from '@/views/login.vue'

export default new Router({
    routes: [{ path: '/login', name: 'denglu', component: Login }]
})

```



> 当需要懒加载 `lazy-loading` 的时候，需要一个个把`routes` 的 `component` 改为 `()=>import('@/views/login.vue')`，甚为麻烦。
>
> 当项目页面越来越多之后，在开发环境之中使用 `lazy-loading` 会变得不太合适，每次更改代码触发热更新都会变得非常的慢。所以建议只在生成环境之中使用路由懒加载功能。

- 2. 优化

  - 根据 `Vue` 的异步组件和 `Webpack` 的代码分割功能可以轻松实现组件的懒加载

```js
const Foo = () => import('./Foo.vue')

```

> 在区分开发环境与生产环境时，可以在路由文件夹下分别新建两个文件：
>
> `_import_production.js`

```js
module.exports = file => () => import('@/views/' + file + '.vue')

```

> `_import_development.js`(这种写法`vue-loader`版本至少在v13.0.0以上)

```js
modules.exports = file => require('@/views/' + file + '.vue').default

// export default === export { default: a }
// require没法应用默认属性，所以后面添加.default

```

> 在设置路由的`router/index.js`文件中

```js
const _import = require('./_import_' + process.env.NODE_ENV)

export default new Router({
    routes: [
        {
            path: '/login', name: 'denglu'， components: _import('login/index')
        }
    ]
})
<<<<<<< HEAD
```



24. 如何通过按钮控制一个或几个变量在不同状态下值的显示，不需申明多个变量

> 假如有两个变量 A = 10、B = [20, 30, 40]; 然后现在我有一个控制按钮，true时，将A、B都改为 0， false时，变回原本的数据。

- 这种情况解决办法我这里提供两种，
  - 用两个变量存放
  - 利用vue的filter过滤器可以轻松解决上述问题。
=======

```



<h5 id="k24" style="color:#007fff;">24. newVue()做了什么</h5>

new关键字代表实例化一个对象, 而`Vue`实际上是一个类, 源码位置是 `/src/core/instance/index.js`

```js
function Vue (options) {
    if (process.env.NODE_ENV !== 'production' && 
    	!(this instanceof Vue)   
    ) {
        warn('Vue is a constructor and should be called with the `new` keyword')
    }
    this._init(options)
}

```

接着我们跳转追踪至`this._init()`, 即 `Vue.prototype._init`, 位于 `/src/core/instance/init.js` 在 `_init()` 方法的内部有一系列 `init*` 的方法

```js
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // ...忽略, 从45行看起
    if (process.env.NODE_ENV !== 'production') {
        initProxy(vm)
    } else {
        vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before adta/props
    initState(vm)
    initProvide(vm)
    callHook(vm, 'created')
    // ...忽略
    if (vm.$options.el) {
        vm.$mount(vm.$options.el)
    }
}

```

<h5 style="color:#58bc58;">24.1 这里我们概述一遍</h5>

- 1. `initProxy`, 作用域代理, 拦截组件内访问其它组件的数据
- 2. `initLifecycle`, 建立父子组件关系, 在当前实例上添加一些属性和生命周期标识. 如: `$children`

, `$refs`, `_isMounted`等

- 3. `initEvents`, 用来存放除 `@hook:生命周期钩子名称="绑定的函数"`事件的对象.如: `$on、$emit`等
- 4. `initRender`, 用于初始化 `$slots`、`$attrs`、`$listeners`
- 5. `initInjectionos`, 初始化 `inject`, 一般用于更深层次的组件通信, 相当于加强版子组件的`props`.用于组件库开发较多

> `只要在上一层级中声明的provide,那么下一层级无论多深都能通过inject来访问到provide的数据.这么做也是有明显的缺点: 在任意层级都能访问, 导致数据追踪比较困难, 不知道是哪一个层级声明了这个或者不知道哪一层级或若干个层级使用.`

- `initState`, 是很多选项初始化的总汇, 包括: `props、methods、data、computed和watch`等
- `initProvide`, 初始化`provide`.
- `vm.$mount`, 挂载实例.



<h5 id="k25" style="color:#007fff;">25. 什么阶段才能访问DOM？</h5>

```js
callHook(vm, 'beforeCreate')
// 初始化 inject
// 初始化 props、methods、data、computed和watch
// 初始化 provide
callHook(vm, 'created')
// 挂载实例 vm.$mount(vm.$options.el)

```



<h5 id="k26" style="color:#007fff;">26. 谈谈你对Vue的生命周期的理解</h5>

​	常规回答这里就不说了，来稍微深入点的：

1. `created / mounted / updated /destroyed`, 以及对应的 `before`钩子.分别是创建 => 挂载 => 更新 => 销毁
2. `Vue`源码中定义了一个`mergeHook`函数来遍历一个常量数组`LIFECYCLE_HOOKS`,该数组实际上是由与生命周期钩子同名的字符串组成的数组.

```js
// v2.6.10最新版
var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    // v2.6+
    'serverPrefetch'
];

```

> 于是，你可以答多 `activated&deactivated`（keep-alive 组件激活/停用）、errorCaptured（v2.5 以上版本有的一个钩子，用于处理错误）这三个。

<h5 style="color:#58bc58;">26.1 新生命周期钩子：serverPrefetch是什么？</h5>

​		`serverPrefetch`前身是`ssrPrefetch`. 顾名思义, 这是用来处理ssr的.允许我们在渲染过程中 '等待'异步数据.可以在任何组件中使用.而不仅仅是路由组件.

```vue
<!-- 这里我们贴出一段官方例子：-->
<!-- Item.vue -->
<template>
	<div v-if="item">{{ item.title }}</div>
	<div v-else>...</div>
</template>

<script>
export default {
    computed: {
        item () {
            return this.$store.state.items[this.$route.params.id]
        }
    },
    servePrefetch () {
        return this.fetchItem
    },
    mounted () {
        if (!this.item) {
            this.fetchItem()
        }
    },
    methods: {
        fetchItem () {
            // return the Promise from the action
            return this.$store.dispatch('fetchItem', this.$route.params.id)
        }
    }
}
</script>

```

<h5 style="color:#58bc58;">26.2 生命周期钩子的合并策略</h5>

拿`callHook(vm, 'create')`讲, 先判断组件的选项中有无对应名字的生命周期钩子, 再判断是否有 `parentVal(vm)`. 若存在 `parentVal(vm)`且都有对应的声明周期钩子, 则会将两者`concat`为一个数组(`parentVal.concat(childVal)`). 所以, 生命周期钩子其实是可以写成数组. 如:

```js
created: [
    function () {
        console.log('first')
    },
    function () {
        console.log('second')
    },
    function () {
        console.log('third')
    }
]

```



<h5 id="k27" style="color:#007fff;">27. Vue-router 路由模式有几种</h5>

三种: `"hash" | "history" | "abstract"`. 一般人只知道两种 `"hash"|"history"`。

```js
// 源码
switch (mode) {
    case 'history':
        this.history = new HTML5History(this, options.base)
        break
    case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
    case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
    default:
        if (process.env.NODE_ENV !== 'production') {
            assert(false, 'invalid mode: ${mode}')
        }
}

```

<font color="#58bc58"># mode</font>

类型: `string`

默认值: `"hash" (浏览器环境) | "abstract" (Node.js环境)`

可选值: `"hash" | "history" | "abstract"` 配置路由模式

- `hash`: 使用 `URL hash` 值来作路由. 支持所有的浏览器, 包括不支持 `HTML5History Api`的浏览器
- `history`: 依赖 `HTML5History Api`和服务器配置. 查看 `HTML5History`模式
- `abstract`: 支持所有`JavaScript` 运行环境, 如 `Node.js`服务器端. 如果没有发现浏览器的 `API`, 路由会自动强制进入这个模式.



<h5 id="k28" style="color:#007fff;">28. 谈谈你对 keep-alive的了解？</h5>

常规回答:

> <span style="background-color:#d8d8bf">keep-alive是Vue内置的一个组件, 可以使被包含的组件保留状态, 或避免重新渲染. 再Vue.2.1.0版本后, keep-alive新加入两个属性: include(包含的组件缓存)与exclude(排除的组件不缓存,优先级打于include)</span>

然后开始骚:

```
1. `<keep-alive>` 是`Vue`源码中实现的一个全局抽象组件, 通过自定义 `render` 函数并且利用了插槽来实现数据缓存和更新. 它的定义再 `src/ core/ components/ keep-alive.js`中

```

```js
export default {
    name: 'keep-alive',
    abstract: true,
    ...
}

```

​	1-1 所有的抽象组件都是通过定义 `abstract` 选项来声明的. 抽象组件不渲染真实 `DOM`, 且不会出现在父子关系的路径上 (initLifecycle会忽略抽象组件), 相关代码片段

```js
if (parent && !options.abstract) {
    // abstract 即 `options.abstract`
    // while 循环查找第一个非抽象的父组件
    while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent
    }
    parent.$children.push(vm)
}

```
>>>>>>> 328c126d5115a76e10d73fe544ff696353fa2722
