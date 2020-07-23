<template>
  <div id="first">
    <header>
      <span @click="goBack">返回</span>
    </header>
    <div>VUEX控制</div>
    <div>
      <span>列表数量:{{count}}次</span>
    </div>
    <div>
      <span>用户信息:</span>
      <span>{{userInfo.name}}</span>
      <span>{{userInfo.age}}</span>
      <span>{{userInfo.weight}}</span>
      <span>,地址:{{userInfo.detail.address}}</span>
    </div>
    <div v-if="JSON.stringify(userInfoCopy)!='{}'">
      <span>用户信息Copy:</span>
      <span>{{userInfoCopy.name}}</span>
      <span>{{userInfoCopy.age}}</span>
      <span>{{userInfoCopy.weight}}</span>
      <span>,地址:{{userInfoCopy.detail.address}}</span>
    </div>
    <div>
      <button @click="changeUser">改变用户信息</button>
      <button @click="addList()">添加到列表</button>
      <button @click="clearList">清空列表</button>
      <button @click="changeText()">pubsub</button>
    </div>
    <div class="tabs">
      <button :class="{'active':!tabIdx}" @click="toChildPage('FirstTwo',0)">tab1</button>
      <button :class="{'active':tabIdx}" @click="toChildPage('SecondTwo',1)">tab2</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import PubSub from "pubsub-js";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  components: {},
  name: "First",
  data() {
    return {
      msg: "第一个页面",
      userInfo: {
        name: "cpx",
        age: 11111,
        weight: 200,
        detail: { address: "厦门市" }
      },
      userInfoCopy: {},
      tabIdx: 0,
      list: [
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
      ]
    };
  },
  computed: {
    // 辅助函数mapGetters 展开是对象
    ...mapGetters({
      title: "getTitle",
      count: "getCount"
    })
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    toChildPage(type, index) {
      this.tabIdx = index;
      this.$router.push({ name: type });
    },
    addList() {
      if (this.count === this.list.length) return;
      this.item = this.list[this.count];
      this.invokeList(this.item); // 或者 this.$store.dispatch("invokeList", this.item);
      this.increment(1); // 或者 this.$store.commit("increment", 1);
    },
    ...mapMutations(["increment"]),
    ...mapActions(["clearList", "invokeList"]),
    changeText() {
      let text = "value";
      PubSub.publish("changeState", text);
      this.$router.back();
    },
    changeUser() {
      this.userInfo.name = "fdm";
      // this.userInfo.detail.address = "福州市"; // 可以改变
      this.$set(this.userInfo.detail, "address", "福州市"); // 可以改变
      // 合并对象
      //  this.userInfo = Object.assign({},this.userInfo,{ name: "xiaoming", age: 13, weight: 20 });
    }
  },
  mounted() { 
    // 浅复制
    // this.userInfoCopy = Object.assign({},this.userInfo);
    // 深拷贝
    this.userInfoCopy = Object.assign(
      {},
      JSON.parse(JSON.stringify(this.userInfo))
    );
  }
};
</script>

<style lang="scss">
#first {
  overflow-y:auto;
  > header {
    width: 100%;
    height: 5rem;
    background: url("../assets/img/componentBg.png") no-repeat;
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
  > div {
    margin: 0.2rem 0;
    padding: 0 0.3rem;
    button {
      width: 100%;
      height: 0.7rem;
      line-height: 0.7rem;
      border-radius: 0.12rem;
      padding: 0 0.1rem;
      margin: 0 0 0.2rem 0rem;
      font-size: 0.28rem;
      background: linear-gradient(45deg, #0081ff, #1cbbb4);
      color: #fff;
    }
  }
  > div.tabs {
    display: flex;
    justify-content: space-between;
    button {
      width: 45%;
      background: linear-gradient(45deg, #39b54a, #8dc63f);
      opacity: 0.5;
      transition: all 0.2s;
      &:last-child {
        background: linear-gradient(45deg, #ff9700, #ed1c24);
      }
    }
    button.active {
      opacity: 1;
    }
  }
}
</style>
