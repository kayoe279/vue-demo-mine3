<template>
  <!-- 模态框alert,confirm测试 -->
  <div class="test">
    <h1>自定义Modal</h1>
    <div class="test-btn check-btn" @click="showOption=true">查看可配置项</div>
    <div class="test-btn" @click="ClickModal('alert')">显示alert</div>
    <div class="test-btn" @click="ClickModal('confirm')">显示confirm</div>
    <div class="test-btn" @click="ClickModal('confirm','promise')">Promise调用的confirm</div>
    <div class="test-btn" @click="ClickModal('confirm','',true)">异步关闭confirm</div>
    <div class="test-btn" @click="ClickModal('confirm','',true,'clear')">异步不关闭弹窗,清空状态</div>
    <div class="tips">异步关闭的好处是可做一些操作之后手动调用关闭方法</div>
    <div class="test-btn" @click="ClickModalCustom()">自定义内容(html片段)</div>
    <div class="test-btn" @click="toggleZoom()">切换动画</div>
    <v-popup v-model="showOption" mode="center" borderRadius="6">
      <div class="optionsContent">
        <p>
          <span>maskCloseAble</span> 点击遮罩是否关闭(默认false)
        </p>
        <p>
          <span>title</span> 标题(默认"提示")
        </p>
        <p>
          <span>content</span> 内容(默认"内容")
        </p>
        <p>
          <span>showTitle</span> 是否显示标题(默认true)
        </p>
        <p>
          <span>showConfirmButton</span> 是否显示确认按钮(默认true)
        </p>
        <p>
          <span>showCancelButton</span> 是否显示取消按钮(默认false)
        </p>
        <p>
          <span>confirmText</span> 确认按钮文案(默认"确认")
        </p>
        <p>
          <span>cancelText</span> 是否显示标题(默认"取消")
        </p>
        <p>
          <span>confirmColor</span> 确认文字颜色(默认"#2979ff")
        </p>
        <p>
          <span>cancelColor</span> 取消文字颜色(默认"#606266")
        </p>
        <p>
          <span>confirmStyle</span>
          自定义确认按钮样式(默认{})
        </p>
        <p>
          <span>cancelStyle</span>
          自定义取消按钮样式(默认{})
        </p>
        <p>
          <span>width</span> 弹窗宽度,单位px/auto/%,最大300px(默认"260px")
        </p>
        <p>
          <span>borderRadius</span>弹窗圆角,单位px(默认6px)
        </p>
        <p>
          <span>asyncClose</span> 是否异步关闭,只对确认按钮有效,需要手调用close才能关闭
        </p>
        <p>
          <span>confrim</span> 点击确认事件
        </p>
        <p>
          <span>cancel</span> 点击取消事件
        </p>
        <p>
          <span>close</span> 手动关闭弹窗 this.$modal.close()
        </p>
        <p>
          <span>clearLoading</span> 手动清空异步动画 this.$modal.clearLoading()
        </p>
        <pre>
        调用例子:
        this.$modal({ 
          content: "我是宇宙无敌爆炸帅",
          confirm()=>{},
          cancell()=>{}
        })
        </pre>
      </div>
    </v-popup>
  </div>
</template>

<script>
export default {
  name: "modalTest",
  data() {
    return {
      index: 0,
      showOption: false,
      zoomOut: true,
    };
  },
  methods: {
    ClickModal(type, way, isAsync, status) {
      let that = this;
      if (way == "promise") {
        this.$showModal({
          content: "我是通过promise调用的",
          showCancelButton: type == "confirm",
          confirmText: "点我",
          cancelText: "关闭",
        })
          .then((rlt) => {
            console.log("确认点我");
          })
          .catch((rlt) => {
            console.log("取消");
          });
      } else {
        this.$showModal({
          title: "注意",
          content: "我是宇宙无敌爆炸帅",
          showCancelButton: type == "confirm",
          asyncClose: !!isAsync,
          confirm() {
            if (!!isAsync) {
              setTimeout(() => {
                if (status == "clear") {
                  that.$modal.clearLoading();
                } else {
                  that.$modal.close();
                  that.$toast("确认按钮(confirm异步)");
                }
              }, 1000);
            } else {
              that.$toast(
                type == "alert" ? "确认按钮(alert)" : "确认按钮(confirm)"
              );
            }
          },
          cancel() {
            console.log("取消按钮");
          },
        });
      }
    },
    ClickModalCustom() {
      let that = this;
      this.$modal({
        title: "提示",
        content: `<img src=${require("../../assets/img/cqObject-icon.png")} alt=''>`, // 传入html片段
        showCancelButton: true,
        confirm() {
          that.$toast("确认按钮");
        },
        cancel() {
          console.log("取消按钮");
        },
      });
    },
    // 切换动画
    toggleZoom() {
      this.$modal({
        title: "提示",
        content: this.zoomOut ? "有里向外缩放" : "由外向里缩放",
        zoomOut: this.zoomOut,
        showCancelButton: true,
        confirm:()=> {
          console.log("confirm")
          setTimeout(() => {
            this.zoomOut = !this.zoomOut;
          }, 500);
        },
        cancel:()=> {
          setTimeout(() => {
            this.zoomOut = !this.zoomOut;
          }, 500);
        },
        success: (res) => {
          if (res == "confirm") {
            console.log("success-confirm");
          } else {
            console.log("success-cancel");
          }
        },
      });
    },
  },
  mounted() {},
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
.test .tips {
  color: sandybrown;
}
</style>