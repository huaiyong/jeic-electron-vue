<template>
<div>
	<div class="customVote" v-if="!editState">
		<div class="header">
			<i class="iconfont icon-fanhui1" @click="backRouter()"></i>
			 自定义投票
		</div>
		<div class="optionList clearfix">
			<div class="option clearfix" v-for="(i,index) in optionList">
				<div class="optionText">
					<span v-text="index+1"></span>
					<input type="text" v-model="optionList[index]"  placeholder="选项" @focus="focus(index)" @blur="blur(index)">
				</div>
				<i class="iconfont icon-shanchu1" @click="deleteOption(index)"></i>
			</div>
			<div class="option clearfix" @click="addOption()">
				<div class="optionText add">
					<i class="iconfont icon-jiahao"></i>
					新建选项
				</div>
			</div>
		</div>
		<div class="completeBtn">
			  <button @click="complete()">完成创建</button>
		</div>  
	</div>
	<div class="mask" v-if="ruleState">
		<div class="voteRule">
			<div class="title clearfix">
				规则设置
				<i class="iconfont icon-chuyidong" @click="closeRule()"></i>
			</div>
			<ul>
				<li><span>投票数量：</span><div class="count"><button @click="subCount()" :disabled="count<2">-</button><span v-text="count"></span><button @click="addCount()" :disabled="count>optionList.length-1">+</button></div></li>
				<li><span>记票方式：</span><div class="mode"><button :class="{'active':model==1}" @click="switchModel(1)">匿名</button><button :class="{'active':model==2}" @click="switchModel(2)">实名</button></div></li>
			</ul>
			<button class="sureBtn" @click="sureRule()">确认</button>
		</div>
	</div>
	<div class="customVote" v-if="editState">
		<div class="header clearfix">
			<i class="iconfont icon-fanhui1" @click="back()"></i>
			 投票
			 <span class="fr">每位同学拥有<i v-text="count"></i>票</span>
		</div>
		<div class="optionList clearfix">
			<div class="option clearfix" v-for="(i,index) in optionList">
				<div class="optionText">
					<span v-text="index+1"></span>
					<input type="text" v-model="optionList[index]" disabled="disabled">
				</div>
			</div>
		</div>
		<div class="completeBtn" v-if="btnState">
			  <button @click="startVote()">开始投票</button>
			  <i class="iconfont icon-bangzhu"></i>
		</div>
		<div class="completeBtn" v-if="!btnState">
			  <button @click="endVote()">结束投票</button>
		</div>
		<div class="mask" v-if="titleState">
			<div class="tips">
				<div class="bg"></div>
				 <div class="title bottom">
				   <h4><i class="iconfont icon-icon-vote"></i>若每位同学拥有一票</h4>
				   <p>学生使用答题器输入选项前的编号，点击ok键即可完成投票</p>
				 </div>
				 <div class="title">
				   <h4><i class="iconfont icon-toupiao3"></i>若每位同学拥有多票</h4>
				   <p>学生使用答题器输入选项前的编号，点击ok键即可完成第一票，再次输入编号,</p>
				   <p>点击ok键完成第二次投票，多项操作同上</p>
				 </div>
				 <div class="checkBox">
					<label><input type="checkbox"><i class="iconfont icon-fuxuankuang_weixuanzhong"></i>不再提示</label>
				 </div>
				 <button @click="sureTitle()">确认</button>
			</div>
		</div>
	</div>
</div>	
</template>

<script>
	import $ from "jquery"
	export default{
		name:"chooseCategory",
		data(){
			return {
				optionList:["",""],
				ruleState:false,//规则弹框状态
				count:1 ,//票数
				model:1,
				editState:false,  //是否完成创建
				btnState:true,//开始投票,
				titleState:false //提示框
			}
		},
		methods:{
			backRouter(){   //返回路由
				this.$router.back();
			},
			back(){  //改变状态
				this.editState=false;
				this.btnState=true;
			},
			deleteOption(index){ //删除选项
				if(this.optionList.length>1){
					this.optionList.splice(index,1);
				};
			},
			addOption(){ //添加选项
				this.optionList.push("");
			},
			focus(index){   //输入框获取焦点
				$(".customVote .optionList .option").eq(index).find(".optionText").addClass("active");
			},
			blur(index){   //输入框失去焦点
				$(".customVote .optionList .option").eq(index).find(".optionText").removeClass("active");
				if(this.optionList[index]==""){
					$(".customVote .optionList .option").eq(index).find("input").attr('placeholder','此选项不能为空');
					$(".customVote .optionList .option").eq(index).find(".optionText").addClass("error");
				}else{
					$(".customVote .optionList .option").eq(index).find("input").attr('placeholder','选项');
					$(".customVote .optionList .option").eq(index).find(".optionText").removeClass("error");
				};
			},
		    complete(){   //完成创建
			   var flag=true;
				for(var i=0;i<this.optionList.length;i++){
					if(this.optionList[i]==""){
						$(".customVote .optionList .option").eq(i).find("input").attr('placeholder','此选项不能为空');
						$(".customVote .optionList .option").eq(i).find(".optionText").addClass("error");
						flag=false;
					};
				};
				if(flag){
					this.ruleState=true;
				}
			},
			subCount(){   //投票数量减
				this.count--;
			},
			addCount(){ //投票数量加
				this.count++;
			},
			switchModel(i){ //切换匿名或者实名
				this.model=i;
			},
			closeRule(){
				this.ruleState=false;
			},
			sureRule(){
				this.ruleState=false;
				this.editState=true;
			},
			startVote(){  //开始投票
				this.btnState=false;
				this.titleState=true;
			},
			endVote(){  //结束投票
			
			},
			sureTitle(){   //提示确认后
				this.titleState=false;
			},
		}
	}
</script>

<style scoped="scoped">
	.customVote{
		width: 100%;
		height: 100%;
		background: #fff;
		font-size: 1.6rem;
	}
	.customVote .header{
		height: 5rem;
		line-height: 5rem;
		padding: 0 1.5rem;
		border-bottom: .2rem solid #ececec;
	}
	
	.customVote .header .iconfont{
		font-size: 1.6rem;
		color:  #4092f4;
		margin-right:1.5rem;
		cursor: pointer;
	}
	.customVote .optionList{
		padding: 0 4.8rem;
	}
	.customVote .optionList  .option{
		margin-top: 2.5rem;
		width: 40%;
		height: 4.4rem;
		line-height: 4.4rem;
		float: left;
	}
	.customVote .optionList  .option:nth-child(2n){
		float: right;
	}
	.customVote .optionList .optionText{
		width: 90%;
		height: 4rem;
		border:.2rem solid #ebebeb;
		border-radius: 2.2rem;
		overflow: hidden;
	    float:left;
	}
	.customVote .optionList div.active{
		border-color: #89bfff;
	}
	.customVote .optionList div.error{
		border-color:red;
	}
	.customVote .optionList .optionText span{
		width: 20%;
		color: #fff;
		text-align: center;
		background: #4092f4;
		display: inline-block;
	}
	.customVote .optionList .optionText input{
		width: 75%;
		height: 100%;
		font-size: 1.6rem;
		border: none;
		outline: none;
		display: inline-block;
	}
	.customVote .optionList .optionText input[disabled]{
		background: #fff;
	}
	.customVote .optionList .add{
		text-align: center;
		cursor: pointer;
	}
	.customVote .optionList .add .iconfont{
		color: #4092f4;
		font-size: 2rem;
		vertical-align: middle;
	}
	.customVote .optionList .option>.iconfont{
		font-size: 2rem;
		color: #ccc;
		cursor: pointer;
		float: right;
	}
	.customVote .completeBtn{
		text-align: center;
		position: absolute;
		bottom: 3rem;
		left: 0;
		right:0;
	}
	.customVote .completeBtn button{
		width: 20rem;
		height: 4rem;
		color: #fff;
		border: none;
		outline: none;
		border-radius: 2rem;
		background: #229cfa;
		cursor: pointer;
	}
	.customVote .completeBtn .iconfont{
		font-size: 2.4rem;
		color:#feaa26;
		vertical-align: middle;
		cursor: pointer;
	}
	.mask{
		position: absolute;
		top: 0;
		left: 0;
		right:0;
		bottom:0;
		background: rgba(0,0,0,0.4);
		margin: auto;
	}
	.mask .voteRule{
		width: 31rem;
		height: 34rem;
		background: #fff;
		border-radius: .5rem;
		margin: 6.4rem auto;
		overflow: hidden;
	}
	.mask .voteRule .title{
		height: 4.4rem;
		line-height: 4.4rem;
		color: #fff;
		font-size: 1.6rem;
		text-align: center;
		background: #4092f4;
	}
	.mask .voteRule .title .iconfont{
		font-size: 1.6rem;
		float:right;
		cursor: pointer;
	}
	.mask .voteRule ul li{
		font-size: 1.4rem;
		padding-left: 3.8rem;
		margin-top: 4rem;
	}	
	.mask .voteRule ul li div{
		margin-left: 2.2rem;
		display: inline-block;
	}
	.mask .voteRule ul li:first-child >span{
		vertical-align: 1.2rem;
	}
	.mask .voteRule ul li .count{
		width: 16rem;
		height: 3rem;
		border:.1rem solid #eee;
		overflow: hidden;
	}
	.mask .voteRule ul li .count button{
		width:3.4rem;
		height: 100%;
		font-size: 2rem;
		border: none;
		outline: none;
		background: #fff;
		cursor: pointer;
	}
	.mask .voteRule ul li .count span{
		width: 9rem;
		height:3.4rem;
		text-align: center;
		line-height: 3.4rem;
		border-left:.1rem solid #eee;
		border-right:.1rem solid #eee;
		display: inline-block;
	}
	.mask .voteRule ul li .mode button{
		width:6rem;
		height: 3rem;
		font-size: 1.4rem;
		background: #fff;
		border: .1rem solid #eeeeee;
		border-radius: .2rem;
		outline: none;
		cursor: pointer;
	}
	.mask .voteRule ul li .mode button:last-child{
		margin-left: 3.4rem;
	}
	.mask .voteRule ul li .mode button.active{
		background: #4092f4;
		border-color: #4092f4;
		color: #fff;
	}
	.mask .voteRule .sureBtn{
		width: 20rem;
		height: 4rem;
		color: #fff;
		font-size: 1.4rem;
		background:#229cfa;
		border-radius: 2rem;
		outline: none;
		border: none;
		margin: 8.5rem auto;
		display: block;
		cursor: pointer;
	}
	.mask .tips{
		width: 70rem;
		height: 43rem;
		background: #fff;
		border-radius: .5rem;
		overflow: hidden;
		margin: 5rem auto;
	}
	.mask .tips .bg{
		height: 10rem;
		background: url("../../assets/img/tishi.png") no-repeat;
		background-size:100%;
	}
	.mask .tips .title{
		margin:0 1.6rem 0 3.4rem;
		padding-bottom: 2rem;
	}
	.mask .tips h4{
		font-size: 1.6rem;
		margin:1rem 0;
	}
	.mask .tips h4 .iconfont{
		font-size: 3.6rem;
		color: #3d8bd1;
		margin-right: 2rem;
	}
	.mask .tips .bottom{
		border-bottom: .1rem solid #ccc;
	}
	.mask .tips .bottom h4 .iconfont{
		color: #feaa26;
	}
	.mask .tips p{
		font-size: 1.4rem;
		color: #acacac;
		line-height:2.8rem;
		padding-left: 5.6rem;
		
	}
	.mask .tips .checkBox{
		text-align: center;
		font-size: 1.4rem;
	}
	.mask .tips .checkBox input{
		visibility: hidden;
	}
	.mask .tips .checkBox .iconfont{
		font-size: 1.4rem;
		color: #ccc;
	}
	.mask .tips .checkBox input[type=checkbox]:checked+.iconfont{
		color: #4092f4;
	}
	.mask .tips button{
		width: 20rem;
		height: 4rem;
		color: #fff;
		font-size: 1.4rem;
		border: none;
		outline: none;
		border-radius: 2rem;
		background: #229cfa;
		margin:1.6rem auto;
		display: block;
		cursor: pointer;
	}
</style>
