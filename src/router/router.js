// import Login from '../pages/Login/Login.vue'
// import Home from '../pages/Home/Home.vue'
// import Welcome from '../pages/Welcome/Welcome.vue'
// import User from '../pages/User/User.vue'
// import Roles from '../pages/Roles/Roles.vue'
// import Rights from '../pages/Rights/Rights.vue'
// import Goods from '../pages/Goods/Goods.vue'
// import Params from '../pages/Params/Params.vue'
// import Categories from '../pages/Categories/Categories.vue'
// import Orders from '../pages/Orders/Orders.vue'
// import Reports from '../pages/Reports/Reports.vue'
// import AddGood from '../pages/Goods/AddGood.vue'

// import动态引入 就是引入函数 ----- 就是路由懒加载 -- 引用时机： 大一点的组件才需要因为需要发请求
const Login = () => import(/* webpackChunkName: "login-home-welcome" */'../pages/Login/Login.vue')
const Home = () => import(/* webpackChunkName: "login-home-welcome" */'../pages/Home/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */'../pages/Welcome/Welcome.vue')

const User = () => import(/* webpackChunkName: "user-rights-roles" */'../pages/User/User.vue')
const Rights = () => import(/* webpackChunkName: "user-rights-roles" */'../pages/Rights/Rights.vue')
const Roles = () => import(/* webpackChunkName: "user-rights-roles" */'../pages/Roles/Roles.vue')

const Goods = () => import(/* webpackChunkName: "cate-params" */'../pages/Goods/Goods.vue')
const Params = () => import(/* webpackChunkName: "cate-params" */'../pages/Params/Params.vue')
const Categories = () => import(/* webpackChunkName: "cate-params" */'../pages/Categories/Categories.vue')
const AddGood = () => import(/* webpackChunkName: "cate-params" */'../pages/Goods/AddGood.vue')

const Orders = () => import(/* webpackChunkName: "order-report" */'../pages/Orders/Orders.vue')
const Reports = () => import(/* webpackChunkName: "order-report" */'../pages/Reports/Reports.vue')



export default [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/home', component: Home, children: [
    {path: '/welcome', component: Welcome},
    {path: '/users', component: User},
    {path: '/roles', component: Roles},
    {path: '/rights', component: Rights},
    {path: '/goods', component: Goods},
    {path: '/params', component: Params},
    {path: '/categories', component: Categories},
    {path: '/orders', component: Orders},
    {path: '/reports', component: Reports},
    {path: '/goods/add', component: AddGood},
    {path: '/home', redirect: '/welcome'}
  ]},
]