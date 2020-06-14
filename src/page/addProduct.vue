<template>
    <div>
     	<head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="14" :offset="4">
  				<header class="form_header">选择产品供应商</header>
	  			<el-form :model="providerForm" ref="providerForm" label-width="110px" class="form">
		  			<el-row class="provider_select">
		  				<el-form-item label="供应商">
			  				<el-select v-model="productForm.provider_id" placeholder="选择供应商" style="width:100%;">
							    <el-option
							      	v-for="item in providerList"
							      	:key="item.value"
							      	:label="item.label"
							      	:value="item.value">
							    </el-option>
						  	</el-select>
						</el-form-item>
					</el-row>
					<el-row class="add_provider_row" :class="showAddprovider? 'showEdit': ''">
						<div class="add_provider">
							<el-form-item label="供应商名称" prop="name">
								<el-input v-model="providerForm.name"></el-input>
							</el-form-item>
							<el-form-item label="供应商电话" prop="phone">
								<el-input v-model="providerForm.phone"></el-input>
							</el-form-item>
							<el-form-item type="email" label="供应商邮件" prop="email">
								<el-input v-model="providerForm.email"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button span="showbtn" type="primary" @click="submitproviderForm('providerForm')">提交</el-button>
							</el-form-item>
						</div>
					</el-row>
					<div class="add_provider_button" @click="addproviderFun">
						<i class="el-icon-caret-top edit_icon" v-if="showAddprovider"></i>
						<i class="el-icon-caret-bottom edit_icon" v-else slot="icon"></i>
						<span>添加新的供应商</span>
					</div>
	  			</el-form>
	  			<header class="form_header">添加理财产品</header>
	  			<el-form :model="productForm" :rules="productrules" ref="productForm" label-width="110px" class="form product_form">
	  				<el-form-item label="产品名称" prop="name">
						<el-input v-model="productForm.name"></el-input>
					</el-form-item>
					<el-form-item label="产品类型">
						<el-select v-model="productForm.type" placeholder="选择类型">
						    <el-option
						      	v-for="item in types"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.label">
						    </el-option>
					 	</el-select>
					</el-form-item>
					<el-form-item label="产品期限">
						<el-radio class="radio" v-model="duration_type" label="flexible">活期产品</el-radio>
  						<el-radio class="radio" v-model="duration_type" label="fixed">定期产品</el-radio>
					</el-form-item>
					<el-row v-if="duration == 'fixed'">
						<el-form-item label="期长">
							<el-col :span="7">
								<el-input-number v-model="year" :min='0' :max='50'></el-input-number>
							</el-col>
							<el-col :span="1"><span>&ensp;年</span></el-col>
							<el-col :span="7">
								<el-input-number v-model="month" :min='0' :max='11'></el-input-number>
							</el-col>
							<el-col :span="1"><span>&ensp;月</span></el-col>
							<el-col :span="7">
								<el-input-number v-model="day" :min='0' :max='30'></el-input-number>
							</el-col>
							<el-col :span="1"><span>&ensp;日</span></el-col>
		
						</el-form-item>
					</el-row>
					<el-form-item label="产品收益率" prop="profit_rate">
						<el-input v-model="productForm.profit_rate" oninput ="value=value.replace(/[^0-9.]/g,'')" maxLength='9'></el-input>
					</el-form-item>
					<el-form-item label="总额度" prop="total_amout">
						<el-input-number oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="productForm.total_amout"  maxLength='9'></el-input-number>
					</el-form-item>
					<el-form-item label="起购金额" prop="least_amount">
						<el-input-number v-model="productForm.amount"></el-input-number>
					</el-form-item>
					<el-form-item label="发行期">
    					<el-col :span="11">
      						<el-date-picker type="date" placeholder="开始日期" v-model="productForm.startdate" style="width: 100%;"></el-date-picker>
    					</el-col>
    					<el-col class="line" :span="2" style="text-align:center">-</el-col>
    						<el-col :span="11">
      						<el-date-picker type="date" placeholder="截止日期" v-model="productForm.enddate" style="width: 100%;"></el-date-picker>
    					</el-col>
  					</el-form-item>
					  <el-form-item label="风险评级">
						<el-select v-model="productForm.risk"  placeholder="选择风险级">
						    <el-option
						      	v-for="item in riskLevels"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.value">
						    </el-option>
					 	</el-select>
					</el-form-item>

					<el-form-item label="产品描述" prop="description">
						<el-input type="textarea" v-model="productForm.description"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addproduct('productForm')">确认添加产品</el-button>
					</el-form-item>
	  			</el-form>
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
 	import headTop from '@/components/headTop'
	import {getProviders, addProvider, addProduct} from '@/api/getData'
	import {baseUrl} from '@/config/env'
	import {riskLevels} from '@/config/risklevels'
    export default {
    	data(){
    		return {
				baseUrl,
				riskLevels,
				duration_type:'flexible',
				year:0,
				month:0,
				day:0,
				providerList: [],
				providerSelect: '',
    			providerForm: {
					name: '',
					email:'',
					phone: '',	
    			},
    			productForm: {
					name:'',  //产品名称
					type:'',  //类型id
					provider_id:'', //供应商id
					profit_rate:'', //利益率
					total_amout: '', //总额度
					least_amout:'',	//起购价
					startdate:'',	//发行时间
					enddate:'',		//结束发行时间
					description: '',//描述
					risk:'', //风险等级
					duration:''//定期产品期长，形如，'0y3m0d','5y3m2d',空串表示活期
    			},
    			productrules: {
    				name: [
						{ required: true, message: '请输入产品名称', trigger: 'blur' },
					],
				},
    			types: [{
		          	value: '储蓄',
		          	label: '储蓄'
		        }, {
		          	value: '基金',
		          	label: '基金'
				},
				{
		          	value: '信托',
		          	label: '信托'
		        },{
		          	value: '银行理财',
		          	label: '银行理财'
		        },{
		          	value: '期货',
		          	label: '期货'
		        },],
    			showAddprovider: false,
    		}
    	},
    	components: {
    		headTop,
		},
		created(){
			this.initData();
		},
    	methods: {
    		async initData(){
    			try{
					const providers = await getProviders();
					providers.forEach(item => {
						this.providerList.push({value:item.id,label:item.name})
					});
	    			
    			}catch(err){
    				console.log(err)
    			}
    		},
		    addproviderFun(){
		    	this.showAddprovider = !this.showAddprovider;
		    },
		    submitproviderForm(providerForm) {
				this.$refs[providerForm].validate(async (valid) => {
					if (valid) {
						const params = {
							name: this.providerForm.name,
							phone: this.providerForm.phone,
							email: this.providerForm.email,
						}
						try{
							const result = await addProvider(params);
							//if (result.status == 1) {
								this.initData();
								this.providerForm.name = '';
								this.providerForm.phone = '';
								this.providerForm.email='';
								this.showAddprovider = false;
								this.$message({
					            	type: 'success',
					            	message: '添加成功'
					          	});
							//}
						}catch(err){
							console.log(err)
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请检查输入是否正确',
							offset: 100
						});
						return false;
					}
				});
			},
		    addproduct(productForm){
				if(this.year==0&&this.month==0&&this.data==0)
					this.productForm.duration='';
				this.productForm.duration=this.year+'y'+this.month+'m'+this.data+'d';
		    	this.$refs[productForm].validate(async (valid) => {
					if (valid) {
						const params = {
							name:this.productForm.name,
							type:this.productForm.type,
							/*
							quota:this.productForm.total_amout,
							rateOfReturn:this.productForm.profit_rate,
							riskLevel:parseInt(this.productForm.risk),
							startUpPoint:this.productForm.least_amout,
							
							stopIssuingTime:this.productForm.enddate
							*/
						}
						try{
							const result = await addProduct(params);
							if (result.status == 1) {
								console.log(result)
								this.$message({
					            	type: 'success',
					            	message: '添加成功'
								  });
								this.duration_type='fixed',
								this.year=0,
								this.month=0,
								this.day=0,
					          	this.productForm = {
									name:'',  //产品名称
									type:'',  //类型id
									provider_id:'', //供应商id
									profit_rate:'', //利益率
									total_amout: '', //总额度
									least_amout:'',	//起购价
									startdate:'',	//发行时间
									enddate:'',		//结束发行时间
									description: '',//描述
									risk:'', //风险等级
									duration:''//定期产品期长，形如，'0y3m0d','5y3m2d',空串表示活期
								}
							}else{
								this.$message({
					            	type: 'error',
					            	message: result.message
					          	});
							}
						}catch(err){
							console.log(err)
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请检查输入是否正确',
							offset: 100
						});
						return false;
					}
				});
		    }
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.form{
		min-width: 400px;
		margin-bottom: 30px;
		&:hover{
			box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
			border-radius: 6px;
			transition: all 400ms;
		}
	}
	.product_form{
		border: 1px solid #eaeefb;
		padding: 10px 10px 0;
	}
	.form_header{
		text-align: center;
		margin-bottom: 10px;
	}
	.provider_select{
		border: 1px solid #eaeefb;
		padding: 10px 30px 10px 10px;
		border-top-right-radius: 6px;
		border-top-left-radius: 6px;
	}
	.add_provider_row{
		height: 0;
		overflow: hidden;
		transition: all 400ms;
		background: #f9fafc;
	}
	.showEdit{
		height: 230px;
	}
	.add_provider{
		background: #f9fafc;
		padding: 10px 30px 0px 10px;
		border: 1px solid #eaeefb;
		border-top: none;
	}
	.add_provider_button{
		text-align: center;
		line-height: 40px;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
		border: 1px solid #eaeefb;
		border-top: none;
		transition: all 400ms;
		&:hover{
			background: #f9fafc;
			span, .edit_icon{
				color: #20a0ff;
			}
		}
		span{
			.sc(14px, #999);
			transition: all 400ms;
		}
		.edit_icon{
			color: #ccc;
			transition: all 400ms;
		}
	}
</style>