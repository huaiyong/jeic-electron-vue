<template>
	<div class="wrapper">
		<div style="width:100%;height:100%;background: #000000;">
			<ul class="ziyuanul">
			    <li style="width:20rem;display: inline-block;margin: 2rem;" v-for="i in studentFileList" @click="showstuimgResoce(i.resource_url)"> 
			        <img :src="i.resource_url" style="width:20rem">
					<p class="filetext_title" ng-bind="i.resourceName"></p>
			    </li>
			</ul>
			<!-- <iframe :src="url" frameborder="0" style="width:100%;height:100%;"></iframe> -->
			<span class="closefullscreen fr" @click="back">
				<em class="iconfont icon-guanbi1 exitResTc colorfff"></em>
			</span>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	
	export default ({
		name: "studentUploadImg",
		data:function(){
			return{
				studentFileList:[]
			}
		},
		sockets:{
		  closeStuPicTC(){
			  this.back();
		  },
		  clickStuPicUrl(data){
			  this.showstuimgResoce(data)
		  }
		},
		methods: {
			back() {
				this.$router.back();
			},
			getParams() {
				var that=this;
				var routerParams = this.$route.query.id; // 取到路由带过来的参数 
				var classRecordId=  this.$route.query.classRecordId; // 取到路由带过来的参数 
				this.$http.get("http://localhost:3000/jeic/api/studentPad/findStudentUploadPicture?classRecordId="+classRecordId+"&stuId="+routerParams).then(function(res){
					that.studentFileList=res.data.data
				});
			},
			showstuimgResoce(imgsrc){
				this.$router.push({
					"name":"picShow",
					 params: {
							imgsrc: imgsrc,
						}
				})
			}
		},
		created() {
			this.getParams()
		},
		watch: {
			// 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
			'$route': 'getParams',
		}
	})
</script>

<style scoped="scoped">
	.wrapper {
		color: #fff;
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
		background: rgb(82, 86, 89);
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
</style>