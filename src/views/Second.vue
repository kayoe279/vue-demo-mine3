<template>
  <div id="second">
    <header>
      <span @click="goBack">返回</span>
    </header>
    <div class="title">{{ msg }}</div>
    <main>
      <div class="buttons">
        <button @click="choose('全选')">全选</button>
        <button @click="choose('反选')">反选</button>
      </div>
      <!-- 内容 -->
      <ul class="mySlider">
        <li v-for="(item,index) in data" :key="index">
          <div @click="selList(index)">
            <input type="checkbox" v-model="item.selected" />
            <span></span>
          </div>
          <div>
            <span>{{item.text}}</span>
          </div>
          <div class="num">
            <x-number v-model="item.number" :min="1" width="25px"></x-number>
          </div>
          <div class="price">
            <span>{{(item.price * item.number).toFixed(2)}}</span>
          </div>
        </li>
      </ul>
      <div class="showTotal">总价:{{totalPrice}}</div>
      <div class="animation"></div>
    </main>
  </div>
</template>

<script>
// import { XNumber } from "vux";
export default {
  name: "Second",
  // components: {
  //   XNumber
  // },
  data() {
    return {
      msg: "第二个页面",
      data: [
        {
          text: "苹果🍎",
          number: 1,
          price: 88.88,
          selected: false
        },
        {
          text: "南瓜🎃",
          number: 1,
          price: 66.66,
          selected: false
        },
        {
          text: "葡萄🍇",
          number: 1,
          price: 55.55,
          selected: false
        },
        {
          text: "草莓🍓",
          number: 1,
          price: 11.11,
          selected: false
        },
        {
          text: "西瓜🍉",
          number: 1,
          price: 22.22,
          selected: false
        }
      ]
    };
  },
  computed: {
    title() {
      return this.$store.state.title;
    },
    // 计算total
    totalPrice() {
      var total = 0;
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].selected) {
          total += this.data[i].number * this.data[i].price;
        }
      }
      return total.toFixed(2);
    }
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    // 选择
    selList(index) {
      this.data[index].selected = !this.data[index].selected;
    },
    // 全选/反选
    choose(type) {
      for (var i = 0; i < this.data.length; i++) {
        type == "全选"
          ? (this.data[i].selected = true)
          : (this.data[i].selected = !this.data[i].selected);
      }
    }
  }
};
</script>

<style lang="scss">
#second {
  background-color: #fff;
  > header {
    width: 100%;
    height: 1.5rem;
    background: url("../assets/img/wave.gif") no-repeat;
    background-size: 100% 100%;
    position: relative;
    span {
      position: absolute;
      width: 1rem;
      height: 1rem;
      line-height: 1rem;
      background-color: #d2f1f0;
      color: #000;
      top: 0.3rem;
      left: 0.3rem;
      border-radius: 50%;
      opacity: 0.6;
    }
  }
  .title {
    margin-top: 1rem;
    font-size: 0.32rem;
  }
  main .buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 0.3rem;
    button {
      width: 40%;
      padding: 0.2rem 0;
      border-radius: 0.12rem;
      color: #fff;
      background: linear-gradient(45deg, #0081ff, #1cbbb4);
    }
  }
  main .showTotal {
    font-size: 0.4rem;
  }
  .animation{
    margin: 0.5rem auto 0;
    width: 165px;
    height: 120px;
    background: url('https://image.weilanwl.com/gif/loading-white.gif') no-repeat;
    background-size: 100% 100%;
  }
}
.mySlider {
  width: 100%;
  padding: 0.3rem;
  li {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 1.2rem;
    margin: 0.1rem 0;
    > div {
      height: 1.2rem;
      line-height: 1.2rem;
      &:nth-of-type(1) {
        width: 8%;
        text-align: right;
        padding-right: 0.2rem;
        input {
          display: none;
          + span {
            position: relative;
            top: 0.08rem;
            display: inline-block;
            width: 0.4rem;
            height: 0.4rem;
            background-image: url("../assets/img/checkbox-false.png");
            background-size: 100% 100%;
          }
          &:checked + span {
            background-image: url("../assets/img/checkbox-true.png");
            background-size: 100% 100%;
          }
        }
      }
      &:nth-of-type(2) {
        width: 35%;
        text-align: center;
      }
    }
    .num {
      width: 40%;
      > div {
        height: 100%;
        box-sizing: border-box;
        font-size: 0.24rem;
      }
      .weui-cell__ft {
        line-height: 1.2rem;
        > div a {
          padding: 0 0.16rem 0 0.16rem;
        }
        input {
          font-size: 0.24rem;
        }
      }
    }
    .price {
      width: 17%;
      text-align: right;
    }
  }
}
</style>