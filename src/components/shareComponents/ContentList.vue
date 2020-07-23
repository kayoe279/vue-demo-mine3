<template>
  <div id="contentList">
    <div class="content" id="mescroll" ref="mescroll" v-show="!withoutData">
      <ul ref="uls">
        <li
          v-for="(acceptItem, index) in listData"
          :key="index"
          @click="skipDetail(acceptItem.FormUrl)"
        >
          <span class="serialNumber">{{index | formatRank}}</span>
          <div class="content-left">
            <img :src="imgUrl+acceptItem.SourceIconUrl" alt />
            <div class="types">{{acceptItem.SourceWayName}}</div>
          </div>
          <div class="content-right">
            <div class="title">{{acceptItem.Title}}</div>
            <div class="date">登记时间 : {{acceptItem.RegistorOn | formatDate}}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="withoutData" v-if="withoutData">
      <!-- <img src="../../assets/img/icon-none-result.png" alt /> -->
      <p style="font-size:0.38rem;margin-top:0.2rem;color:#9ea7b3">暂无内容</p>
    </div>
  </div>
</template>
<script>
import MeScroll from "mescroll.js";
import Tools from "@/tools/Tools";
import { post } from "@/api/http.js";
export default {
  props: ["type", "paramsObj", "searchKeyWord"],
  data() {
    return {
      page: 0,
      pageSize: 20,
      imgUrl: "", // 图片前缀
      mescroll: null, // 刷新
      listData: [], // 展示数据
      withoutData: false, // 暂无数据
      OfficeId: "",
      userInfo: {}, // 用户信息
      synergyType: null // 0-12345中心 1-还是单位
    };
  },
  filters: {
    formatRank(n) {
      return n < 9 ? "0" + (n + 1) : n + 1;
    }
  },
  methods: {
    skipDetail(FormUrl) {
      Tools.removeStorage("timeArr");
      Tools.removeStorage("commonRemark");
      Tools.removeStorage("addList");
      let tabType = Tools.getString(this.type, "mappingSql");
      let category = this.$route.params.category;
      let fromPage = this.$route.params.fromPage;
      let title = this.$route.params.title;
      let routeName = {
        UIAccept_Reject: "/doneDetail",
        UIAccept_Feedbacked: "/doneDetail",
        UIAccept_OfficeFeedbacked: "/doneDetail",
        UICoordination: "/leaderDetail",
        UICenterLender_DelayToApprove: "/leaderDetail",
        UICenterLeader_Todo: "/leaderDetail",
        UI_DaiBanLi_Fjs: "/leaderDetail",
        UIDaiLi_Todo: "/leaderDetail"
      };
      if (title == "待受理" || title == "待办理") {
        // 中心0
        if (this.synergyType == 0) {
          this.$router.push(`/detail${FormUrl}&category=${category}`);
        } else {
          // 单位1
          this.$router.push(`/waitDetail${FormUrl}&category=${category}`);
        }
      } else if (fromPage == "ZhengWuDuBan") {
        this.$router.push(
          `/waitDetail${FormUrl}&category=${category}&tabType=${tabType}`
        );
      } else {
        this.$router.push(
          `${routeName[category]}${FormUrl}&category=${category}&tabType=${tabType}`
        );
      }
    },
    getList(page) {
      let _this = this;
      let startRecord = "";
      let pageSize = "";
      let TagType = this.type;
      if (this.paramsObj.numStart || this.paramsObj.numEnd) {
        startRecord = (this.paramsObj.numStart - 1) * 1;
        pageSize = (this.paramsObj.numEnd - this.paramsObj.numStart + 1) * 1;
      } else {
        startRecord = (page.num - 1) * page.size;
        pageSize = page.size * 1;
      }
      this.imgUrl = Tools.getImgUrl();
      this.synergyType =
        this.userInfo.OfficeId == "51f8c2ee01d546549d3ba195a6a149e2" ? 0 : 1;
      if (this.paramsObj.transactWay) {
        TagType = TagType + "&prm_DealWay_=" + this.paramsObj.transactWay;
      }
      if (this.paramsObj.transactType) {
        TagType = TagType + "&prm_TopicType_=" + this.paramsObj.transactType;
      }
      if (this.searchKeyWord) {
        TagType = TagType + "&prm_Keyword_=" + this.searchKeyWord;
      }
      let params = {
        startRecord: startRecord,
        pageSize: pageSize,
        Tag: TagType,
        userId: this.userInfo.Id
      };
      let arr = [];
      this.withoutData = false;
      post("/Petition/GetPetitionList", params)
        .then(rlt => {
          Tools.hideLoading(this);
          arr = JSON.parse(rlt.data).List;
          if (rlt.ret == 0) {
            if (arr && arr instanceof Array) {
              if (JSON.parse(rlt.data).TotalCount == 0) {
                this.withoutData = true;
              }
              if (page.num === 1) this.listData = [];
              if (this.paramsObj.numStart || this.paramsObj.numEnd) {
                this.$emit("getTotalCount", {
                  count: arr.length,
                  type: this.type
                });
                this.listData = arr;
                this.mescroll.endBySize(arr.length, arr.length);
              } else {
                this.$emit("getTotalCount", {
                  count: JSON.parse(rlt.data).TotalCount,
                  type: this.type
                });
                this.listData = this.listData.concat(arr);
                this.$nextTick(() => {
                  this.mescroll.endSuccess(arr.length);
                });
              }
            }
          } else {
            Tools.toast(_this, rlt.umsg);
          }
        })
        .catch(err => {
          Tools.hideLoading(this);
          Tools.toast(_this, "获取数据错误");
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
          htmlNodata: "<p class='upwarp-nodata'>已经没有更多数据了</p>",
          lazyLoad: {
            use: true
          }
        }
      });
    },
    refreshPage() {
      Tools.showLoading(this);
      this.mescroll.upwarp.innerHTML = "";
      this.listData = [];
      this.mescroll.resetUpScroll(true);
    }
  },
  // 缓存刷新
  activated() {
    let isRefresh = this.$store.getters.getRefreshCache;
    if (isRefresh) {
      this.mescroll.resetUpScroll(true);
    }
  },
  deactivated() {
    this.$store.commit("setRefreshCache", false);
  },
  mounted() {
    this.userInfo = JSON.parse(Tools.getStorage("userInfo"));
    this.initMescroll();
    this.$waterMark.loadMark({
      textMark: this.userInfo.Name,
      parentContainer: this.$refs.uls,
      rows: 1000
    });
    this.$refs.mescroll.addEventListener("scroll", () => {
      this.mescroll.lastScrollTop = this.mescroll.getScrollTop();
    });
  },
  watch: {
    paramsObj() {
      this.refreshPage();
    },
    searchKeyWord() {
      this.refreshPage();
    },
    $route(to, from) {
      if (to.meta.keepAlive) {
        this.mescroll.setScrollTop(this.mescroll.lastScrollTop || 0);
      }
    }
  }
};
</script>
<style>
#contentList {
  width: 100%;
  height: 100%;
  font-size: 0.28rem;
  overflow: hidden;
  padding-top: 0.2rem;
}
#contentList .withoutData {
  text-align: center;
}
#contentList .withoutData img {
  width: 4rem;
  height: 4rem;
  margin-top: 2rem;
}
#contentList .content {
  width: 100%;
  height: 100%;
  padding: 0rem 0.2rem 2rem;
  box-sizing: border-box;
  overflow-y: scroll;
}
#contentList .content ul {
  position: relative;
}
#contentList .content ul li {
  margin-bottom: 0.2rem;
  background-color: #fff;
  border-radius: 0.1rem;
  padding: 0.32rem 0.22rem;
  display: flex;
  display: -webkit-flex;
  position: relative;
  overflow: hidden;
}
#contentList .content ul li .serialNumber {
  height: 0.342rem;
  line-height: 0.34rem;
  position: absolute;
  left: 0;
  top: 0;
  background-color: #96a7c3;
  font-size: 0.24rem;
  color: #fff;
  padding: 0rem 0.18rem;
  border-bottom-right-radius: 0.1rem;
}
#contentList .content ul li .content-left {
  width: 32%;
  text-align: center;
  flex: 1;
}
#contentList .content ul li .content-left img {
  width: 1rem;
  height: 1rem;
  display: block;
  margin: 0 auto;
  position: relative;
  top: 0.04rem;
}
#contentList .content ul li .content-left .types {
  font-size: 0.23rem;
  color: #626e7d;
  display: block;
  margin-top: 0.26rem;
}
#contentList .content ul li .content-right {
  width: 68%;
  font-size: 0.28rem;
  color: #32373e;
  margin-left: 0.2rem;
}
#contentList .content ul li .content-right .title {
  width: 100%;
  height: 0.44rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0.6rem;
  font-weight: 550;
}
/* #contentList .content ul li .content-right .content-detail {
  font-size: 0.24rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #636e7d;
  margin-bottom: 0.16rem;
} */
#contentList .content ul li .content-right .date {
  background-color: #eaf5ff;
  border-radius: 0.08rem;
  font-size: 0.24rem;
  font-weight: normal;
  font-stretch: normal;
  padding: 0.05rem 0 0.05rem 0.16rem;
  letter-spacing: 0px;
  color: #55aaff;
}
</style>
