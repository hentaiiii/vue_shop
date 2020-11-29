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

 // 获取所有权限列表
 export const reqRights = () => ajax.get('rights/list')

 // 树状获取所有权限列表
 export const reqRightsByTree = () => ajax.get('rights/tree')

 // 角色列表
 export const reqRoles = () => ajax.get('roles')

 // 添加角色
 export const reqAddRole = ({roleName, roleDesc}) => ajax.post('roles', {
  roleName,
  roleDesc
 })

 // 根据 ID 查询角色
 export const reqRole = (id) => ajax.get(`roles/${id}`)

 // 编辑提交角色
 export const putRole = ({roleId, roleName, roleDesc}) => ajax.put(`roles/${roleId}`, {
  roleName,
  roleDesc
 })

 // 删除角色
 export const reqDelteRole = (roleId) => ajax.delete(`roles/${roleId}`)

 //  删除角色指定权限
 export const deleteRights = (roleId, rightId) => ajax.delete(`roles/${roleId}/rights/${rightId}`)

 // 角色授权
 export const reqSetRights = (roleId, rids) => ajax.post(`roles/${roleId}/rights`, {
  rids
 })

 // 分配用户角色
 export const reqSetRole = (id, rid) => ajax.put(`users/${id}/role`, {
  rid
 })

 // 商品分类数据列表
 export const reqCategories = (queryInfo) => ajax.get('categories', {
   params: queryInfo
 })

 // 添加分类
 export const reqAddCate = (addCateObj) => ajax.post('categories', addCateObj)

 // 根据 id 查询分类
 export const reqCateById = (id) => ajax.get(`categories/${id}`)

 // 编辑提交分类
 export const putCate = (id, cat_name) => ajax.put(`categories/${id}`, {
  cat_name
 })

 // 删除分类
 export const delCate = (id) => ajax.delete(`categories/${id}`)

 // 参数列表
 export const reqAttributes = (id, sel) => ajax.get(`categories/${id}/attributes`, {
   params: {
     sel
   }
 })

 // 添加动态参数或者静态属性
 export const reqAddParam = (id, attr_name, attr_sel) => ajax.post(`categories/${id}/attributes`, {
  attr_name,
  attr_sel
 })

 // 根据 ID 查询参数
export const reqParamById = (id, attrId, attr_sel) => ajax.get(`categories/${id}/attributes/${attrId}`, {
  params: {
    attr_sel
  }
})

// 编辑提交参数
export const reqPutParam= (id, attrId, attr_name, attr_sel, attr_vals) => ajax.put(`categories/${id}/attributes/${attrId}`, {
  attr_name,
  attr_sel,
  attr_vals
})

// 删除参数
export const reqDeleteParamById = (id, attrid) => ajax.delete(`categories/${id}/attributes/${attrid}`)

// 获取商品列表数据
export const reqGoodList = (queryInfo) => ajax.get('goods', {
  params: queryInfo
})

// 删除商品
export const reqDeleteGood = (id) => ajax.delete(`goods/${id}`)

// 添加商品
export const reqAddGood = (addFromObj) => ajax.post('goods', addFromObj)

// 订单数据列表
export const reqGetOrders = (queryInfo) => ajax.get('orders', {
  params: queryInfo
})

// 查看物流信息
export const reqGetKuaidi = (id) => ajax.get(`kuaidi/${id}`)