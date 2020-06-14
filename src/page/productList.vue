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
                <el-form :model="selectItem">
                    <el-form-item label="产品名称" label-width="100px">
                        <el-input v-model="selectItem.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="产品供应商" label-width="100px">
	                    <el-select v-model="selectProvider" :placeholder="selectProvider.label" @change="handleSelect">
						    <el-option
						      v-for="item in providerOptions"
						      :key="item.id"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item label="产品类型" label-width="100px">
	                    <el-select v-model="product_type" :placeholder="selectType.label" @change="handleSelect">
						    <el-option
						      v-for="item in typeOptions"
						      :key="item.id"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item label="风险型" label-width="100px">
	                    <el-select v-model="selectRisk" :placeholder="selectRisk.label" @change="handleSelect">
						    <el-option
						      v-for="item in riskOptions"
						      :key="item.id"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
                    </el-form-item>
                    <el-form-item label="收益率" label-width="100px">
						<el-input v-model="profit_rate" ></el-input>
					</el-form-item>
                    <el-form-item label="价格" label-width="100px">
						<el-input v-model="price" ></el-input>
					</el-form-item>
                    <el-form-item label="起购价" label-width="100px">
						<el-input v-model="least_amount" ></el-input>
					</el-form-item>
                    <el-form-item label="产品期限" label-width="100px">
    					<el-col :span="11">
      						<el-date-picker type="date" placeholder="开始日期" v-model="startdate" style="width: 100%;"></el-date-picker>
    					</el-col>
    					<el-col class="line" :span="2">-</el-col>
    						<el-col :span="11">
      						<el-date-picker type="date" placeholder="截止日期" v-model="enddate" style="width: 100%;"></el-date-picker>
    					</el-col>
  					</el-form-item>
                    <el-form-item label="产品介绍" label-width="100px">
                        <el-input type="textarea" v-model="selectItem.description"></el-input>
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
    import {getAllProducts} from '@/api/getData'
    
    export default {
        data(){
            return {
                baseUrl,
                offset: 0,
                limit: 20,
                count: 0,
                tableData: [],
                currentPage: 1,
                selectItem: {},
                dialogFormVisible: false,
                selectRisk: {},
                selectType:{},
                selectProvider:{},
                riskOptions: [],
                typeOptions: [],
                providerOptions: [],
                selectIndex: null,
                expendRow: [],
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
                try{/*
                    const countData = await getProductsCount();
                    if (countData.status == 1) {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }*/
                    this.getProducts();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            async getMenu(){
            	this.menuOptions = [];
                try{
                    const menu = await getMenu({restaurant_id: this.selectItem.restaurant_id, allMenu: true});
                    menu.forEach((item, index) => {
                        this.menuOptions.push({
                        	label: item.name,
                        	value: item.id,
                        	index,
                        })
                    })
                }catch(err){
                    console.log('获取种类失败', err);
                }
            },
            async getProducts(){
                const products = await getAllProducts();
                console.log(products)
                this.tableData = [];
                products.forEach((item, index) => {
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.id = item.id;
                    tableData.description = item.description;
                    tableData.provider_id = item.providerId;
                    tableData.type = item.type;
                    tableData.status = item.status;
                    tableData.profit_rate = item.rateOfReturn;
                    tableData.least_amout = item.startUpPoint;
                    tableData.index = index;
                    this.tableData.push(tableData);
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getFoods()
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
            	const item = await get(row.restaurant_id);
            	const category = await getMenuById(row.category_id)
                this.selectItem = {...row, ...{restaurant_name: restaurant.name, restaurant_address: restaurant.address, category_name: category.name}};

                this.selectMenu = {label: category.name, value: row.category_id}
                this.tableData.splice(row.index, 1, {...this.selectItem});
                this.$nextTick(() => {
                    this.expendRow.push(row.index);
                })
                if (type == 'edit' && this.restaurant_id != row.restaurant_id) {
                	this.getMenu();
                }
            },
            handleSelect(index){
            	this.selectIndex = index;
            	this.selectMenu = this.menuOptions[index];
            },
            async handleDelete(index, row) {
                try{
                    const res = await deleteFood(row.item_id);
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除食品成功'
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
                    console.log('删除食品失败')
                }
            },
            handleServiceAvatarScucess(res, file) {
                if (res.status == 1) {
                    this.selectItem.image_path = res.image_path;
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
            beforeAvatarUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },
            async updateFood(){
                this.dialogFormVisible = false;
                try{
                	const subData = {new_category_id: this.selectMenu.value, specs: this.specs};
                	const postData = {...this.selectItem, ...subData};
                    const res = await updateFood(postData)
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新食品信息成功'
                        });
                        this.getFoods();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新餐馆信息失败', err);
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
