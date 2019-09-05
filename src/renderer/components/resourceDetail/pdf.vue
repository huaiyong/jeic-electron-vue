<template>
    <div class="page-one" style="width:100%;height:100%;overflow: hidden;">
		<iframe :src="pdfsrc" frameborder="0" style="width:100%;height:100%;"></iframe>
		<span class="closefullscreen fr" @click="closePdftc">
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
		      pdfsrc: '', //pdf展示路径
		      resourceId:'',
		      isFirstEnter: false
        }
    },
    sockets: {
			closePdf() {
				this.closePdftc();
			},
			minimizePdf() {
				this.min();
			}
		},
    methods: {
	    closePdftc () {
        this.$router.push({"name": "Resourceslist"});
        this.isFirstEnter = true;
        this.pdfsrc = "";
        sessionStorage.removeItem("resourcePdfId");
        sessionStorage.removeItem("resourcePdfUrl");
      },
      getRouterData() {
        this.pdfsrc = this.$route.params.pdfsrc;
        this.resourceId = this.$route.params.resourceId;
        console.log(this.resourceId,'id');
        console.log(this.pdfsrc,'src')
      },
      min(){
        sessionStorage.setItem("resourcePdfId",this.resourceId);
        sessionStorage.setItem("resourcePdfUrl",this.pdfsrc);
        $(this.$parent.$refs.indexItem).append("<li id='pdfMax'><div><i class='iconfont icon-quanping'></i><p>pdf</p></div></li>");
        this.$router.push({"name":"Resourceslist"});
        this.isFirstEnter = false;
      }
    },
    created() {
      this.isFirstEnter = true;
    },
    activated() {
      if (this.isFirstEnter) {
        this.getRouterData();
      };
      this.isFirstEnter = false;
    }
  }
</script>

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
    padding-top:.4rem;
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
</style>