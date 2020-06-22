<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="用户服务">
                        <span>{{ props.row.user_sevc }}</span>
                      </el-form-item>
                      <el-form-item label="产品服务">
                        <span>{{ props.row.prod_sevc }}</span>
                      </el-form-item>
                      <el-form-item label="认购用户">
                        <span>{{ props.row.user_name }}</span>
                      </el-form-item>
                      <el-form-item label="认购产品">
                        <span>{{ props.row.product_name }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="下单时间"
                  prop="order_time">
                </el-table-column>
                <el-table-column
                  label="订单编号"
                  prop="order_id">
                </el-table-column>
                <el-table-column
                  label="订单类型"
                  prop="order_type">
                </el-table-column>
                <el-table-column
                  label="交易总额（元）"
                  prop="amount">
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
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {getOrderList} from '@/api/getData'
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
            }
        },
    	components: {
    		headTop,
        },
        created() {
            this.initData();
        },
        methods: {
            async initData(){
    			try{
                    // 初始化用户信息
                    this.tableData = []
                    const orders = await getOrderList();
                    console.log(orders)
                    orders.data.forEach(async (item,index)=>{
                        let order_id = item.id;
                        let order_time = item.orderTime;
                        let user_name = item.username;
                        let order_type = item.orderTypeName;
                        let user_sevc = item.userService;
                        let prod_sevc = item.productService;
                        let product_name = item.productName;
                        let amount = item.amount;

                        this.tableData.push({
                            order_id: order_id,
                            order_time: order_time,
                            user_name: user_name,
                            order_type: order_type,
                            user_sevc: user_sevc,
                            prod_sevc: prod_sevc,
                            product_name: product_name,
                            amount: amount,
                        });
                    });
    			}catch(err){
    				console.log(err.message)
    			}
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
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
