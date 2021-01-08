<template>
  <div
    class="v-loading-wrap"
    v-if="show"
    @touchmove.stop.prevent
    :class="{'v-loading-wrap-white':isCover}"
  >
    <div v-if="isCover" class="v-loading-box">
      <svg viewBox="0 0 50 50" class="circular" :style="coverCircleStyle">
        <circle cx="25" cy="25" r="20" fill="none" class="path" :stroke="circleColor" />
      </svg>
      <div class="v-loading-title" :style="{'color':circleColor}" v-if="title">{{title}}</div>
    </div>
    <div v-else class="v-loading-box" :class="[!!title?'title':'',theme]">
      <div class="v-loading" :class="'v-loading-' + type" :style="[circleStyle]"></div>
      <div class="v-loading-title" v-if="title">{{title}}</div>
    </div>
  </div>
</template>

<script>
/**
 * loading 加载动画
 * @description 此组件为一个小动画
 * @data {Boolean} isCover 是否覆盖整个页面loading,默认false(内置属性)
 * @data {String} circleColor isCover下,loading的颜色
 * @data {String} circleWidth isCover下,loading的宽度,默认50px
 * @data {String} circleHeight isCover下,loading的高度,默认50px
 * @data {String} theme 主题色,仅有light/dark
 * @data {Boolean} show 是否显示动画
 * @data {String} title loading文字
 * @data {String} type 模式选择默认loading加载中(可选circle) success成功 warning警告
 * @data {String} color 动画活动区域的颜色，只对 type = circle 模式有效（默认#c7c7c7）
 * @data {String Number} size 加载图标的大小，单位px
 */
export default {
  name: "vLoading",
  data() {
    return {
      isCover: false,
      circleColor: "#409EFF",
      circleWidth: "50px",
      circleHeight: "50px",
      theme: "light",
      show: false,
      title: "",
      type: "loading",
      color: "#c7c7c7",
      size: "40"//动画大小
    };
  },
  computed: {
    coverCircleStyle() {
      return {
        width: this.getUnitValue(this.circleWidth),
        height: this.getUnitValue(this.circleHeight)
      };
    },
    // 加载中圈动画的样式
    circleStyle() {
      let style = {};
      if (this.type == "circle") {
        style.width = parseInt(this.size * 0.6) + "px";
        style.height = parseInt(this.size * 0.6) + "px";
        style.borderColor = `#e4e4e4 #e4e4e4 #e4e4e4 ${
          this.color ? this.color : "#c7c7c7"
        }`;
      } else if (this.type == "warning") {
        style.width = parseInt(this.size * 0.6) + "px";
        style.height = parseInt(this.size * 0.6) + "px";
      } else {
        style.width = this.size + "px";
        style.height = this.size + "px";
      }
      return style;
    }
  },
  methods: {
    // 判断传入的值，是否带有单位，如果没有，就默认用px单位
    getUnitValue(val) {
      if (/(%|px|auto)$/.test(val)) return val;
      else return val + "px";
    },
    showLoading() {
      this.show = true;
    },
    hideLoading() {
      this.show = false;
    },
    // 重置data对象到初始化状态
    setDefaultOptions() {
      Object.assign(this.$data, this.$options.data());
    }
  }
};
</script>

<style scoped>
.v-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-loading-wrap.v-loading-wrap-white {
  background-color: rgba(255, 255, 255, 1);
}

.v-loading-wrap-white .v-loading-title {
  margin-top: 10px !important;
}

.v-loading-box {
  min-width: 90px;
  max-width: 100px;
  min-height: 90px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.v-loading-box.light {
  background-color: #f5f5f5;
  color: #aaaaaa;
}

.v-loading-box.dark {
  background-color: rgba(0, 0, 0, 0.6);
  color: #ffffff;
}

.v-loading-box.title {
  min-width: 90px;
}

.v-loading-box .v-loading-title {
  margin-top: 8px;
  font-size: 14px;
}

.v-loading-box .v-loading-circle {
  display: inline-block;
  vertical-align: middle;
  width: 10px;
  height: 10px;
  background: 0 0;
  border-radius: 50%;
  border: 2px solid;
  border-color: #e5e5e5 #e5e5e5 #e5e5e5 #8f8d8e;
  animation: v-circle 1s linear infinite;
}

.v-loading-box .v-loading-loading {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  -webkit-animation: a 1s steps(12) infinite;
  animation: v-flower 1s steps(12) infinite;
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=)
    no-repeat;
  background-size: 100%;
}

.v-loading-box .v-loading-success {
  background: transparent
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEUUlEQVR4Xu2ZXWgcVRTHz9nsQ2gUDfFhk3tuZIN50VD0taL0taAUSgbFTwoiSFHUItJitbWIIsXSGkUQQVrBD0QREUQoioiigggilKqEzL13IhtKpBVDZs1euTDCdne+95bO7M68zrnnnv9vzvnP3VmEEb9wxPVDBaDqgBEnUI3AiDdAZYLVCFQjMOIEqhEY9gZotVo3tNvtXb7vn242m3/16h3qDlBK7dNaL/0vmoj69A4tACnlMQDY3/XE/9FaX8c53+jugqED4LruTK1WexUA9lwiFPEwY+zIUI+AUurWoOVv7hF6lIieDfO7oekAIcR9ALCEiNf0CH2BiJ6JMvuhACClPAQAz/eK1Fq/xDk/EPemKzUAz/O2dTod4/J7+2Yb8WXG2NNJr/nSAnBddyEwu50h4o8xxp5KEm/ulxKAUurOwOxmQ0QeJ6In04gvJQAhxGOIeCJC4Akiejyt+NIBkFIeB4BQgaYjOOePZhFfGgBSSkLEJa317giBrxPRvqziSwHAdd3bA7PbHiHwDSJ6JI/4wgOQUj5oDjcAcFWYQK31m5zzh/OKLzQAIcRhRHwu8gSH+BZj7KFBxBcSwNra2tWbm5vmqT8QI+5tIuo7/OSBUahzgBBie61WM2Z3W4yYU0RkRsPKFQlACLGTc/6VlV1SJFFK7Q4ONxQT/g4R3Z8iXeqQUABd83cOEU8yxl5LnTFHoJTyCQB4JW6p1vpdzvk9OdLHLgkFIKXUPatOaa0Pcs6V7QKEECcRMekA8z4R3W1771ATNB8Rfd//LWSzswGEj20U4nne9cEvuTsS8n1IRI6NPcNy9HXAysrK3NjY2B8xG75IRAcHKcj4S2B2NyXk+Ygx5iBiZ5D94tZGjcB7AHBXzMIzQTf8kLUwpdTewOy2Jcz8J0S0iIj/Zt0jS3wogNXV1Rs7nc4HWuu4J3QREQ9kMUgp5VEAiPw81VX4pxsbG878/PxmFjF5YiNfgykhmD0TDXJ5efnaer1uvtfdm6LIz7TWTu/n6xTrcoXEHoQyQIg0SKXULUHL70iqEBE/X19fdxYWFv5OirV1P/EkmAGCqekSg/Q8b0/g9NNJBSPiF+Pj487U1NSFpFib9xMBmM0yQpAA8F3wC25XymLPTExMLE5OTvb9d5dyfe6wVAByQMhS0JcA4BDR+SyLbMWmBnA5IGitv67X64vT09NrtgRlzZMJgGUI37TbbafZbP6ZtWib8ZkB2ICAiN9ubW05s7Oznk0xeXLlAjAghO8BYJGIjFle8Ss3gJwQfvR935mbm1u54sqDAgYCkBHCT8bwGo3GclHEmzoGBpASws/B8fb3Iom3BiAOgtb6F0Q0M3+uaOKtAgiDgIi/GvEzMzNniyjeOgCTUAjBAMD8gdmq1+unG41Gq6jiLwuAIosNq82KCZZNdHe9FYAyPz0btVcdYINimXNUHVDmp2ej9qoDbFAsc46qA8r89GzU/h/D89pQgdpe7QAAAABJRU5ErkJggg==)
    no-repeat;
  background-size: 100%;
}

.v-loading-box .v-loading-warning {
  background: transparent
    url(data:image/png;base64,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)
    no-repeat;
  background-size: 100%;
}

@keyframes v-flower {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}

@keyframes v-circle {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 全局loading样式 */
.v-loading-box .circular {
  width: 50px;
  height: 50px;
  animation: loading-rotate 2s linear infinite;
  transform-origin: center center;
}

.v-loading-box .path {
  stroke-dasharray: 90 120;
  stroke-dashoffset: 0;
  stroke-width: 3;
  stroke-linecap: round;
  animation: loading-dash 1.5s ease-in-out infinite,
    loading-color 6s ease-in-out infinite;
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90 150;
    stroke-dashoffset: -40px;
  }

  100% {
    stroke-dasharray: 90 150;
    stroke-dashoffset: -120px;
  }
}

@keyframes loading-rotate {
  to {
    transform: rotate(1turn);
  }
}

@keyframes loading-color {
  100%,
  0% {
    stroke: #409eff;
  }
  40% {
    stroke: #d62d20;
  }
  66% {
    stroke: #008744;
  }
  80%,
  90% {
    stroke: #ffa700;
  }
}
</style>
