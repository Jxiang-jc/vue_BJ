/* 标签页嵌套的组件 */

Vue.component('pane', {
  name: 'pane',
  template: `\
    <div class="pane" v-show="show" :style="contentStyle"> \
      <slot></slot> \
    </div> \
  `,
  data () {
    return {
      show: true,
      currentName: this.name
    }
  },
  props: {
    name: {
      type: String
    },
    label: {
      type: String,
      default: ''
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    updateNav () {
      this.$parent.updateNav()
      console.log('this.$parent', this.$parent)
    }
  },
  watch: {
    label () {
      this.updateNav()
    },
    name (nVal) {
      this.currentName = nVal
      this.updateNav()
    }
  },
  mounted () {
    this.updateNav()
  },
  computed: {
    contentStyle () {
      return {
        // 组件自己控制是否显示。
        visibility: this.$parent.currentValue !== this.currentName ? 'hidden' : 'visible'
      }
    }
  }
})