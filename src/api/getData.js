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

//获取用户数量
export const getUserCount = () => fetch('/user/count');

//获取订单列表
export const getOrderList = () => fetch('/order/selectAll');

//获取订单数量
export const getOrderCount = () => fetch('/order/count');