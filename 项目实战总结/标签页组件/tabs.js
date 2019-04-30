/* 标签页外层的组件 */

Vue.component('tabs', {
  template: `\
    <div class="tabs"> \
      <div class="tabs-bar"> \
        <!-- 标签页标题， 这里要用v-for --> \
        <div \
          :class="tabCls(item)" \
          class="close"
          v-for="(item, index) in navList" \
          @click="handleChange(index)" \
        > \
          {{ item.label }} \
          <span class="close_tab" v-show="item.closable" @click.stop="closeTab(index)">x</span>
        </div> \
      </div> \
      <div class="tabs-content" :class="content_classes" \
        :style="contentStyle" ref="panes"\
      > \
        <!-- 这里的 slot 就是嵌套的 pane --> \
        <slot></slot> \
      </div> \
    </div> \
  `,
  props: {
    // 这里的value是为了可以使用v-model
    value: {
      type: [String, Number]
    },
    animated: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 用于渲染tabs的标题
      navList: [],
      // 因为不能修改value， 所以复制一份自己维护
      currentValue: this.value
    }
  },
  methods: {
    tabCls (item) {
      return [
        'tabs-tab', {
          // 给当前选中的tab加一个class
          'tabs-tab-active': item.name === this.currentValue
        }
      ]
    },
    // 关闭pane
    closeTab (index) {
      // 获取所有的子组件
      let arr = this.$refs.panes.children
			arr[index].parentNode.removeChild(arr[index])
      
      const tabs = this.getTabs()
      const tab = tabs[index]
      tab.$destroy() // 完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。 // 但不会清楚dom节点

      // 保持当前高亮
      if (tab.currentName === this.currentValue) {
        // $destroy以后， 子组件会销毁一个。需要重新获取currentValue
        const newTabs = this.getTabs()
        let activeKey = -1
        if (newTabs.length) {
          activeKey = newTabs[0].currentName
        }
        this.currentValue = activeKey
      }
      
    },
    // 点击tab标签时触发
    handleChange (index) {
      var nav = this.navList[index]
      var name = nav.name
      // 改变当前选中的tab， 并触发下面的watch
      this.currentValue = name
      // 更新value
      this.$emit('input', name)
      // 触发一个自定义时间， 供父级使用
      this.$emit('on-click', name)
    },
    getTabs () {
      // 通过遍历子组件，得到所有的pane组件
      return this.$children.filter(function (item) {
        return item.$options.name === 'pane'
      })
    },
    getTabsIdx (name) {
      return this.navList.findIndex(nav => nav.name === name)
    },
    updateNav () {
      this.navList = []
      // 设置对this的引用， 在function回调里， this指向的并不是Vue实例
      var _this = this
      this.getTabs().forEach( function (pane, index) {
        _this.navList.push({
          label: pane.label,
          name: pane.name || index,
          closable: pane.closable // 是否可以关闭
        })

        // 如果没有给pane设置name， 默认设置它的索引
        if (!pane.name) pane.name = index

        // 设置当前选中的tab的索引
        if (index === 0) {
          if (!_this.currentValue) {
            _this.currentValue = pane.name || index
          }
        }
      })

      this.updateStatus()
    },
    updateStatus () {
      var tabs = this.getTabs()
			// console.log("TCL: updateStatus -> tabs", tabs)
      var _this = this
      // 显示当前选中的tab对应的pane组件，隐藏没有选中的
      tabs.forEach(function (tab) {
        // var a = false || true // a -> true
        return tab.show = (tab.name === _this.currentValue) || _this.animated
      })

    }
  },
  watch: {
    value (nVal) {
      this.currentValue = nVal
    },
    currentValue () {
      // 在当前选中的tab发生变化时， 跟新pane的显示状态
      this.updateStatus()
    }
  },
  computed: {
    content_classes () {
      return {'content_animated': this.animated}
    },
    contentStyle () {
      let idx = this.getTabsIdx(this.currentValue)
      let pos = idx === 0 ? '0%' : `-${idx}00%`
      let style = {}
      if (idx > -1) {
        style = {
          transform: `translateX(${pos}) translateZ(0px)`
        }
      }
      return style
    }
  }
})