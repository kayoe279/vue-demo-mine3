<template>
  <!-- 组件测试 -->
  <div class="test">
    <h1>自定义popup</h1>
    <div class="test-btn check-btn" @click="showOption=true">查看可配置项</div>
    <div class="test-btn" @click="showPopupTop=true">上</div>
    <div class="test-btn" @click="showPopupBottom=true">下</div>
    <div class="test-btn" @click="showPopupLeft=true">左</div>
    <div class="test-btn" @click="showPopupRight=true">右</div>
    <div class="test-btn" @click="showPopupCenter=true">中</div>
    <v-popup v-model="showPopupTop" mode="top" borderRadius="12">
      <div class="content">
        <p>除了长得好看一无是处的我</p>
        <p>也就是宇宙无敌爆炸帅的我!</p>
      </div>
    </v-popup>
    <v-popup v-model="showPopupBottom" mode="bottom" borderRadius="12">
      <div class="content">
        <p>除了长得好看一无是处的我</p>
        <p>也就是宇宙无敌爆炸帅的我!</p>
      </div>
    </v-popup>
    <v-popup v-model="showPopupLeft" mode="left">
      <div class="content">
        <p>除了长得好看一无是处的我</p>
        <p>也就是宇宙无敌爆炸帅的我!</p>
      </div>
    </v-popup>
    <v-popup v-model="showPopupRight" mode="right">
      <div class="content">
        <p>除了长得好看一无是处的我</p>
        <p>也就是宇宙无敌爆炸帅的我!</p>
      </div>
    </v-popup>
    <v-popup v-model="showPopupCenter" mode="center" borderRadius="6">
      <div class="content" style="height:200px">
        <p>除了长得好看一无是处的我</p>
        <p>也就是宇宙无敌爆炸帅的我!</p>
      </div>
    </v-popup>
    <v-popup v-model="showOption" mode="center" borderRadius="6">
      <div class="optionsContent">
        <p>
          <span>v-model</span> 绑定弹窗显示隐藏
        </p>
        <p>
          <span>mode</span> 弹出方向(默认bottom),可选:top,center,left,right
        </p>
        <p>
          <span>mask</span> 是否显示遮罩(默认true)
        </p>
        <p>
          <span>maskCloseAble</span>是否点击遮罩关闭(默认true)
        </p>
        <p>
          <span>width</span>  宽度，只对左，右，中部弹出时起作用，单位px，或者"auto"
        </p>
        <p>
          <span>height</span> 高度，只对上，下，中部弹出时起作用，单位px，或者"auto"
        </p>
      </div>
    </v-popup>
  </div>
</template>

<script>
export default {
  name: "popupTest",
  data() {
    return {
      showPopupTop: false,
      showPopupBottom: false,
      showPopupLeft: false,
      showPopupRight: false,
      showPopupCenter: false,
      showOption: false
    };
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="css">
.test {
  width: 100%;
  height: 100%;
  background-color: #f5f8fa;
  padding: 0.3rem 0;
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