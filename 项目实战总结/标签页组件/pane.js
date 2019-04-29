/* 标签页嵌套的组件 */

Vue.component('pane', {
  name: 'pane',
  template: `\
    <div class="pane" v-show="show"> \
      <slot></slot> \
    </div> \
  `,
  data () {
    return {
      show: true
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
    }
  },
  watch: {
    label () {
      this.updateNav()
    }
  },
  mounted () {
    this.updateNav()
  }
})