import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const addShop = r => require.ensure([], () => r(require('@/page/addShop')), 'addShop');
const addProduct = r => require.ensure([], () => r(require('@/page/addProduct')), 'addProduct');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const deptList = r => require.ensure([], () => r(require('@/page/deptList')), 'deptList');
const providerList = r => require.ensure([], () => r(require('@/page/providerList')), 'providerList');
const productList = r => require.ensure([], () => r(require('@/page/productList')), 'productList');
const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList');
const roleList = r => require.ensure([], () => r(require('@/page/roleList')), 'roleList');
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');

const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path: '/addShop',
			component: addShop,
			meta: ['添加数据', '添加店铺'],
		},{
			path: '/addProduct',
			component: addProduct,
			meta: ['添加数据', '添加产品'],
		},{
			path: '/userList',
			component: userList,
			meta: ['系统管理', '用户'],
		}, {
			path: '/deptList',
			component: deptList,
			meta: ['系统管理', '部门'],
		}, {
			path: '/roleList',
			component: roleList,
			meta: ['系统管理', '角色'],
		},{
			path: '/providerList',
			component: providerList,
			meta: ['产品管理', '供应商列表'],
		},{
			path: '/productList',
			component: productList,
			meta: ['产品管理', '产品列表'],
		},{
			path: '/orderList',
			component: orderList,
			meta: ['订单管理', '订单列表'],
		},{
			path: '/visitor',
			component: visitor,
			meta: ['图表', '用户分布'],
		},{
			path: '/newMember',
			component: newMember,
			meta: ['图表', '用户数据'],
		},{
			path: '/uploadImg',
			component: uploadImg,
			meta: ['文本编辑', 'MarkDown'],
		},{
			path: '/vueEdit',
			component: vueEdit,
			meta: ['编辑', '文本编辑'],
		},{
			path: '/adminSet',
			component: adminSet,
			meta: ['设置', '管理员设置'],
		},{
			path: '/sendMessage',
			component: sendMessage,
			meta: ['设置', '发送通知'],
		},{
			path: '/explain',
			component: explain,
			meta: ['说明', '我改过的'],
		}]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
