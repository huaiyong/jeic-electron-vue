<template>
	<div class="zmj_userInfo">
		<div class="zmj_userTitle clearfix"><span>用户</span><span @click="close()"><img src="../assets/img/close.svg" alt=""></span></div>
		<div class="wraper clearfix">
			<div class="sildeBar fl">
				<ul>
					<li @click="changeIndex(0)" :class="{'active':index==0}"><i class="iconfont icon-yonghu"></i>个人信息</li>
					<li @click="changeIndex(1)" :class="{'active':index==1}"><i class="iconfont icon-iconset0103"></i>关于我们</li>
				</ul>
			</div>
			<div class="content fr">
				<div class="zmj_userContent clearfix" v-show="index==0">
					<ul>
						<li><span>用户名:</span><span v-text="realname"></span></li>
						<li><span>手机号:</span><span v-text="userMobile"></span></li>
						<li><span>邮箱号:</span><span v-text="userEmail"></span></li>
					</ul>
					<span class="zmj_userFace"><img src="../assets/img/login_img.png" alt=""></span>
				</div>
				<div class="projectInfo" v-show="index==1">
					<div class="about" >
						<img src="../assets/img/companyLogo.png" alt="">
						<p>捷成智慧课堂</p>
						<p>Version 1.1.0</p>
						<div>
							检查更新
							<span></span>			
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "UserInfo",
		data() {
			return {
				realname: sessionStorage.getItem("realname"),
				userMobile: sessionStorage.getItem("userMobile"),
				userEmail: sessionStorage.getItem("userEmail"),
				index:0,  //tab下标
			}
		},
		sockets:{
		    closeTeacherInfo(){
				this.close();
			},
		
		},
		methods:{
			close(){
				this.$router.push({"name":"Index"});
			},
			changeIndex(i){   //切换
				this.index=i;
			}
		}
	}
</script>

<style>
	.zmj_userInfo {
		width: 75rem;
		height: 40rem;
		background: rgb(137, 137, 137);
		border: .1rem solid rgba(18, 18, 18, 0.3);
		border-radius: .6rem;
		box-shadow: .1rem .1rem 1rem #0003;
		position: absolute;
		top: 2rem;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		overflow: hidden;
	}

	.zmj_userTitle {
		height: 5.6rem;
		line-height: 5.6rem;
		padding: 0 2rem;
		border-bottom: .1rem solid rgba(1, 1, 1, 0.3);
		background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#E8E6E7), to(#D2D0D3), color-stop(0.5, #dbd9dc));
	}

	.zmj_userTitle span:first-child {
		color: #666;
		font-size: 1.6rem;
		padding: .8rem 1rem;
		border: .1rem solid #a3a1a4;
		border-radius: .8rem;
		background: #fff;

	}

	.zmj_userTitle span:last-child {
		width: 2.4rem;
		height: 2.4rem;
		text-align: center;
		line-height: 2.4rem;
		background: #fff;
		border-radius:50%;
		margin-top: 1.6rem;
		overflow: hidden;
		display: inline-block;
		float: right;
		cursor: pointer;

	}
	.zmj_userTitle span:last-child img{
		width: 100%;
		height: 100%;
	}
	.wraper{
		height: 34.3rem;
		overflow-y: auto;
	}
    .sildeBar{
		width: 20%;
		height: 100%;
		border-right:.1rem solid #c9c9c9;
		box-sizing: border-box;
	}
	.content{
		width: 80%;
		height: 100%;
	}
	.sildeBar ul li{
		height: 4.4rem;
		text-align: center;
		line-height: 4.4rem;
		font-size: 1.4rem;
		color: #fff;
		border-bottom: .1rem solid  #c9c9c9;
		cursor: pointer;
	}
	.sildeBar ul li .iconfont{
		font-size: 1.6rem;
		vertical-align: middle;
		margin-right: 1rem;
	}
    .sildeBar ul li.active{
		background:  #74838a;
	}
	.zmj_userContent {
		padding: 0 1rem;
		width: 80%;
		background: #fff;
		border-radius: 1rem;
		color: #333;
		margin: 6rem auto 0 auto;
	}

	.zmj_userContent ul {
		width: 30rem;
		float: left;
	}

	.zmj_userContent ul li {
		font-size: 1.6rem;
		margin: 1.6rem;
	}

	.zmj_userContent .zmj_userFace {

		width: 8rem;
		height: 8rem;
		margin-top: 1.6rem;
		border-radius: 50%;
		display: inline-block;
		float: right;
		overflow: hidden;
	}

	.zmj_userContent .zmj_userFace img {
		width: 100%;
		height: 100%;
	}
	.about{
		width: 250px;
		text-align: center;
		color: #fff;
		font-size: 1.6rem;
		margin:80px auto 0 auto;
	}
	.about p{
		line-height: 3.2rem;
	}
	.about div{
		width: 10rem;
		height: 2.4rem;
		color: #fff;
		font-size: 1.4rem;
		text-align: center;
		line-height: 2.4rem;
		border-radius: 1.2rem;
		background: #4092f4;
		margin:20px auto 0 auto;
		cursor: pointer;
	}
	.about div span{
		 width: .5rem;
		 height: .5rem;
		 border-radius: 100%;
		 background: red;
		 display: inline-block;
		 vertical-align: .2rem;
		 overflow: hidden;
	}
</style>
