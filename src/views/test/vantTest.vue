<template>
  <div class="vantTest">
    <!-- vant 可用组件  tab picker date-picker  popup 等等 -->
    <!-- <van-uploader v-model="fileList" multiple :after-read="afterRead" /> -->
    <van-tabs
      v-model="tabIndex"
      animated
      title-active-color="#55aaff"
      title-inactive-color="#000"
      color="#55aaff"
      line-width="20px"
      @click="selectTab"
      swipeable
    >
      <van-tab title-style="font-size:0.28rem;line-height:0.88rem" :title="item" v-for="(item, index) in tabs" :key="index">
        <list :tabIndex="index" :label="label"></list>
      </van-tab>
    </van-tabs>
    <div class="filter">筛选容器</div>
  </div>
</template>

<script>
import List from "../../components/shareComponents/List";
export default {
  name: "VantTest",
  components: {
    List
  },
  data() {
    return {
      fileList: [],
      tabs: ["随手拍", "政企直通车", "事件照片", "事件整改"],
      tabIndex: 0,
      label: ""
    };
  },
  methods: {
    afterRead(file) {
      console.log(file);
    },
    selectTab(index) {
      this.tabIndex = index;
    }
  }
};
</script>

<style lang="css">
.vantTest {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f1f5f7;
  position: relative;
}
/*tab样式 */
.van-tabs.van-tabs--line {
  height: 100%;
  overflow: hidden;
}
.van-tabs .van-tabs__wrap.van-hairline--top-bottom {
  height: 0.88rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 200;
}
.van-tabs .van-tabs__content {
  height: 100% !important;
}
.van-tabs .van-tab__pane {
  height: 100%;
}
.van-tabs .van-tabs__content {
  padding-top: 1.78rem;
}



.filter {
  position: fixed;
  top: 0.88rem;
  left: 0;
  width: 100%;
  height: 0.9rem;
  line-height: 0.9rem;
  background-color: #fff;
  border-bottom: 0.02rem solid #ebedf0;
}
</style>