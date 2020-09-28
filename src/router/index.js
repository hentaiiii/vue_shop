import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from '../pages/login.vue'


export default new VueRouter({
  mode: 'history',
  routes: [
    {path: '/login', component: Login}
  ]
})