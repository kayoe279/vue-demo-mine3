<template>
  <div>
    <popup v-model="showMap" mode="bottom" height="90%" borderRadius="8">
      <div id="bgContainer">
        <div class="bg-head" :class="{'focus':focusSearch || locationKeyWord}">
          <div class="head-nav">
            <span class="down" @click="closePopup">取消</span>
            <span class="label">位置</span>
            <span class="down" @click="confirmSelect">确认</span>
          </div>
          <div class="search-box-adr">
            <form action @submit.prevent="search">
              <span class="search-icon"></span>
              <div>
                <input
                  type="search"
                  @focus="focusFun"
                  v-model="locationKeyWord"
                  placeholder="搜索附近位置"
                />
              </div>
            </form>
            <span v-show="focusSearch" @click="cancel">取消</span>
          </div>
        </div>
        <div id="searchResult" class="searchResult" v-show="focusSearch || locationKeyWord">
          <ul v-if="searchResultList.length>0">
            <li
              v-for="(item, index) in searchResultList"
              :key="index"
              @click="searchRltSelect(item)"
            >
              <div class="addr">{{item.name}}</div>
              <div class="addrDetail">{{item.district}}{{item.address.length==0?"":item.address}}</div>
            </li>
          </ul>
          <div class="no-addrDetail" v-if="noSearchResult">抱歉,你搜索的地址暂无结果</div>
        </div>
        <div v-show="!focusSearch && !locationKeyWord" class="bg-map-box" id="bg-map-box">
          <div class="map-box" :class="{'changeHeight':changeMapBoxHeight}">
            <div id="map"></div>
            <div class="goMyPosition" @click="goMyPosition"></div>
          </div>
          <div class="showAddress" ref="showAddress" :class="{'changeHeight':changeMapBoxHeight}">
            <ul>
              <li
                :class="{'selected':select==index}"
                v-for="(item, index) in nearByList"
                :key="index"
                @click="selectNearBy(item,index)"
              >
                <div class="addr">{{item.name}}</div>
                <div class="addrDetail">福建省厦门市{{item.address.length==0?"":item.address}}</div>
              </li>
            </ul>
            <div
              class="nextPage"
              @click="loadMore"
            >{{noData?'暂无更多数据':!noData&&nearByList.length==0?'':"加载更多"}}</div>
          </div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import GPS from "../utils/gps";
export default {
  name: "AddressMap",
  props: {
    // v-model绑定值
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showMap: false,
      focusSearch: false, //展示搜索结果
      locationKeyWord: "", //位置关键字
      searchResultList: [], // 搜索结果列表
      noSearchResult: false, //搜索结果
      nearByList: [], //附件列表
      address: "",
      longitude: "",
      latitude: "",
      addressDetail: "",
      map: null,
      pageIndex: 1, //11页码
      pageSize: 20, //页数
      noData: false,
      select: 0,
      changeMapBoxHeight: false
    };
  },
  methods: {
    blurResetScroll() {
      Utils.blurResetScroll();
    },
    focusFun() {
      this.focusSearch = true;
      this.searchResultList = [];
    },
    // 返回
    closePopup() {
      this.showMap = false;
      this.locationKeyWord = "";
      if (this.map) {
        this.changeMapBoxHeight = false;
      }
    },
    // 取消搜索
    cancel() {
      this.focusSearch = false;
      this.noSearchResult = false;
      this.locationKeyWord = "";
      this.searchResultList = [];
    },
    // 搜索
    search() {
      let _this = this;
      this.noSearchResult = false;
      if (!_this.locationKeyWord) {
        _this.searchResultList = [];
        return;
      }
      AMap.plugin("AMap.Autocomplete", function() {
        var autoOptions = { city: "厦门市", citylimit: true };
        var autoComplete = new AMap.Autocomplete(autoOptions);
        autoComplete.search(_this.locationKeyWord, (status, result) => {
          if (
            result.tips &&
            result.tips.length > 0 &&
            result.tips instanceof Array
          ) {
            _this.searchResultList = result.tips;
          } else {
            _this.noSearchResult = true;
          }
        });
      });
    },
    // 搜索结果选择
    searchRltSelect(value) {
      if (value) {
        this.address = value.name;
        this.longitude = value.location.lng;
        this.latitude = value.location.lat;
        let markerList = this.map.getAllOverlays();
        if (markerList) {
          this.map.remove(markerList);
        }
        this.select = 0;
        this.nearByList = [];
        this.pageIndex = 1;
        this.renderMarker();
        this.searchByNear();
        this.focusSearch = false;
        this.locationKeyWord = "";
      }
    },
    // 附近选择
    selectNearBy(value, idx) {
      this.select = idx;
      this.longitude = value.location.lng;
      this.latitude = value.location.lat;
      let markerList = this.map.getAllOverlays();
      if (markerList) {
        this.map.remove(markerList);
      }
      this.renderMarker();
    },
    // 完成选择
    confirmSelect() {
      let obj = {};
      if (this.select != null && this.nearByList.length) {
        obj = {
          name: this.nearByList[this.select].name,
          longitude: this.nearByList[this.select].location.lng,
          latitude: this.nearByList[this.select].location.lat
        };
      } else {
        obj = {
          name: "",
          longitude: this.longitude,
          latitude: this.latitude
        };
      }
      this.$emit("getLocation", obj);
      this.showMap = false;
      this.focusSearch = false;
      this.locationKeyWord = "";
      this.changeMapBoxHeight = false;
      this.renderMarker();
    },
    // 加载更多
    loadMore() {
      this.pageIndex++;
      this.searchByNear();
    },
    // 附近地址
    searchByNear() {
      let _this = this;
      _this.noData = false;
      AMap.plugin("AMap.PlaceSearch", () => {
        var placeSearch = new AMap.PlaceSearch({
          type:
            "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施", // 兴趣点类别
          pageSize: _this.pageSize,
          pageIndex: _this.pageIndex,
          city: "厦门市",
          citylimit: true, //是否强制限制在设置的城市内搜索
          autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        var cpoint = [_this.longitude, _this.latitude]; //中心点坐标
        placeSearch.searchNearBy("", cpoint, 200, function(status, result) {
          if (result) {
            if (result.poiList) {
              if (
                result.poiList.pois &&
                result.poiList.pois.length > 0 &&
                result.poiList.pois instanceof Array
              ) {
                _this.nearByList = _this.nearByList.concat(result.poiList.pois);
              }
            } else {
              _this.noData = true;
            }
          }
        });
      });
    },
    // 渲染覆盖物
    renderMarker() {
      let _this = this;
      let markerList = this.map.getAllOverlays();
      if (markerList) {
        this.map.remove(markerList);
      }
      var icon = new AMap.Icon({
        size: new AMap.Size(30, 30),
        image: require("../assets/img/my-map-position.png"),
        imageSize: new AMap.Size(30, 30)
      });
      var marker = new AMap.Marker({
        position: new AMap.LngLat(_this.longitude, _this.latitude),
        icon: icon,
        offset: new AMap.Pixel(-15, -15),
        animation: "AMAP_ANIMATION_DROP",
        draggable: false
      });
      var circle = new AMap.Circle({
        center: [_this.longitude, _this.latitude],
        radius: 200,
        borderWeight: 3,
        strokeColor: "transparent",
        fillOpacity: 0.15,
        strokeStyle: "dashed",
        strokeDasharray: [10, 10],
        fillColor: "#1791fc",
        zIndex: -1
      });
      circle.on("click", e => {
        _this.longitude = e.lnglat.getLng();
        _this.latitude = e.lnglat.getLat();
        _this.renderMarker();
        _this.nearByList = [];
        _this.pageIndex = 1;
        _this.searchByNear();
      });
      _this.map.panTo([_this.longitude, _this.latitude]);
      circle.setMap(this.map);
      _this.map.add(marker);
    },
    // 点击
    clickMap() {
      let _this = this;
      this.map.on("click", e => {
        let markerList = this.map.getAllOverlays();
        if (markerList) {
          this.map.remove(markerList);
        }
        _this.longitude = e.lnglat.getLng();
        _this.latitude = e.lnglat.getLat();
        _this.renderMarker();
        _this.nearByList = [];
        _this.pageIndex = 1;
        _this.searchByNear();
      });
    },
    // 我的定位
    goMyPosition() {
      this.select = 0;
      if (process.env.NODE_ENV !== "production") {
        let gcjlonlat = GPS.gcj_encrypt(24.47951, 118.08948); //测试
        this.longitude = gcjlonlat.lon;
        this.latitude = gcjlonlat.lat;
      } else {
        //  获取定位
      }
      this.initMap();
      this.clickMap();
    },
    initMap() {
      let _this = this;
      this.map = new AMap.Map("map", {
        zoom: 16,
        resizeEnable: true,
        center: [_this.longitude, _this.latitude] //中心点坐标
      });
      let markerList = this.map.getAllOverlays();
      if (markerList) {
        this.map.remove(markerList);
      }
      this.nearByList = [];
      this.pageIndex = 1;
      this.renderMarker();
      this.searchByNear();
    },
    // 监听高度
    changeHeight() {
      let nearByAddress = this.$refs.showAddress;
      if (nearByAddress.scrollTop >= 100) {
        this.changeMapBoxHeight = true;
      } else {
        this.changeMapBoxHeight = false;
      }
    }
  },
  mounted() {
    if (!this.longitude && !this.latitude) {
      this.goMyPosition();
    }
    this.$refs.showAddress.addEventListener("scroll", this.changeHeight);
  },
  watch: {
    locationKeyWord() {
      if (!this.locationKeyWord) {
        this.noSearchResult = false;
        this.locationKeyWord = "";
        this.searchResultList = [];
      }
    },
    value(val) {
      if (val) {
        this.showMap = val;
      }
    },
    showMap(val) {
      if (!val) this.$emit("input", false);
    }
  }
};
</script>

<style>
#bgContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
}
#bgContainer .bg-head {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.2s;
}
#bgContainer .bg-head.focus {
  top: -1rem;
}
#bgContainer .bg-head .head-nav {
  height: 1rem;
  line-height: 1rem;
  padding: 0 0.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#bgContainer .bg-head .head-nav .label {
  font-weight: 550;
}
#bgContainer .bg-head .search-box-adr {
  height: 1rem;
  line-height: 1rem;
  background-color: antiquewhite;
  padding: 0 0.2rem;
  position: relative;
  top: 0;
  background-color: #f5f8fa;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
#bgContainer .bg-head .search-box-adr form {
  width: 88%;
  flex-grow: 1;
}
#bgContainer .bg-head .search-box-adr > span {
  margin-left: 0.2rem;
}
#bgContainer .bg-head .search-box-adr form div {
  width: 100%;
  height: 0.64rem;
  margin-top: 0.18rem;
  border-radius: 0.05rem !important;
  background-color: #fff;
  overflow: hidden;
  transition: all 0.2s;
}
#bgContainer .bg-head .search-box-adr form input {
  width: 100%;
  height: 100%;
  padding: 0.1rem 0.2rem 0.1rem 0.5rem;
  border: none;
  outline: none;
  background-color: transparent !important;
  vertical-align: top;
}
#bgContainer .bg-head .search-box-adr .search-icon {
  width: 0.26rem;
  height: 0.26rem;
  position: absolute;
  left: 0.32rem;
  top: 0.36rem;
  background: url("../assets/img/search-icon.png") no-repeat;
  background-size: 100% 100%;
}
#bgContainer .searchResult {
  width: 100%;
  height: 100%;
  margin-top: 0.88rem;
  padding: 0.2rem 0.32rem 1.5rem;
  overflow-y: scroll;
}
#bgContainer .searchResult .no-addrDetail {
  margin-top: 2rem;
  color: #666;
  text-align: center;
}
#bgContainer ul li {
  border-bottom: 0.02rem solid #f5faf8;
  padding: 0.2rem;
  position: relative;
}
#bgContainer ul li.selected::after {
  content: "";
  position: absolute;
  width: 0.4rem;
  height: 0.4rem;
  background: url("../assets/img/selected.png") no-repeat;
  background-size: 100% 100%;
  right: 0.3rem;
  top: 0.4rem;
}
#bgContainer ul li div {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#bgContainer ul li .addrDetail {
  font-size: 0.24rem;
  color: #666;
}
#bgContainer .bg-map-box {
  width: 100%;
  height: 100%;
  padding-top: 2rem;
}
#bgContainer .bg-map-box .map-box {
  width: 100%;
  height: 6rem;
  position: relative;
  transition: all 0.3s linear;
  overflow: hidden;
}
#bgContainer .bg-map-box .map-box.changeHeight {
  height: 3rem !important;
}
#bgContainer .bg-map-box .map-box .goMyPosition {
  position: absolute;
  width: 1rem;
  height: 1rem;
  background: url("../assets/img/geolocation-icon.png") no-repeat;
  background-size: 100% 100%;
  right: 0.28rem;
  bottom: 0.78rem;
  z-index: 100;
}
#bgContainer .bg-map-box #map {
  width: 100%;
  height: 6rem;
}

#bgContainer .bg-map-box .showAddress {
  height: calc(100% - 7.5rem);
  overflow-y: scroll;
  transition: all 0.3s linear;
  z-index: 1500;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  border-radius: 20px;
  background: #fff;
}
#bgContainer .bg-map-box .showAddress.changeHeight {
  height: calc(100% - 4.5rem);
}
#bgContainer .bg-map-box .showAddress .nextPage {
  text-align: center;
  color: #4b89f7;
  margin: 0.3rem 0;
}
.amap-copyright {
  opacity: 0;
}
</style>