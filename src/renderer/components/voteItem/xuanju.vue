<template>
	
	<div class="wrapper">
		<div class="foundGroup" style="z-index:1">
			<div class="heads">
				<i class="iconfont icon-fanhui1" @click="backRouter()"   v-if="!jieshu"></i>
				<em>班级选举</em>
				<span class="fr"  v-if="editState">
					<input type="checkbox" v-model="checked" @click="checkedAll()" :checked="checked">
					<label for="allcheck">全选</label>
				</span>
				<span class="fr"  v-if="!editState">
					<p v-if="ruleSet==1">每位同学拥有{{count}}票 / 候选人不可投票</p>
					<p v-if="ruleSet==2">每位同学拥有{{count}}票 / 候选人可投票 / 不可投自己</p>
					<p v-if="ruleSet==3">每位同学拥有{{count}}票 / 候选人可投票 / 可投自己</p>
				</span>
			</div>
			<div class="mainBox clearfix">
				<ul class="mainR" v-if="editState">
					<li class="fl strSingle" :class="{'active':item.active}" v-for="(item,index) in list" :key="index" @click="checkStudent(item,index)">
						<img :src='"../../assets/img/"+ getImgUrl(item.sex) +".png"' alt="">
						<p>{{item.name}}</p>
					</li>
				</ul>
				<ul v-if="!editState" class="checkListStu">
					<li v-for="(item,index) in checkedstr" :key="index">
						<span class="strIndex">{{index+1}}</span>
						<span class="ckeckstate">{{item.name}}</span>
					</li>
				</ul>
				<div class="completeBtn" v-if="!jieshu&&checkedstr.length>0">
					<button  v-if="editState" class="finishcreated" @click="finishcreated">完成创建</button>
					<button v-if="!editState" class="finishcreated" @click="beginToupiao">开始投票</button><i class="iconfont icon-bangzhu"  @click="bangzhu"></i>
				</div>
				<div class="completeBtn"  v-if="jieshu">
					<button  class="finishcreated" @click="endVote">结束投票</button>
				</div>
			
				<!-- 弹窗显示 -->

				<div class="mask" v-show="complite">
					<div class="voteRule">
						<div class="title clearfix">
							规则设置
							<i class="iconfont icon-chuyidong" @click="closeSetNum()"></i>
						</div>
						<ul>
							<li>
								<span>投票数量：</span>
								<div class="count">
									<button @click="subCount()" :disabled="count<2">-</button>
									<span v-text="count"></span>
									<button @click="addCount()" :disabled="count>checkedstr.length-1">+</button>
								</div>
							</li>
							<li><span>记票方式：</span><div class="mode"><button :class="{'active':model==1}" @click="switchModel(1)">匿名</button><button :class="{'active':model==2}" @click="switchModel(2)">实名</button></div></li>
							<li>
								规则设置：
								<p v-if="isAllCheck">
									<input type="radio" name="toupiaoType" id="bxzj" value="1" v-model="ruleSet"><label for="bxzj">候选人不可投票</label>
								</p>
								<p>
									<input type="radio" name="toupiaoType" id="xzj1" value="2" v-model="ruleSet"><label for="xzj1">候选人可投票/不可投自己</label>
								</p>
								<p>
									<input type="radio" name="toupiaoType" id="xzj2" value="3" v-model="ruleSet"><label for="xzj2">候选人可投票/可投自己</label>
								</p>
								
							</li>
						</ul>
						<button class="sureBtn" @click="sureRule()">确认</button>
					</div>
				</div>
				
				<!-- 提示 -->
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
						 <button @click="sureTou()">确认</button>
					</div>
				</div>
				

			</div>
		</div>
	</div>

</template>

<script>
	import $ from "jquery";
	import Vue from 'vue';
	import {
		mapState
	} from "vuex";

	export default {
		name: 'foundGroup',
		data() {
			return {
				list: [], //全班的学生
				checkedstr: [], //选择的学生
				checked: false ,//全选按钮默认状态
				complite:false,
				optionList:["","",""],
				count:1 ,//票数
				model:1,
				editState:true,
				titleState:false,
				jieshu:false,
				ruleSet:0,
				isAllCheck:true,
				checkToupiaoren:[], //选民，可投票的人
				voteId:"" //选举的id
			}
		},
		components: {
			
		},
		sockets: {
			endtoupiao(){
				this.endVote()
			}
		},
		created() {
			const that = this;
			// 全班学生接口数据
			this.$http.get('http://127.0.0.1:3000/jeic/api/student?classId=' + this.$store.state.state.classId).then(function(data){
			    that.list = data.data.data;
			});
			
			
			var data=this.$route.params.data;
			if(data){
				data=JSON.parse(data);
				this.complite=false;
				this.editState=false;
				this.jieshu=true;
				this.checkedstr=data.candidateList;
				
				this.$http.post("http://localhost:3000/jeic/api/votingElections", {jsonData: data}).then(function(res){
					console.log(res)
					that.voteId=res.data.data;
					that.$socket.emit("vote", {
						"name": "stuXuanju",
						"data": res.data.data
					});
				});
				
			}
			
			// this.getParams()
			// 
			// var routerParams = this.$route.params; // 取到路由带过来的参数
			// // console.log()
			// var toupiaoData=JSON.parse(routerParams.data);
			// console.log(toupiaoData)
			// var that=this
			// if(toupiaoData.candidateList!=undefined){
			// 		this.complite=false;
			// 		this.editState=false;
			// 		this.jieshu=true;
			// 		this.checkedstr=toupiaoData.candidateList;
			// 		
			// 		this.$http.post("http://localhost:3000/jeic/api/votingElections", {jsonData: toupiaoData}).then(function(res){
			// 			console.log(res)
			// 			that.voteId=res.data.data;
			// 			that.$socket.emit("vote", {
			// 				"name": "stuXuanju",
			// 				"data": res.data.data
			// 			});
			// 		});
			// }
			
			
			
		},
		computed: {
			...mapState({
				classRecord: state => state.state.classRecord,
				userId: state => state.state.userId
			})
		},
		// watch: {
		// 	'$route': 'getParams',// 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
		// },
		methods: {
// 			getParams() {
// 				
// 
// 			},
			// 获取img地址
			getImgUrl(obj) {
				return obj == '男' ? 'boy' : 'girl'
			},
			subCount(){   //投票数量减
				this.count--;
			},
			addCount(){ //投票数量加
				this.count++;
			},
			switchModel(i){ //切换匿名或者实名
				this.model=i;
				console.log(this.model)
			},
			bangzhu(){
				this.titleState=true;
			},
			sureTou(){
				this.titleState=false;
			},
			sureRule(){ //确认设置规则
				this.complite=false;
				this.editState=false;
				console.log(this.ruleSet)
				
				
				if(this.ruleSet==1){ //候选人不可投票
					for(var i=0;i<this.checkedstr.length;i++){
						this.list.splice(this.list.indexOf(this.checkedstr[i]),1);
					}
					this.checkToupiaoren=this.list
				}else{ //候选人可投票
					this.checkToupiaoren=this.list
				}
				
				console.log(this.checkToupiaoren)
			},
			sureToupiao(){ //开始投票
				
				this.jieshu=true;

				var candidateList=[] //被选中的投票对象
				for(var i=0;i<this.checkedstr.length;i++){
					var jsonCandidateList={}
					jsonCandidateList.name=this.checkedstr[i].name;
					jsonCandidateList.id=this.checkedstr[i].id;
					jsonCandidateList.no=i+1;
					candidateList.push(jsonCandidateList)
				}
				
				var toupiaoData = {
					"candidateList":candidateList, //候选项
					"userList": this.checkToupiaoren, //投票的人
					"name": "班级选举",
					"type": 2, //1自定义2班级选举
					"candidate_no": this.checkedstr.length, //候选项个数
					"anonymous": this.model,//1匿名2实名
					"voting_rules": this.ruleSet, //投票规则 分别对应图上的123
					"vote_number":this.count, //可投票数
					"class_record_id": this.classRecord, //课堂记录id
					"user_id": this.userId //教师id
				};
				
				console.log(toupiaoData)
				var that=this
				// var stringstuinfodata = JSON.stringify(stuinfodata);
				this.$http.post("http://localhost:3000/jeic/api/votingElections", {jsonData: toupiaoData}).then(function(res){
					that.voteId=res.data.data;
					that.$socket.emit("vote", {
						"name": "stuXuanju",
						"data": res.data.data
					});
				});
			},
			endVote(){  //结束投票
			    this.$http.get("http://localhost:3000/jeic/api/votingElections/stopVote?voteId="+this.voteId).then(res=>{
					console.log(res)
					this.$router.push({name:"echartResult",query:{voteId:this.voteId,type:2}});
					
				});
				this.$socket.emit("jeic", {
					"name": "getVoteId",
					"data": this.voteId
				});
			},
			beginToupiao(){
				// this.titleState=true; //提示弹窗显示
				this.sureToupiao()
			},
			checkStudent(item, index) { //选择被选举的学生
				var that=this;
				if (item.active) { //取消选中状态
					Vue.set(item, 'active', false); //为item添加不存在的属性，需要使用vue提供的Vue.set( object, key, value )方法。 
					var pos = this.checkedstr.indexOf(item);
					if(this.checkedstr===this.list){
						// this.isAllCheck=false;
						this.checkedstr.splice(pos,1)
					}else{
						this.checkedstr.splice(pos,1)
					}
					
				} else { //添加选中状态
					Vue.set(item, 'active', true);
					if(this.checkedstr.indexOf(item)==-1){
						this.checkedstr.push(item)
					}
				}
				//判断是否全选了
				if (this.checkedstr.length == this.list.length) { 
					this.checked = true;
				} else {
					this.checked = false;
				}
			},
			checkedAll() {//全选和全不选
				if (this.checked) { //全不选
					for (var i = 0; i < this.list.length; i++) {
						Vue.set(this.list[i], 'active', false);
						this.checkedstr=[]
					}
					this.isAllCheck=true;
				} else { //全选
					for (var i = 0; i < this.list.length; i++) {
						Vue.set(this.list[i], 'active', true);
						this.checkedstr = this.list.concat();
					}
					this.isAllCheck=false;
				}
			},
			finishcreated(){ //点击完成创建 设置弹窗显示
				if(this.checkedstr.length>0){
					this.complite=true;
				}
			},
			closeSetNum(){ //关闭设置弹窗显示
				this.complite=false;
			},
			backRouter(){   //返回路由
				for (var i = 0; i < this.list.length; i++) {
					Vue.set(this.list[i], 'active', false);
					this.checkedstr=this.list
				}
				this.$router.back();
			},
		}
	}
</script>

<style scoped="scoped">
	.wrapper {
		position: relative;
		z-index: 5;
		width: 100%;
		height: 100%;
	}
	
	.voteRule ul>li>p{
		margin:10px 0
	}
	
	.completeBtn {
		text-align: center;
	}
	
	.completeBtn button{
		width: 20rem;
		height: 4rem;
		color: #fff;
		border: none;
		outline: none;
		border-radius: 2rem;
		background: #229cfa;
		cursor: pointer;
		display: inline-block;
	}
	.completeBtn .iconfont{
		font-size: 2.4rem;
		color:#feaa26;
		vertical-align: middle;
		cursor: pointer;
	}
	.checkListStu{
		margin: 2rem 0;
	}
	.checkListStu li{
		display: inline-block;
		height: 3rem;
		margin-left: 2rem;
		width: 10rem;
	}
	.ckeckstate{
		padding:2px 5px;
		background: #219cfa;
		border-radius: 8px;
		color:#fff;
	}
	.strIndex{
		width:2rem;
		display: inline-block;
		text-align: center;
	}
	.strSingle {
		opacity: 0.5;
	}
	
	.piaoNum,.guizeSet{
		margin:20px;
	}
	
	.guizeSet>ul>li{
		margin:20px 0;
	}

	.piaoNum span{
		font-size: 20px;
		border:1px solid #ddd;
		color:#ccc;
		height: 30px;
		vertical-align: middle;
		margin: -5px;
	}
	
	.piaoNum input{
		border: #ddd 1px solid;
		height: 28px;
		outline: none;
		text-align: center;
		width: 60px;
	}
	
	.piaoStyle{
		margin: 20px;
	}
	
	.piaoStyle span{
		width: 50px;
		height: 30px;
		display: inline-block;
		border-radius: 7px;
		line-height: 30px;
		text-align: center;
		color: #fff;
		background: #ccc;
	}
	
	.piaoStyle span.xuanzhong{
		background: #4092f5;
	}
	
	.settitle{
		width: 100%;
		height: 40px;
		background: #4092f5;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	    text-align: center;
	    line-height: 40px;
	    color: #fff;
	}
	.closeicon{
		transform: rotate(45deg);
		display: inline-block;
		margin-right:20px;
	}
	.setNum{
		position: fixed;
		top:0;
		bottom:0;
		left:0;
		right:0;
		margin:auto;
	}
	.setNum .bghui{
		background: rgba(0,0,0,.5);
		width:100%;
		height:100%;
	}
	.setContent{
		width: 400px;
		height: 500px;
		border-radius: 10px;
		z-index: 99;
		margin: auto;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		background: #fff;
	}

	.active {
		opacity: 1;
	}

	.finishcreated {
		width: 300px;
		height: 50px;
		background: #219cfa;
		display: block;
		margin: 0 auto;
		border: 0;
		border-radius: 30px;
		color: #fff;
		font-weight: bold;
		outline: none;
	}

	.foundGroup {
		width: 100%;
		height: 100%;
		background: #fff;
		font-size: 1.354rem;
		color: #333333;
	}

	.foundGroup .heads {
		width: 100%;
		height: 5.2rem;
		line-height: 5.2rem;
		border-bottom: .1rem solid #ececec;
		box-sizing: border-box;
		padding: 0 3rem;
	}

	.foundGroup .heads i {
		font-size: 1.6rem;
		cursor: pointer;
		color: #4092f4;
	}

	.foundGroup .heads em {
		font-size: 1.6rem;
		margin: 0 .5rem;
	}

	/* .foundGroup .heads span{display: inline-block; font-size: 1.4583rem;background: #4092f4;border-radius: .5rem;color: #fff;min-width: 6rem;height: 2rem;line-height: 2rem;padding: 0 1rem} */
	.foundGroup .heads small {
		color: #acacac;
		font-size: 1.354rem;
	}

	.foundGroup .mainBox {
		height: 93%;
	}

	.foundGroup .mainBox .mainL {
		width: 38%;
		height: 96%;
		border-right: .1rem solid #ececec;
		box-sizing: border-box;
		padding: 3rem 3rem 0;
		overflow-y: auto;
	}

	.foundGroup .mainBox .mainL .smallAdd {
		width: 7rem;
		height: 7rem;
		border-radius: 5px;
		background: #eeeeee;
		box-sizing: border-box;
		text-align: center;
		padding-top: 2.2rem;
		margin-top: 2rem;
		cursor: pointer;
	}

	.foundGroup .mainBox .mainL .smallAdd i {
		font-size: 4rem;
		color: #4092f4;
	}

	.foundGroup .mainBox .mainL .btn {
		width: 10rem;
		height: 3rem;
		line-height: 3rem;
		text-align: center;
		background: #4092f4;
		color: #fff;
		border-radius: 40px;
		margin: 2rem auto 0;
		cursor: pointer;
		font-size: 1.458rem;
	}

	.foundGroup .mainBox .mainL .newBuild {
		margin-bottom: 3rem;
	}

	.foundGroup .mainBox .mainL .newBuild .tit strong {
		font-size: 1.6rem;
		padding: 0 .5rem;
	}

	.foundGroup .mainBox .mainL .newBuild .tit span {
		color: #4092f4;
		font-size: 1.145rem;
		cursor: pointer;
	}

	.foundGroup .mainBox .mainL .newBuild .tit i {
		color: #4092f4;
		font-size: 1.6rem;
		cursor: pointer;
	}

	.foundGroup .mainBox .mainL .newBuild .groupLeader h3,
	.foundGroup .mainBox .mainL .newBuild .teamMember h3 {
		font-size: 1.354rem;
		margin: 2rem 0 0.8rem;
	}

	.foundGroup .mainBox .mainL .newBuild .groupLeader>div,
	.foundGroup .mainBox .mainL .newBuild .teamMember>div {
		width: 100%;
		min-height: 5rem;
		background: #eeeeee;
		box-sizing: border-box;
		padding: 1.5rem;
		border-radius: .5rem;
	}

	.foundGroup .mainBox .mainL .newBuild .teamMember>div {
		min-height: 10rem;
	}

	.leftDrag,
	.rightDrag {
		display: inline-block;
		width: 100%;
		min-height: 8rem;
		height: 100%;
	}

	.laberDrag {
		display: inline-block;
		width: 100%;
		min-height: 2rem;
	}

	.leftDrag em,
	.leftDrag em,
	.laberDrag em {
		display: inline-block;
		width: 8.3rem;
		height: 2.6rem;
		line-height: 2.6rem;
		text-align: center;
		background: #4092f4;
		color: #fff;
		border-radius: 0.5rem;
		font-size: 1.458rem;
		position: relative;
		margin-right: 1rem;
		margin-bottom: 1.5rem;
		cursor: pointer;
	}

	.leftDrag em:nth-child(3n) {
		margin-right: 0;
	}

	.leftDrag em img,
	.leftDrag em img {
		position: absolute;
		top: -0.7rem;
		right: -0.7rem;
		;
		cursor: pointer;
		width: 1.485rem;
		height: 1.485rem;
	}

	.laberDrag em {
		margin-bottom: 0;
	}

	.foundGroup .mainBox .mainR {
		width: 96%;
		height: 80%;
		overflow-y: auto;
		margin: 0 auto;
	}

	.foundGroup .mainBox .mainR li {
		margin-left: 2rem;
		margin-top: 1rem;
		cursor: pointer;
		list-style: none;
		width: 6rem;
		text-align: center;
		overflow: hidden;
	}

	.foundGroup .mainBox .mainR li img {
		width: 4rem;
		height: 4rem;
		margin-bottom: 1rem;
	}

	.foundGroup .mainBox .mainR li p {
		text-align: center;
	}


	.flip-list-move {
		transition: transform 0.5s;
	}

	.ghost {
		opacity: 0.5;
		background: #c8ebfb;
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
		height: 45rem;
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
		/* margin-left: 2.2rem; */
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
		width:3rem;
		height: 100%;
		font-size: 2rem;
		border: none;
		outline: none;
		background: #fff;
		cursor: pointer;
	}
	.mask .voteRule ul li .count span{
		width: 8rem;
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
		margin: 4.5rem auto;
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
