/**
 * 包含多个请求接口函数的模块
 */
import ajax from './ajax'


/**账号登录 */
 export const reqLogin = ({username, password}) => ajax.post('login', {username, password})


 /**左侧菜单权限 */
 export const reqMenu = () => ajax.get('menus')


 //  获取用户数据列表
 export const reqUserList = (queryyInfo) => ajax.get('users', { params: queryyInfo })

 // 修改用户状态
 export const changeUserState = (uId, type) => ajax.put(`users/${uId}/state/${type}`)

 // 添加用户
 export const reqAddUser = ({username, password, email, mobile}) => ajax.post('users', {username, password, email, mobile})

 // 根据 ID 查询用户信息
 export const reqUserById = (id) => ajax.get(`users/${id}`)

 // 编辑用户提交
 export const putUserById = ({id, email, mobile}) => ajax.put(`users/${id}`, {email, mobile})

 // 删除单个用户
 export const deleteUserById = (id) => ajax.delete(`/users/${id}`)