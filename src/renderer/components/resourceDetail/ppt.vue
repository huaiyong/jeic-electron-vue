<template>
	 <div class="page-one" style="width:100%;height:100%;overflow: hidden;">
		<iframe :src="pptsrc" frameborder="0" id="pptsrc" style="width:100%;height:100%;"></iframe>
		<p class="welcome_user" style="display: none; z-index: 2;">幻灯片播放完毕!</p>
		<span class="closefullscreen fr" @click="closePpttc">
      <em class="iconfont icon-guanbi1 exitResTc"></em>
    </span>
    <span class="minimizeResources" id="wordMinimize" @click="min()">
        <em class="iconfont icon-zuixiaohua"></em>
      </span>
	</div>
</template>

<script>
  import $ from 'jquery';
  export default {
      name: 'page-one',
      data() {
          return {
            pptsrc:"" , //ppt展示路径
            isFirstEnter: false,
            resourceId: this.$route.params.resourceId,
            pptNumber:''
//			  imgUrl:'http://47.93.207.20/index.html?WOPISrc=http://172.17.26.104:8080/wopi/files/Resource/20190313/8af8595ef31e449eb796d227a5f3b70b_1552459639449.ppt'
          }
      },
      inject: ["reload"],
      created(){
      	this.isFirstEnter = true;
      },
	  mounted() {
	  	
	  },
      methods: {
      	  getRouterData() {
      	  	const that = this;
        this.$http.get(this.configure.showResourceIp + this.resourceId).then(function(res) {
				
        	that.pptsrc = res.data.result.viewURL.officeView;
        })
	      },
		  closePpttc(){
		  	this.$router.push({"name": "Resourceslist"});
		  	sessionStorage.removeItem("resourcepptId");
		  	this.reload()
		
		  },
		  min() {
		  	sessionStorage.setItem("resourcepptId",this.resourceId);
        $(this.$parent.$refs.indexItem).append("<li id='pptMax'><div><i class='iconfont icon-quanping'></i><p>ppt</p></div></li>");
        this.$router.push({"name":"Resourceslist"});
        this.isFirstEnter = false;
		  }
     },
     activated() {
			if (this.isFirstEnter) {
				this.getRouterData();
			};
			this.isFirstEnter = false;

		}
  }
</script>

<!-- <script>
	
</script> -->

<style scoped>
  .page-one{
    position: relative;
    z-index: 2;
  }
	.backLast{
		background: none;
		color:#fff;
		border:0;
		font-size:3rem;
		position: absolute;
		bottom:3rem;
		left:3rem;
	}
	
	.welcome_user {
		width: 36.5rem;
		height: 5.8rem;
		margin-top: 2.5rem;
		padding: 0 1.5rem;
		background: #2d2d2d;
		background: rgba(45, 45, 45, .8);
		-moz-border-radius: .6rem;
		-webkit-border-radius: .6rem;
		border-radius: .6rem;
		border: .1rem solid #3d3d3d;
		border: .1rem solid rgba(255, 255, 255, .15);
		-moz-box-shadow: 0 .2rem .3rem 0 rgba(0, 0, 0, .1) inset;
		-webkit-box-shadow: 0 .2rem .3rem 0 rgba(0, 0, 0, .1) inset;
		box-shadow: 0 .2rem .3rem 0 rgba(0, 0, 0, .1) inset;
		font-family: 'PT Sans', Helvetica, Arial, sans-serif;
		font-size: 2rem;
		color: #fff;
		text-shadow: 0 .1rem .2rem rgba(0, 0, 0, .1);
		-o-transition: all .2s;
		-moz-transition: all .2s;
		-webkit-transition: all .2s;
		line-height: 5.8rem;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
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
    z-index: 1;
  }
  .exitResTc {
    font-size: 3rem !important;
    opacity: 1;
    cursor: pointer;
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
  .minimizeResources {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 3rem;
    height: 2.6rem;
    padding-top:.4rem;
    display: inline-block;
    background: #fff;
    border-radius: .3rem;
    box-shadow: -1px 1px 20px 4px #1296db;
    border: 0;
    z-index: 2;
    cursor: pointer;
  }
  .minimizeResources>em {
    font-size: 3rem;
    color: #1296db;
  }  
</style>