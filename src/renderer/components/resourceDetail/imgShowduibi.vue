<template>
	<div class="wrapper">
		<div class="resouceBg">
			<div class="imgZoom">
				<button type="button" class="iconfont icon-fangda" @click="imgChange('big')"></button>
				<button type="button" class="iconfont icon-suoxiao1" @click="imgChange('small')"></button>
				<button type="button" class="iconfont icon-xuanzhuan" @click="revolve"></button>
				<button type="button" class="iconfont icon-xiangzuo" @click="displacement('left')"></button>
				<button type="button" class="iconfont icon-xiangyou" @click="displacement('right')"></button>
				<button type="button" class="iconfont icon-xiangshang" @click="displacement('top')"></button>
				<button type="button" class="iconfont icon-xiangxia" @click="displacement('bottom')"></button>
			</div>
			<div class="contentBox  clearfix imgTransform" style="text-align:center;">
				<img class="imgshowtc" :src="imgsrc" alt="" id="imgshowtc" style="max-width: 100%;max-height: 100%;"/>
			</div>
			
			<div class="caozuo">
			    <button @click="leftChangeImg()" class="page_btn lastPage"><em class="iconfont icon-zuojiantou"></em></button>
			    <button @click="rightChangeImg()" class="page_btn nextPage"><em class="iconfont icon-youjiantou"></em></button>
			</div>
		</div>
		<div class="commonTitle" ref="commonTitle">

		</div>
		<span class="closefullscreen fr" @click="back()">
			<em class="iconfont icon-guanbi1 exitResTc"></em>
		</span>
	</div>
</template>

<script>
	import $ from 'jquery';
	import {
		mapState
	} from "vuex";
	
	export default {
		name: "imgShow",
		data() {
			return {
				imgZoomRate: 1, //图片缩放比率
				crosswise: 0, //左右移动
				lengthways: 0, //上下移动
				imgRevolve: 1, //图片旋转
				imgsrc: this.$route.params.imgsrc, //地址
				isFirstEnter: false,
				imgindex:"",
			}
		},
		computed: {
			...mapState({
				recordId: state => state.state.recordId,
				pattern: state => state.state.pattern,
				model: state => state.state.model,
				getIndexImg: state => state.state.getIndexImg
			})
		},
		sockets: {
			closeimgtc() {
			    this.back();
			},
			imgZoom() {
				this.imgChange(data[0]);
			},
			imgMove() {
				this.displacement(data[0]);
			},
			imgRotate() {
				this.revolve();
			},
			minimizeImg() {
				this.min();
			},
			leftImage(data){
			  this.leftChangeImg();
			},
			rightImage(data){
			   this.rightChangeImg();
			}
		},
		methods: {
			back() {
				this.$router.back();
			},
			leftChangeImg(){ //上一张图片
			     
				if (this.imgindex > 0) {
					this.imgindex=parseInt(this.imgindex)-1;
					this.imgsrc = this.imgscontrasts[this.imgindex].imgUrl;
					this.isFirstEnter = true;
					$(".imgTransform").css("transform", 'scale(1)');
					$("#imgshowtc").css("margin-left", 0 + "px");
					$("#imgshowtc").css("margin-top", 20 + "px");
					$("#imgshowtc").css("transform", 'rotate(0deg)');
				};
				
			},
			rightChangeImg(){ //下一张图片
				if (this.imgindex < 3) {
					this.imgindex=parseInt(this.imgindex)+1;
					this.imgsrc = this.imgscontrasts[this.imgindex].imgUrl;
					this.isFirstEnter = true;
					$(".imgTransform").css("transform", 'scale(1)');
					$("#imgshowtc").css("margin-left", 0 + "px");
					$("#imgshowtc").css("margin-top", 20 + "px");
					$("#imgshowtc").css("transform", 'rotate(0deg)');
				};
			
			
			},
			error: function() {
				const that = this;
				this.$refs.commonTitle.innerHTML = "图片加载失败...";
				this.$refs.commonTitle.style.display = "block";
				setTimeout(function() {
					that.$refs.commonTitle.style.display = "none";
				}, 1000);
			},
			imgChange(num) { //缩放图片
				if (num == "big") {
					this.imgZoomRate += 0.2;
				} else if (num == "small" && this.imgZoomRate >= 0.4) {
					this.imgZoomRate += -0.2;
				};
				$(".imgTransform").css("transform", 'scale(' + this.imgZoomRate + ')');
			},
			displacement(direction) {
				if (direction == "left") {
					this.crosswise += -40;
				} else if (direction == "right") {
					this.crosswise += 40;
				} else if (direction == "top") {
					this.lengthways += -40;
				} else if (direction == "bottom") {
					this.lengthways += 40;
				};
				$("#imgshowtc").css("margin-left", this.crosswise + "px");
				$("#imgshowtc").css("margin-top", this.lengthways + "px");
			},
			revolve() {
				var rotatenum = 90 * this.imgRevolve + 'deg';
				this.imgRevolve++
				$("#imgshowtc").css("transform", 'rotate(' + rotatenum + ')');
			},
		},
		activated() {
			if (this.isFirstEnter) {
				var newImg = new Image()
				newImg.src = this.$route.params.imgsrc;
				newImg.onload = () => { // 图片加载成功执行
					this.imgsrc = newImg.src;
					var imgwidth = newImg.width;
					var imgheight = newImg.height;
				}
			};
			this.isFirstEnter = false;

		},
		created() {
			this.isFirstEnter = true;
			this.imgindex=this.$route.params.imgIndex;
			this.imgscontrasts=this.$route.params.imgUrl;
			this.imgsrc=this.imgscontrasts[this.imgindex].imgUrl;
		  
		}
	
	}
</script>

<style scoped>
	.resouceBg {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: 100%;
		height: 100%;
		background: rgb(82, 86, 89) !important;
		border: .1rem solid rgba(18, 18, 18, 0.3);
		box-shadow: .1rem .1rem 1rem #0003;
		overflow: hidden;
		box-sizing: border-box;
		z-index: 2;
	}
	
	.caozuo {
	    position: fixed;
	}
	
	.page_btn{
		position: fixed;
		background: #f00;
		width:100px;
		height:100px;
		top: 50%;
		outline: none;
		text-align: center;
		padding: 0;
		border-radius: 50%;
		color: #fff;
		opacity: .3;
		background:#2d2c2c;
	}
	.page_btn>em{
		font-size:60px;
	}
	.lastPage{
		left: 0;
	}
	
	.nextPage{
		right: 0;
	}

	.contentBox img {
		margin-top: 2rem;
	}

	.closefullscreen {
		position: absolute;
		top: 5px;
		right: 0;
		width: auto;
		height: auto;
		color: #fff;
		display: inline-block;
		background: transparent;
		box-shadow: none;
		border-radius: 0;
		border: 0;
		z-index: 2;
	}

	.exitResTc {
		font-size: 3rem !important;
		opacity: 1;
		cursor: pointer;
	}

	.minimizeResources {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 3rem;
		height: 2.6rem;
		padding-top: .4rem;
		display: inline-block;
		background: #fff;
		border-radius: .3rem;
		box-shadow: -1px 1px 20px 4px #1296db;
		border: 0;
		z-index: 1;
		cursor: pointer;
	}

	.minimizeResources>em {
		font-size: 3rem;
		color: #1296db;
	}

	.imgZoom {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3rem;
		text-align: center;
		background: rgb(82, 86, 89);
		z-index: 2;
		width: 35rem;
		margin: auto;
	}

	.imgZoom button {
		width: 4rem;
		height: 2rem;
		line-height: 2.3rem;
		font-size: 1.6rem;
		margin-top: 0.5rem;
		margin-left: 0.5rem;
		color: #535353;
		border-radius: 0.2rem;
		border: none;
		outline: none;
		cursor: pointer;
	}
</style>
