<template>
  <div class="v-drawer">
    <div
      class="v-mask"
      :class="{'v-mask-show': showMask}"
      :style="{'background-color':maskBgColor}"
      @click="maskClick"
      @touchmove.stop.prevent
    ></div>
    <div
      class="v-drawer-content"
      @click.self="modeCenterClose(mode)"
      :class="[
				showDrawer ? 'v-drawer-content-visible' : '',
				'v-drawer-' + mode,
			]"
      @touchmove.stop.prevent
      @tap.stop.prevent
      :style="[style]"
    >
      <div
        class="v-mode-center-box"
        :class="mode == 'center' ? 'v-animation-zoom' : ''"
        @tap.stop.prevent
        @touchmove.stop.prevent
        v-if="mode == 'center'"
        :style="[centerStyle]"
      >
        <div v-if="closeAble" class="v-drawer-close" @click="close"></div>
        <div class="v-drawer_scroll-view">
          <slot />
        </div>
      </div>
      <div class="v-drawer_scroll-view" v-else>
        <div v-if="closeAble" class="v-drawer-close" @click="close"></div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * popup 弹窗
 * @description 弹出层容器，支持上、下、左、右和中部弹出
 * @property {Boolean} value v-model绑定值,显示/隐藏
 * @property {String} mode 弹出方向（默认left）
 * @property {Boolean} mask 是否显示遮罩（默认true）
 * @property {Boolean} maskBgColor 遮罩背景颜色
 * @property {Boolean} maskCloseAble 是点击示遮罩关闭（默认true）
 * @property {Boolean} closeAble 关闭弹窗图标（默认false）
 * @property {Number | String} borderRadius 弹窗圆角值（默认0）
 * @property {String} width 宽度
 * @property {String} height 高度
 * @event {Function} open 弹出层打开
 * @event {Function} close 弹出层收起
 */
export default {
  name: "vPopup",
  props: {
    //绑定的值
    value: {
      type: Boolean,
      default: false
    },
    //弹出方向，left|right|top|bottom|center|cBottom
    mode: {
      type: String,
      default: "left"
    },
    //是否显示遮罩
    mask: {
      type: Boolean,
      default: true
    },
    maskBgColor: {
      type: String,
      default: "rgba(0, 0, 0, 0.5)"
    },
    // 是否可以通过点击遮罩进行关闭
    maskCloseAble: {
      type: Boolean,
      default: true
    },
    // 是否显示关闭图标
    closeAble: {
      type: Boolean,
      default: false
    },
    // 显示显示弹窗的圆角，单位px
    borderRadius: {
      type: [Number, String],
      default: 0
    },
    // 宽度，只对左，右，中部弹出时起作用，单位px，或者"auto"
    width: {
      type: String,
      default: ""
    },
    // 高度，只对上，下，中部弹出时起作用，单位px，或者"auto"
    height: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visibleSync: false,
      showDrawer: false, // 显示隐藏
      timer: null
    };
  },
  computed: {
    showMask() {
      return this.showDrawer && this.mask;
    },
    style() {
      let style = {};
      // 设置上下左右的独立样式
      if (this.mode == "left" || this.mode == "right") {
        style = {
          width: this.width ? this.getUnitValue(this.width) : "auto",
          "max-width": "80%",
          height: "100%",
          transform: `translate3D(${
            this.mode == "left" ? "-100%" : "100%"
          },0px,0px)`
        };
      } else if (this.mode == "top" || this.mode == "bottom") {
        style = {
          width: "100%",
          "max-height": "80%",
          height: this.height ? this.getUnitValue(this.height) : "auto",
          transform: `translate3D(0px,${
            this.mode == "top" ? "-100%" : "100%"
          },0px)`
        };
      } else if (this.mode == "cBottom") {
        style = {
          width: "90%",
          "max-height": "80%",
          height: this.height ? this.getUnitValue(this.height) : "auto",
          left: "5%",
          bottom: "30px",
          transform: `translate3D(0px,${
            this.mode == "top" ? "-100%" : "100%"
          },0px)`
        };
      }
      // 如果设置了borderRadius值，添加弹窗的圆角
      if (this.borderRadius) {
        switch (this.mode) {
          case "left":
            style.borderRadius = `0 ${this.borderRadius}px ${this.borderRadius}px 0`;
            break;
          case "top":
            style.borderRadius = `0 0 ${this.borderRadius}px ${this.borderRadius}px`;
            break;
          case "right":
            style.borderRadius = `${this.borderRadius}px 0 0 ${this.borderRadius}px`;
            break;
          case "bottom":
            style.borderRadius = `${this.borderRadius}px ${this.borderRadius}px 0 0`;
            break;
          case "cBottom":
            style.borderRadius = `${this.borderRadius}px`;
            break;
          default:
        }
        style.overflow = "hidden";
      }
      return style;
    },
    // mode=center弹窗的样式
    centerStyle() {
      let style = {
        width: this.width ? this.getUnitValue(this.width) : "auto",
        height: this.height ? this.getUnitValue(this.height) : "auto",
        "max-width": "80%",
        "max-height": "80%"
      };
      if (this.borderRadius) {
        style.borderRadius = `${this.borderRadius}px` || "6px";
        style.overflow = "hidden";
      }
      return style;
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.open();
      } else {
        this.close();
      }
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
      this.close();
    },
    close() {
      this.showDrawer = false;
      // this.$emit("update:show", false); // 修改父组件的值
      this.$emit("input", false); // 修改父组件的值
      this.$emit("close");
    },
    // 中部弹出时(mode=center)，u-drawer-content元素会铺满屏幕，点击需要关闭弹窗
    modeCenterClose(mode) {
      if (mode != "center" || !this.maskCloseAble) return;
      this.close();
    },
    open() {
      this.showDrawer = true;
      this.$emit("open");
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
.v-drawer-content {
  position: fixed;
  box-sizing: border-box;
  transform-origin: center;
  transition: all 0.3s ease-in-out;
  z-index: 1200;
  visibility: hidden;
}

.v-drawer-content-visible {
  transform: translate3d(0, 0, 0) !important;
  visibility: visible;
  opacity: 1 !important;
}

.v-drawer-left {
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
}

.v-drawer-right {
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #ffffff;
}

.v-drawer-top {
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
}

.v-drawer-bottom {
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
}

.v-drawer-center {
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

.v-drawer_scroll-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.v-drawer-close {
  width: 18px;
  height: 18px;
  position: absolute;
  top: 15px;
  right: 15px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABwklEQVRoQ+2ZzVHDMBCFV6ENSuBIASkCKIGfgyfmxDUdAGEGBugAimAogCMVcOTIGYsRxJBxLO1K+0TsGeUa7e779q0lxTE08o8ZuX4qAJt2sDhQHFB2IDhC55c3czPZ2iOidyJ7XVdHj8p6ovCLq9t9IntGNPmwzefz6exk7gv0AiwW99uNad46gQe5IX7E08NfXfNaV4c7KACXJxvEunhXzr7U1fFuNIAL6E/4nQoOkVqL3UZTE4uGfblIU4MFyO2ERrzTJgLIBaEVHwWAhkCIjwZAQaDEJwFoIZDikwFSIdDiVQCxEDnEqwGkELnEQwA4iOVZtXK3+T3iIKe5+BzgTtZAl/tCIeJhDrQKhRAw8XAAZpyyXAJhIyR0Adp9uAOjHiGh+NYomBOQEQrt84PfRiWHlGQNt037vlc5ECMsZm0MTDJAiqCUGA4mCUAjRBPbBxMNgBCAyNHCRAEgC6NyiQFQBVfHAJFTBIAo5HsYtblZAG0Bbhfhfk9w72KDAP8hXnAJDF47GIC7JyI77XQRdo/putPfMNXL3TWAbOL9TiS+XncJR/0Hh+ThG8IadhcagsiQhgKwaYeKA8UBZQe+AOuZREC5QglxAAAAAElFTkSuQmCC")
    no-repeat;
  background-size: 100% 100%;
}

/* mode=center样式 */
.v-mode-center-box {
  min-width: 38px;
  min-height: 38px;
  display: block;
  position: relative;
  background-color: #fff;
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

.v-animation-zoom {
  transform: scale(1.2);
}

.v-drawer-content-visible .v-mode-center-box {
  transform: scale(1);
  opacity: 1;
}
</style>
