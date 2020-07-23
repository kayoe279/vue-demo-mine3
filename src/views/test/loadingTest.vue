<template>
  <!-- loading -->
  <div class="test">
    <h1>自定义Loading</h1>
    <div class="test-btn check-btn" @click="showOption=true">查看可配置项</div>
    <div class="test-btn" @click="ClickLoading('loading')">显示默认</div>
    <div class="test-btn" @click="ClickLoading('circle')">circle类型的loading</div>
    <div class="test-btn" @click="ClickLoading('loading','正在加载')">带文字的loading</div>
    <div class="test-btn" @click="ClickLoading('loading','黑色主题','dark')">黑色主题loading</div>
    <div class="test-btn" @click="ClickLoading('loading','请稍等','','cb')">可传回调</div>
    <div class="test-btn" @click="ClickCoverLoading">整页面显示loading</div>
    <v-popup v-model="showOption" mode="center" borderRadius="6">
      <div class="optionsContent">
        <p>
          <span>circleColor</span> 整页面loading颜色
        </p>
        <p>
          <span>circleWidth</span> 整页面loading宽度(默认50px)
        </p>
        <p>
          <span>circleHeight</span> 整页面loading高度(默认50px)
        </p>
        <p>
          <span>theme</span> 主题色(默认light),可选dark
        </p>
        <p>
          <span>title</span> loading文字
        </p>
        <p>
          <span>type</span> 模式选择(默认loading),可选:circle,success,warning
        </p>
        <p>
          <span>color</span> 动画活动区域的颜色，只对 type = circle 模式有效（默认#c7c7c7）
        </p>
        <p>
          <span>size</span> size 加载图标的大小，单位px(默认50px)
        </p>
        <p>
          <span>showLoading</span> 显示loading
        </p>
        <p>
          <span>hideLoading</span> 隐藏loading
        </p>
        <pre>
调用例子:
this.$loading.showLoading("宇宙爆炸帅");
this.$loading.hideLoading(()=>{
  console.log(我是回调)
});

        </pre>
      </div>
    </v-popup>
  </div>
</template>

<script>
export default {
  name: "loadingTest",
  data() {
    return {
      index: 0,
      showOption: false
    };
  },
  methods: {
    ClickLoading(type, title, theme, cb) {
      this.$loading.showLoading({ type, title, theme });
      setTimeout(() => {
        this.$loading.hideLoading(() => {
          if (cb) {
            this.$toast("我是加载完成后调用的(#^.^#)");
          }
        });
      }, 3000);
    },
    ClickCoverLoading() {
      this.$loading.coverLoading();
      setTimeout(() => {
        this.$loading.hideLoading();
      }, 2000);
    }
  },
  mounted() {
    this.ClickCoverLoading();
  }
};
</script>
<style lang="css">
.test {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 0.3rem 0;
  overflow-y: auto;
}
.test h1 {
  font-size: 0.4rem;
  font-weight: 550;
  margin-bottom: 0.4rem;
}
.test .btn {
  width: 80%;
  padding: 0.3rem;
  background-color: teal;
  color: #ffffff;
  font-size: 0.38rem;
  margin: 0.3rem auto 0.3rem;
  border-radius: 0.12rem;
}
.content {
  height: 300px;
  text-align: left;
  padding: 0.3rem;
}
</style>