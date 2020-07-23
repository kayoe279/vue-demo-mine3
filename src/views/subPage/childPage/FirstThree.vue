<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "FirstThree",
  data() {
    return {
      msg: "第一个页面的子页面的子页面11111111111111111111111111"
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>