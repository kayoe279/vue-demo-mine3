<template>
  <!-- 接口测试 -->
  <div class="test">
    <div v-for="(item, index) in workbenchList" :key="index">
      <span>{{item.PetitionName}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "testPage",
  data() {
    return {
      workbenchList: []
    };
  },
  methods: {
    async getData() {
      this.$loading.coverLoading();
      // this.$request
      //   .post("kpapi/evafbappeal/search", {
      //     currentPage: 1,
      //     pageSize: 2,
      //     mappingSql: "EvaFbAppeal.List",
      //     orderby: "ModifiedOn desc",
      //     searchDict: JSON.stringify({})loading
      //   })
      //   .then(resp => {
      //     if (resp.ErrorCode == 0) {
      //       console.log(resp);
      //     }
      //   });

      let resp = await this.$request.post("kpapi/evafbappeal/search", {
        currentPage: 1,
        pageSize: 2,
        mappingSql: "EvaFbAppeal.List",
        orderby: "ModifiedOn desc",
        searchDict: JSON.stringify({})
      });
      if (resp.ErrorCode == 0) {
        this.workbenchList = resp.Data.List;
      }
      console.log(resp);
      console.log("resp之后输出");
      this.$loading.hideLoading();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="css">
.test {
  padding: 0.3rem;
}
.test > div {
  padding: 0.2rem 0;
}
</style>