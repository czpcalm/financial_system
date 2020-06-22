import fetch from '@/config/fetch'

export const OPERATION = {
  'ADMIN': 1,
  'GENERAL': 2,
  'USER_READ': 3,
  'USER_WRITE': 4,
  'DEPT_READ': 5,
  'DEPT_WRITE': 6,
  'ROLE_READ': 7,
  'ROLE_WRITE': 8,
  'ORDER_READ': 9,
}

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

//获取订单数量
export const getOrderCount = () => fetch('/order/count');

//获取用户列表
export const getUserList = () => fetch('/user/selectAll');

//获取某个用户
export const getUser = id => fetch('/user/selectOne?id='+id);

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

//获取订单列表
export const getOrderList = () => fetch('/order/selectAll');

//增加某个订单
export const addOrder = data => fetch('/order/insertSelective', data, "POST");

//修改某个订单
export const updateOrder = data => fetch('/order/update', data, 'POST');

//删除某个角色
export const deleteOrder = data => fetch('/order/delete?id='+data.id, {}, "DELETE");

//获取操作列表
export const getOperationList = () => fetch('/operation/selectAll');

//获取角色菜单绑定
export const getRoleOperationList = data => fetch('/operationRole/selectAll');

//增加角色菜单绑定
export const addRoleOperation = data => fetch('/operationRole/insertSelective', data, 'POST');

//根据角色获取操作
export const getOperationsByRoleId = id => fetch('/role/selectOperationIdListByRoleId?roleId='+id);

//增加用户角色绑定
export const addUserRole = data => fetch('/roleUser/insertSelective', data, 'POST');

//根据用户获取角色
export const getRolesByUserId = id => fetch('/user/selectRoleIdListByUserId?userId='+id);

//增加部门角色绑定
export const addDeptRole = data => fetch('/roleDepartment/insertSelective', data, 'POST');

//根据用户获取角色
export const getRolesByDeptId = id => fetch('/department/selectRoleIdListByDepartmentId?departmentId='+id);

//根据用户获取操作
export const getOperationsByUserId = id => fetch('/operation/selectByUserId?userId='+id);

//获取单个订单评价
export const getOrderComment = id => fetch('/orderComment/selectOne?id='+id);
