<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                @expand='expand'
                :expand-row-keys='expendRow'
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="产品 ID">
                        <span>{{ props.row.id }}</span>
                      </el-form-item>
                      <el-form-item label="供应商 ID">
                        <span>{{ props.row.provider_id }}</span>
                      </el-form-item>
                      <el-form-item label="产品名称">
                        <span>{{ props.row.name }}</span>
                      </el-form-item>
                      <el-form-item label="供应商">
                        <span>{{ props.row.provider_name }}</span>
                      </el-form-item>
                      <el-form-item label="产品类型">
                        <span>{{ props.row.type }}</span>
                      </el-form-item>
                      <el-form-item label="收益率">
                        <span>{{ props.row.profit_rate }}</span>
                      </el-form-item>
                      <el-form-item label="产品价格">
                        <span>{{ props.row.price }}</span>
                      </el-form-item>
                      <el-form-item label="起购价">
                        <span>{{ props.row.least_amount }}</span>
                      </el-form-item>
                      <el-form-item label="风险等级">
                        <span>{{ props.row.risk }}</span>
                      </el-form-item>
                      <el-form-item label="生效日期">
                        <span>{{ props.row.startdate}}</span>
                      </el-form-item>
                      <el-form-item label="失效日期">
                        <span>{{ props.row.enddate}}</span>
                      </el-form-item>
                      <el-form-item label="产品介绍">
                        <span>{{ props.row.description }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="产品名称"
                  prop="name">
                </el-table-column>
                <el-table-column
                  label="产品类型"
                  prop="type">
                </el-table-column>
                <el-table-column
                  label="产品状态"
                  prop="status">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button
                      size="small"
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
            <el-dialog title="修改产品信息" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="产品名称" label-width="100px">
                        <el-input v-model="selectTable.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="产品供应商" label-width="100px">
	                    <el-select v-model="selectProvider" :placeholder="selectProvider.label" @change="handleSelect">
						    <el-option
						      v-for="item in providers"
						      :key="item.id"
						      :label="item.label"
						      :value="item.id">
						    </el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item label="产品类型" label-width="100px">
	                    <el-select v-model="product_type" :placeholder="selectMenu.label" @change="handleSelect">
						    <el-option
						      v-for="item in types"
						      :key="item.id"
						      :label="item.label"
						      :value="item.id">
						    </el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item label="风险型" label-width="100px">
	                    <el-select v-model="selectRisk" :placeholder="selectMenu.label" @change="handleSelect">
						    <el-option
						      v-for="item in risks"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item label="产品介绍" label-width="100px">
                        <el-input v-model="selectTable.description"></el-input>
                    </el-form-item>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="unpdateProduct">确 定</el-button>
              </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getProducts, getProductsCount, getMenu, unpdateProduct, deleteFood, getResturantDetail, getMenuById} from '@/api/getData'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                
                offset: 0,
                limit: 20,
                count: 0,
                tableData: [],
                currentPage: 1,
                selectTable: {},
                dialogFormVisible: false,
                menuOptions: [],
                selectMenu: {},
                selectIndex: null,
                specsForm: {
		          	specs: '',
		          	packing_fee: 0,
		          	price: 20,
		        },
            }
        },
        created(){
        	this.provider_id = this.$route.query.provider_id;
            this.initData();
        },
        computed: {
        	specs: function (){
        		let specs = [];
        		if (this.selectTable.specProducts) {
	        		this.selectTable.specProducts.forEach(item => {
	        			specs.push({
	        				specs: item.specs_name,
	        				packing_fee: item.packing_fee,
	        				price: item.price,
	        			})
	        		})
        		}
        		return specs
        	}
        },
    	components: {
    		headTop,
    	},
        methods: {
            async initData(){
                try{
                    const countData = await getProductsCount({provider_id: this.provider_id});
                    if (countData.status == 1) {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getProducts();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            async getMenu(){
            	this.menuOptions = [];
                try{
                    const menu = await getMenu({provider_id: this.selectTable.provider_id, allMenu: true});
                    menu.forEach((item, index) => {
                        this.menuOptions.push({
                        	label: item.name,
                        	value: item.id,
                        	index,
                        })
                    })
                }catch(err){
                    console.log('获取产品种类失败', err);
                }
            },
            async getProducts(){
                const Products = await getProducts();
                this.tableData = [{
                    name: "五五开理财产品",
                    id:55,
                    description:"卢姥爷专供",
                    profit_rate:0.005,
                    price:5500,
                    least_amount:100,
                    category_id:3,
                    provider:"卢本伟",
                    product_id:55,
                    startdate:'2020/06/07',
                    enddate:'2022/07/06',
                    status:2
                }];
                Products.forEach((item, index) => {
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.id = item.id;
                    tableData.description = item.description;
                    tableData.profit_rate = item.profit_rate;
                    tableData.price = item.price;
                    tableData.least_amount = item.least_amount;
                    tableData.category_id = item.category_id;
                    tableData.provider = item.provider;
                    tableData.provider_id = item.provider_id;
                    tableData.startdate = item.startdate;
                    tableData.enddate = item.enddate;
                    tableData.status = item.status;
                    tableData.index = index;
                    this.tableData.push(tableData);
                })
            },
            tableRowClassName(row, index) {
		        if (index === 1) {
		        	return 'info-row';
		        } else if (index === 3) {
		        	return 'positive-row';
		        }
		        return '';
		    },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getProducts()
            },
            expand(row, status){
            	if (status) {
            		this.getSelectItemData(row)
            	}else{
                    const index = this.expendRow.indexOf(row.index);
                    this.expendRow.splice(index, 1)
                }
            },
            handleEdit(row) {
            	this.getSelectItemData(row, 'edit')
                this.dialogFormVisible = true;
            },
            async getSelectItemData(row, type){
            	const provider = await getResturantDetail(row.provider_id);
            	const category = await getMenuById(row.category_id)
                this.selectTable = {...row, ...{provider_name: provider.name, provider_address: provider.address, category_name: category.name}};

                this.selectMenu = {label: category.name, value: row.category_id}
                this.tableData.splice(row.index, 1, {...this.selectTable});
                this.$nextTick(() => {
                    this.expendRow.push(row.index);
                })
                if (type == 'edit' && this.provider_id != row.provider_id) {
                	this.getMenu();
                }
            },
            handleSelect(index){
            	this.selectIndex = index;
            	this.selectMenu = this.menuOptions[index];
            },
            async handleDelete(index, row) {
                try{
                    const res = await deleteFood(row.product_id);
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除产品成功'
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
                    console.log('删除产品失败')
                }
            },
            async unpdateProduct(){
                this.dialogFormVisible = false;
                try{
                	const subData = {new_category_id: this.selectMenu.value};
                	const postData = {...this.selectTable, ...subData};
                    const res = await unpdateProduct(postData)
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新产品信息成功'
                        });
                        this.getProducts();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新产品信息失败', err);
                }
            },
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
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
