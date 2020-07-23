<template>
  <div id="st">
    <div class="st-box">
      <header>{{ msg }}</header>
    </div>
  </div>
</template>

<script>
export default {
  name: "SecondTwo",
  data() {
    return {
      msg: "第一个页面的子页面2"
    };
  },
  methods: {
    goBack() {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss">
#st {
  width: 100%;
  height: 6rem;
  .st-box {
    height: 6rem;
    background: linear-gradient(45deg, #ff9700, #ed1c24);
    padding: 0.3rem;
    border-radius: 0.12rem;
    color: #fff;
  }
}
</style>