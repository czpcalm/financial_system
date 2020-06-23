<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button class="addbtn" type="primary" @click="showAddDept" v-if="operationShow">添加部门</el-button>
        <el-dialog title="添加部门" v-model="addFormVisible">
                <el-form :model="createForm">
                    <el-form-item label="部门名称" label-width="100px">
                        <el-input v-model="createForm.dept_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色选择" label-width="100px">
                        <el-select multiple collapse-tags v-model="createForm.role_ids" placeholder="请选择部门所属的角色">
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
                <el-button type="primary" @click="createDept()">确 定</el-button>
              </div>
            </el-dialog>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <!-- <el-table-column type="expand">
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
                </el-table-column> -->
                <el-table-column
                  label="部门名称"
                  prop="dept_name">
                </el-table-column>
                <el-table-column
                  label="部门编号"
                  prop="dept_id">
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
            <el-dialog title="修改部门" v-model="dialogFormVisible">
                <el-form :model="updateForm">
                    <el-form-item label="部门名称" label-width="100px">
                        <el-input v-model="updateForm.dept_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色选择" label-width="100px">
                        <el-select multiple collapse-tags v-model="updateForm.role_ids" placeholder="请选择部门所属的角色">
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
                    <el-button type="primary" @click="updateDept()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {getDeptList, addDept, updateDept, deleteDept} from '@/api/getData'
    import {getRoleList, getRolesByDeptId, addDeptRole} from '@/api/getData'
    import {getUserList, getOperationsByUserId, OPERATION} from '@/api/getData'
    export default {
        data(){
            return {
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,

                tableData: [],

                createForm: {
                    dept_name: '',
                    role_ids: [],
                },
                updateForm: {
                    dept_name: '',
                    role_ids: [],
                },

                roles: [],
                
                dialogFormVisible: false,
                addFormVisible:false,

                operationShow: false,
            }
        },
        created(){
            let user_id = localStorage.getItem("user_id");
			this.auth(user_id);
            this.initData();
        },
    	components: {
    		headTop,
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
                            case OPERATION.DEPT_WRITE:
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
                    this.tableData = []
                    let depts = await getDeptList();
                    this.count = depts.data.content.length;
                    depts = await getDeptList({
                        pageNum: this.currentPage,
                        pageSize: this.limit,
                    });
                    depts.data.content.forEach(async (item,index)=>{
                        let dept_id = item.id;
                        let dept_name = item.name;
                        let role_name = '';

                        const roles_by_dept_id = await getRolesByDeptId(dept_id);
                        if (roles_by_dept_id.data.roleIdList.length > 0) {
                            roles_by_dept_id.data.roleIdList.forEach((it, idx) => {
                                this.roles.forEach((e, i) => {
                                    if (e.value == it) {
                                        role_name += e.label + '; '
                                    }
                                })
                            })
                        } 
                        
                        this.tableData.push({
                            dept_id: dept_id,
                            dept_name: dept_name,
                            role_name: role_name,
                        });
                    });
    			}catch(err){
    				console.log(err.message)
    			}
            },
            showAddDept(){
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
                        const dept_res = await deleteDept({"id": row.dept_id});
                    } catch(err) {
                        console.log(err.message)
                    }
                    
                    // if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除部门成功'
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
                    console.log('删除部门失败')
                }
            },
            async createDept(){
                this.dialogFormVisible = false;
                try{
                    try {
                        // 添加部门
                        const dept_result = await addDept({
                            name: this.createForm.dept_name,
                        });

                        // 添加部门-角色绑定
                        this.createForm.role_ids.forEach(async (item, index) => {
                            const dept_role_result = await addDeptRole({
                                "departmentId": dept_result.data.id,
                                "roleId": item,
                            });
                        })
                    } catch(err) {
                        console.log(err.message)
                    }
                    
                    // if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '添加部门成功'
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
                    console.log('添加部门失败')
                }
            },
            async updateDept(){
                this.dialogFormVisible = false;
                try{
                    try {
                        // 更新部门
                        const dep_result = await updateDept({
                            id: this.updateForm.dept_id,
                            name: this.updateForm.dept_name,
                        });

                        // TODO: 更新部门-角色绑定
                        // const dept_role_result = await updateDeptRole({
                        //     dept_id: user_result.data.id,
                        //     role_id: this.udpateForm.role_id,
                        // });
                    } catch(err) {
                        console.log(err.message)
                    }

                    // if (result.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新部门成功'
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
                    console.log('更新部门失败')
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
