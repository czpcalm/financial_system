<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button class="addbtn" type="primary" @click="showAddRole">添加角色</el-button>
        <el-dialog title="添加角色" v-model="addFormVisible">
                <el-form :model="createForm">
                    <el-form-item label="角色名称" label-width="100px">
                        <el-input v-model="createForm.role_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单权限" label-width="100px">
                        <el-select multiple collapse-tags v-model="createForm.operation_ids" placeholder="请选择角色允许的操作">
                            <el-option
                                v-for="item in operations"
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
                <el-button type="primary" @click="createRole()">确 定</el-button>
              </div>
            </el-dialog>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <!-- <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="供应商id">
                        <span>{{ props.row.provider_id }}</span>
                      </el-form-item>
                      <el-form-item label="供应商名称">
                        <span>{{ props.row.name }}</span>
                      </el-form-item>
                      <el-form-item label="电话">
                        <span>{{ props.row.phone }}</span>
                      </el-form-item>
                      <el-form-item label="邮箱">
                        <span>{{ props.row.email }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column> -->
                <el-table-column
                  label="角色名称"
                  prop="role_name">
                </el-table-column>
                <el-table-column
                  label="角色编号"
                  prop="role_id">
                </el-table-column>
                <el-table-column
                  label="允许操作"
                  prop="operation_name">
                </el-table-column>
                <el-table-column label="操作" width="200">
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
            <el-dialog title="修改角色" v-model="dialogFormVisible">
                <el-form :model="updateForm">
                    <el-form-item label="角色名称" label-width="100px">
                        <el-input v-model="updateForm.role_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单权限" label-width="100px">
                        <el-select multiple collapse-tags v-model="updateForm.operation_ids" placeholder="请选择角色允许的操作">
                            <el-option
                                v-for="item in operations"
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
                    <el-button type="primary" @click="updateRole()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {getRoleList, addRole, updateRole, deleteRole} from '@/api/getData'
    import {getOperationList, getOperationsByRoleId, addRoleOperation, getRoleOperationList} from '@/api/getData'
    export default {
        data(){
            return {
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,

                tableData: [],

                createForm: {
                    role_name: '',
                    operation_ids: [],
                },
                updateForm: {
                    role_name: '',
                    operation_ids: [],
                },

                operations: [],
                
                dialogFormVisible: false,
                addFormVisible:false,

                user_auth: '',
            }
        },
        created(){
            this.initData();
        },
    	components: {
    		headTop,
    	},
        methods: {
            async initData(){
    			try{
                    // 初始化菜单权限
                    this.operations = []
                    const operations = await getOperationList();
                    operations.data.forEach((item, index) => {
                        this.operations.push({
                            value: item.id,
                            label: item.name,
                        });
                    });

                    // 初始化角色信息
                    this.tableData = []
                    const roles = await getRoleList();
                    roles.data.forEach(async (item,index)=>{
                        let role_id = item.id;
                        let role_name = item.name;
                        let operation_name = '';

                        const operations_by_role_id = await getOperationsByRoleId(role_id);
                        if (operations_by_role_id.data.operationIdList.length > 0) {
                            operations_by_role_id.data.operationIdList.forEach((it, idx) => {
                                this.operations.forEach((e, i) => {
                                    if (e.value == it) {
                                        operation_name += e.label + '; '
                                    }
                                })
                            })
                        }

                        this.tableData.push({
                            role_id: role_id,
                            role_name: role_name,
                            operation_name: operation_name,
                        });
                    });
    			}catch(err){
    				console.log(err.message)
    			}
            },
            showAddRole(){
                this.addFormVisible=true;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
            },
            handleEdit(index, row) {
                this.updateForm = row;
                this.dialogFormVisible = true;
            },
            async handleDelete(index, row) {
                try{
                    try {
                        // const user_res = await deleteUsers(row.role_id);
                        // const dept_res = await deleteDepts(row.role_id);
                        // const operation_res = await deleteOperations(row.role_id);
                        const role_res = await deleteRole({"id": row.role_id});
                    } catch(err) {
                        console.log(err.message)
                    }
                    
                    // if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除角色成功'
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
                    console.log('删除角色失败')
                }
            },
            async createRole(){
                this.dialogFormVisible = false;
                try{
                    try {
                        // 添加角色
                        const role_result = await addRole({
                            name: this.createForm.role_name,
                        });

                        // 根据角色名字查询角色编号
                        let roles = await getRoleList();
                        roles.data.forEach((item, index) => {
                            if (item.name == this.createForm.role_name) {
                                role_result.id = item.id;
                            }
                        })

                        // 添加角色-菜单绑定
                        this.createForm.operation_ids.forEach(async (item, index) => {
                            console.log(item)
                            const role_operation_result = await addRoleOperation({
                                "roleId": role_result.id,
                                "operationId": item,
                            });
                        })
                    } catch(err) {
                        console.log(err.message)
                    }
                    
                    // if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '添加角色成功'
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
                    console.log('添加角色失败')
                }
            },
            async updateRole(){
                this.dialogFormVisible = false;
                try{
                    try {
                        // 更新角色
                        var role_data = {
                            "id": this.updateForm.role_id, 
                            "name": this.updateForm.role_name,
                        }
                        const role_result = await updateRole(role_data)

                        // 根据角色名字查询角色编号
                        let roles = await getRoleList();
                        roles.data.forEach((item, index) => {
                            if (item.name == this.updateForm.role_name) {
                                role_result.id = item.id;
                            }
                        })

                        // 角色-菜单绑定
                        this.updateForm.operation_ids.forEach(async (item, index) => {
                            const role_operation_result = await addRoleOperation({
                                "roleId": role_result.id,
                                "operationId": item,
                            });
                        })

                        // // 更新角色-操作绑定
                        // var role_operation_data = {
                        //     "role_id": this.updateForm.role_id,
                        //     "operation_id": this.updateForm.operation_id
                        // }
                        // const role_operation_res = await updateRoleOperation(role_operation_data)
                    } catch(err) {
                        console.log(err.message)
                    }

                    // if (result.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新角色成功'
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
                    console.log('更新角色失败')
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
