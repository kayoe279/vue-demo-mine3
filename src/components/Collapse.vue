<template>
  <div class="v-collapse">
    <div class="v-collapse-item">
      <div class="v-collapse-head" @click.stop="headClick" :style="[headStyle]">
        <div
          class="v-collapse-title v-line-1"
          :style="[{ textAlign: align ? align : 'left' }, 
				isShow && activeStyle && !arrow ? activeStyle : '']"
        >
          <img class="title-icon" v-if="imgUrl" :src="'/static/img/' + imgUrl" alt />
          <span class="title-text">{{ title }}</span>
        </div>
        <div class="v-arrow-down-icon" :class="{ 'v-arrow-down-icon-active': isShow }"></div>
      </div>
      <div
        class="v-collapse-body"
        :style="[{
				height: isShow ? height + 'px' : '0'
			}, bodyStyle]"
      >
        <div class="v-collapse-content" :ref="elId">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * collapse 手风琴
 * @description 通过折叠面板收纳内容区域
 * @property {Boolean} accordion 是否手风琴模式（默认true）
 * @property {Boolean} arrow 是否显示标题右侧的箭头（默认true）
 * @property {String} arrow-color 标题右侧箭头的颜色（默认#909399）
 * @property {Object} head-style 标题自定义样式，对象形式
 * @property {Object} body-style 主体自定义样式，对象形式
 * @property {String} title 面板标题
 * @property {String Number} index 主要用于事件的回调，标识那个Item被点击
 * @property {Boolean} disabled 面板是否可以打开或收起（默认false）
 * @property {Boolean} open 设置某个面板的初始状态是否打开（默认false）
 * @property {String Number} name 唯一标识符，如不设置，默认用当前collapse-item的索引值
 * @property {String} align 标题的对齐方式（默认left）
 * @property {Object} active-style 不显示箭头时，可以添加当前选择的collapse-item活动样式，对象形式
 * @event {Function} change 某个item被打开或者收起时触发
 * @event {Function} change 当前激活面板展开时触发(如果是手风琴模式，参数activeNames类型为String，否则为Array)
 * @example <collapse></collapse>
 */
export default {
  name: "Collapse",
  props: {
    // 是否手风琴模式
    accordion: {
      type: Boolean,
      default: true
    },
    // 头部的样式
    headStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    // 主体的样式
    bodyStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    // 是否显示右侧的箭头
    arrow: {
      type: Boolean,
      default: true
    },
    // 箭头的颜色
    arrowColor: {
      type: String,
      default: "#b6b9be"
    },
    // 标题
    title: {
      type: String,
      default: ""
    },
    // 图标
    imgUrl: {
      type: String,
      default: ""
    },
    // 标题的对齐方式
    align: {
      type: String,
      default: "left"
    },
    // 是否可以点击收起
    disabled: {
      type: Boolean,
      default: false
    },
    // collapse显示与否
    open: {
      type: Boolean,
      default: false
    },
    // 唯一标识符
    name: {
      type: [Number, String],
      default: ""
    },
    //活动样式
    activeStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    // 标识当前为第几个
    index: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      isShow: false,
      elId: this.$utils.getRandomUuid(),
      height: 0, // body内容的高度
      childrens: []
    };
  },
  methods: {
    // collapse item被点击
    onChange() {
      let activeItem = [];
      this.childrens.forEach((vm, index) => {
        if (vm.isShow) {
          activeItem.push(vm.nameSync);
        }
      });
      // 如果是手风琴模式，只有一个匹配结果，也即activeItem长度为1，将其转为字符串
      if (this.accordion) activeItem = activeItem.join("");
      this.$emit("change", activeItem);
    },
    // 点击collapsehead头部
    headClick() {
      if (this.disabled) return;
      if (this.accordion == true) {
        this.childrens.map(val => {
          // 自身不设置为false，因为后面有this.isShow = !this.isShow;处理了
          if (this != val) {
            val.isShow = false;
          }
        });
      }
      this.isShow = !this.isShow;
      // 触发本组件的事件
      this.$emit("change", {
        index: this.index,
        show: this.isShow
      });
      // this.arrowColor = this.isShow ? "#4c85ff" : "#c5c6ca";
      // 只有在打开时才发出事件
      if (this.isShow) this.onChange();
      this.$forceUpdate();
    },
    // 查询内容高度
    queryRect() {
      let el = this.$refs[this.elId];
      if (el) {
        if (!el.offsetHeight) {
          setTimeout(() => {
            this.queryRect();
          }, 10);
          return;
        }
        this.height = el.offsetHeight;
      }
    }
  },
  created() {
    this.isShow = this.open;
    this.childrens.push(this);
  },
  mounted() {
    this.$nextTick(() => {
      this.queryRect();
    });
  },
  watch: {
    open(val) {
      this.isShow = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-collapse-head {
  width: 100%;
  position: relative;
  height: 48px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.v-collapse-head .title-icon {
  width: 16px;
  height: 18px;
  position: relative;
  top: 1px;
}

.v-collapse-title {
  flex: 1;
  overflow: hidden;
  line-height: 1;
  text-align: left;
  font-weight: 550;
  font-size: 18px;
  display: flex;
  align-items: center;
}

.v-collapse-title .title-text {
  font-weight: 550;
  font-size: 18px;
  margin-left: 16px;
}

.v-arrow-down-icon {
  display: flex;
  align-items: center;
  transition: all 0.3s;
  margin-right: 16px;
  transform-origin: center center;
  width: 20px;
  height: 20px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/klEQVRYR+2VsQrCMBCG72zBd9HVxUWwiEIfwCdw860cfQBFEQsObo76Iq4tkRMDpU2bu6PSJV1zuf/LR3JF6PnDnvMhAAQDwYDawOFyG0GR7wDhDYN4my5mL82TVgFQOBb53gCMKRQBniaK1xoIMUA5nIIJgEC0ECKAajid+mvgZ0MDwQZwhVvlbWu+e8EC4ARwalwwXgBJY0mthWkF0DSU7mkEkDYq65XsdQJIGjRdMm6PGgB3o+920zqnVw3geMruBsxU86ZdUJWp+UhXyaRcVzdwvmZocGiiaKMZrU0Q9r+RLpN5KwBHbZc13jnQZZhqEAWAYCAYCAb+beADB3/ZIS/M5XgAAAAASUVORK5CYII=)
    no-repeat;
  background-size: 100% 100%;
  transform: rotate(180deg);
}

.v-arrow-down-icon-active {
  transform: rotate(0deg);
  transform-origin: center center;
}

.v-collapse-body {
  overflow: hidden;
  transition: all 0.3s;
}

.v-collapse-content {
  overflow: hidden;
  font-size: 14px;
  text-align: left;
}
</style>
