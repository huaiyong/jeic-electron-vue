<template>
    <div class="page-one" style="width:100%;height:100%;overflow: hidden;">
		<iframe :src="pdfsrc" frameborder="0" style="width:100%;height:100%;"></iframe>
		<span class="closefullscreen fr" @click="closePdftc">
      <em class="iconfont icon-guanbi1 exitResTc"></em>
    </span>
    </div>
	
</template>

<script>
  export default {
    name: 'page-one',
    data() {
        return {
		      pdfsrc: '', //pdf展示路径
        }
    },
    inject: ["reload"],
    methods: {
	    closePdftc () {
        this.$router.push({"name": "Resourceslist"});
        this.reload();
      },
      getRouterData() {
        this.pdfsrc = this.$route.params.pdfsrc;
      }
    },
    created() {
        this.getRouterData();
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
</style>