<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    console.log(window.navigator.userAgent); // 设备信息
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "PingFang Regular";
  src: url("./assets/ttf/PingFang Regular.ttf");
}
body,
html,
#app {
  width: 100%;
  height: 100%;
  background-color: #fff;
  text-align: center;
  font-size: 0.28rem;
  font-family: "PingFang Regular";
  line-height: 1.2 !important;
  overflow-y: auto !important;
}
button {
  font-family: "PingFang Regular" !important;
}
a {
  font-family: "PingFang Regular" !important;
}
</style>
