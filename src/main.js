import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
// 引入初始样式
import './assets/css/common.css'
// 引入element
import './plugin/element'
// 引入字体图标
import './assets/fonts/iconfont.css'
// 引入ajax
// import './api/index'

// import axios from 'axios'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
