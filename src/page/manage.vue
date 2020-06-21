<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="2">
						<template slot="title"><i class="el-icon-document"></i>产品管理</template>
						<el-menu-item index="addproduct">添加产品</el-menu-item>
						<el-menu-item index="productList">产品列表</el-menu-item>
						<el-menu-item index="providerList">供应商信息</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-plus"></i>订单管理</template>
						<el-menu-item index="orderList">订单列表</el-menu-item>
					</el-submenu>
					<el-submenu index="4" v-if="isShow">
						<template slot="title"><i class="el-icon-star-on"></i>系统管理</template>
						<el-menu-item index="userList" v-show="userShow">用户</el-menu-item>
						<el-menu-item index="deptList" v-show="deptShow">部门</el-menu-item>
						<el-menu-item index="roleList" v-show="roleShow">角色</el-menu-item>
					</el-submenu>

					<!-- <el-submenu index="5"> -->
						<!-- <template slot="title"><i class="el-icon-edit"></i>系统管理</template> -->
						<!-- <el-menu-item index="newMember">用户数据</el-menu-item> -->
						<!-- <el-menu-item index="uploadImg">上传图片</el-menu-item> -->
						<!-- <el-menu-item index="vueEdit">文本编辑</el-menu-item>  -->
						<!-- <el-menu-item index="adminList">权限列表</el-menu-item> -->
						<!-- <el-menu-item index="adminSet">管理员设置</el-menu-item> -->
						<!-- <el-menu-item index="explain">说明</el-menu-item> -->
					<!-- </el-submenu> -->
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
		import {getUserList, getUser, getRolesByUserId, getRolesByDeptId, getOperationsByRoleId, OPERATION} from '@/api/getData'
    export default {
			data() {
				return {
					isShow: false,
					userShow: false,
					deptShow: false,
					roleShow: false,
				}
			},
			computed: {
				defaultActive () {
					let username = localStorage.getItem("username");
					this.Authorization(username);
				}
			},
			methods: {
				async Authorization(username) {
					let user_id = '';
					let dept_id = '';
					let roles = [];
					let operations = [];

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
					dept_id = user.data.departmentId;				
					if (typeof(dept_id) != 'undefined') {
						const roles_by_dept_id = await getRolesByDeptId(dept_id);
						roles.push(...roles_by_dept_id.data.roleIdList);
					}

					// 获取角色对应操作
					roles.forEach(async (role_id, index) => {
						const operations_by_role_id = await getOperationsByRoleId(role_id);
						if (operations_by_role_id.data.operationIdList.length > 0) {
								console.log(operations_by_role_id)
								operations_by_role_id.data.operationIdList.forEach((it, idx) => {
									// operations.push(it);
									localStorage.setItem(it, true);
									if (it == 1) {
										this.isShow = true;
										this.userShow = true;
										this.deptShow = true;
										this.roleShow = true;
									}
									if (it == 3) {
										this.isShow = true;
										this.userShow = true;
									}
									if (it == 5) {
										this.isShow = true;
										this.roleShow = true;
									}
									if (it == 7) {
										this.isShow = true;
										this.deptShow = true;
									}
								})
						} 
					})
				}
			}
    }
</script>


<style lang="less" scoped>
	@import '../style/mixin';
	.manage_page{
		
	}
</style>
