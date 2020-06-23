<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button class="addbtn" type="primary" @click="showAddUser" v-if="operationShow">添加用户</el-button>
        <el-dialog title="添加用户" v-model="addFormVisible">
                <el-form :model="createForm">
                    <el-form-item label="用户名称" label-width="100px">
                        <el-input v-model="createForm.user_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" label-width="100px">
                        <el-input type="password" v-model="createForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户电话" label-width="100px">
                        <el-input v-model="createForm.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" label-width="100px">
                        <el-input v-model="createForm.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="部门选择" label-width="100px">
                        <el-select v-model="createForm.department_id" placeholder="请选择用户所属的部门">
                            <el-option
                                v-for="item in departments"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色选择" label-width="100px">
                        <el-select multiple collapse-tags v-model="createForm.role_ids" placeholder="请选择用户所属的角色">
                            <el-option
                                v-for="item in roles"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="createUser()">确 定</el-button>
              </div>
            </el-dialog>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="角色">
                        <span>{{ props.row.role_name }}</span>
                      </el-form-item>
                      <el-form-item label="部门">
                        <span>{{ props.row.department_name }}</span>
                      </el-form-item>
                      <el-form-item label="手机">
                        <span>{{ props.row.phone }}</span>
                      </el-form-item>
                      <el-form-item label="邮箱">
                        <span>{{ props.row.email }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="用户名称"
                  prop="user_name">
                </el-table-column>
                <el-table-column
                  label="用户编号"
                  prop="user_id">
                </el-table-column>
                <el-table-column
                  label="所属角色"
                  prop="role_name">
                </el-table-column>
                <el-table-column label="操作" width="200" v-if="operationShow">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                      <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
            <el-dialog title="修改用户" v-model="dialogFormVisible">
                <el-form :model="updateForm">
                    <el-form-item label="用户名称" label-width="100px">
                        <el-input v-model="updateForm.user_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" label-width="100px">
                        <el-input type="password" v-model="updateForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户电话" label-width="100px">
                        <el-input v-model="updateForm.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" label-width="100px">
                        <el-input v-model="updateForm.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="部门选择" label-width="100px">
                        <el-select v-model="updateForm.department_id" placeholder="请选择用户所属的部门">
                            <el-option
                                v-for="item in departments"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色选择" label-width="100px">
                        <el-select multiple collapse-tags v-model="updateForm.role_ids" placeholder="请选择用户所属的角色">
                            <el-option
                                v-for="item in roles"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateUser()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {getUserList, addUser, updateUser, deleteUser} from '@/api/getData'
    import {getDeptList, getRoleList, getRolesByUserId, addUserRole} from '@/api/getData'
    import {getOperationsByUserId, OPERATION} from '@/api/getData'
    export default {
        data(){
            return {
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,

                tableData: [],

                createForm: {
                    user_name: '',
                    password: '',
                    phone: '',
                    email: '',
                    department_id: '',
                    role_ids: [],
                },
                updateForm: {
                    user_name: '',
                    password: '',
                    phone: '',
                    email: '',
                    department_id: '',
                    role_ids: [],
                },

                departments: [],
                roles: [],
                
                dialogFormVisible: false,
                addFormVisible:false,

                operationShow: false,
            }
        },
    	components: {
    		headTop,
        },
        created() {
            let user_id = localStorage.getItem("user_id");
			this.auth(user_id);
            this.initData();
        },
        methods: {
            async auth(user_id) {
                try{
                    const operations = await getOperationsByUserId(user_id);
                    operations.data.forEach((item, index) => {
                        switch (item.id) {
                            case OPERATION.ADMIN:
                                this.operationShow = true;
                                break;
                            case OPERATION.USER_WRITE:
                                this.operationShow = true;
                                break;
                        }
                    })
                }catch(err){
                    console.log(err.message)
                }
            },
            async initData(){
    			try{
                    // 初始化角色信息
                    this.roles = []
                    const roles = await getRoleList();
                    roles.data.content.forEach((item, index) => {
                        this.roles.push({
                            value: item.id,
                            label: item.name,
                        });
                    });

                    // 初始化部门信息
                    this.departments = []
                    const departments = await getDeptList();
                    departments.data.content.forEach((item, index) => {
                        this.departments.push({
                            value: item.id,
                            label: item.name,
                        });
                    });

                    // 初始化用户信息
                    this.tableData = []
                    let users = await getUserList();
                    this.count = users.data.content.length;
                    users = await getUserList({
                        pageNum: this.currentPage,
                        pageSize: this.limit,
                    });
                    users.data.content.forEach(async (item,index)=>{
                        let user_id = item.id;
                        let user_name = item.username;
                        let phone = item.phone;
                        let email = item.email;
                        let department_name;
                        let role_name = '';

                        this.departments.forEach((it, idx) => {
                            if (it.value == item.departmentId) {
                                department_name = it.label
                            }
                        })

                        const roles_by_user_id = await getRolesByUserId(user_id);
                        if (roles_by_user_id.data.userIdList.length > 0) {
                            roles_by_user_id.data.userIdList.forEach((it, idx) => {
                                this.roles.forEach((e, i) => {
                                    if (e.value == it) {
                                        role_name += e.label + '; '
                                    }
                                })
                            })
                        }

                        this.tableData.push({
                            user_id: user_id,
                            user_name: user_name,
                            phone: phone,
                            email: email,
                            department_name: department_name,
                            role_name: role_name,
                        });
                    });
    			}catch(err){
    				console.log(err.message)
    			}
            },
            showAddUser(){
                this.addFormVisible=true;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.initData();
            },
            handleEdit(index, row) {
                this.updateForm = row;
                this.dialogFormVisible = true;
            },
            async handleDelete(index, row) {
                try{
                    try {
                        const user_res = await deleteUser({"id": row.user_id});
                    } catch(err) {
                        console.log(err.message)
                    }
                    
                    // if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除用户成功'
                        });
                        location.reload();
                    // }else{
                    //     throw new Error(res.message)
                    // }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除用户失败')
                }
            },
            async createUser(){
                this.dialogFormVisible = false;
                try{
                    try {
                        // 添加用户
                        const user_result = await addUser({
                            username: this.createForm.user_name,
                            password: this.createForm.password,
                            phone: this.createForm.phone,
                            email: this.createForm.email,
                            departmentId: this.createForm.department_id,
                        });

                        // 添加用户-角色绑定
                        this.createForm.role_ids.forEach(async (item, index) => {
                            const user_role_result = await addUserRole({
                                "userId": user_result.data.id,
                                "roleId": item,
                            });
                        })
                    } catch(err) {
                        console.log(err.message)
                    }
                    
                    // if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '添加用户成功'
                        });
                        location.reload()
                    // }else{
                    //      throw new Error(res.message)
                    // }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('添加用户失败')
                }
            },
            async updateUser(){
                this.dialogFormVisible = false;
                try{
                    try {
                        // 更新用户
                        const user_result = await updateUser({
                            id: this.updateForm.user_id,
                            username: this.updateForm.user_name,
                            password: this.updateForm.password,
                            phone: this.updateForm.phone,
                            email: this.updateForm.email,
                            departmentId: this.updateForm.department_id,
                        });

                        // TODO: 更新用户-角色绑定
                        // const user_role_result = await updateUserRole({
                        //     user_id: user_result.data.id,
                        //     role_id: this.udpateForm.role_id,
                        // });
                    } catch(err) {
                        console.log(err.message)
                    }

                    // if (result.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新用户成功'
                        });
                        location.reload()
                    // }else{
                    //     throw new Error(res.message)
                    // }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('更新用户失败')
                }
            },
        },
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .addbtn{
        float: right;
        margin: 10px 100px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
