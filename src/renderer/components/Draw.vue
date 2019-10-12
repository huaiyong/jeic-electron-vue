<template>
	<div style="width:100%;height:100%;position: relative;z-index: 2;">
	    <iframe src="http://localhost:3000/static/draw/draw.html" frameborder="0" style="width:100%;height:100%;"></iframe>
		<span class="closefullscreen fr" @click="back">
        <em class="iconfont icon-guanbi1 exitResTc"></em>
      </span>
	</div>
</template>

<script>
	
	import {
			mapState
		} from "vuex";

	export default{
		name:"Draw",
		sockets: {
			closeDraw(){
				this.back()
			}
		},
		methods:{
			back:function(){
				this.$router.push({
					"name": "Index"
				});
			}
		}
	}
</script>

<style scoped>
.closefullscreen {
    position: absolute;
    top: 0;
    right: 0;
    width: auto;
    height: auto;
    color: #09c;
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
