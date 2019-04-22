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