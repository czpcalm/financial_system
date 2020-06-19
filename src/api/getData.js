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

//获取用户列表
export const getUserList = () => fetch('/user/selectAll');

//增加某个用户
export const addUser = data => fetch('/user/insertSelective', data, "POST");

//修改某个用户
export const updateUser = (id, name) => fetch('/user/update?id='+id+'&name='+name, {}, "PUT");

//删除某个部门
export const deleteUser = id => fetch('/user/delete?id='+id, {}, "DELETE");

//获取用户数量
export const getUserCount = () => fetch('/user/count');

//获取订单列表
export const getOrderList = () => fetch('/order/selectAll');

//获取订单数量
export const getOrderCount = () => fetch('/order/count');

//获取部门列表
export const getDeptList = () => fetch('/department/selectAll');

//增加某个部门
export const addDepartment = name => fetch('/department/insertSelective', {name: name}, "POST");

//修改某个部门
export const updateDepartment = (id, name) => fetch('/department/update?id='+id+'&name='+name, {}, "PUT");

//删除某个部门
export const deleteDepartment = id => fetch('/department/delete?id='+id, {}, "DELETE");

//增加部门权限
export const addDeptRole = (dept_id, role_id) => fetch('/roleDepartment/insertSelective?department_id='+dept_id+"&role_id="+role_id, {}, 'POST');

//修改部门权限
export const updateDeptRole = (dept_id, role_id) => fetch('/roleDepartment/update?department_id='+dept_id+"&role_id="+role_id, {}, 'PUT');

//获取部门权限
export const getDeptRole = id => fetch('/roleDepartment/selectOne', id);