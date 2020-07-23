<template>
  <!-- toast组件测试 -->
  <div class="test">
    <h1>自定义Toast</h1>
    <div class="test-btn check-btn" @click="showOption=true">查看可配置项</div>
    <div class="test-btn" @click="ClickToast('middle')">middle</div>
    <div class="test-btn" @click="ClickToast('top')">top</div>
    <div class="test-btn" @click="ClickToast('bottom')">bottom</div>
    <div
      class="test-btn"
      @click="ClickToast('middle','我是一条长文字我是一条长文字我是一条长文字我是一条长文字我是一条长文字我是一条长文字我是一条长文字')"
    >长文字</div>
    <div class="test-btn" @click="ClickToast('middle','成功提示','success')">成功提示</div>
    <div class="test-btn" @click="ClickToast('middle','警告提示','warning')">警告提示</div>
    <v-popup v-model="showOption" mode="center" borderRadius="6">
      <div class="optionsContent">
        <p>
          <span>title</span> toast标题文字
        </p>
        <p>
          <span>position</span> 位置(默认middle),可选:top,bottom
        </p>
        <p>
          <span>type</span> 模式选择(默认toast),可选:success,warning(这两种情况position固定为middle)
        </p>
        <p>
          <span>duration</span> toast显示时间,单位ms(默认1500)
        </p>
        <p>
          <span>callback</span> 第二个参数可以传callback
        </p>
        <pre>
调用例子:
this.$toast("宇宙爆炸帅",()=>{
  console.log(我是回调)
})
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
    ClickToast(position, title, type) {
      this.$toast({ title: title || "一个toast模块", position, type });
    }
  },
  mounted() {}
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
.content {
  height: 300px;
  text-align: left;
  padding: 0.3rem;
}
</style>