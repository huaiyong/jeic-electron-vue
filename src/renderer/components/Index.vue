<template>
	<div class="zmj_index">
		<div class="indexContent">
			<keep-alive>
				<router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		</div>
		<div class="indexFooter">
			<div class="footCont">
				<ul class="indexItem clearfix" ref="indexItem">
					<li @click="teachModel()" :class="{'active':index==0}">
						<div>
							<i class="iconfont icon-jiaoxuemoshi"></i>
							<p>教学模式</p>
						</div>
					</li>
					<li @click="userInfo()" :class="{'active':index==1}">
						<div>
							<i class="iconfont icon-yonghu"></i>
							<p>用户</p>
						</div>
					</li>
					<li @click="lookStudent()" :class="{'active':index==2}">
						<div>
							<i class="iconfont icon-yonghu1"></i>
							<p>成员</p>
						</div>
					</li>
					<li @click="teachRecord()" :class="{'active':index==3}">
						<div>
							<i class="iconfont icon-jilu1"></i>
							<p>教学记录</p>
						</div>
					</li>
					<li @click="changeClassroomState()" :class="{'active':index==4}">
						<div :class="{'active':classroomState}">
							<i class="iconfont icon-lingdang1"></i>
							<p v-text="classroomState?'下课':'上课'"></p>
						</div>
					</li>
					<li :class="{'active':index==5}">
						<div @click="resources()">
							<i class="iconfont icon-yun1"></i>
							<p>资源</p>
						</div>
					</li>
					<li :class="{'active':index==6}">
						<div @click="draw()">
							<i class="iconfont icon-heibanblackboard4"></i>
							<p>白板</p>
						</div>
					</li>
					<li :class="{'active':index==7}" @click="pingtai()">
						<div>
							<i class="iconfont icon-xuanti-pingtai"></i>
							<p>平台</p>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="commonTitle"></div>
		<ppt-show v-if="pptHave"></ppt-show>
		<word-show v-if="wordHave"></word-show>
		<pdf-show v-if="pdfHave"></pdf-show>
		<excel-show v-if="excelHave"></excel-show>
		<small-tools v-show="classroomState"></small-tools>
	</div>
</template>

<script>
	import smallTools from "./resourceDetail/smallTools";
	import pptShow from "./pptShow";
	import wordShow from "./wordShow";
	import pdfShow from "./pdfShow";
	import excelShow from "./excelShow";
	import $ from "jquery";
	import {
		ipcRenderer
	} from 'electron';
	import {
		mapState
	} from "vuex";
	const shell = require('electron').shell;
	export default {
		name: "Index",
		data: function() {
			return {
				index: null //点击底部导航条的下标
			};
		},
		computed: {
			...mapState({
				classroomState: state => state.state.classroomState,
				userId: state => state.state.userId,
				cityId: state => state.state.city,
				pptHave: state => state.state.pptHave,
				wordHave: state => state.state.wordHave,
				pdfHave: state => state.state.pdfHave,
				excelHave: state => state.state.excelHave,
			})
		},
		components: {
			smallTools,
			pptShow,
			wordShow,
			pdfShow,
			excelShow
		},
		sockets: {
			teacherInfo() {
				this.userInfo();
			},
			memberAdmin() {
				this.lookStudent();
			},
			ketangjilu() {
				this.teachRecord();
			},
			changeClassroomState() {
				this.changeClassroomState();
			},
			resouceAdmin() {
				this.resources();
			},
			pingtai() {
				this.pingtai();
			},
			drawclick() {
				this.draw();
			},
			teacheModel() {
				this.teachModel();
			},
			maximizeTest() {
				this.testMax();
			},
			maximizePpt() {
				this.pptMax();
			},
			maximizeWord() {
				this.wordMax();
			},
			maximizeExcel() {
				this.excelMax();
			},
			maximizeImg() {
				this.imgMax();
			},
			maximizePdf() {
				this.pdfMax();
			}
		},
		methods: {
			teachModel() {
				//教学模式
				this.index = 0;
				if (this.classroomState) {
					this.$router.push({
						name: "teachModel",
						query: {
							classType: 'all'
						}
					});
				} else {
					this.error();
				}
			},
			userInfo() {
				//用户信息
				this.index = 1;
				if (this.classroomState) {
					this.$router.push({
						name: "UserInfo"
					});
				} else {
					this.error();
				}
			},
			lookStudent() {
				//查看学员
				this.index = 2;
				if (this.classroomState) {
					this.$router.push({
						name: "StudentList"
					});
				} else {
					this.error();
				}
			},
			teachRecord() {
				//查看教学记录
				this.index = 3;
				if (this.classroomState) {
					this.$router.push({
						name: "Records"
					});
				} else {
					this.error();
				}
			},
			changeClassroomState() {
				//上课或下课
				this.index = 4;
				this.$router.push({
					name: "Classroom"
				});
			},
			resources() {
				//资源
				this.index = 5;
				if (this.classroomState) {
					this.$router.push({
						name: "Resourceslist"
					});
				} else {
					this.error();
				};
			},
			draw() {
				//白板
				this.index = 6;
				this.$router.push({
					name: "draw"
				});
			},
			pingtai() {
				shell.openExternal("http://111.207.13.88:8881/jeuc/api/oauth/toClientUrl?clientId=1&userId=" + this.userId +
					"&areaCode=" + this.cityId)
			},
			testMax() { //试题最大化
				$('#testMax').addClass("active").remove();
				sessionStorage.removeItem("resourceId");
				sessionStorage.removeItem("paizhaoUrl");
				this.$router.push({
					name: "StudentAnswers",
					params: {
						state: true
					}
				});
			},
			imgMax() { //图片最大化
				$('#imgMax').addClass("active").remove();
				this.$router.push({
					name: "imgShow",
					params: {
						resourceImgId: sessionStorage.getItem("resourceImgId"),
						imgsrc: sessionStorage.getItem("resourceImgUrl")
					}
				});
			},
			pdfMax() { //pdf最大化
				$('#pdfMax').addClass("active").remove();
				sessionStorage.removeItem("resourcepdfId");
				this.$store.dispatch("getPdfState",true);
			},
			wordMax() { //word最大化
				$('#wordMax').addClass("active").remove();
				sessionStorage.removeItem("resourcewordId");
				this.$store.dispatch("getWordState",true);
			},
			excelMax() { //excel最大化
				$("#excelMax").addClass("active").remove();
				sessionStorage.removeItem("resourceexcelId");
				this.$store.dispatch("getExcelState",true);
			},
			pptMax() { //ppt最大化
				$('#pptMax').addClass("active").remove();
				sessionStorage.removeItem("resourcepptId");
				this.$store.dispatch("getPptState",true);
			},
			error: function() {
				$(".commonTitle").html("请先上课").show();
				setTimeout(function() {
					$(".commonTitle").hide();
				}, 1000);

			}
		},
		mounted() {
			const that = this;
			$("body").on("click", "#testMax", function() {
				that.testMax();
			});
			$("body").on("click", "#imgMax", function() {
				that.imgMax();
			});
			$("body").on("click", "#wordMax", function() {
				that.wordMax();
			});
			$("body").on("click", "#excelMax", function() {
				that.excelMax();
			});
			$("body").on("click", "#pptMax", function() {
				that.pptMax();
			});
			$("body").on("click", "#pdfMax", function() {
				that.pdfMax();
			});
		}
	};
</script>

<style>
	.zmj_index,.indexContent {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.zmj_index .indexFooter {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 6rem;
		z-index: 1;
	}

	.footCont {
		width: auto !important;
		margin: auto;
		height: 100%;
		background: rgba(255, 255, 255, 0.88);
		border-radius: 0.4rem 0.4rem 0 0;
		position: relative;
		padding: 0 1rem;
		border-top-left-radius: 0.6rem;
		border-top-right-radius: 0.6rem;
		display: table;
	}

	.zmj_index .indexFooter .indexItem {
		display: table-cell;
		vertical-align: middle;
		text-align: center;
	}

	.zmj_index .indexFooter .indexItem li {
		margin: auto 0.6rem;
		display: inline-block;
	}

	.zmj_index .indexFooter .indexItem li:first-child {
		margin-left: 0;
	}

	.zmj_index .indexFooter .indexItem li.active {
		-webkit-animation: bounce 1s;
		animation: bounce 1s;
	}

	.zmj_index .indexFooter .indexItem li:last-child {
		margin-right: 0;
	}

	.zmj_index .indexFooter .indexItem li div {
		width: 5rem;
		height: 5rem;
		border-radius: 1rem;
		background: rgba(18, 150, 219, 0.75);
		cursor: pointer;
	}

	.zmj_index .indexFooter .indexItem li div.active {
		background: #f44336;
	}

	.zmj_index .indexFooter .indexItem li div .iconfont {
		color: #fff;
		font-size: 2.6rem;
		margin-top: 1.2rem;
		display: inline-block;
	}

	.zmj_index .indexFooter .indexItem li p {
		font-size: 0.8rem;
		color: #fff;
		text-align: center;
	}
</style>
