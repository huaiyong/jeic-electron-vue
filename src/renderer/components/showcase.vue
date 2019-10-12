<template>
	<div class="wrapper">
		<div style="width:100%;height:100%;background: #000000;">
			<iframe :src="url" frameborder="0" style="width:100%;height:100%;"></iframe>
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
	export default {
		name: "showcase",
		data(){
			return {
				url: '',
			}
		},
		sockets: {
			zhantaiClose() {
				this.$router.push({
					"name": "Index"
				});
			}
		},
		methods: {
			back: function() {
				this.$router.back();
			}
		},
		computed: {
			...mapState({
				zhantai: state => state.state.zhantai,
			})
		},
		created() {
		
			this.url="http://localhost:3000/static/draw/zhantai.html?zhantaiid="+this.zhantai;
			// sessionStorage.setItem("zhantai",this.zhantai)
			// new PeerManager().peerInit()
		}
	}
</script>

<style scoped>
	.wrapper {
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
	}

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

	.colorfff {
		color: #fff;
	}

	#remoteVideosContainer {
		width: 100%;
		height: 100%;
	}

	#remoteVideosContainer video {
		width: 100%;
		height: 100%;
	}
</style>
