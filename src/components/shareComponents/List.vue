<template>
  <div id="list">
    <mescroll-vue ref="mescroll" :up="mescrollUp" @init="mescrollInit">
      <div
        class="list-box"
        :class="tabIndex==0?'blue':tabIndex==1?'green':tabIndex==2?'pink':tabIndex==3?'orange':''"
      >
        <ul :id="'dataList'+tabIndex">
          <li v-for="(item, index) in filterList" :key="index" @click="skipDetail(item)">
            <div class="list-avatar">{{item.id}}</div>
            <div class="list-info">价格:{{item.pdPrice}}</div>
          </li>
        </ul>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  name: "List",
  props: ["tabIndex", "label"],
  components: {
    MescrollVue
  }, 
  computed: {
    filterList() {
      return this.list.filter(item => {
        if (this.label == "odd") {
          return item.id % 2 == 1;
        } else if (this.label == "even") {
          return item.id % 2 == 0;
        } else if (this.code == "up") {
          return this.list.sort(function(a, b) {
            return a.pdPrice - b.pdPrice;
          });
        } else if (this.code == "down") {
          return this.list.sort(function(a, b) {
            return b.pdPrice - a.pdPrice;
          });
        } else {
          return item;
        }
      });
    }
  },
  data() {
    return {
      pdList: [
        {
          id: 1,
          pdName: "【1】  六罐装荷兰美素佳儿金装2段900g",
          pdPrice: 1149.0,
          pdSold: 648
        },
        {
          id: 2,
          pdName: "【2】  韩国Amore爱茉莉红吕洗发水套装修复受损发质",
          pdPrice: 89.0,
          pdSold: 128
        },
        {
          id: 3,
          pdName: "【3】  Friso美素佳儿 金装婴儿配方奶粉3段900g",
          pdPrice: 195.0,
          pdSold: 968
        },
        {
          id: 4,
          pdName: "【4】  Fisher pdPrice费雪 费雪三轮儿童滑行车",
          pdPrice: 299.0,
          pdSold: 85
        },
        {
          id: 5,
          pdName: "【5】  Babylee巴布力 实木婴儿床 雷卡拉130*70cm",
          pdPrice: 1889.0,
          pdSold: 18
        },
        {
          id: 6,
          pdName: "【6】  Pigeon贝亲 独立三层奶粉盒 送小罐奶粉1段200g",
          pdPrice: 70.0,
          pdSold: 658
        },
        {
          id: 7,
          pdName: "【7】 TTBOO兔兔小布 肩纽扣套装",
          pdPrice: 268.0,
          pdSold: 128
        },
        {
          id: 8,
          pdName: "【8】  Nuna璐拉 婴儿布里奇果精纯嫩肤沐浴露婴儿精纯芦荟胶",
          pdPrice: 140.0,
          pdSold: 366
        },
        {
          id: 9,
          pdName: "【9】  illuma启赋 奶粉3段900g",
          pdPrice: 252.0,
          pdSold: 98
        },
        {
          id: 10,
          pdName: "【10】  Abbott雅培乳蛋白部分水解婴儿配方奶粉3段820g",
          pdPrice: 89.0,
          pdSold: 128
        },
        {
          id: 11,
          pdName: "【11】  韩蜜 酷炫唇蜜（礼盒套装）2.8g*4",
          pdPrice: 179.0,
          pdSold: 35
        },
        {
          id: 12,
          pdName: "【12】  保税区直发【3包装】日本Merries花王纸尿裤NB90",
          pdPrice: 289.0,
          pdSold: 1928
        },
        {
          id: 13,
          pdName: "【13】  Comotomo可么多么 硅胶奶瓶（0-3月奶嘴）150ml绿色",
          pdPrice: 203.0,
          pdSold: 87
        },
        {
          id: 14,
          pdName: "【14】  香港直邮德国瑞德露Rival de Loop芦荟精华安瓶",
          pdPrice: 152.0,
          pdSold: 61
        },
        {
          id: 15,
          pdName: "【15】  保税区直发药师堂尊马油香草味温和保湿无刺激面霜",
          pdPrice: 269.0,
          pdSold: 73
        },
        {
          id: 16,
          pdName: "【16】  香港直邮日本Spatreatment眼膜保湿去细纹法令纹",
          pdPrice: 219.0,
          pdSold: 13
        },
        {
          id: 17,
          pdName: "【17】  韩国MEDIHEALNMF可莱丝针剂睡眠面膜",
          pdPrice: 81.0,
          pdSold: 128
        },
        {
          id: 18,
          pdName: "【18】  DHC蝶翠诗橄榄蜂蜜滋养洗脸手工皂90g",
          pdPrice: 123.0,
          pdSold: 77
        },
        {
          id: 19,
          pdName: "【19】  日本资生堂CPB肌肤之钥新版隔离霜 清爽型 30ml",
          pdPrice: 429.0,
          pdSold: 36
        },
        {
          id: 20,
          pdName: "【20】 Heinz亨氏 婴儿面条优加面条全素套餐组合3口味3盒",
          pdPrice: 39.0,
          pdSold: 61
        },
        {
          id: 21,
          pdName: "【21】  Heinz亨氏 乐维滋果汁泥组合5口味15袋",
          pdPrice: 69.0,
          pdSold: 55
        },
        {
          id: 22,
          pdName: "【22】  保税区直发澳大利亚Swisse高浓度蔓越莓胶囊30粒",
          pdPrice: 271.0,
          pdSold: 19
        },
        {
          id: 23,
          pdName: "【23】  挪威Nordic Naturals小鱼婴幼儿鱼油DHA滴剂",
          pdPrice: 102.0,
          pdSold: 125
        },
        {
          id: 24,
          pdName: "【24】  澳大利亚Bio island DHA for Pregnancy海藻油DHA",
          pdPrice: 289.0,
          pdSold: 28
        },
        {
          id: 25,
          pdName: "【25】  澳大利亚Fatblaster Coconut Detox椰子水",
          pdPrice: 152.0,
          pdSold: 17
        },
        {
          id: 26,
          pdName: "【26】  Suitsky舒比奇 高护极薄舒爽纸尿片尿不湿XL60",
          pdPrice: 99.0,
          pdSold: 181
        },
        {
          id: 27,
          pdName: "【27】  英国JUST SOAP手工皂 玫瑰天竺葵蛋糕皂",
          pdPrice: 72.0,
          pdSold: 66
        },
        {
          id: 28,
          pdName: "【28】  德国NUK 多色婴幼儿带盖学饮杯",
          pdPrice: 92.0,
          pdSold: 138
        }
      ],
      list: [],
      page: 0,
      pageSize: 10,
      mescroll: null,
      mescrollUp: {
        callback: this.getList,
        page: {
          num: this.page,
          size: this.pageSize
        },
        noMoreSize: 7,
        isBounce: true,
        htmlNodata: '<p class="upwarp-nodata">已经没有更多数据了</p>',
        empty: {
          warpId: "dataList" + this.tabIndex,
          icon: "static/mescroll/icon-none-result.png",
          tip: "暂无相关数据~"
        }
      },
      code: "" //筛选code
    };
  },
  activated() {
    // Bus.$on("sendFilterCode", code => {
    //   // 刷新数据
    //   this.code = code;
    //   this.mescroll.resetUpScroll();
    //   console.log(this.code);
    // });
  },
  methods: {
    skipDetail(item) {
      // this.$router.push({
      //   name: "Detail",
      //   params: { id: item.id, pdName: item.pdName }
      // });
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    getList(page, mescroll) {
      // console.log("更新数据");
      this.page = page.num;
      this.pageSize = page.size;
      let arr = [];
      setTimeout(() => {
        for (
          var i = (page.num - 1) * page.size;
          i < page.num * page.size;
          i++
        ) {
          if (i === this.pdList.length) break;
          arr.push(this.pdList[i]);
        }
        if (page.num === 1) this.list = [];
        this.list = this.list.concat(arr);
        this.$nextTick(() => {
          mescroll.endSuccess(arr.length);
        });
      }, 300);
    }
  },
  mounted() {
    this.$refs.mescroll.$el.addEventListener("scroll", () => {
      this.mescroll.lastScrollTop = this.mescroll.getScrollTop();
    });
  },
  watch: {
    $route(to, from) {
      if (to.meta.keepAlive) {
        this.mescroll.setScrollTop(this.mescroll.lastScrollTop || 0);
      }
    }
  }
};
</script>
<style>
#list {
  height: 100%;
  overflow: hidden;
  padding-top: 0.3rem;
  /* padding-bottom: 0.6rem; */
}
#list ul {
  padding: 0 0.3rem 0;
}
#list ul li {
  margin: 0rem 0 0.3rem;
  box-shadow: 0 0 10px rgba(144, 144, 144, 0.15);
  border-radius: 0.2rem;
  background-color: #fff;
  padding: 0.3rem 0.2rem;
  display: flex;
  align-items: flex-start;
}
#list .list-box.blue .list-avatar,
#list .list-box.blue .list-info {
  background-color: #55aaff;
}
#list .list-box.green .list-avatar,
#list .list-box.green .list-info {
  background-color: #23d088;
}
#list .list-box.pink .list-avatar,
#list .list-box.pink .list-info {
  background-color: #f38499;
}
#list .list-box.orange .list-avatar,
#list .list-box.orange .list-info {
  background-color: #e6a23c;
}
#list ul li .list-avatar {
  width: 1.2rem;
  height: 1.2rem;
  line-height: 1.2rem;
  border-radius: 0.1rem;
  font-size: 0.6rem;
  text-align: center;
  color: #fff;
}
#list ul li .list-info {
  position: relative;
  width: 4.5rem;
  height: 0.4rem;
  border-radius: 0.2rem;
  margin-left: 0.4rem;
  color: #fff;
  line-height: 0.4rem;
  padding-left: 0.2rem;
}
#list ul li .list-info::after {
  content: "";
  position: absolute;
  bottom: -140%;
  left: 0;
  width: 40%;
  height: 70%;
  background-color: inherit;
  border-radius: inherit;
  opacity: 0.7;
}
</style>