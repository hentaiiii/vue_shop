import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
// 引入初始样式
import './assets/css/common.css'
// 引入element
// import './plugin/element'
// 引入字体图标
import './assets/fonts/iconfont.css'
// 引入ajax
// import './api/index'

// import axios from 'axios'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios

// 引入树状表格插件
import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

Vue.use(VueQuillEditor)


// 自定义时间过滤器
Vue.filter('dateFormat', (val) => {
  const dt = new Date(val)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const HH = (dt.getHours() + '').padStart(2, '0')
  const MM = (dt.getMinutes() + '').padStart(2, '0')
  const SS = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${HH}:${MM}:${SS}`
})


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
