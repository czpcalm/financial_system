<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button class="addbtn" type="primary" @click="showAddProvider">添加供应商</el-button>
        <el-dialog title="添加供应商" v-model="addFormVisible">
                <el-form :model="providerForm">
                    <el-form-item label="供应商名称" label-width="100px">
                        <el-input v-model="providerForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" label-width="100px">
                        <el-input v-model="providerForm.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" label-width="100px">
                        <el-input v-model="providerForm.email" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addProvider('providerForm')">确 定</el-button>
              </div>
            </el-dialog>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column type="expand">
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
                </el-table-column>
                <el-table-column
                  label="供应商id"
                  prop="provider_id">
                </el-table-column>
                <el-table-column
                  label="供应商名称"
                  prop="name">
                </el-table-column>
                <el-table-column
                  label="电话"
                  prop="phone">
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
            <el-dialog title="修改供应商信息" v-model="dialogFormVisible">
                <el-form :model="selectProvider">
                    <el-form-item label="供应商名称" label-width="100px">
                        <el-input v-model="selectProvider.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" label-width="100px">
                        <el-input v-model="selectProvider.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" label-width="100px">
                        <el-input v-model="selectProvider.email" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateProvider">确 定</el-button>
              </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {getProviders} from '@/api/getData'
    export default {
        data(){
            return {
                offset: 0,
                limit: 20,
                count: 0,
                tableData: [],
                currentPage: 1,
                providerForm:[{
                    name:'',
                    phone:'',
                    email:''
                }],
                selectProvider: {},
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
                    const providers = await getProviders();
                providers.forEach((item,index)=>{
                    this.tableData.push({
                        provider_id:item.id,
                        name:item.name,
                        phone:item.phone,
                        email:item.email
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
                this.selectProvider = row;
                this.dialogFormVisible = true;
            },
            async handleDelete(index, row) {
                try{
                    const res = await deleteProvider(row.provider_id);
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除供应商成功'
                        });
                        this.tableData.splice(index, 1);
                    }else{
                        throw new Error(res.message)
                    }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除供应商失败')
                }
            },
            showAddProvider(){
                this.addFormVisible=true;
            },
            async updateProvider(){
                this.dialogFormVisible = false;
                try{
                    const result = await updateProvider(this.selectProvider)
                    if (result.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新供应商信息成功'
                        });
                        this.getProviders();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新供应商信息失败', err);
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
