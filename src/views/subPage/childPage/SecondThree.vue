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
      msg: "第一个页面的子页面的子页面222222222222222222222222222222222"
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  mounted() {}
};
</script>
<style>
h1 {
  word-break: break-all !important;
  white-space: pre-wrap !important;
  text-align: justify;
}
</style>