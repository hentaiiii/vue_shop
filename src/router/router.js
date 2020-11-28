import Login from '../pages/Login/Login.vue'
import Home from '../pages/Home/Home.vue'
import Welcome from '../pages/Welcome/Welcome.vue'
import User from '../pages/User/User.vue'
import Roles from '../pages/Roles/Roles.vue'
import Rights from '../pages/Rights/Rights.vue'
import Goods from '../pages/Goods/Goods.vue'
import Params from '../pages/Params/Params.vue'
import Categories from '../pages/Categories/Categories.vue'
import Orders from '../pages/Orders/Orders.vue'
import Reports from '../pages/Reports/Reports.vue'
import AddGood from '../pages/Goods/AddGood.vue'


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