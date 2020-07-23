<template>
  <div id="AppealContentList">
    <div class="list-box" id="mescroll" ref="mescroll">
      <ul>
        <li v-for="(item, i) in 5" :key="i" @click="skipAppealDetail">
          <div class="content-left">
            <img src="../assets/img/checkbox-true.png" alt />
            <span>{{2}}</span>
          </div>
          <div class="content-centre">
            <div class="list-title">我是标题</div>
            <div class="list-serial">事件单号 : 323412312312</div>
            <div class="list-location">
              <img src="../assets/img/checkbox-true.png" alt />
              <span>发给第三方士大夫是否是否</span>
            </div>
          </div>
          <div class="content-right"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import { get, post } from "@/api/http";
// import Utils from "@/tools/Utils";
// import MeScroll from "mescroll.js";
export default {
  name: "AppealContentList",
  // props: ["tabIndex", "clqk"],
  data() {
    return {
      page: 0,
      pageSize: 10,
      mescroll: null,
      listData: []
    };
  },
  methods: {
    // 诉求详情
    skipAppealDetail() {
      this.$router.push("/appealDetail");
    },
    getList(page) {
      let _this = this;
      let userInfo = JSON.parse(Utils.getStorage("userInfo"));
      let params = {
        start: page.num - 1,
        Limit: page.size,
        UserCode: userInfo.UserName,
        clqk: this.clqk
      };
      console.log(params);
      let arr = [];
      get("/WebSite/GKListItem", params)
        .then(rlt => {
          arr = rlt.response.docs;
          console.log(arr);
          if (arr && arr instanceof Array) {
            if (page.num === 1) _this.listData = [];
            _this.listData = _this.listData.concat(arr);
            _this.$nextTick(() => {
              // this.mescroll.endSuccess(arr.length);
            });
          }
        })
        .catch(err => {
          Utils.toast(_this, "获取数据错误");
        });
    },
    initMescroll() {
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
          callback: this.getList,
          page: {
            num: this.page,
            size: this.pageSize
          },
          noMoreSize: 7,
          htmlNodata: "<p class='upwarp-nodata'>已经没有更多数据了</p>"
        }
      });
    }
  },
  mounted() {
    // Utils.getUserInfo(this, () => {
    this.initPage = true;
    // this.getList({ num: 1, size: 10 });
    // });
  }
};
</script>

<style lang="scss">
/* 列表 */
#AppealContentList {
  height: 100%;
  font-size: 0.28rem;
  margin-top: 0.88rem;
  overflow: hidden;
  .list-box {
    width: 100%;
    height: 100%;
    padding: 0rem 0.32rem 1rem;
    box-sizing: border-box;
    overflow-y: scroll;
    ul li {
      padding: 0.32rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // border-bottom: $border-global;
      &:last-child {
        border-bottom: none;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .content-left {
        width: 1.42rem;
        height: 1.42rem;
        border-radius: 0.08rem;
        position: relative;
        overflow: hidden;
        img {
          border-radius: 0.08rem;
        }
        span {
          width: 0.38rem;
          height: 0.38rem;
          text-align: center;
          padding-left: 0.06rem;
          font-size: 0.22rem;
          line-height: 0.4rem;
          background-color: #000000;
          opacity: 0.6;
          color: #fff;
          border-radius: 0.3rem 0rem 0 0rem;
          position: absolute;
          right: 0rem;
          bottom: 0rem;
        }
      }
      .content-right {
        width: 1.06rem;
        height: 1.06rem;
      }
      .content-centre {
        width: 3.8rem;
        overflow: hidden;
        .list-title {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 0.3rem;
          font-weight: 550;
        }
        .list-serial {
          font-size: 0.24rem;
          padding: 0.02rem 0 0.02rem 0.18rem;
          margin: 0.13rem 0 0.13rem;
          background-color: #fef2f0;
          border-radius: 0.19rem;
          color: #f5846e;
        }
        .list-location {
          width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          img {
            width: 0.2rem;
            height: 0.24rem;
            margin-right: 0.1rem;
            position: relative;
            top: 0.02rem;
          }
        }
      }
    }
  }
}
</style>