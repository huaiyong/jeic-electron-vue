<template>
	<div class="maskBox">
		<div class="chooseGroup mask">
		  <div class="head">
		    <span>投票</span>
			<i class="iconfont icon-shanchu1" @click="closeVote()"></i>
		  </div>
		  <ul class="groupBox clearfix">
		    <li @click="voteRoute()">
				<span><i class="iconfont icon-toupiao3"></i></span>
				<strong>自定义投票</strong>
			</li>
		    <li @click="gotoXuanju()">
				<span><i class="iconfont icon-toupiao-"></i></span>
				<strong>班级选举</strong>
			</li> 
		  </ul>
		</div>
	</div>
</template>

<script>
	export default{
		name:"chooseMode",
		methods:{
			closeVote(){
				this.$router.back();
			},
			voteRoute(){
				this.$router.push({name:"customVote"});
			},
			gotoXuanju(){
				this.$router.push({name:"xuanju"});
			}
		}
	}
</script>

<style scoped="scoped">
	.maskBox{position: absolute;top: 0;right: 0;bottom: 0;left: 0;background:rgba(0,0,0,0.4);z-index: 3;}
	.maskBox .chooseGroup{width: 70rem; height: 40rem;background: #888888;border-radius: .6rem;margin:2rem auto;}
	.maskBox .chooseGroup .head{width: 100%; height: 5.7812rem; line-height: 5.7812rem; background: -webkit-gradient( linear, 0% 0%, 0% 100%, from(#e8e6e7), to(#d2d0d3), color-stop(0.5, #dbd9dc) ); padding-left: 3rem; box-sizing: border-box; border-top-left-radius: .6rem; border-top-right-radius: .6rem;}
	.maskBox .chooseGroup .head span{font-size: 1.45rem; height: 3.2291rem; padding:0 1rem; line-height: 3.2291rem; border: .1rem solid #acacac; border-radius: 5px; font-size: 1.6rem; text-align: center; background: #fff; margin-top: 1.4rem; display: inline-block;}
	.maskBox .chooseGroup .head i{font-size: 2.5rem;color: red;margin-right: 1.6rem;float:right;cursor: pointer;}
	.maskBox .chooseGroup .groupBox{padding-top: 4rem;}
	.maskBox .chooseGroup .groupBox li{float: left; width: 24%; text-align: center; cursor: pointer; padding: 10px;}
	.maskBox .chooseGroup .groupBox li:hover{border-radius: 5px; box-shadow: 0px 0px 30px #ccc; animation-name: shake-slow; animation-duration: 5s; animation-timing-function: ease-in-out; animation-iteration-count: infinite;}
	.maskBox .chooseGroup .groupBox li:first-child{margin-left: 11rem; margin-right: 13rem;}
	.maskBox .chooseGroup .groupBox li span{display: inline-block; width: 15.6rem; height: 15.6rem; border-radius: 50%; background: #4092f4; text-align: center; padding-top: 4.2rem; box-sizing: border-box;}
	.maskBox .chooseGroup .groupBox li span i{font-size: 8rem; color: #fff;}
	.maskBox .chooseGroup .groupBox li strong{font-size: 1.6rem; color: #fff; margin-top: 3rem; margin-bottom: 0.6rem; display: block;}
</style>
