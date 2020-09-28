import Vue from 'vue'
import App from './App.vue'
import {Button} from 'element-ui'
import router from './router/index'

Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
