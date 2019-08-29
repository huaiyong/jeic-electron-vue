<template>
	<div>
		<div class="zmj_loginWrap">
			<h1>智慧课堂 有你有我<span :class="{'inputLogin':!loginMode}" @click="modeTab()"></span></h1>
			<div class="loginForm" v-show="!loginMode">
				<div class="loginInput">
					<input type="text" placeholder="用户名" required="required" v-model="userName">
					<input type="password" placeholder="密码" required="required" v-model="userPwd">
				</div>
				<div class="loginError">
					<p id="errorTitle">账号或密码有误</p>
				</div>
				<button class="loginSubmit" @click="loginSubmit(userName,userPwd)">登录</button>
			</div>
			<div class="loginCode" v-show="loginMode">
				<img :src="codeSrc" alt="">
				<!-- <vue-qr :bgSrc='config.logo' :logoSrc="config.logo" :text="config.value" :size="200" :dotScale="config.dotScale"></vue-qr> -->
				<p>打开课中APP扫码登录</p>
			</div>
		</div>
		<div class="zmj_loginLogo">
			<img src="../assets/img/logo_login.png" alt="">
			
		</div>
		<div class="zmj_loginClose" @click="closeWindows()">
			<img src="../assets/img/login_back.png" alt="">
		</div>
		
		<update-version></update-version>
</div>

</template>

<script>
	import md5 from 'js-md5';
	import vueQr from 'vue-qr';
	import uuid from 'node-uuid';
	import os  from 'os';
	import updateVersion from "./resourceDetail/update"
	var interfaces = os.networkInterfaces();
	var localIP = "";

	for(var devName in interfaces){
		 var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
			 var alias = iface[i];
			if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
				localIP = alias.address;
			}
		}
	}

	import {
		ipcRenderer
	} from 'electron';
	export default {
		name: "Login",
		components: {
			vueQr,
			updateVersion
		},
		data: function() {
			return {
				loginMode: true, //登录方式
				codeSrc: "", //二维码路径
				uuid: "", //扫描二维码返回的id
				userName: "", //用户名,
				userPwd: "", //用户密码
				config: {
				  value: uuid.v1()+"@"+localIP,//显示的值、跳转的地址
				  dotScale:0.9
				}
			}
		},
		methods: {
			modeTab() {
				this.loginMode = !this.loginMode;
			},
			loginSubmit(name, pwd) { //登录
				const that = this;
				if (name == "") {
					document.getElementById("errorTitle").style.display ="block";
				} else if (pwd == "") {
					document.getElementById("errorTitle").style.display ="block";
				} else {
					pwd=md5(md5(pwd));
					this.$http.get(this.configure.jeucIp + '/uc/login?username=' + name + '&password=' + pwd).then(function(jdata) {
						if (jdata.data.ret == 200) {
							document.getElementById("errorTitle").style.display = "none";
							sessionStorage.setItem("realname", jdata.data.data.realname);
							sessionStorage.setItem("userMobile", jdata.data.data.userMobile);
							sessionStorage.setItem("userEmail", jdata.data.data.userEmail);
							that.$store.dispatch("getUserId", jdata.data.data.id);
							that.$router.push({
								'name': 'Classroom'
							});
						} else {
							document.getElementById("errorTitle").style.display ="block";
						};
					});
				};
			},
			getCodeInfo() { //获取二维码和扫码信息
				const that = this;
				this.$http.get(this.configure.jeucIp + "/uc/QRCode/getQrCode").then(function(req) {
					if (req.data.ret = 200) {
						that.codeSrc = req.data.data.qrCodeImg;
						that.uuid = req.data.data.uuid;
					};
				});
				const timer = setInterval(function() {
					that.$http.get(that.configure.jeucIp + "/uc/QRCode/longConnectionCheck?uuid=" + that.uuid).then(function(req) {
						if (req.data.ret == 200) {
							clearInterval(timer);
							that.loginSubmit(req.data.data.loginName, req.data.data.password)
						};
					});
				}, 2000);
			},
			closeWindows() {
				ipcRenderer.send('close-window');
			}

		},
		created() {
			this.getCodeInfo();
		}
	}
</script>

<style scoped>
	.zmj_loginWrap h1 {
		font-size: 3rem;
		font-weight: 700;
		text-align: center;
		color: #fff;
		padding-top: 5rem;

	}

	.zmj_loginWrap h1 span {
		width: 3rem;
		height: 3rem;
		background: url("../assets/img/ewm.png") no-repeat;
		background-size: 100%;
		border-radius: .4rem;
		margin-left: .2rem;
		vertical-align: top;
		display: inline-block;
		cursor: pointer;
	}

	.zmj_loginWrap h1 span.inputLogin {
		background: url("../assets/img/pc.png") no-repeat;
		background-size: 100%;
	}

	.zmj_loginWrap .loginForm {
		width: 30rem;
		margin: 0 auto;
	}

	.zmj_loginWrap .loginInput input {
		width: 27rem;
		height: 4.2rem;
		margin-top: 2.5rem;
		padding: 0 1.5rem;
		background: rgba(45, 45, 45, .15);
		border-radius: .6rem;
		border: .1rem solid rgba(255, 255, 255, .15);
		-webkit-box-shadow: 0 0.2rem 0.3rem 0 rgba(0, 0, 0, .1) inset;
		font-size: 1.4rem;
		color: #fff;
		outline: none;
		display: block;

	}


	.zmj_loginWrap .loginError {
		height: 2.8rem;
		line-height: 2.8rem;
		font-size: 1.6rem;
		color: red;
	}

	.zmj_loginWrap .loginError p {
		display: none;
	}

	.zmj_loginWrap .loginSubmit {
		width: 30rem;
		height: 4.4rem;
		background: #ef4300;
		border-radius: .6rem;
		border: .1rem solid #ff730e;
		box-shadow: 0 1.5rem 3rem 0 rgba(255, 255, 255, .25) inset, 0 2px 7px 0 rgba(0, 0, 0, .2);
		font-size: 1.4rem;
		font-weight: 700;
		color: #fff;
		text-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, .1);
		cursor: pointer;
	}

	.zmj_loginWrap .loginCode {
		width: 23.5rem;
		margin: 5rem auto;
	}

	.zmj_loginWrap .loginCode img {
		width: 100%;
	}

	.zmj_loginWrap .loginCode p {
		font-size: 2rem;
		color: #fff;
		text-align: center;
		margin-top: 2rem;

	}

	.zmj_loginLogo {
		position: absolute;
		left: 2rem;
		top: 3rem;
		color: #fff;
		font-size: 1.8rem;
		font-weight: bold;
		z-index: 1;
	}

	.zmj_loginClose {
		position: absolute;
		right: 0;
		bottom: 4rem;
		cursor: pointer;
	}
</style>
