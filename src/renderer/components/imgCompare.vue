<template>
	<div class="wrapper">
		<div class="showTc ctrlTc imgduibiPlayer">
			<div class="resoucetcContent">
				<!-- 新加的对比 -->
				<div class="blocks">
				  <div class="block" v-for="i in imgArr" track-by="name" v-bind:class="{'left':i.name==2 || i.name==0,'right':i.name==1 || i.name==3,'bot':i.name==2||i.name==3,'top':i.name==0||i.name==1}"  @click="contrastsImg(i.name,i.imgUrl)">
					<h1><img v-bind:src="i.imgUrl"></h1>
				  </div>
				</div>
				<!-- 新加的对比 -->
			</div>
		</div>
		<span class="closefullscreen fr" @click="back()">
			<em class="iconfont icon-guanbi1 exitResTc colorfff"></em>
		</span>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	
	export default ({
		name: "rankingStatistics",
		data() {
			return {
				
			}
		},
		sockets:{
			findImageByIndex(data){
				this.contrastsImg(data);
			},
			closeComper(){
				console.log(2222)
				this.back();
			}
			
	
		},
		methods: {
			back() {
				this.$router.back();
			},
			contrastsImg(index){
				this.$router.push({
					name: "imgShowduibi",
					params: {
						imgIndex:index,
						imgUrl:this.imgArr,
						resourceId:""
					}
				});
			}
		},
		computed: {
			...mapState({
				recordId: state => state.state.recordId,
				model: state => state.state.model,
				imgArr: state => state.state.imgArr
			})
		},
		created() {
			
		}
	})
</script>

<style scoped>
	.wrapper {
		color: #fff;
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
		background: rgb(82, 86, 89);
	}
	.imgduibiPlayer,.resoucetcContent{
		height: 100%;
	}
	
	.closefullscreen {
		position: absolute;
		top: -1px;
		right: 0;
		width: auto;
		height: auto;
		display: inline-block;
		background: transparent;
		box-shadow: none;
		border-radius: 0;
		border: 0;
		z-index: 999;
	}
	
	.exitResTc {
		font-size: 3rem !important;
		opacity: 1;
		cursor: pointer;
	}
	
	/* 对比 */
	/* SASS BASE CLASSES */
	.blocks .block {
	  position: absolute;
	  width: 50%;
	  height: 50%;
	}
	.blocks .top.block {
	  top: 0;
	}
	.blocks .right.block {
	  left: 50%;
	}
	.blocks .bot.block {
	  top: 50%;
	}
	.blocks .left.block {
	  left: 0;
	}
	
	.labelClose, .blocks #left-top:checked ~ .trigger.left.top, .blocks #right-top:checked ~ .trigger.right.top, .blocks #left-bot:checked ~ .trigger.left.bot, .blocks #right-bot:checked ~ .trigger.right.bot {
	  left: auto;
	  bottom: auto;
	  right: 0;
	  top: 0;
	  width: 30px;
	  height: 30px;
	  z-index: 101;
	  -webkit-animation: hideAndShow 1s;
	          animation: hideAndShow 1s;
	}
	.labelClose:before, .blocks #left-top:checked ~ .trigger.left.top:before, .blocks #right-top:checked ~ .trigger.right.top:before, .blocks #left-bot:checked ~ .trigger.left.bot:before, .blocks #right-bot:checked ~ .trigger.right.bot:before {
	  content: "+";
	  display: block;
	  position: absolute;
	  top: 5px;
	  right: 43px;
	  font-size: 50px;
	  line-height: 30px;
	  font-weight: bold;
	  color: #fff;
	  -webkit-transform: rotate(45deg);
	      -ms-transform: rotate(45deg);
	          transform: rotate(45deg);
	  -webkit-transition: 0.5s;
	          transition: 0.5s;
	}
	.labelClose:hover:before, .blocks #left-top:checked ~ .trigger.left.top:hover:before, .blocks #right-top:checked ~ .trigger.right.top:hover:before, .blocks #left-bot:checked ~ .trigger.left.bot:hover:before, .blocks #right-bot:checked ~ .trigger.right.bot:hover:before {
	  -webkit-transform: rotate(225deg);
	      -ms-transform: rotate(225deg);
	          transform: rotate(225deg);
	  color: red;
	}
	
	.activeBlock, .blocks #left-top:checked ~ .block.left.top, .blocks #right-top:checked ~ .block.right.top, .blocks #left-bot:checked ~ .block.left.bot, .blocks #right-bot:checked ~ .block.right.bot {
	  -webkit-transform: translateZ(0) scale(2.005);
	          transform: translateZ(0) scale(2.005);
	  z-index: 100;
	  overflow-x: hidden;
	  overflow-y: auto;
	}
	.activeBlock h1, .blocks #left-top:checked ~ .block.left.top h1, .blocks #right-top:checked ~ .block.right.top h1, .blocks #left-bot:checked ~ .block.left.bot h1, .blocks #right-bot:checked ~ .block.right.bot h1 {
	  opacity: 0;
	  z-index: 5;
	}
	.activeBlock .content, .blocks #left-top:checked ~ .block.left.top .content, .blocks #right-top:checked ~ .block.right.top .content, .blocks #left-bot:checked ~ .block.left.bot .content, .blocks #right-bot:checked ~ .block.right.bot .content {
	  opacity: 1;
	  z-index: 150;
	}
	
	/* END OF SASS BASE CLASSES */
	.blocks {
	  width: 100%;
	  height: 100%;
	  position: relative;
	  text-align: center;
	}
	.blocks .trigger {
	  z-index: 30;
	  cursor: pointer;
	}
	.blocks .trigger:hover + .block h1 {
	  color: #fff;
	}
	.blocks .block {
	  font-size: 14px;
	  -webkit-transition: 0.5s;
	          transition: 0.5s;
	  will-change: transform;
	  z-index: 5;
	  background-size: cover;
	}
	.blocks .block.left.top {
	  -webkit-transform-origin: 0% 0%;
	      -ms-transform-origin: 0% 0%;
	          transform-origin: 0% 0%;
	}
	.blocks .block.right.top {
	  -webkit-transform-origin: 100% 0%;
	      -ms-transform-origin: 100% 0%;
	          transform-origin: 100% 0%;
	}
	.blocks .block.left.bot {
	  -webkit-transform-origin: 0% 100%;
	      -ms-transform-origin: 0% 100%;
	          transform-origin: 0% 100%;
	}
	.blocks .block.right.bot {
	  -webkit-transform-origin: 100% 100%;
	      -ms-transform-origin: 100% 100%;
	          transform-origin: 100% 100%;
	}
	.blocks .block h1 {
	  position: absolute;
	  left: 50%;
	  top: 50%;
		width: 100%;
		height: 100%;
		overflow: hidden;
	  -webkit-transform: translateX(-50%) translateY(-50%);
	      -ms-transform: translateX(-50%) translateY(-50%);
	          transform: translateX(-50%) translateY(-50%);
	  text-transform: uppercase;
	  color: #aaa;
	  -webkit-transition: 0.5s;
	          transition: 0.5s;
	  will-change: opacity;
	}
	.blocks .block .content {
	  opacity: 0;
	  z-index: 1;
	  padding: 2em;
	  text-align: left;
	  -webkit-transition: 0.5s;
	  transition: 0.5s;
	  color: #fff;
	  background-color: rgb(82, 86, 89) !important;
	  will-change: opacity;
	}
	.blocks .block h1>img{
		width:100%;
	}
	
	.blocks .block .content h2 {
	  font-size: 2.5em;
	  margin-bottom: 1em;
	}
	
	.blocks .block .content h2 img{
	  position: absolute;
		left:0;
		top:0;
		right:0;
		bottom:0;
		margin:auto;
	}
	
	.blocks .block .content p {
	  font-size: 1em;
	  margin: 0.5em 0;
	}
	
	/* fix for position absolute label movement outside block */
	@-webkit-keyframes hideAndShow {
	  0% {
	    opacity: 0;
	  }
	  50% {
	    opacity: 0;
	    -webkit-transform: scale(0.5);
	            transform: scale(0.5);
	  }
	  90% {
	    -webkit-transform: scale(1.2);
	            transform: scale(1.2);
	  }
	  100% {
	    opacity: 1;
	    -webkit-transform: scale(1);
	            transform: scale(1);
	  }
	}
	@keyframes hideAndShow {
	  0% {
	    opacity: 0;
	  }
	  50% {
	    opacity: 0;
	    -webkit-transform: scale(0.5);
	            transform: scale(0.5);
	  }
	  90% {
	    -webkit-transform: scale(1.2);
	            transform: scale(1.2);
	  }
	  100% {
	    opacity: 1;
	    -webkit-transform: scale(1);
	            transform: scale(1);
	  }
	}
</style>
