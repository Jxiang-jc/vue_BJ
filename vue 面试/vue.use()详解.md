### 1. 新建一个.vue文件 `Jxiang.vue`
```vue
<template>
    <div class="loading-box">
        Loading...
    </div>
</template>
```

### 2. 在同目录下新建 `index.js`, 并引入 `Jxiang.vue`
```js
// 引入组件
import JxiangComponent from './Jxiang.vue'
// 定义 Loading 对象
const Jxaing = {
    // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
    install:function (Vue) {
        Vue.component('Jxaing', JxiangComponent)
    }
}
// 导出
export default Jxaing
```

### 3. 在 `main.js` 中引入 Jxiang 文件下的 `index.js`
```js
// 其中'./components/Jxiang/index' 的 /index 可以不写，webpack会自动找到并加载 index 。如果是其他的名字就需要写上。
import Jxiang from './components/Jxiang/index'
// 这时需要 use(Jxiang)，如果不写 Vue.use()的话，浏览器会报错，大家可以试一下
Vue.use(Jxiang)
```

### 4. 在App.vue里面写入定义好的组件标签 <Jxiang></Jxiang>
```vue
<template>
  <div id="app">
    <h1>全局使用自定义组件</h1>
    <Jxiang></Jxiang>
  </div>
</template>
```





## 2019.10.8 更新

> 以下是以源码为基准。重新理解vue.use().而不是像上面一样“肤浅”



#### 1.直接源码解析

- `Vue.use`是通过`initUse`这个方法初始化的，

```js
import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
 	Vue.use = function (plugin: Function | Object) {
        // 限制了自定义组建的类型
       	const installedPlugins = (this._installedPlugins || (this._installedPlugins =
    []))
        // 保存注册组件的数组，不存在及创建
       	if (installedPlugins.indexOf(plugin) > -1) {
        	//判断该组件是否注册过，存在return Vue对象
         	return this
       	}
       	// 调用`toArray`方法
       	const args = toArray(arguments, 1)
       	args.unshift(this)
        // 将Vue对象拼接到数组头部
       	if (typeof plugin.install === 'function') {
        	// 如果组件是对象，且提供install方法，调用install方法将参数数组传入，改变`this`指针为该组件
         	plugin.install.apply(plugin, args)
       	} else if (typeof plugin === 'function') {
        	// 如果传入组件是函数，这直接调用，但是此时的`this`指针为`null` 
         	plugin.apply(null, args)
       	}
        // 在保存注册组件的数组中添加
        installedPlugins.push(plugin)
        return this
	}
}
```

- 1. `Vue.use` 接收一个参数 `plugin`， 方法检测`installedPlugins`这个数组中是否已经包含想要注册的插件，可知，插件只允许注册一次。
- 2. 调用`toArray`将转入的参数转换成数组，源码如下：

```js
export function toArray (list: any, start?: number): Array<any> {
  	start = start || 0
  	let i = list.length - start
	// 将存放参数的数组转为数组，并除去第一个参数（该组件）
  	const ret: Array<any> = new Array(i)
	// 循环拿出数组
  	while (i--) {
    	ret[i] = list[i + start]
  	}
  	return ret
}
```



- 3. 将当前`Vue`实例`this`插入转化后的数组前（所以`install`第一个实参是vue实例）
- 4. 判断`plugin`中`install`是否是一个方法，如果是，则调用`install`方法并将转化后的数组传入，同时改变`this`指针为该组件(插件)。否则，如果传入的是函数，则直接调用，但此时`this`指向为null



> 综合上述源码。我们可以得知。我们编写插件时，可以有以下写法

```js
1. export default {
       install(Vue, arg) {}
   }

2. const testObj =  {
       install(Vue, arg) {}
   }
   expordt default testObj

3.  // 如果是使用类的创建。必须如下。这是静态属性。如果放在TestObj里面。叫静态方法。静态方法需要实例才能访问。静态属性可以直接访问
    export default class TestObj {}
    TestObj.install = function (vue) {}

4. export const TestFn = function(arg) {}
```

