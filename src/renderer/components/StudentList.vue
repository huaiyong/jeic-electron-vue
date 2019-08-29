<template>
<div>
	<div class="zmj_remember" v-if="pattern">
		<div class="zmj_rememberTitle">
			<span>成员管理</span><span @click="close()"><img src="../assets/img/close.svg" alt=""></span>
		</div>
		<div class="zmj_rememberInfo">全部:<span><i v-text="remember.length"></i>人</span> 已签到:<span><i v-text="signRemember.length"></i>人</span>
			未签到:<span><i v-text="remember.length-signRemember.length"></i>人</span></div>
		<div class="zmj_rememberList">
			<ul class="clearfix">
				<li v-for="(item,index) in remember" :key="index" :class="{'active':signRemember.indexOf(item.device)!=-1}">
					<img v-if="item.sex=='男'" src="../assets/img/boy.png" alt="">
					<img v-if="item.sex=='女'" src="../assets/img/girl.png" alt="">
					<p v-text="item.name"></p>
				</li>
			</ul>
		</div>
	</div>
	<div class="zmj_remember" v-if="!pattern">
		<div class="zmj_rememberTitle">
			<span v-text="groupName"></span><span @click="close()"><img src="../assets/img/close.svg" alt=""></span>
		</div>
		<div  class="zmj_groupStudent">
			<div v-for="i in groupStudent" :key="i.id" class="noneBottom" >
					<p><span v-text="i.name"></span> (<span v-text="i.studentList.length+1"></span>人)</p>
					<div class="clearfix">
						<ol class="fl clearfix">
							<li :class="{'active':signRemember.indexOf(i.groupLeader.device)!=-1}">
								<img v-if="i.groupLeader.sex=='男'" src="../assets/img/boy.png" alt="">
								<img v-if="i.groupLeader.sex=='女'" src="../assets/img/girl.png" alt="">
								<p v-text="i.groupLeader.name"></p>
							</li>
						</ol>
						<ul class=" fl clearfix">
							<li v-for="item in i.studentList" :key="item.id" :class="{'active':signRemember.indexOf(item.device)!=-1}" >
								<img v-if="item.sex=='男'" src="../assets/img/boy.png" alt="">
								<img v-if="item.sex=='女'" src="../assets/img/girl.png" alt="">
								<p v-text="item.name"></p>
							</li>
						</ul>
					</div>
				</div>
		</div>
	</div>
</div>	
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		name: "Studentlist",
		data: function() {
			return {
				signRemember: [], //签到学生
				timer: "", //定时器
				groupStudent:[] ,// 分组学生,
				groupName:""  //组名
			}
		},
		sockets:{
		  closeMemberAdmin(){
			  this.close();
		  }
			
		},
		methods: {
			close() {
				clearInterval(this.timer);
				this.$router.push({
					"name": "Index"
				});
			},
			getGroupStudent(){
				console.log(this.groupId)
				var that=this;
				this.$http.get("http://127.0.0.1:3000/jeic/api/teachingGroup/"+this.groupId).then(function(
						res) {
						if (res.data.ret == 200) {
							that.groupStudent = res.data.data.userGrouplist;
							that.groupName= res.data.data.name;
						};
					});
				
				
			},
			signIn() { //请求签到学生
				const that = this;
				this.$http.get("http://localhost:3000/jeic/api/signin/signinStart").then(function(res) {
					

				});
			this.timer = setInterval(function() {
				that.$http.get("http://localhost:3000/jeic/api/signin/getSignin").then(function(res) {
					if (res.data.ret == 200) {
						that.signRemember = res.data.data;
						that.$socket.emit('jeic', {
							'name': "qiandao",
							'data': res.data.data
						});
					};
				});
			}, 1000);
		}
		

	},
	computed: {
			...mapState({
				remember: state => state.state.remember,
				pattern:state => state.state.pattern,
				groupId:state => state.state.groupId
			})
		},
		created() {
			this.getGroupStudent();
			this.signIn();
		},
		destroyed() {
			clearInterval(this.timer);
		}
	}
</script>

<style scoped="scoped">
	.zmj_remember {
		width: 80rem;
		height: 42rem;
		border: .1rem solid rgba(18, 18, 18, 0.3);
		border-radius: .6rem;
		background: rgb(137, 137, 137);
		margin: 2rem auto 0;
		overflow: hidden;
	}

	.zmj_rememberTitle {
		height: 5.6rem;
		line-height: 5.6rem;
		padding: 0 2rem;
		border-bottom: .1rem solid rgba(1, 1, 1, 0.3);
		background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#E8E6E7), to(#D2D0D3), color-stop(0.5, #dbd9dc));
	}

	.zmj_rememberTitle span:first-child {
		color: #666;
		font-size: 1.6rem;
		padding: .8rem 1rem;
		border: .1rem solid #a3a1a4;
		border-radius: .8rem;
		background: #fff;

	}

	.zmj_rememberTitle span:last-child {
		width: 2.4rem;
		height: 2.4rem;
		text-align: center;
		line-height: 2.4rem;
		background: #fff;
		border-radius: 50%;
		margin-top: 1.6rem;
		overflow: hidden;
		display: inline-block;
		float: right;
		cursor: pointer;

	}

	.zmj_rememberTitle span:last-child img {
		width: 100%;
		height: 100%;
	}

	.zmj_rememberInfo {
		height: 4rem;
		line-height: 4rem;
		font-size: 2.2rem;
		color: #fff;
		padding: 0 2rem;
		border-bottom: .1rem solid #ccc;
	}

	.zmj_rememberInfo span {
		margin-right: 2rem;
	}

	.zmj_rememberList ul {
		padding-top: 2rem;
		padding-left: 2rem;
		height: 30.2rem;
		overflow-y: auto;
	}

	.zmj_rememberList ul li {
		position: relative;
		width: 8.3rem;
		font-size: 1.8rem;
		color: #fff;
		text-align: center;
		margin-right: 1rem;
		margin-bottom: 2rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		display: inline-block;
		opacity: 0.3;
	}

	.zmj_rememberList ul li.active {
		opacity: 1
	}

	.zmj_rememberList ul li img {
		width: 100%;
		pointer-events: none;
	}
	.zmj_groupStudent{
		height: 36rem;
		overflow-y: auto;
		
	}
	.zmj_groupStudent>div {
		font-size: 1.6rem;
		color: #fff;
		padding: 1.2rem;
	}
	
	.zmj_groupStudent ol {
		width: 20%;
	}
	
	.zmj_groupStudent ul {
		width: 80%;
	}
	
	.zmj_groupStudent li {
		margin-right: 2.1rem;
		margin-top: 1.8rem;
		float: left;
		opacity: 0.3;
	}
	
	.zmj_groupStudent li.active {
		opacity: 1;
		cursor: pointer;
	}
	
	.zmj_groupStudent li img {
		width: 4.5rem;
		height: 4.5rem;
		pointer-events: none;
	}
	
	.zmj_groupStudent li p {
		font-size: 1.4rem;
		color: #fff;
		text-align: center;
		margin-top: .8rem;
	}
</style>
