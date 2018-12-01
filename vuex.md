

#  V u e x

------

1.当项目较为庞大，组件结构较复杂，多组件状态共享较为麻烦,而且如果只是用普通的组件通信方法根本无法做到高效的维护,所以`vue`给我们提供了一个 状态管理工具`vuex`

2.采用集中式储存管理应用的所有需要过组件共享的状态(数据)

3.在使用`vuex`,其核心的功能都是通过store来实现,所以我们项目的开始就该搞一个store

4.

​	* store中又可以分为多个小的部分:

​		state , getters, actions , mutations

​		state:负责保存状态   在组件中使用状态的时候,可以通过this.$store.state来使用,但有时候,我们希望自己定义一条数据来接收store中的状态的话,为了实现响应式,要使用computed,而且也可以使用`mapState`辅助函数,

​		mutations 里面的方法可以接收state,并且是唯一可以更改state的方法

​	* 将store传入到根实例中  这样组件中就可以使用this.$store来调用store的`api`了

​	* 想要更改状态只有一种办法,就是通过mutations的方法,利用`mapMutation`可以帮组我们在组件的methods中设置调用mutation方法的方法

​	* 在调用mutation的时候,希望我们在commit立传入一个对象

​	* 如果组件产生用户操作后需要发送一个异步的请求,需要让组件去调用`actions`的方法,actions中进行异步操作后再去调用mutations来更改状态

​	*在组价那种利用this.$store.dispatch方法来调用actions的方法,执行完以后,actions的方法会接收到一个context参数,它身上有commit方法,直接用这个commit方法调用mutations的方法   也可以使用`mapMutations`来给组件身上挂载 

​	* getters 根据一条现有的状态,派生出一条新状态

​	* modules vuex中store只能有一个,但是为了开发方便,允许我们再vuex中配置模块,每个模块都有自己独立的state,getters,mutations,actions,然后再合并到一起,但是,各个模块的state不会合并,而是按照模块去存放数据,  

```
安装: npm i vuex -S
使用: 1. import Vue from 'vue'  2. import Vuex from 'vuex' 3. Vue.use(vuex) 

```



vuex是一个状态管理工具,主要为了解决多组件间的状态共享,

vuex里面有一个核心的store,而且一个项目只能有一个store,唯一数据源

vuex中store需要配置几个小玩意:



```js
state: 是一个纯对象,负责储存需要管理的状态,

组件中如何使用state的状态??

因为已经将store注入根实例中,所以组件可以利用this.$store.state来使用state中管理的状态

为了做到响应式 state中数据变,组件中使用的也改变,vuex要求我们使用计算属性来接收state中的数据

computed:{

	number(){return this.$store.state.number}

}
也可以使用mapState辅助函数来帮助组件使用state中的状态,
    1.computed: mapState(['number'])
    2.computed: mapState({
        number:state => state.number,
        number: 'number'
    })
    3. computed: {
        // ...自己的属性
        ...mapState(['number'])
    }
```

```js
mutations: 更改state只有唯一的一种方式!!就是利用mutations的方法来进行更改,mutations也是一个纯纯的对象,身上有一些方法,可以接收state,并且进行更改
    mutations = {
        increment (state) {
            state.number ++
        }
    }
// 当mutations的方法被调用的使用,状态就会更新
在组件中视图store中commit方法来调用
	this.$store.commit('increment')
// 传参数的时候推荐我们传一个对象(payload)
    mutations = {
         increment (state,payload) {
            state.number += payload.num
        }
    }
	this.$store.commit('increment',{num:2})
// 调用的方式还有一种.就是直接搞一个对象进来
this.$store.commit({type:'increment',num:2}) // 这种最棒棒
// 最好把方法的名字搞成常量
    const INCREMENT = 'INCREMENT'
    mutations = {
        [INCREMENT] (state,payload) {
                state.number += payload.num
            }
    }
    this.$store.commit({type:INCREMENT,num:2})
在组件中调用mutations的时候其实还可以用mapMutations辅助函数来帮我们将mutations中的方法放入到methods中
methods: mapMutations([INCREMENT]) // 其他的用法不写了,和mapState基本一样
```

```js
actions: 注意!mutations里面不能放入异步操作,所以异步操作放在actions
actions是一个纯纯的对象,里面放了很多方法,这些方法会接收到一个context的对象,之歌对象上右commit方法,我们就可以在做完异步操作后,调用commit方法来调用mutations的方法更改状态
actions = {
    asyncIncrement (context, payload) {
        axios.get('./random').then(res =>{
            let num = tes.data.num
            // 准备调用mutations的INCREMENT方法来更改状态
            context.commit({
                type:INCREMENT,
                num
            })
        })
    }
}
在组件中调用actions的方法需要使用store的dispatch
this.$store.dispatch('asyncIncrement',{n:1})
也可以使用mapActions将actions的方法放入组件中
```

```
getters: 有的时候需要根据一条现有的状态派生新状态,比如根据 当前用户的购物车里的商品数据,需要得到用户购物车的总价钱,我们就可以利用getters来派生数据
getters = {
    doubleNumber (state) {
        return state.number * 2
    }
}
组件中通过this.$store.getter来使用getters的数据,也可以使用mapGetters辅助函数
这样的话当state中的状态改变,派生出来的getters也会改变
```

```
modules
	做项目的时候,可能同时管理A,B,C三个状态,因为开发者不一样,就会在一个state上保存可能毫不相关的多个状态,容易引起冲突等,因为store只能有一个,vuex就做了模块化处理,也就是说.可以将某一种状态管理所需要的state/getters/actions/mutations写在一个模块中,然后再创建store的时候进行配置
	这样的话开发的时候可以在在各自的模块中进行管理,store就会对模块进行数据合并,但是state的数据依然是分开模块的,例如我们现在有a,b两个模块,他们都有number数据,我们使用的时候是这样的
	this.$store.state.a.number
	this.$store.state.b.number
```

