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
					<el-submenu index="4">
						<template slot="title"><i class="el-icon-star-on"></i>系统管理</template>
						<el-menu-item index="userList" v-if="userShow">用户</el-menu-item>
						<el-menu-item index="deptList" v-if="deptShow">部门</el-menu-item>
						<el-menu-item index="roleList" v-if="roleShow">角色</el-menu-item>
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
		import {getUserList, getOperationsByUserId, OPERATION} from '@/api/getData'
    export default {
			data() {
				return {
					userShow: false,
					deptShow: false,
					roleShow: false,
				}
			},
			created() {
				let user_id = localStorage.getItem("user_id");
				this.auth(user_id);
			},
			methods: {
				async auth(user_id) {
					try{
						const operations = await getOperationsByUserId(user_id);
						operations.data.forEach((item, index) => {
							switch (item.id) {
								case OPERATION.ADMIN:
									this.userShow = true;
									this.deptShow = true;
									this.roleShow = true;
									break;
								case OPERATION.USER_READ:
									this.userShow = true;
									break;
								case OPERATION.DEPT_READ:
									this.deptShow = true;
									break;
								case OPERATION.ROLE_READ:
									this.roleShow = true;
									break;
							}
						})
					}catch(err){
						console.log(err.message)
					}
				}
			}
    }
</script>


<style lang="less" scoped>
	@import '../style/mixin';
	.manage_page{
		
	}
</style>
