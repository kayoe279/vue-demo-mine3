
<template>
  <!-- 模态框 alert和confirm -->
  <div class="v-modal-wrap">
    <div
      class="v-mask"
      :class="{'v-mask-show': showMask}"
      @click="maskClick"
      @touchmove.stop.prevent
    ></div>
    <div
      class="v-modal-box"
      :class="[showModal ? 'v-modal-box-visible' : '']"
      @touchmove.stop.prevent
      @click.stop="maskClick"
    >
      <div class="v-modal v-animation-zoom" :style="centerStyle">
        <div v-if="showTitle" class="v-modal-title">{{ title }}</div>
        <div class="v-modal-content">
          <div class="v-modal-content-meeeage" v-if="!!isContentHtml" v-html="content"></div>
          <div class="v-modal-content-meeeage" v-else>{{ content }}</div>
        </div>
        <div class="v-modal-footer">
          <div
            v-if="showCancelButton"
            class="v-modal-footer-button"
            :style="quxiaoStyle"
            type="default"
            @click.stop="cancel"
          >{{cancelText}}</div>
          <div
            v-if="showConfirmButton"
            class="v-modal-footer-button confirm-btn"
            :style="querenStyle"
            @click.stop="confirm"
          >
            <span
              v-if="loading"
              class="asyncLoading"
              :style="{'border-color':confirmColor+' '+confirmColor+' '+confirmColor+' '+'#8f8d8e'}"
            ></span>
            <span v-else>{{confirmText}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "vModal",
  data() {
    return {
      showModal: false, // 绑定显示隐藏
      mask: true, //是否显示遮罩,默认true
      maskCloseAble: false, //是否点击遮罩隐藏,默认false
      title: "提示", //标题
      content: "内容", //内容(可以传入html标签)
      showTitle: true, //是否显示标题
      showConfirmButton: true, //是否显示确认按钮,默认true
      showCancelButton: false, //是否显示取消按钮,默认false
      confirmText: "确认", //确认按钮文案
      cancelText: "取消", //取消按钮文案
      confirmColor: "#2979ff", //确认文字颜色
      cancelColor: "#606266", //取消文字颜色
      confirmStyle: {}, //确认按钮样式
      cancelStyle: {}, //取消按钮样式
      width: "260px", //弹窗宽度,单位px/auto
      borderRadius: 6, //弹窗圆角,默认6px
      asyncClose: false, //是否异步关闭,只对确认按钮有效 ,需要手调用close才能关闭
      loading: false //确认正在加载
    };
  },
  computed: {
    showMask() {
      return this.showModal && this.mask;
    },
    // 判断传入的内容是否为html片段
    isContentHtml() {
      return /<\/?[\s\S]*?(?:".*")*>/g.test(this.content);
    },
    // 弹窗的样式
    centerStyle() {
      let style = {
        width: this.width ? this.getUnitValue(this.width) : "auto",
        "min-width": "260px",
        "max-width": "300px"
      };
      if (this.borderRadius) {
        style.borderRadius = `${this.borderRadius}px`;
        style.overflow = "hidden";
      }
      return style;
    },
    // 取消按钮样式
    quxiaoStyle() {
      return {
        ...this.cancelStyle,
        color: this.cancelColor
      };
    },
    // 确认按钮样式
    querenStyle() {
      return {
        ...this.confirmStyle,
        color: this.confirmColor
      };
    }
  },
  methods: {
    // 判断传入的值，是否带有单位，如果没有，就默认用px单位
    getUnitValue(val) {
      if (/(%|px|auto)$/.test(val)) return val;
      else return val + "px";
    },
    // 遮罩被点击
    maskClick() {
      if (!this.maskCloseAble) return;
      this.cancel();
    },
    confirm() {
      this.showModal = false;
    },
    cancel() {
      this.showModal = false;
    },
    // 重置data对象到初始化状态
    setDefaultOptions() {
      Object.assign(this.$data, this.$options.data());
    }
  }
};
</script>

<style scoped>
/* 遮罩 */
.v-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  visibility: hidden;
}

.v-mask-show {
  opacity: 1;
  visibility: visible;
}

/* 内容 */
.v-modal-box {
  position: absolute;
  box-sizing: border-box;
  transform-origin: center;
  transition: all 0.3s ease-in-out;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  justify-content: center;
  align-items: center;
  opacity: 0;
  z-index: 2000;
}

.v-modal-box-visible {
  transform: translate3d(0, 0, 0) !important;
  visibility: visible;
  opacity: 1;
}

.v-modal-box .v-modal {
  background-color: #fff;
  transition: all 0.3s ease-in-out;
}
.v-animation-zoom {
  transform: scale(1.2);
}

.v-modal-box-visible .v-modal {
  transform: scale(1);
  opacity: 1;
}

.v-modal .v-modal-title {
  padding-top: 15px;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  color: #303133;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.v-modal .v-modal-content-meeeage {
  padding: 14px;
  font-size: 15px;
  text-align: center;
  color: #303133;
}
.v-modal .v-modal-content-meeeage img {
  width: 30px;
  height: 30px;
}
.v-modal .v-modal-footer {
  display: flex;
  position: relative;
}
.v-modal .v-modal-footer .v-modal-footer-button {
  flex: 1;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  border-radius: 2px;
  color: #606266;
}
.v-modal .v-modal-footer .v-modal-footer-button.confirm-btn {
  color: #2979ff !important;
}
.v-modal .v-modal-footer .v-modal-footer-button .asyncLoading {
  display: inline-block;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  background: 0 0;
  border-radius: 50%;
  border: 2px solid;
  border-color: #e5e5e5 #e5e5e5 #e5e5e5 #c3c4c5;
  animation: v-circle 1s linear infinite;
}
.v-modal .v-modal-footer::after {
  content: "";
  width: 100%;
  height: 1px;
  background-color: #e7e7e8;
  transform: scaleY(0.5);
  position: absolute;
  top: 0;
  left: 0;
}

@-webkit-keyframes v-circle {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
