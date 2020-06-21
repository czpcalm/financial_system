import fetch from '@/config/fetch'

//获取所有产品信息
export const getAllProducts = () => fetch('/product/selectAll');

//获取所有供应商信息
export const getProviders=()=>fetch('/provider/selectAll');

//添加供应商
export const addProvider=data=>fetch('/provider/insertSelective',data,"POST");

//添加产品
export const addProduct=data=>fetch('/product/insertSelective',data,"POST");

//登录
export const login = data => fetch('/login',data,'POST');

//获取管理员列表
export const adminList = () => fetch('/roleUser/selectAll');

//获取管理员数量
export const adminCount = () => fetch('/role/countName');

//获取用户数量
export const getUserCount = () => fetch('/user/count');

//获取订单列表
export const getOrderList = () => fetch('/order/selectAll');

//获取订单数量
export const getOrderCount = () => fetch('/order/count');

//获取用户列表
export const getUserList = () => fetch('/user/selectAll');

//增加某个用户
export const addUser = data => fetch('/user/insertSelective', data, "POST");

//修改某个用户
export const updateUser = data => fetch('/user/update', data, "PUT");

//删除某个用户
export const deleteUser = data => fetch('/user/delete?id='+data.id, {}, "DELETE");

//获取部门列表
export const getDeptList = () => fetch('/department/selectAll');

//增加某个部门
export const addDept = data => fetch('/department/insertSelective', data, "POST");

//修改某个部门
export const updateDept = data => fetch('/department/update', data, "PUT");

//删除某个部门
export const deleteDept = data => fetch('/department/delete?id='+data.id, {}, "DELETE");

//获取角色列表
export const getRoleList = () => fetch('/role/selectAll');

//增加某个角色
export const addRole = data => fetch('/role/insertSelective', data, "POST");

//修改某个角色
export const updateRole = data => fetch('/role/update', data, 'POST');

//删除某个角色
export const deleteRole = data => fetch('/role/delete?id='+data.id, {}, "DELETE");

//获取操作列表
export const getOperationList = () => fetch('/operation/selectAll');