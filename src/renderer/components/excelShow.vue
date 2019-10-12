<template>
	<div style="width:100%;height:100%;" class="resouceBg" v-show="excelState">
		<iframe :src="'http://localhost:3000/static/draw/excel.html?resourceId='+this.excelId" frameborder="0" style="width:100%;height:100%;"></iframe>
		<span class="closefullscreen fr" @click="closeWordtc">
			<em class="iconfont icon-guanbi1 exitResTc"></em>
		</span>
		<span class="minimizeResources" id="wordMinimize" @click="min">
			<em class="iconfont icon-zuixiaohua"></em>
		</span>
	</div>
</template>

<script>
	import $ from 'jquery';
	import {
		mapState
	} from "vuex";
	export default {
		name: "wordShow",
		data() {
			return {}
		},
		sockets: {
			minimizeExcel() {
				this.min();
			},
			closeexceltc() {
				this.closeWordtc()
			}
		},
		computed: {
			...mapState({
				excelId: state => state.state.excelId,
				excelState:state => state.state.excelState
			})
		},
		methods: {

			closeWordtc() {
				this.$store.dispatch("getExcelHave",false);
				this.$store.dispatch("getExcelState",true);
			},
			min() {
				sessionStorage.setItem("resourceexcelId", this.excelId);
				$(this.$parent.$refs.indexItem).append(
					"<li id='excelMax'><div><i class='iconfont icon-quanping'></i><p>excel</p></div></li>");
		        this.$store.dispatch("getExcelState",false);
			}
		},
		
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
		overflow: hidden;
		box-sizing: border-box;
		z-index: 3;
	}

	.closefullscreen {
		position: absolute;
		top: 0;
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
		z-index: 2;
		cursor: pointer;
	}

	.minimizeResources>em {
		font-size: 3rem;
		color: #1296db;
	}
</style>
