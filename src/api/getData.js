import fetch from '@/config/fetch'

export const OPERATION = {
  'SUPER': 1,
  'PROVIDER_ADD': 2,
  'PROVIDER_DELETE': 3,
  'PROVIDER_UDPATE': 4,
  'PROVIDER_GET': 5,
  'PRODUCT_ADD': 6,
  'PRODUCT_DELETE': 7,
  'PRODUCT_UDPATE': 8,
  'PRODUCT_GET': 9,
  'PRODUCT_AUDIT': 10,
  'PRODUCT_ASSESS': 11,
  'PRODUCT_ONSALE': 12,
  'PRODUCT_OFFSALE': 13,
  'MANAGE_READONLY': 14,
  'MANAGE_WRITE': 15,
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

//获取订单列表
export const getOrderList = () => fetch('/order/selectAll');

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

// 鉴权操作
export const Authorization = async (username) => {  
  let user_id = '';
  let dept_id = '';
  let roles = [];
  let operations = {};

  // 获取用户对应角色
  const users = await getUserList();
  users.data.forEach((item, index) => {
      if (item.username == username) {
          user_id = item.id;
      }
  })
  if (typeof(user_id) != 'undefined') {
    const roles_by_user_id = await getRolesByUserId(user_id);
    roles.push(...roles_by_user_id.data.userIdList);
  }

  // 获取部门对应角色
  const user = await getUser(user_id);
  dept_id = user.department;
  if (typeof(dept_id) != 'undefined') {
    const roles_by_dept_id = await getRolesByDeptId(dept_id);
    roles.push(...roles_by_dept_id.data.roleIdList);
  }

  // 获取角色对应操作
  roles.forEach(async (role_id, index) => {
    const operations_by_role_id = await getOperationsByRoleId(role_id);
    if (operations_by_role_id.data.operationIdList.length > 0) {
        operations_by_role_id.data.operationIdList.forEach((it, idx) => {
          operations[it] = true;
        })
    } 
  })
  
  return operations;
}