<template>
	<div class="zmj_resourceList">
		<div class="zmj_resourceTitle clearfix"><span>资源</span><span @click="close()"><img src="../../assets/img/close.svg"
				 alt=""></span></div>
		<div class="zmj_resourceContent clearfix">
			<div class="zmj_resourceSidebar">
				<ul>
					<li :class="{'active':sideBarIndex==0}" @click="sideBarTab(0)"><i class="iconfont icon-yun1"></i>云资源</li>
					<li :class="{'active':sideBarIndex==1}" @click="sideBarTab(1)"><i class="iconfont icon-yun1"></i>云试题</li>
				</ul>
			</div>
			<div class="zmj_resourceMain">
				<div class="zmj_resourceType" v-show="sideBarIndex==0">
					<ul class="clearfix">
						<li v-for="(i,index) in resourceList" :key="index" @click="showResoce(i.resourceId,i.resType)">
							<span :class="{'wx_video':i.resType==1 || i.resType==8 || i.resType==9,'wx_aduo':i.resType==2,'wx_img':i.resType==3,'wx_pdf':i.resType==4,'wx_ppt':i.resType==5,'wx_doc':i.resType==6,'wx_excel':i.resType==7,'wx_qita':i.resType==null}"></span>
							<p v-text="i.resourceName"></p>
						</li>
					</ul>
				</div>
				<div class="zmj_resourceTest" v-show="sideBarIndex==1">
					<ul class="clearfix">
						<li v-for="(i,index) in questionList" :key="index" @click="answer(i.resourceId,1)">
							<span class="wx_shiti"></span>
							<p v-text="i.resourceName"></p>
						</li>
					</ul>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import $ from "jquery";
	import {
		mapState
	} from "vuex";
	export default {
		name: "Resourceslist",
		data() {
			return {
				sideBarIndex: 0, //左侧列表默认选中下标
				resourceList: [], //云资源列表
				questionList: [], //云试题列表
				imgsrc: '', //图片展示路径
				showWordsrc: '', //word展示路径
				showExcelsrc: '', //excel展示路径
				pdfsrc: '', //pdf展示路径
				VideoMpsrc: '', //视频展示路径
				arrVideo: '', //视频
				AudioMpsrc: '', //音频展示路径
				arrAudio: '', //音频
				pptsrc: '' //ppt展示路径

			}
		},
		sockets: {
			restabSwitch(data) {
				this.sideBarTab(data[0]);
			},
			showShiti(data) {
				this.answer(data[0], data[1]);
			}
		},
		methods: {
			answer(resourceId, type) {
				if (resourceId == sessionStorage.getItem("resourceId")) {
					$(this.$parent.$refs.indexItem).find("#testMax").remove();
					sessionStorage.removeItem("resourceId");
					this.$router.push({
						name: 'StudentAnswers',
						params: {
							state: true
						}
					});
				} else if (sessionStorage.getItem("resourceId")) {
					this.error("请先关闭最小化试题资源");
				} else {
					this.$store.dispatch("getResourceId", resourceId);
					this.$store.dispatch("getTestType", type);
					this.$router.push({
						name: 'StudentAnswers'
					});
				};
			},
			close() { //关闭按钮								
				this.$router.push({
					"name": "Index"
				});
			},
			sideBarTab(index) { //左侧列表切换
				this.sideBarIndex = index;
			},
			showResoce(resourceId, resType) {

				const that = this;
				this.$http.get(this.configure.showResourceIp + resourceId).then(function(res) {
					if (res.data.ret == 200) {
						if (resType == 1 || resType == 8 || resType == 9) { //视频
							that.VideoMpsrc = res.data.result.viewURL.pathmp4PC; //mp4播放地址需要单独设置
							that.arrVideo = that.VideoMpsrc.split(":")[3];
							that.$router.push({
								name: 'videoPlayer',
								params: {
									VideoMpsrc: that.VideoMpsrc,
									arrVideo: that.arrVideo
								}
							});
						} else if (resType == 2) { //音频
							that.AudioMpsrc = res.data.result.viewURL.pathmp3PC; //mp3播放地址需要单独设置
							that.arrAudio = that.AudioMpsrc.split(":")[3];
							that.$router.push({
								name: 'videoPlayer',
								params: {
									AudioMpsrc: that.AudioMpsrc,
									arrAudio: that.arrAudio
								}
							});
						} else if (resType == 3) { //图片展示
							if (resourceId == sessionStorage.getItem("resourceImgId")) {
								$(that.$parent.$refs.indexItem).find("#imgMax").remove();
								sessionStorage.removeItem("resourceImgId");
								that.imgsrc = res.data.result.downloadUrl;
								that.$router.push({
									name: 'imgShow',
									params: {
										imgsrc: that.imgsrc,
										resourceId: resourceId
									}
								})
							} else if (sessionStorage.getItem("resourceImgId")) {
								that.error("请先关闭最小化img资源");
							} else {
								that.imgsrc = res.data.result.downloadUrl;
								that.$router.push({
									name: 'imgShow',
									params: {
										imgsrc: that.imgsrc,
										resourceId: resourceId
									}
								})
							}

						} else if (resType == 4) { //PDF文档
							that.pdfsrc = "/static/pdf/web/viewer.html?file=" + res.data.result.downloadUrl;
							console.log(that.pdfsrc, 111113333)
							that.$router.push({
								name: 'pdf',
								params: {
									pdfsrc: that.pdfsrc
								}
							});
						} else if (resType == 5) { //ppt展示
							sessionStorage.setItem("resourceId", resourceId);
							if (resourceId == sessionStorage.getItem("resourcepptId")) {
								$(that.$parent.$refs.indexItem).find("#pptMax").remove();
								sessionStorage.removeItem("resourcepptId");

								that.$router.push({
									name: 'ppt',
									params: {
										resourceId: resourceId
									}
								})
							} else if (sessionStorage.getItem("resourcepptId")) {
								that.error("请先关闭最小化ppt资源");
							} else {

								that.$router.push({
									name: 'ppt',
									params: {
										resourceId: resourceId
									}
								})
							}

						} else if (resType == 6) { //word文档 
							sessionStorage.setItem("resourceId", resourceId);
							if (resourceId == sessionStorage.getItem("resourcewordId")) {
								$(that.$parent.$refs.indexItem).find("#wordMax").remove();
								sessionStorage.removeItem("resourcewordId");

								that.$router.push({
									name: 'word',
									params: {
										resourceId: resourceId
									}
								});
							} else if (sessionStorage.getItem("resourcewordId")) {
								that.error("请先关闭最小化word资源");
							} else {
								that.$router.push({
									name: 'word',
									params: {
										resourceId
									}
								});
							}
						} else if (resType == 7) { //excel文档
							sessionStorage.setItem("resourceId", resourceId);
							if (resourceId == sessionStorage.getItem("resourceexcelId")) {
								$(that.$parent.$refs.indexItem).find("#excelMax").remove();
								sessionStorage.removeItem("resourceexcelId");
								that.$router.push({
									name: 'excel',
									params: {
										resourceId: resourceId
									}
								});
							} else if (sessionStorage.getItem("resourceexcelId")) {
								that.error("请先关闭最小化excel资源");
							} else {
								that.$router.push({
									name: 'excel',
									params: {
										showExcelsrc: that.showExcelsrc,
										resourceId
									}
								});
							}
						}
					};
				});


			},
			error: function(data) {
				$(".commonTitle").html(data).show();
				setTimeout(function() {
					$(".commonTitle").hide();
				}, 1000);

			}
		},
		computed: {
			...mapState({
				userId: state => state.state.userId,
				resourceId: state => state.state.resourceId,
				classId: state => state.state.classId
			})
		},
		created() {
			const that = this;
			this.$http.get(this.configure.resourceIp + "/sync?userId=" + this.userId + "&type=homework").then(function(res) {
				if (res.data.ret == 200) { //云试题
					that.questionList = res.data.data;
				};
			});
			this.$http.get(this.configure.resourceIp + "/sync?userId=" + this.userId + "&type=res").then(function(res) {
				if (res.data.ret == 200) { //云资源
					that.resourceList = res.data.data;

				};
			});
		}
	}
</script>

<style scoped="scoped">
	.zmj_resourceList {
		width: 80rem;
		height: 40rem;
		background: rgb(137, 137, 137);
		border: .1 solid rgba(18, 18, 18, 0.3);
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

	.zmj_resourceTitle {
		height: 5.6rem;
		line-height: 5.6rem;
		padding: 0 2rem;
		border-bottom: .1rem solid rgba(1, 1, 1, 0.3);
		background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#E8E6E7), to(#D2D0D3), color-stop(0.5, #dbd9dc));
	}

	.zmj_resourceTitle span:first-child {
		color: #666;
		font-size: 1.6rem;
		padding: .8rem 1rem;
		border: .1rem solid #a3a1a4;
		border-radius: .8rem;
		background: #fff;

	}

	.zmj_resourceTitle span:last-child {
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

	.zmj_resourceTitle span:last-child img {
		width: 100%;
		height: 100%;
	}

	.zmj_resourceSidebar {
		width: 20rem;
		height: 34.3rem;
		border-right: .1rem solid #ccc;
		float: left;

	}

	.zmj_resourceSidebar ul li {
		padding-left: 2rem;
		height: 4rem;
		line-height: 4rem;
		font-size: 2.2rem;
		color: #fff;
		border-bottom: .1rem solid #ccc;
		cursor: pointer;

	}

	.zmj_resourceSidebar ul li.active {
		background: rgba(96, 125, 139, .5);
		transition: .3s;
	}

	.zmj_resourceSidebar ul li .iconfont {
		font-size: 1.6rem;
	}

	.zmj_resourceMain {
		width: 59.9rem;
		height: 34.3rem;
		float: right;
	}

	.zmj_resourceType,
	.zmj_resourceTest {
		height: 100%;
		overflow-y: auto;
	}

	.zmj_resourceMain ul li {

		width: 9rem;
		height: 12rem;
		text-align: center;
		margin: .4rem .3rem;
		float: left;
		overflow: hidden;
		cursor: pointer;

	}

	.zmj_resourceMain ul li:hover {
		background: #69a9da;
	}

	.zmj_resourceMain ul li span {
		width: 8rem;
		height: 8rem;
		border-radius: 1.4rem;
		box-shadow: 0.2rem 0.2rem 0.6rem 0 #565656;
		display: inline-block;
	}

	.zmj_resourceMain ul li p {
		font-size: 1.6rem;
		color: #fff;
		margin-top: .6rem;
		line-height: 1.7rem;
	}

	.wx_pdf {
		background: url(../../assets/img/pdf.png);
		background-size: 100%;
	}

	.wx_excel {
		background: url(../../assets/img/excel.png);
		background-size: 100%;
	}

	.wx_ppt {
		background: url(../../assets/img/ppt.png);
		background-size: 100%;
	}

	.wx_doc {
		background: #fff url(../../assets/img/doc.png);
		background-size: 100%;
	}

	.wx_shiti {
		background: #fff url(../../assets/img/shiti.png);
		background-size: 100%;
	}

	.wx_video {
		background: url(../../assets/img/video.png);
		background-size: 100%;
	}

	.wx_aduo {
		background: url(../../assets/img/aduo.png);
		background-size: 100%;
	}

	.wx_qita {
		background: url(../../assets/img/qita.png);
		background-size: 100%;
	}

	.wx_img {
		background: url(../../assets/img/image.png);
		background-size: 100%;
	}
</style>
