<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button class="addbtn" type="primary" @click="showAddDept">添加部门</el-button>
        <el-dialog title="添加部门" v-model="addFormVisible">
                <el-form :model="deptForm">
                    <el-form-item label="部门名称" label-width="100px">
                        <el-input v-model="deptForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="部门权限" label-width="100px">
                        <el-select v-model="deptForm.role" placeholder="请选择该部门预设的角色">
                            <el-option
                                v-for="item in options"
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
                <el-button type="primary" @click="addDept()">确 定</el-button>
              </div>
            </el-dialog>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column type="expand">
                  <!-- <template slot-scope="props">
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
                  </template> -->
                </el-table-column>
                <!-- <el-table-column
                  label="创建时间"
                  prop="create_time">
                </el-table-column> -->
                <el-table-column
                  label="部门编号"
                  prop="dept_id">
                </el-table-column>
                <el-table-column
                  label="部门名称"
                  prop="dept_name">
                </el-table-column>
                <!-- <el-table-column
                  label="角色权限"
                  prop="auth_role">
                </el-table-column> -->
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
            <el-dialog title="修改部门" v-model="dialogFormVisible">
                <el-form :model="selectDept">
                    <el-form-item label="部门名称" label-width="100px">
                        <el-input v-model="selectDept.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="部门权限" label-width="100px">
                        <el-select v-model="selectDept.role" placeholder="请选择该部门预设的角色">
                            <el-option
                                v-for="item in options"
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
                    <el-button type="primary" @click="updateDept">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {getDeptList, addDepartment, updateDepartment, deleteDepartment, addDeptRole} from '@/api/getData'
    export default {
        data(){
            return {
                offset: 0,
                limit: 20,
                count: 0,
                tableData: [],
                currentPage: 1,
                deptForm: {
                    name: '',
                    role: '',
                },
                options: [ // TODO: 获取角色列表
                    { 
                        value: '1',
                        label: 'administrator',
                    }, 
                    {
                        value: '2',
                        label: 'general_user',
                    }
                ],
                selectDept: {
                    name: '',
                    role: '',
                },
                dialogFormVisible: false,
                addFormVisible:false,
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
                    const depts = await getDeptList();
                    depts.forEach((item,index)=>{
                        this.tableData.push({
                            create_time:item.createTime,
                            dept_id:item.id,
                            dept_name:item.name,
                            // auth_role:
                        });
                    });
    			}catch(err){
    				console.log(err)
    			}
    		},
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getResturants()
            },
            handleEdit(index, row) {
                this.selectDept = row;
                this.dialogFormVisible = true;
            },
            async handleDelete(index, row) {
                try{
                    // TODO: 删除该部门的用户
                    try {
                        const res = await deleteDepartment(row.dept_id);
                    } catch(err) {
                        console.log(err.message)
                    }
                    
                    // if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除部门成功'
                        });
                        this.tableData.splice(index, 1);
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
            showAddDept(){
                this.addFormVisible=true;
            },
            async addDept(){
                try{
                    try {
                        const res = await addDepartment(this.deptForm.name);
                        // TODO: 插入角色权限
                        // addDeptRole(this.deptForm.id, this.deptForm.role)
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
                    //     throw new Error(res.message)
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
                        const res = await updateDepartment(this.selectDept.name)
                        // TODO: 更新角色权限
                        // updateDeptRole(this.deptForm.id, this.deptForm.role)
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
                        message: res.message
                    });
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
