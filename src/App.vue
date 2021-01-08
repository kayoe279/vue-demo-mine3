<template>
	<div id="app">
		<keep-alive :include="include">
			<router-view v-if="$route.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!$route.keepAlive"></router-view>
	</div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return {
      include:[] // 动态组件
    }
  },
	created() {
		console.log(window.navigator.userAgent); // 设备信息
	},
};
</script>
