<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
</script>

<style>
	html,
	body,
	#app {
		height: 100%;
		background: url("./assets/img/bigBg.jpg");
		background-size: cover;
	}
	::-webkit-scrollbar {
		width: 5px;
	}

	/* 滚动槽 */
	::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		border-radius: 5px;
	}

	/* 滚动条滑块 */
	::-webkit-scrollbar-thumb {
		border-radius: 5px;
		background: #000;
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
	}

	::-webkit-scrollbar-thumb:window-inactive {
		background: #000;
	}
</style>
