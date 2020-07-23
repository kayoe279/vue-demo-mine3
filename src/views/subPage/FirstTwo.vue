<template>
  <div id="ft">
    <div class="ft-box">
      <header>{{ msg }}</header>
      <div class="three">
        <div class="three-left">
          <router-link :to="{path:'/first/firstTwo/firstThree'}">tab1</router-link>
          <router-link :to="{name:'SecondThree'}">tab2</router-link>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FirstTwo",
  data() {
    return {
      msg: "第一个页面的子页面1"
    };
  },
  methods: {
    goBack() {
      this.$router.push("/");
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
#ft {
  width: 100%;
  height: 6rem;
  overflow-y:auto;
  .ft-box {
    height: 6rem;
    background: linear-gradient(45deg, #39b54a, #8dc63f);
    padding: 0.3rem;
    border-radius: 0.12rem;
    color: #fff;
  }
  .three {
    height: 100%;
    padding: 0.3rem 0;
    color: #fff !important;
    display: flex;
    justify-content: space-between;
    .three-left {
      width: 30%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border: 1px solid #e0e0e0;
      border-radius: 0.12rem;
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        color: inherit;
        width: 100%;
        height: 50%;
        text-align: center;
        padding: 0.3rem 0;
        border-bottom: 1px solid #e0e0e0;
        &:last-child {
          border-bottom: none;
        }
      }
    }
    > div {
      width: 70%;
    }
  }
}
</style>