<template>
  <div class="v-toast-wrap" v-show="show" @touchmove.stop.prevent>
    <div
      class="v-toast-box"
      :class="[!!showToast?'v-toast-box-show':'',toastMode?'v-toast-box-'+position:'v-toast-common']"
    >
      <div class="v-toast" :class="'v-toast-' + type" v-if="type=='success'||type=='warning'"></div>
      <div
        class="v-toast-title"
        :class="{'limitTitle':type=='success'||type=='warning'}"
        v-show="title"
      >{{title}}</div>
    </div>
  </div>
</template>

<script>
/**
 * toast
 * @description 组件为一个toast消息提示
 * @data {Boolean} show 是否显示
 * @data {Boolean} showToast 是否显示toast
 * @data {String} title toast文字
 * @data {String} position toast位置 默认middle, 可选 top bottom (只在type为默认时生效)
 * @data {String} type 模式选择默认toast,可选 success成功 warning警告
 * @data {String Number} size 加载图标的大小，单位px
 * @data {String Number} duration toast显示时长 默认1500ms
 *
 */
export default {
  name: "vToast",
  data() {
    return {
      show: false,
      showToast: false,
      title: "",
      position: "middle",
      type: "toast",
      duration: 1500
    };
  },
  computed: {
    toastMode() {
      return (
        (this.position == "top" || this.position == "bottom") &&
        this.type != "success" &&
        this.type != "warning"
      );
    }
  },
  methods: {
    setDefaultOptions() {
      Object.assign(this.$data, this.$options.data()); // 重置data对象到初始化状态
    }
  },
  watch: {
    show(value) {
      if (value) {
        // 动画效果dom加载完延迟显示
        this.$nextTick(() => {
          setTimeout(() => {
            this.showToast = true;
          }, 50);
        });
      } else {
        this.showToast = false;
      }
    }
  }
};
</script>

<style scoped>
.v-toast-wrap {
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
  transition: all 0.3s ease-in-out;
}
.v-toast-box {
  min-width: 100px;
  max-width: 70%;
  min-height: 40px;
  padding: 10px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0;
}
/* 普通 */
.v-toast-common {
  transform: scale(0.8) translateZ(0);
  opacity: 0;
  transition: all 0.2s;
  transform-origin: center center;
}
.v-toast-common.v-toast-box-show {
  opacity: 1;
  transform: scale(1) translateZ(0);
}
/* 上出来 */
.v-toast-box.v-toast-box-top {
  position: absolute;
  top: -20%;
  opacity: 0;
  transition: all 0.3s ease-in-out;
}
.v-toast-box.v-toast-box-top.v-toast-box-show {
  top: 6%;
  opacity: 1;
}
/* 下出来 */
.v-toast-box.v-toast-box-bottom {
  position: absolute;
  bottom: -20%;
  opacity: 0;
  transition: all 0.3s ease-in-out;
}
.v-toast-box.v-toast-box-bottom.v-toast-box-show {
  bottom: 6%;
  opacity: 1;
}

/* 内容 */
.v-toast-box .v-toast-title {
  font-size: 14px;
  word-break: break-all;
}
.v-toast-box .v-toast-title.limitTitle {
  max-width: 100px;
}
.v-toast-box .v-toast {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
  font-size: 0;
  transition: all 0.2s;
}
.v-toast-box .v-toast-success {
  background: transparent
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADmUlEQVR4Xu2aW6hOQRiG3/dWxIUbhyi5QuKWyK0iJTtyTElJ5JBEzjuRRI4pKW3KIZGkpEQSoaSk5JAUEikhUvJq6lPbv9dhZv0ja/3/mpt9sb+Z+d7nO6xZs36izQfbXD9qAHUGtDmBugTaPAHqJliXQF0CbU6gLoFWTwBJwwFMBnCC5KdGvS2dAZKWAjj4RzTJHnpbFoCk3QBWd4v4NwD9SX7vngUtB0DSQAAHAExvSPctJLe2dAlIGm8pP6ZBaCfJTUn9rmUyQNJcE9+3Qeh2khvSmn1LAJC0EcC2BJE7Sa7LetJVGoCkXhb1hQkid5Fcm/eYrywASaOs2U1KELmb5Jo88e7/lQQgaapFfkiCyL0kV/mIryQAScsB7EsRuI/kCl/xlQMgaS+ANIEHSS4LEV8ZAJIGW8pPSxF4mKQ79gaP0vcASROt2Y1OUXeE5JJg5Tah1AAkLbDI904ReJTk4qLiS10CkrYA2Jwh7hjJRc2ILyUASX0s6vMzxB0nmXT4CeZRqhKQ5Orcvb9PyFDSRdKVRpSRCkDSJJI3ouzisYgk1+GdeNfx08ZJkvM8lvM2SQTQrf6eAthP8pD3igUMJa0EsCdn6imSswssnzklDYAaZnUBWE/yTWwHJO0HkHeAOUNyVuy9E5ugXSI+S9jsiUG4EMMRSUMt5afkrHeOZEeMPZPW6JEBkoYBeJGx4Q6S65txyPUXEz8yZ53zADpI/mpmv6y5aSVwGsDMjInXLBvuhTomyT2+XLNz7/JZ4yKAGSR/hu4RYp8GYASAswCyIvQFwLqQBimpE0Dq9VQ3xy9Z5H+EiClim/UY9IHg9sxtkJL6WdTneDh52cT/dX3tMa+QSeZBSJIvhNQGKWmsiR/n4eEVE//VwzaKSe5JMACCc+ivBinJ3c27eh/g4e1VE//ZwzaaSS4At1MghNcA7gBwb3Dum5zPcE3VNbwe3+58Jjdj4wWgAIQQn65b5D+GTIpl6w3gH0G4aZH/EEtQ6DpBACJDuGWRfxfqdEz7YACRINw28W9jiimyViEATUK4a2nvmuV/H4UBFIRw3yL/6r8rNweaAhAI4YFF/mVZxDs/mgbgCeGhRf55mcRHA5AD4ZFF3t0ulW5EyYA/qhJOjI9NvHtXKOWICsAyYRAA9wHzvf00zf0t7YgOoLRKUxyrAVQtYrH9rTMgNtGqrVdnQNUiFtvfOgNiE63aenUGVC1isf1t+wz4DTxOFFBUuSY1AAAAAElFTkSuQmCC)
    no-repeat;
  background-size: 100% 100%;
}
.v-toast-box .v-toast-warning {
  background: transparent
    url(data:image/png;base64,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)
    no-repeat;
  background-size: 100% 100%;
}
</style>
