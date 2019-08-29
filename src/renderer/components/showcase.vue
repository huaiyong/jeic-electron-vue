<template>
	<div class="wrapper">
		<div style="width:100%;height:100%;background: #000000;">
			<div id="remoteVideosContainer"></div>
			<span class="closefullscreen fr" @click="back">
				<em class="iconfont icon-guanbi1 exitResTc colorfff"></em>
			</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: "showcase",
		methods: {
			back: function() {
				this.$router.back();
			}
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
