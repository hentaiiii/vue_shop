import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'

Vue.use(VueRouter)


 const router = new VueRouter({
  mode: 'history',
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if(to.path === '/login'){
    next()
  }else{
    // 查看是否有token
    const loginToken = window.sessionStorage.getItem('loginToken')
    if(!loginToken){
      return next('/login')
    }
    next()
  }
})

export default router