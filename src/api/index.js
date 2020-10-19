/**
 * 包含多个请求接口函数的模块
 */
import ajax from './ajax'


//  /**
//   * 账户登陆
//   */
 export const reqLogin = ({username, password}) => ajax.post('login', {username, password})

