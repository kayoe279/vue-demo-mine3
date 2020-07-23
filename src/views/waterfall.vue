<template>
  <div id="waterfall">
    <div class="title">{{title}}</div>
    <vueWaterfallEasy
      ref="waterfall"
      :imgsArr="imgsArr"
      :mobileGap="20"
      @scrollReachBottom="getData"
      :enablePullDownEvent="true"
      @pullDownMove="pullDownMove"
      @pullDownEnd="pullDownEnd"
    ></vueWaterfallEasy>
  </div>
</template>

<script>
import vueWaterfallEasy from "vue-waterfall-easy";
import axios from "axios";
export default {
  name: "waterfall",
  components: {
    vueWaterfallEasy
  },
  data: () => ({
    title: "瀑布流布局waterfall",
    group: 0,
    imgsArr: [],
    pullDownDistance: 0
  }),
  methods: {
    getData() {
      axios.get("./static/mock/data.json?group=" + this.group).then(res => {
        this.group++;
        if (this.group == 5) {
          this.$refs.waterfall.waterfallOver();
          return;
        }
        this.imgsArr = this.imgsArr.concat(res.data);
      });
    },
    pullDownMove(pullDownDistance) {
      console.log("pullDownDistance", pullDownDistance); // 不是很好用 先放着吧
      this.pullDownDistance = pullDownDistance;
    },
    pullDownEnd(pullDownDistance) {
      console.log("pullDownEnd");
      if (this.pullDownDistance > 50) {
        console.log("下拉刷新");
      }
      this.pullDownDistance = 0;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="scss">
#app {
  overflow: hidden;
}
#waterfall {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
#waterfall .title {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  font-size: 20px;
}
.vue-waterfall-easy-container {
  height: calc(100% - 40px) !important;
}
</style>