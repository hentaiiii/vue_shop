/**
 * 能发送ajax函数䣌请求
 * 1.处理post请求参数位转化为urlencode模式
 * 2.响应拦截的直接返回data
 */
import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  // 为请求头对象添加token【验证的 Authorization
  config.headers.Authorization = window.sessionStorage.getItem('loginToken')
  const {method, data} = config
  if(method.toUpperCase() === 'post' && data instanceof Object){
    qs.stringify(data)
  }
  return config

}, err => {
  return Promise.reject(err)
})

// // 添加响应拦截器
axios.interceptors.response.use(res => {
  NProgress.done()
  // 成功响应
  return res.data

}, err => {
  // 错误响应
  return Promise.reject(err)
})

export default axios