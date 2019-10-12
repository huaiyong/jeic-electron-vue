<template>
	<div>
	    <div class="update" v-if="updateState">
			<div class="bg">
				<div class="edition">
					<span v-text="updateInfo.version"></span>
					<b>当前版本:<i v-text="currentVersion"></i></b>
				</div>
			</div>
			<div class="describe">
				<div v-html="updateInfo.releaseNotes"></div>
			</div>
			<div class="btn clearfix" v-if="nowUpdateState==false">
				<div class="cancelBtn" @click="cancel()">
					下次再说
				</div>
				<div class="sureBtn" @click="updateFun()">
					立即更新
				</div>
			</div>
			<div class="progressBar" v-if="downloadInfo.percent!=null && nowUpdateState==true">
				<div class="progress" :style="{width:downloadInfo.percent+'%'}">

				</div>
			</div>
		</div>
	    <div class="downloadSucess" v-if="updateModalShow">
			<div class="title clearfix">提示 <i class="iconfont icon-chuyidong fr" @click="closeUpdateModal"></i></div>
			<p>新版本下载完成，是否立即安装？</p>
			<div class="downloadBtn">
				<button @click="closeUpdateModal">下次再说</button>
				<button @click="updateConfirm">立即更新</button>
			</div>
		</div>
	</div>
</template>
<script>
	import packageJson from '../../../../package.json';
	export default {
		name: "update-version",
		data() {
			return {
				currentVersion: packageJson.version,
				updateText: '',
				downloadProgress: null,
				downloadInfo: {
					percent: null,
					totalMB: 0,
					KBPerSecond: 0,
				},
				updateModalShow: false,
				updateInfo: {
					releaseName: '',
					releaseNotes: '',
					releaseDate: '',
					version: '',
				},
				nowUpdateState:false,
				updateState:false
			};
		},
		methods: {
			cancel() {
				this.updateState =false;
			},
			updateFun(){
				this.nowUpdateState=true;
			},
			showUpdateModal() {
			    this.updateModalShow = true;
				this.updateState=false;
			 },
			updateConfirm() {
				this.updateModalShow = false;
				this.$electron.ipcRenderer.send('update-now');
			},
			closeUpdateModal() {
				this.updateModalShow = false;
				this.updateText = '更新已取消';
			},
			update() {
				this.$electron.ipcRenderer.on('update-message', (event, msg) => {
					const message = msg.message;
					const data = msg.data;
					switch (message) {
						case 'error':
							this.updateText = '检查更新失败';
							this.downloadInfo = this.$options.data().downloadInfo;
							break;
							/* case 'checking-for-update':
							  this.updateText = '检查更新中';
							  break;*/
						case 'update-available':
							this.updateText = '有可用更新';
							this.updateState=true;
							this.$emit("changeUpdate",true);
							this.updateInfo = {
								releaseDate: new Date(data.releaseDate).getTime() - new Date().getTimezoneOffset() * 60 * 1000,
								releaseName: data.releaseName,
								releaseNotes: data.releaseNotes,
								version: data.version,
							};
							break;
						case 'update-not-available':
							this.updateText = '已经是最新版';
							this.$emit("changeUpdate",false);
							break;
						case 'download-progress':
							this.updateText = '';
							this.downloadInfo = {
								percent: data.percent.toFixed(2),
								totalMB: (data.total / 1024 / 1024).toFixed(3),
								KBPerSecond: (data.bytesPerSecond / 1024).toFixed(3),
							};
							break;
						case 'update-downloaded':
							this.updateText = '';
							this.downloadInfo = this.$options.data().downloadInfo;
							this.showUpdateModal();
							this.$emit("changeUpdate",true);
							break;
						default:
							this.updateText = '';
							this.downloadInfo = this.$options.data().downloadInfo;
					}
				});
			},
		},
		created() {
			this.update();
			this.$emit("changeVersion",this.currentVersion);
		},
	};
</script>
<style scoped="scoped">
	.update {
		width: 480px;
		height: 480px;
		border-radius: 10px;
		background: #fff;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		z-index: 2;
	}

	.bg {
		width: 100%;
		height: 240px;
		background: url("../../assets/img/update.png") no-repeat center;
		background-size: 100%;
		position: absolute;
		top: -40px;
	}
    .bg .edition{
		margin-top: 160px;
		margin-left: 160px;
		color: #fff;
	}
	.bg .edition span {
		width: 80px;
		height: 24px;
		text-align: center;
		line-height: 24px;
		font-size: 24px;
		color: #fff;
		border-radius: 16px;
		background: #89bfff;
		display:inline-block;
	}
	.bg .edition b{
		font-weight: normal;
		margin-left: 5px;
	}

	.describe {
		position: absolute;
		top: 210px;
		padding-left: 36px;
		color: #666;
		font-size: 24px;
		line-height: 36px;
	}

	.btn {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 80px;
		border-top: 1px solid #ccc;
	}

	.btn div {
		width: 50%;
		height: 80px;
		box-sizing: border-box;
		text-align: center;
		line-height: 80px;
		font-size: 32px;
		color: #ccc;
		float: left;
		cursor: pointer;
	}

	.btn div:last-child {
		border-left: 1px solid #ccc;
		color: #5575ff;
	}

	.progressBar {
		width: 400px;
		height: 40px;
		border-radius: 20px;
		background: #d8d8d8;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 30px;
		margin: 0 auto;
		overflow: hidden;

	}
	.progress {
		width: 20%;
		height: 100%;
		background: #5575ff;
	}
	.downloadSucess{
		width: 400px;
		height: 200px;
		background: #fff;
		border-radius: 10px;
		position: absolute;
		top:0;
		left:0;
		right: 0;
		bottom: 0;
		margin: auto;
		z-index: 2;
		overflow: hidden;
	}
	.downloadSucess .title{
		height: 50px;
		line-height: 50px;
		padding:  0 20px;
		color: #fff;
		background: #5575ff;	
	}
	.downloadSucess .title .iconfont{
		cursor: pointer;
	}
	.downloadSucess p{
		text-align: center;
		margin: 40px 0;
	}
	.downloadSucess .downloadBtn{
		text-align: center;
	}
	.downloadSucess .downloadBtn button{
		width: 100px;
		height: 30px;
		color: #fff;
		border-radius: 15px;
		background: #acacac;
		border: none;
        outline: none;
		cursor: pointer;
	}
	.downloadSucess .downloadBtn button:last-child{
		background: #4092f4;
		margin-left: 100px;
	}
</style>
