<template>
  <div id="hello">
    <header></header>
    <div class="buttons">
      <div
        class="item-btn"
        :class="'bg-'+item.color"
        v-for="(item, index) in navigationList"
        :key="index"
        @click="navToView(item.url)"
      >{{item.name}}</div>
    </div>
    <main>
      <div class="subButton" @click="change" style="font-size:16px;">数量加1</div>
      <div class="subButton" @click="clearList">重置count</div>
      <div class="count-box">
        <span class="count">数量:{{count}}</span>
        <span>showPubSub值:{{showPubSub}}</span>
      </div>
      <div class="box">
        <div>VUEX控制</div>
        <button @click="sortAge">按岁数排序</button>
        <ul>
          <li v-for="(item, index) in List" :key="index">
            <span>姓名:{{item.name}},年龄:{{item.age}}</span>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import PubSub from "pubsub-js";
export default {
  name: "Index",
  data() {
    return {
      show2: false,
      navigationList: [
        // { name: "第一个page", color: "red", url: "/first" },
        // { name: "第二个page", color: "orange", url: "/second" },
        // { name: "接口页", color: "yellow", url: "/testPage" },
        // { name: "瀑布流布局页面", color: "olive", url: "/waterfall" },
        // { name: "vant组件测试", color: "green", url: "/vantTest" },
        { name: "自定义Popup组件", color: "cyan", url: "/popupTest" },
        { name: "自定义Loading", color: "blue", url: "/loadingTest" },
        { name: "自定义Toast", color: "purple", url: "/toastTest" },
        { name: "自定义Modal", color: "pink", url: "/modalTest" },
        { name: "Calendar日历", color: "green", url: "/calendarTest" }
      ],
      picker: [
        { label: "<b style='color:red'>拍照</b>", type: "creame" },
        { label: "从相册选择", type: "selectPhoto" }
      ],
      allList: [
        { name: "xiaoming", age: 13, weight: 20 },
        { name: "liming", age: 23, weight: 21 },
        { name: "zhangming", age: 8, weight: 66 },
        { name: "liming", age: 55, weight: 21 },
        { name: "lisa", age: 72, weight: 21 },
        { name: "maliya", age: 336, weight: 21 },
        { name: "zhangsan", age: 596, weight: 21 },
        { name: "wangwu", age: 1352, weight: 21 },
        { name: "kangkang", age: 11, weight: 21 },
        { name: "datiedan", age: 2, weight: 21 }
      ],
      showPubSub: null
    };
  },
  computed: {
    ...mapGetters({
      title: "getTitle",
      count: "getCount",
      List: "getList"
    })
  },
  methods: {
    toPage(page) {
      // 三种跳转方式
      this.$router.push({ path: "/" + page });
      // this.$router.push({name:page.substr(0,1).toUpperCase() + page.substr(1)})
      // this.$router.push('/' + page)
    },
    navToView(url) {
      this.$router.push({ path: url });
    },
    change() {
      if (this.count === this.allList.length) return;
      this.item = this.allList[this.count];
      this.invokeList(this.item); // 或者  this.$store.dispatch("invokeList", this.item);
      this.increment(1); // 或者 this.$store.commit("increment", 1);
    },
    ...mapMutations(["increment"]),
    ...mapActions(["clearList", "invokeList"]),
    // 排序
    sortAge() {
      this.show2 = true;
      if (this.List.length === 0) return;
      this.List.sort(function(a, b) {
        return a.age - b.age;
      });
    },
    showPicker() {
      this.show2 = true;
    }
  },
  beforeDestroy() {
    // 销毁订阅
    PubSub.unsubscribe("changeState");
  },
  mounted() {
    let _this = this;
    // this.$coverLoading();
    PubSub.subscribe("changeState", (event, data) => {
      _this.showPubSub = data;
      console.log(data);
    });
  }
};
</script>

<style lang="scss">
#hello {
  height: 100%;
  background-color: #fff;
  padding-bottom: 25px;
  background: url("../assets/img/bg-skin.png") no-repeat;
  background-size: 100% 100%;
  overflow-y: auto;
  header {
    width: 100%;
    height: 50px;
    background-size: 100% 100%;
  }
  .buttons {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item-btn {
      width: 48%;
      height: 100px;
      line-height: 100px;
      border-radius: 5px;
      padding: 0 5px;
      margin: 0 0 20px 0;
      font-size: 16px;
      background-image: url("https://image.weilanwl.com/color2.0/cardBg.png");
      background-size: cover;
      background-position: center;
      position: relative;
      z-index: 100;
      color: #fff;
      &::after {
        content: "";
        position: absolute;
        z-index: -1;
        background-color: inherit;
        width: 100%;
        height: 100%;
        left: 0;
        bottom: -12%;
        border-radius: 5px;
        opacity: 0.2;
        transform: scale(0.9, 0.9);
      }
    }
  }
  main {
    width: 100%;
    margin-top: 20px;
    padding: 15px;
    .count-box {
      margin-bottom: 15px;
    }
    .subButton {
      width: 100%;
      height: 45px;
      line-height: 45px;
      border-radius: 5px;
      padding: 0 5px;
      margin: 0 0 10px 0rem;
      font-size: 18px;
      background: #8dc63f;
      color: #fff;
      box-shadow: rgba(26, 26, 26, 0.2);
    }
    .box {
      width: 100%;
      border-radius: 6px;
      background-image: url("https://image.weilanwl.com/color2.0/cardBg.png");
      background-size: cover;
      background-position: center;
      position: relative;
      z-index: 1;
      background-color: #1cbbb4;
      padding: 15px;
      color: #fff;
      &::after {
        content: "";
        position: absolute;
        z-index: -1;
        background-color: inherit;
        width: 100%;
        height: 100%;
        left: 0;
        bottom: -10%;
        border-radius: 5px;
        opacity: 0.2;
        transform: scale(0.9, 0.9);
      }
    }
    ul li {
      width: 100%;
      padding: 7.5px 0;
    }
    button {
      width: 100%;
      padding: 10px 0;
      border-radius: 6px;
      margin-top: 10px;
      background-color: #fff;
      color: #1cbbb4;
      border: none;
    }
  }
}
</style>
