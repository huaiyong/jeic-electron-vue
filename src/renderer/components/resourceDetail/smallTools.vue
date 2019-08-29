<template>
	<div>
		<div class="round" id="fd">
			<div class="toggle" id="toggle">
				<i class="iconfont icon-hao" id="plus" @click="expand()"></i>
			</div>
			<div class="parent">
				<div class="menu" id="menu">
					<div class="circle_bg">
						<div class="part bg-blue pos01" @click="search()">
							<p class="cont">
								<i class="iconfont icon-xingtaiduICON_sousuo--"></i>
								<span>搜索</span>
							</p>
						</div>
						<div class="part bg-red pos02" @click="callName()">
							<p class="cont">
								<i class="iconfont icon-dianming"></i>
								<span>点名</span>
							</p>
						</div>
						<div class="part bg-green pos03" @click="more">
							<p class="cont">
								<i class="iconfont icon-bangdingyinxingqia"></i>
								<span>更多</span>
							</p>
						</div>
						<div class="part bg-blue1 pos04" @click="luPing()">
							<p class="cont">
								<i class="iconfont icon-weibiaoti1fuzhi"></i>
								<span>录屏</span>
							</p>
						</div>
						<div class="part bg-red2 pos05" @click="annotationFrame()">
							<p class="cont">
								<i class="iconfont icon-pizhu"></i>
								<span>批注</span>
							</p>
						</div>
						<div class="part bg-green3 pos06" @click="countDownShow()">
							<p class="cont">
								<i class="iconfont icon-icon-test"></i>
								<span>倒计时</span>
							</p>
						</div>
					</div>
				</div>
			</div>
	        <div class="moreTools">
				<ul class="moreclass">
					<li @click="responder()">
						<img src="../../assets/img/qiangdabtn.png" alt="">
						<p>抢答</p>
					</li>
				</ul>
			</div>
		</div>
		<!--抢答-->
		<div class="responderBox">
			<div class="responder">
				<h4 class="responderTitle">抢答 <i class="iconfont icon-chuyidong" @click="closeResponder()"></i></h4>
				<div class="responderContent">
					<div class="title-show">
						<img src="../../assets/img/qiangda.png" alt="">
						<p>准备好了吗？</p>
					</div>
					<div class="successInfo" v-if="pattern">
						<img v-if="successInfo.sex=='男'" src="../../assets/img/boy.png" alt="">
						<img v-if="successInfo.sex=='女'" src="../../assets/img/girl.png" alt="">
						<p v-text="successInfo.realname"></p>
					</div>
					<div class="successInfo" v-if="!pattern">
		                    <div>
								<img v-if="successInfo.sex=='男'" src="../../assets/img/boy.png" alt="">
								<img v-if="successInfo.sex=='女'" src="../../assets/img/girl.png" alt="">
								<div class="guangrongbang" v-text="successInfo.groupName"></div>
							</div>
						   <p>恭喜<span v-text="successInfo.realname"></span>为<span v-text="successInfo.groupName"></span>抢得答题机会</p>
					</div>
				</div>
				<div class="responderBtn" @click="startResponder()">
					开始抢答
				</div>
			</div>
		</div>
		<!--批注弹框-->
		<div class="annotationFrame">
			<canvas id="canvas"></canvas>
			<div class="paintBrush clearfix">
				<div class="choose fl">
					<ul class="chooseColor clearfix">
						<li class="active" @click="chooseColor(0,'#f3161f')"><span></span></li>
						<li @click="chooseColor(1,'#06f40c')"><span></span></li>
						<li @click="chooseColor(2,'#fff')"><span></span></li>
						<li @click="chooseColor(3,'#0b0c10')"><span></span></li>
						<li @click="chooseColor(4,'#fcff3e')"><span></span></li>
						<li @click="chooseColor(5,'#05b1f9')"><span></span></li>
					</ul>
					<ul class="chooseSize  clearfix">
						<li class="active" @click="chooseSize(0,'3')"><span></span></li>
						<li  @click="chooseSize(1,'6')"><span></span></li>
						<li  @click="chooseSize(2,'9')"><span></span></li>
					</ul>
				</div>
				<div class="operation fr">
                    <div>
						<i class="iconfont icon-chexiao" @click="restor()"></i>
					</div>
					<div class="active" @click="showColor()" id="showColor">
						<i class="iconfont icon-kujialeqiyezhan_tiaosepan"></i>
					</div>
					<div>
						<i class="iconfont icon-guanbi3" @click="closeAnnotationFrame()"></i>
					</div>
				</div>
			</div>
		</div>
	    <!--倒计时-->
		<div class="countDown">
			<span class="close" @click="countDownClose()"><i class="iconfont icon-shanchu1"></i></span>
			<div class="countDownTimer clearfix">
				<div class="left fl">
					<div class="time">
						<button @click="addCount('shiMin')">+</button>
						<span v-text="shiMin"></span>
						<button @click="subtract('shiMin')">+</button>
					</div>
					<div  class="time">
						<button @click="addCount('min')">+</button>
						<span v-text="min">2</span>
						<button @click="subtract('min')">+</button>
					</div>
				</div>
				<div class="icon fl">
					<i class="iconfont icon-icon50"></i>
				</div>
				<div class="right fr">
					<div class="time">
						<button @click="addCount('shiSec')">+</button>
						<span v-text="shiSec"></span>
						<button @click="subtract('shiSec')">+</button>
					</div>
					<div class="time">
						<button @click="addCount('sec')">+</button>
						<span v-text="sec">2</span>
						<button @click="subtract('sec')">+</button>
					</div>
				</div>
			</div>
			<button @click="beginCountDown()" class="begin"><i class="iconfont icon-kaishi"></i></button>
			<button @click="reset()" class="reset"><i class="iconfont icon-zhongzhi"></i></button>
		</div>
		<!--随机点名-->
		<div class="callName">
			<div class="picture">
				<img src="../../assets/img/login_img.png" alt="">
			</div>
			<p class="name"></p>
		</div>
	</div>
</template>

<script>
	import * as screenCapApi from '../../../../modules/screencap/renderers/index/Index';
	import {
			mapState
		} from "vuex";
	import $ from "jquery";
	import {
		ipcRenderer
	} from 'electron';
	export default {
		name: "SmallTools",
		data() {
			return {
				i: 0, //用于控制小工具伸缩
				sizeR: "3",
				ismousedown: false,
				changeColor: "#f3161f",
				endobj: {},
				allpoint: [],
				arrXY: [],
				arr: [],
				undoarr: [],
				shiMin:0,//分
				min:0,
				shiSec:0,//秒
				sec:0,
				timer:null,//倒计时定时器，
				timer1:null, //抢到定时器
				successInfo:{}, //抢答成功人员
			}
		},
		computed: {
			...mapState({
				remember: state => state.state.remember,
				pattern: state => state.state.pattern,
				classRecord: state => state.state.classRecord,
				userId: state => state.state.userId,
				classId:state => state.state.classId,
				groupId:state => state.state.groupId,
				
			})
		},
		sockets:{
			showChuangti(data){
			 this.$store.dispatch("getTestType",3);	
			 this.$store.dispatch("getImgUrl",data[0]);
			 this.$store.dispatch("getImgType",data[1]);
			 this.$store.dispatch("getImgAnswer",data[2]);
			 this.$router.push({
				name: 'StudentAnswers'
			 });
			},
			
			
		},
		methods: {
			expand() {
				if (this.i == 0) {
					this.$options.methods.toolsShow.bind(this)();
				} else if (this.i == 1) {
					this.$options.methods.toolsHide.bind(this)();
				};

			},
			toolsHide() { //小工具缩小
				document.getElementById("menu").style.transform = "scale(0)";
				document.getElementById("plus").style.transform = "rotate(0deg)";
				document.getElementById("toggle").style.borderColor = "transparent";
				this.i = 0;
				$(".moreTools").hide();
				$(".part").removeClass("active");
			},
			toolsShow() { //小工具放大
				document.getElementById("menu").style.transform = "scale(1)";
				document.getElementById("plus").style.transform = "rotate(45deg)";
				document.getElementById("toggle").style.borderColor = "#1296db";
				this.i = 1;
			},
			more(){ //更多
			    $(".pos03").addClass("active").siblings().removeClass("active");
				$(".moreTools").show();
			},
			responder(){  //点击抢答
				$(".moreTools").hide();
				$(".responderBox").show();
			},
			closeResponder(){ //关闭抢答
				$(".responderBox").hide();
				$(".pos03").removeClass("active");
				clearInterval(this.timer1);
				$(".title-show").show();
				$(".successInfo").hide();
				$(".responderBtn").html("开始抢答");
			},
			startResponder(){  //开始抢答
			    $(".title-show").show();
				$(".successInfo").hide();
				$(".responderBtn").html("抢答中...");
				var that=this;
				this.$http("http://127.0.0.1:3000/jeic/api/sendRecord/startResponder?number=1").then(function(res){
					if(res.data.ret==200){
						if(that.pattern){
							that.timer1=setInterval(function(){
								that.$http("http://localhost:3000/jeic/api/sendRecord/getStartResponder?type=1").then(function(res){
									if(res.data.ret==200){
										if(JSON.stringify(res.data.data) != "{}"){
											that.successInfo=res.data.data;
											$(".responderBtn").html("重新抢答");
											$(".title-show").hide();
											$(".successInfo").show();
											clearInterval(that.timer1);
											that.$http("http://127.0.0.1:3000/jeic/api/sendRecord/stopResponder").then(function(res){
												
											});
										};
									}
								});
							},1000);
							
						}else{
							that.timer1=setInterval(function(){
								that.$http("http://localhost:3000/jeic/api/sendRecord/getStartResponder?type=3&teachingGroupId="+that.groupId).then(function(res){
									if(res.data.ret==200){
										if(JSON.stringify(res.data.data) != "{}"){
											that.successInfo=res.data.data;
											console.log(that.successInfo)
											$(".responderBtn").html("重新抢答");
											$(".title-show").hide();
											$(".successInfo").show();
											clearInterval(that.timer1);
											that.$http("http://127.0.0.1:3000/jeic/api/sendRecord/stopResponder").then(function(res){
												
											});
										};
									}
								});
							},1000);
						}
						
					};
					
				});
				
			},
			search() { //搜索
				ipcRenderer.send('open-baidu');
				
			},
			luPing(){
				$(".pos04").addClass("active").siblings().removeClass("active");
				if($(".pos04 span").html()=="录屏"){
					//alert('录频中')
					//'lupingstart_' + $scope.classRecord + "," + $scope.userId + ',' + $scope.teachClassId +
					//',' + $scope.SubjectName
//					this.classRecord,
//					this.userId,
//					this.classId,
//					sessionStorage.getItem("subjectName")
					var StringData = this.classRecord+","+this.userId+","+this.classId+","+sessionStorage.getItem("subjectName");
					screenCapApi.startRecord(StringData);
					$(".pos04 span").html("录屏中");
					$(".pos04").addClass("active").siblings().removeClass("active");
				}else{
					//alert('录频')
					screenCapApi.stopRecord();
					setTimeout(function(){
						screenCapApi.uploadScreenCap(); 
					}, 1000);
					$(".pos04 span").html("录屏");
					$(".pos04").removeClass("active");
				};
			},
			countDownShow(){
				$(".pos06").addClass("active").siblings().removeClass("active");
				$(".countDown").show();
			},
			countDownClose(){
				$(".countDown").hide();
				$(".pos06").removeClass("active");
				clearInterval(this.timer);
				this.shiMin=0;
				this.min=0;
				this.shiSec=0;
				this.sec=0;
			},
			addCount(data){  //倒计时加
				if(this[data]<9){
					this[data]++;
				}else{
					this[data]=0;
				};
			},
			subtract(data){ //倒计时减
				if(this[data]>0){
					this[data]--;
				}else{
					this[data]=9;
				};
			},
			beginCountDown(){ //开始计时
				var that=this;
				var maxtime=this.shiMin*60*10+this.min*60+this.shiSec*10+this.sec;
				var countDown=function CountDown(){
				                if (maxtime >= 0) {
				                    var minutes = Math.floor(maxtime / 60);
				                    var seconds = Math.floor(maxtime % 60);
									if(minutes<10){
										minutes="0"+minutes;
									}else{
										minutes=minutes+"";
									};
									if(seconds<10){
										seconds="0"+seconds;
									}else{
										seconds=seconds+"";
									};
									that.shiMin=minutes[0];
									that.min=minutes[1];
									that.shiSec=seconds[0];
									that.sec=seconds[1];
				                    --maxtime;
				                } else{
				                    clearInterval(this.timer);
				                };
				            };
				this.timer = setInterval(countDown, 1000);
				
			},
			reset(){
				clearInterval(this.timer);
				this.shiMin=0;
				this.min=0;
				this.shiSec=0;
				this.sec=0;
			},
			annotationFrame() { //批注弹层
			    var mycan=document.getElementById("canvas");
			    var con=document.getElementById("canvas").getContext('2d');
				$(".pos05").addClass("active").siblings().removeClass("active");
				this.undoarr = [];
				con.clearRect(0, 0, mycan.width, mycan.height);
				con.beginPath();
				this.changeColor = "#f3161f";
				this.sizeR="3";
				$(".chooseColor li").eq(0).addClass('active').siblings().removeClass('active');
				$(".chooseSize li").eq(0).addClass('active').siblings().removeClass('active');
				$(".annotationFrame").show();
				this.toolsHide();
			},
			showColor(){  //展开或者隐藏颜色托盘
				if($("#showColor").hasClass("active")){
					$("#showColor").removeClass("active");
					$(".choose").hide();
				}else{
				   $("#showColor").addClass("active");
				   $(".choose").show();	
				};
			},
			callName(){ //点名
			    var arr=[];
				if(this.pattern){
					arr=this.remember.concat([]);
					for(var i=0;i<5;i++){
						arr.sort(function(a,b){
							return Math.random()>0.5 ? -1 : 1;
						}); 
					};
					 $(".pos02").addClass("active").siblings().removeClass("active");
					 if($(".callName").css("display")=="none"){
						$(".callName").show();
						this.startRollcall(arr);
					 }; 
				}else{
					var that = this;
					this.$http.get("http://127.0.0.1:3000/jeic/api/teachingGroup/e6ede400-b744-11e9-8c29-6b7ccf60b4df").then(function(
						res) {
						if (res.data.ret == 200) {
							var student= res.data.data.userGrouplist;
							for(var i=0;i<student.length;i++){
								var obj={};
								    obj.name=student[i].name;
								arr.push(obj);
							};
							for(var i=0;i<5;i++){
								arr.sort(function(a,b){
									return Math.random()>0.5 ? -1 : 1;
								}); 
							};
							$(".pos02").addClass("active").siblings().removeClass("active");
							 if($(".callName").css("display")=="none"){
								$(".callName").show();
								that.startRollcall(arr);
							}; 
						};
					});
				};
				
				
				
			},
			startRollcall(data){
				var t = null;
				clearInterval(t);
				t = setInterval(function(){
					var num = Math.floor(Math.random() * (data.length - 1));
					$(".callName .name").html(data[num].name);
				}, 10);
				setTimeout(function() {
					clearInterval(t);
					t = setInterval(function(){
						var num = Math.floor(Math.random() * (data.length - 1));
						$(".callName .name").html(data[num].name);
						$("")
					}, 200);
				}, 2000);
				setTimeout(function() {
					clearInterval(t);
				}, 3000);
				setTimeout(function() {
					$(".callName").hide();
					$(".pos02").removeClass("active");
				}, 6000);
			},
			draw(){   //画
				var mycan = document.getElementById("canvas");
				var con = mycan.getContext('2d');
				const that = this;
				var x, y //定义绘制的画笔起始坐标
				var dx, dy;
				['touchstart', 'mousedown'].forEach(function(item, index) {
					mycan.addEventListener(item, function(e) {
						if (item == "touchstart") {
							x = e.touches[0].clientX;
							y = e.touches[0].clientY;
							
						} else {
							x = e.x;
							y = e.y;
						};
						e.preventDefault();
						that.ismousedown = true;
						con.beginPath()
						con.lineCap = "round";
						con.lineJoin = "round";
						con.strokeStyle = this.changeColor;
						con.moveTo(x, y);	
				});
				['touchmove', 'mousemove'].forEach(function(item, index) {
					mycan.addEventListener(item, function(e) {
						if (item == "mousemove") {
							dx = e.x;
							dy = e.y
						} else {
							dx = e.touches[0].clientX;
							dy = e.touches[0].clientY;
							
						};
					if (that.ismousedown == true) {
				         that.arr = [];
				         that.arr[0] = dx;
				         that.arr[1] = dy;
				         that.arrXY.push(that.arr);
				         con.lineTo(dx, dy)
				         con.strokeStyle = that.changeColor;
				         con.lineWidth = that.sizeR;
				         con.stroke()
				         con.restore();
						
						}
					});
				});
				['touchend', 'mouseup'].forEach(function(item, index) {
						mycan.addEventListener(item, function(e) {
							that.ismousedown = false;
							if(that.undoarr.indexOf(mycan.toDataURL())==-1){
								that.undoarr.push(mycan.toDataURL());
							};
							var obj = {};
							obj.startX = x;
							obj.startY = y;
							obj.endY = dy;
							obj.endX = dx;
							obj.points
							that.ismousedown = false;
							that.allpoint.push(that.arrXY)
							that.endobj.width = that.sizeR;
							that.endobj.color = that.changeColor;
							that.endobj.points = that.arrXY;
							that.allpoint = [];
							that.arrXY = [];
						},false);
					});
				});
			},
			chooseColor(index,data){ //选择画笔颜色
				$(".chooseColor li").eq(index).addClass('active').siblings().removeClass('active');
				this.changeColor=data;
			},
			chooseSize(index,data){  //选择画笔大小
				$(".chooseSize li").eq(index).addClass('active').siblings().removeClass('active');
				this.sizeR=data;
			},
			closeAnnotationFrame(){ //关闭批注
				$(".annotationFrame").hide();
				$(".pos05").removeClass("active");
			},
			restor() { //撤销
			    var mycan=document.getElementById("canvas");
			    var con=document.getElementById("canvas").getContext('2d');
				if (this.undoarr.length != 0) {
					this.undoarr.pop();
				    con.clearRect(0, 0, mycan.width, mycan.height);
					var canvasPic = new Image();
					var that = this;
					canvasPic.src = this.undoarr[this.undoarr.length - 1];
					canvasPic.addEventListener('load', function() {
						con.drawImage(canvasPic, 0, 0);
					});
				};

			}

		},
		mounted() {
			var x, y; //定义起始坐标
			var flag = false;
			var div = document.getElementById('fd');
			// 鼠标按下事件
			['touchstart', 'mousedown'].forEach(function(item) {

				div.addEventListener(item, function(event) {
					var e = event || window.event;
					var x;
					var y;
					var flag = true;
					//鼠标按下时的坐标x,y
					if (item == "touchstart") {
						x = e.touches[0].clientX;
						y = e.touches[0].clientY;
					} else {
						x = e.x;
						y = e.y;
					}

					//鼠标按下时的左右偏移量
					var dragLeft = this.offsetLeft,
						dragTop = this.offsetTop;

					// 鼠标移动事件
					['touchmove', 'mousemove'].forEach(function(item) {
                  
						if (item == 'touchmove') {
							div.addEventListener(item, function(e) {
								if (flag) {
									var nowX = e.touches[0].clientX,
										nowY = e.touches[0].clientY,
										//鼠标移动时的坐标的变化量
										moveX = nowX - x,
										moveY = nowY - y;
									var offsetX = dragLeft + moveX;
									var maxW = $("body").width() - $("#fd").width() / 2;
									var maxH = $("body").height() - $("#fd").height();
									if (offsetX < 0) {
										offsetX = 0;
									}
									if (offsetX > maxW) {
										offsetX = maxW;
									}
									var offsetY = dragTop + moveY;
									if (offsetY < 0) {
										offsetY = 0;
									};
									if (offsetY > maxH) {
										offsetY = maxH;
									};
									div.style.left = offsetX + 'px';
									div.style.top = offsetY + 'px';
									event.preventDefault();
								}
							})
						} else {
							document.addEventListener(item, function(e) {
								if (flag) {
									var nowX = e.clientX,
										nowY = e.clientY,
										//鼠标移动时的坐标的变化量
										moveX = nowX - x,
										moveY = nowY - y;

									var offsetX = dragLeft + moveX;
									var maxW = $("body").width() - $("#fd").width() / 2;
									var maxH = $("body").height() - $("#fd").height() / 2;
									if (offsetX < -$("#fd").width() / 2) {
										offsetX = -$("#fd").width() / 2;
									}
									if (offsetX > maxW) {
										offsetX = maxW;
									}
									var offsetY = dragTop + moveY;
									if (offsetY < -$("#fd").height() / 2) {
										offsetY = -$("#fd").height() / 2;
									};
									if (offsetY > maxH) {
										offsetY = maxH;
									};
									div.style.left = offsetX + 'px';
									div.style.top = offsetY + 'px';
									event.preventDefault();
								}
							})
						}

					});

					// 鼠标抬起事件
					['touchend', 'mouseup'].forEach(function(item) {
						if (item == 'touchend') {
							div.addEventListener(item, function() {
								flag = false
							})
						} else {
							document.addEventListener(item, function() {
								flag = false
							})

						}
					});
				});
			});
			var mycan=document.getElementById("canvas");
			mycan.width = document.documentElement.clientWidth;
			mycan.height = document.documentElement.clientHeight;
			this.draw();
		}
	}
</script>

<style scoped="scoped" >
	.round {
		position: fixed;
		bottom: 0px;
		left:-120px;
		width: 240px;
		height: 240px;
		z-index: 999;
	}

	.toggle {
		background: #1296db;
		border: 1px solid transparent;
		text-align: center;
		height: 80px;
		width: 80px;
		border-radius: 50%;
		position: absolute;
		margin: auto;
		bottom: 80px;
		left: 80px;
		cursor: pointer;
	}

	.toggle i.icon-hao {
		font-size: 48px;
		color: white;
		display: block;
		margin-top: 16px;
		transition: 0.7s;
		cursor: pointer;
	}

	.menu {
		height: 240px;
		width: 240px;
		transform: scale(0);
		border-radius: 50%;
		position: absolute;
		margin: auto;
		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
		z-index: -1;
		transition: 0.7s;
		cursor: pointer;
	}

	.circle_bg {
		border-radius: 50%;
		width: 240px;
		height: 240px;
		color: #fff;
		overflow: hidden;
		position: relative;
	}

	.circle_bg>.part {
		width: 58%;
		height: 58%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform-origin: 0% 0%;

	}

	.circle_bg>div.active {
		background: red;
	}

	.circle_bg>.part p {
		text-align: center;
		position: absolute;
		margin: 0;
	}

	.circle_bg>.part p i {
		font-size: 18px;
		display: block;
	}

	.circle_bg>.part p span {
		font-size: 14px;
		padding-top: 6px;
		display: block;
	}

	.pos01 {
		transform: rotate(0deg) skewX(0deg);
	}

	.pos01 p {
		left: 60px;
		top: 22px;
	}

	.pos02 {
		transform: rotate(60deg) skewX(-30deg);
	}

	.pos02 .cont {
		transform: skewX(30deg) rotate(-60deg);
	}

	.pos02 p {
		left: 78px;
		top: 20px;
	}

	.pos03 {
		transform: rotate(120deg) skewX(-30deg);
	}

	.pos03 .cont {
		transform: skewX(30deg) rotate(-120deg);
	}

	.pos03 p {
		left: 80px;
		top: 20px;
	}

	.pos04 {
		transform: rotate(180deg) skewX(-30deg);
	}

	.pos04 .cont {
		transform: skewX(30deg) rotate(-180deg);
	}

	.pos04 p {
		left: 82px;
		top: 25px;
	}

	.pos05 {
		transform: rotate(240deg) skewX(-30deg);
	}

	.pos05 .cont {
		transform: skewX(30deg) rotate(-240deg);
	}

	.pos05 p {
		left: 80px;
		top: 24px;
	}

	.pos06 {
		transform: rotate(300deg) skewX(-330deg);
	}

	.pos06 .cont {
		transform: skewX(330deg) rotate(-300deg);
	}

	.pos06 p {
		left: 28px;
		top: 22px;
	}

	.bg-blue {
		background: #1296db;
	}

	.bg-red {
		background: #1296db;
	}

	.bg-green {
		background: #1296db;
	}

	.bg-blue1 {
		background: #1296db;
	}

	.bg-red2 {
		background: #1296db;
	}

	.bg-green3 {
		background: #1296db;
	}

	.annotationFrame {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: 0 auto;
		display: none;
		z-index: 3;
		overflow: hidden;
	}
    
	.paintBrush {
		position: absolute;
		bottom: 0;
		right: 10px;
		z-index: 4;
	}
     .choose{
		 padding: 0 5px;
		 border-radius: 5px;
		 background: rgba(0, 0, 0, 0.4);
		 margin-right: 20px;
		 margin-top: 25px;
	 }
	.chooseColor li {
		width: 32px;
		height:32px;
		margin-top: 2px;
		margin-right: 5px;
		border-radius: 4px;
		border: 1px solid transparent;
		float: left;
	}

	.chooseColor li.active {
		border-color: #69b5cd;
	}

	.chooseColor li span {
		width: 28px;
		height:28px;
		margin: 2px;
		border-radius: 2px;
		display: inline-block;
		cursor: pointer;
	}

	.chooseColor li:nth-child(1) span {
		background: #f3161f;
	}

	.chooseColor li:nth-child(2) span {
		background: #06f40c;
	}

	.chooseColor li:nth-child(3) span {
		background: #fff;
	}

	.chooseColor li:nth-child(4) span {
		background: #0b0c10;
	}

	.chooseColor li:nth-child(5) span {
		background: #fcff3e;
	}

	.chooseColor li:nth-child(6) span {
		background: #05b1f9;
	}
    .chooseColor li:nth-child(6){
		margin-right: 0;
	}
	.chooseSize {
		margin-top: 5px;
		display: flex;
		align-items: center;
		justify-content: space-around
	}
    .chooseSize li{
		border-radius: 50%;
		border:1px solid transparent;
	}
	 .chooseSize li.active{
		border-color:#69b5cd;
	}
	.chooseSize li span {
		margin: 4px;
		background: #fff;
		border-radius: 50%;
		display: inline-block;
		cursor: pointer;
	}

	.chooseSize li:nth-child(1) span {
		width: 12px;
		height: 12px
	}

	.chooseSize li:nth-child(2) span {
		width: 15px;
		height: 15px
	}

	.chooseSize li:nth-child(3) span {
		width: 20px;
		height:20px
	}
	.operation div{
		width: 35px;
		height: 35px;
		color: #fff;
		text-align: center;
		line-height: 35px;
		border-radius: 5px;
		background: rgba(0, 0, 0, 0.4);
		margin-bottom: 10px;
		cursor: pointer;
	}
	.operation div.active{
		background: #1296db;
	}
	.countDown{
		width: 22.6rem;
		height: 12rem;
		padding: 1rem 2rem;
		background: #fff;
		border-radius: 1rem;
		position: absolute;
		right: 0;
		bottom:20px;
		z-index: 3;
		display: none;
	}
	.countDown .close{
		position: absolute;
		top: .5rem;
		right: .5rem;
		cursor: pointer;
	}
	.countDown .close .iconfont{
		font-size: 1.6rem;
		color: #ccc;
	}	
	.countDown .icon .iconfont{
		font-size: 2.4rem;
		line-height: 10rem;
	}
	
	.countDown .time{
		width: 5rem;
		height: 10.3rem;
		text-align: center;
		background: url("../../assets/img/daojishi_bg.png") no-repeat;
		background-size: 100%;
		float: left;
	}
	.countDown .time button{
		width: 3.2rem;
		height: 1.4rem;
		font-size: 1rem;
		background: #fff;
		border:none;
		outline: none;
		border:.1rem solid #c3c3c3;
		border-radius: .7rem;
		margin: 0 auto;
		display: block;
		cursor: pointer;
		position: relative;
		z-index: 2;
	}
   .countDown .time span{
	   height: 7rem;
	   font-size: 5.8rem;
	   display: block;
   }
   .countDown .begin{
	   width: 4.6rem;
	   height: 4.6rem;
	   background: #fff;
	   border:.1rem solid #b0b0b0;
	   border-radius: 50%;;
	   position: absolute;
	   left:0;
	   right: 0;
	   bottom: -1rem;
	   margin:0 auto;
	   outline: none;
	   cursor: pointer;
   }
   .countDown .begin .iconfont{
	   font-size: 2rem;
	   color: #1296db;
   }
   .countDown .reset{
	   border: none;
	   outline: none;
	   background: #fff;
	   position: absolute;
	   bottom: 0;
	   right: 4rem;
	   cursor: pointer;
   }
   .countDown .reset .iconfont{
		font-size: 2rem;
	}
	.callName{
		width: 25rem;
		height: 25rem;
		background: #fff;
		border:.4rem #f5ad18 solid;
		border-radius: .5rem;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		z-index: 3;
		display: none;
	}
	.callName .picture{
		  width: 100%;
		  height: 100%;   
	}
	.callName .picture img{
		width: 100%;
		height: 100%;   
	}
	.callName .name{
		width: 100%;
		height: 6rem;
		text-align: center;
		line-height: 6rem;
		color: #fff;
		font-size: 3.6rem;
		background-color: rgba(0, 0, 0, .5);
		position: absolute;
		bottom: 0;
	}
	.moreTools{
		    position: absolute;
		    bottom: 260px;
		    width: 300px;
		    height: 240px;
		    background-color: rgba(41, 37, 36, 0.8);
		    border-radius: 6px;
			display: none;
	}
	.moreclass{
		    text-align: left;
		    padding: 20px;
			
	}
	.moreclass li{
		    width: 50px;
		    height: 50px;
			color: #fff;
		    display: inline-block;
		    text-align: center;
		    margin: 5px;
		    cursor: pointer;
	}
	.responderBox{
		position: absolute;
		top: 0;
		bottom: 0;
		right:0;
		left:0;
		margin: auto;
		background: rgba(0,0,0,0.4);
		display: none;
		z-index: 2;
	}
	.responder{
		width: 28rem;
		height: 38rem;
		background: #fff;
		border-radius: .6rem;
		margin: 2rem auto;
		overflow: hidden;
	}
	.responderTitle{
		    height: 5.6rem;
		    line-height: 5.6rem;
		    padding:0 1rem;
		    border-bottom: .1px solid rgba(1, 1, 1, 0.3);
			background: #1296db;
			color: #fff;
			font-size: 1.6rem;	
	}
	.responderTitle .iconfont{
		font-size: 1.6rem;
		float: right;
		cursor: pointer;
	}
	.responderContent{
		height: 26.8rem;
		text-align: center;
		color: #000;
		font-size: 2.4rem;
		overflow: hidden;
	}
	.successInfo>div{
		position: relative;
	}
	.guangrongbang{
		width:100%;
		height: 4.6rem;
		line-height: 4.6rem;
		color: #fff;
		background: url("../../assets/img/guangrongbang.png") no-repeat;
		background-size: 100%;
		position: absolute;
		bottom: .2rem;
	}
	.responderContent img{
		width: 20rem;
		height: auto;
		margin-top: 1rem;
		
	}
	.responderBtn{
		height: 5.6rem;
		line-height: 5.6rem;
		text-align: center;
		font-size: 2rem;
		color: #fff;
	    background: #1296db;
		cursor: pointer;
	}
</style>
