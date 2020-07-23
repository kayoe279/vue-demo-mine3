<template>
  <div>
    <v-popup v-model="show" mode="bottom" borderRadius="10">
      <div class="picker">
        <!-- 日期选择器 -->
        <div v-if="type!='time'" class="picker-modal" :class="{'active':showCalendar}">
          <div class="picker-modal-header">
            <div class="picker-icon picker-icon-zuozuo" @click="onSetYear('-1')"></div>
            <div class="picker-icon picker-icon-zuo" @click="onSetMonth('-1')"></div>
            <span class="picker-modal-header-title">{{title}}</span>
            <div class="picker-icon picker-icon-you" @click="onSetMonth('+1')"></div>
            <div class="picker-icon picker-icon-youyou" @click="onSetYear('+1')"></div>
          </div>
          <div class="picker-modal-info">
            <template v-if="isMultiSelect">
              <div class="picker-display">
                <span>{{beginText}}日期</span>
                <span class="picker-display-text">{{BeginTitle}}</span>
                <div
                  v-if="isContainTime"
                  class="picker-display-link"
                  :style="{color}"
                  @click="onShowTimePicker('begin')"
                >{{BeginTimeTitle}}</div>
              </div>
              <div class="picker-display">
                <span>{{endText}}日期</span>
                <span class="picker-display-text">{{EndTitle}}</span>
                <div
                  v-if="isContainTime"
                  class="picker-display-link"
                  :style="{color}"
                  @click="onShowTimePicker('end')"
                >{{EndTimeTitle}}</div>
              </div>
            </template>
            <template v-else>
              <div class="picker-display">
                <span>当前选择</span>
                <span class="picker-display-text">{{BeginTitle}}</span>
                <div
                  v-if="isContainTime"
                  class="picker-display-link"
                  :style="{color}"
                  @click="onShowTimePicker('begin')"
                >{{BeginTimeTitle}}</div>
              </div>
            </template>
          </div>
          <swiper
            class="picker-modal-body"
            :style="{'height':calendarHeight + 'px'}"
            :duration="200"
            loop
            :show-dots="false"
            height="100%"
            v-model="calendarIndex"
            @on-index-change="onSwiperChange"
          >
            <swiper-item
              class="picker-calendar"
              v-for="(calendar,calendarIndex2) in calendars"
              :key="calendarIndex2"
            >
              <div class="picker-calendar-view" v-for="(week,index) in weeks" :key="index - 7">
                <div class="picker-calendar-view-item">{{week}}</div>
              </div>
              <div
                class="picker-calendar-view"
                v-for="(date,dateIndex) in calendar"
                :key="dateIndex"
                @click="onSelectDate(date)"
              >
                <!-- 背景样式 -->
                <div
                  v-show="date.bgStyle.type"
                  :class="'picker-calendar-view-'+date.bgStyle.type"
                  :style="{background: date.bgStyle.background}"
                ></div>
                <!-- 正常和选中样式 -->
                <div
                  class="picker-calendar-view-item"
                  :style="{opacity: date.statusStyle.opacity, color: date.statusStyle.color, background: date.statusStyle.background}"
                >
                  <span>{{date.title}}</span>
                </div>
                <!-- 小圆点样式 -->
                <div
                  class="picker-calendar-view-dot"
                  :style="{opacity: date.dotStyle.opacity, background: date.dotStyle.background}"
                ></div>
                <!-- 信息样式 -->
                <div v-show="date.tips" class="picker-calendar-view-tips">{{date.tips}}</div>
              </div>
            </swiper-item>
          </swiper>
          <div class="picker-modal-footer">
            <div class="picker-footer-btn-box">
              <!-- <view class="picker-btn picker-cancel-btn"  @click="onCancel">取消</view> -->
              <div
                class="picker-sure-btn"
                :hover-stay-time="100"
                hover-class="picker-btn-active"
                @click="onConfirm"
              >确定</div>
            </div>
          </div>
        </div>
        <!-- 时间选择器 -->
        <div v-if="showTimePicker" class="picker-time-mask">
          <div class="picker-time">
            <div class="picker-modal-header">
              <span class="picker-modal-header-title">选择时间</span>
            </div>
            <picker :data="timeList" v-model="timeValue" @on-change="onTimeChange"></picker>
            <div class="picker-modal-footer">
              <div class="picker-modal-footer-info">
                <div class="picker-display">
                  <span>当前选择</span>
                  <span class="picker-display-text">{{PickerTimeTitle}}</span>
                </div>
              </div>
              <div class="picker-modal-footer-btn">
                <div class="picker-btn" @click="onCancelTime">取消</div>
                <div class="picker-btn" :style="{color}" @click="onConfirmTime">确定</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-popup>
  </div>
</template>

<script>
/**
 * 工具函数库
 */
const DateTools = {
  /**
   * 获取公历节日
   * @param date Date对象
   */
  getHoliday(date) {
    let holidays = {
      "0101": "元旦",
      "0214": "情人",
      "0308": "妇女",
      "0312": "植树",
      "0401": "愚人",
      "0501": "劳动",
      "0504": "青年",
      "0601": "儿童",
      "0701": "建党",
      "0801": "建军",
      "0903": "抗日",
      "0910": "教师",
      "1001": "国庆",
      "1031": "万圣",
      "1224": "平安",
      "1225": "圣诞"
    };
    let value = this.format(date, "mmdd");
    if (holidays[value]) return holidays[value];
    return false;
  },
  /**
   * 解析标准日期格式
   * @param s 日期字符串
   * @return 返回Date对象
   */
  parse: s => new Date(s.replace(/(年|月|-)/g, "/").replace(/(日)/g, "")),
  /**
   * 比较日期是否为同一天
   * @param a Date对象
   * @param b Date对象
   * @return Boolean
   */
  isSameDay: (a, b) =>
    a.getMonth() == b.getMonth() &&
    a.getFullYear() == b.getFullYear() &&
    a.getDate() == b.getDate(),
  /**
   * 格式化Date对象
   * @param d 日期对象
   * @param f 格式字符串
   * @return 返回格式化后的字符串
   */
  format(d, f) {
    var o = {
      "m+": d.getMonth() + 1,
      "d+": d.getDate(),
      "h+": d.getHours(),
      "i+": d.getMinutes(),
      "s+": d.getSeconds(),
      "q+": Math.floor((d.getMonth() + 3) / 3)
    };
    if (/(y+)/.test(f))
      f = f.replace(
        RegExp.$1,
        (d.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(f))
        f = f.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return f;
  },
  /**
   * 用于format格式化后的反解析
   * @param s 日期字符串
   * @param f 格式字符串
   * @return 返回Date对象
   */
  inverse(s, f) {
    var o = {
      y: "",
      m: "",
      d: "",
      h: "",
      i: "",
      s: ""
    };
    let d = new Date();
    if (s.length != f.length) return d;
    for (let i in f) if (o[f[i]] != undefined) o[f[i]] += s[i];
    if (o.y)
      d.setFullYear(
        o.y.length < 4
          ? (d.getFullYear() + "").substr(0, 4 - o.y.length) + o.y
          : o.y
      );
    o.m && d.setMonth(o.m - 1, 1);
    o.d && d.setDate(o.d - 0);
    o.h && d.setHours(o.h - 0);
    o.i && d.setMinutes(o.i - 0);
    o.s && d.setSeconds(o.s - 0);
    return d;
  },
  /**
   * 获取日历数组（42天）
   * @param date 日期对象或日期字符串
   * @param proc 处理日历(和forEach类似)，传递一个数组中的item
   * @return Array
   */
  getCalendar(date, proc) {
    let it = new Date(date),
      calendars = [];
    it.setDate(1);
    it.setDate(it.getDate() - ((it.getDay() == 0 ? 7 : it.getDay()) - 1)); //偏移量
    for (let i = 0; i < 42; i++) {
      let tmp = {
        dateObj: new Date(it),
        title: it.getDate(),
        isOtherMonth:
          it.getMonth() < date.getMonth() || it.getMonth() > date.getMonth()
      };
      calendars.push(Object.assign(tmp, proc ? proc(tmp) : {}));
      it.setDate(it.getDate() + 1);
    }
    return calendars;
  },
  /**
   * 获取日期到指定的月份1号(不改变原来的date对象)
   * @param d Date对象
   * @param v 指定的月份
   * @return Date对象
   */
  getDateToMonth(d, v) {
    let n = new Date(d);
    n.setMonth(v, 1);
    return n;
  },
  /**
   * 把时间数组转为时间字符串
   * @param t Array[时,分,秒]
   * @param showSecinds 是否显示秒
   * @return 字符串 时:分[:秒]
   */
  formatTimeArray(t, s) {
    let r = [...t];
    if (!s) r.length = 2;
    r.forEach((v, k) => (r[k] = ("0" + v).slice(-2)));
    return r.join(":");
  }
};
// import { Swiper, SwiperItem, Picker } from "vux";
export default {
  name: "v-calendar",
  // components: {
  //   Swiper,
  //   SwiperItem,
  //   Picker
  // },
  props: {
    //颜色
    color: {
      type: String,
      default: "#00b0f8"
    },
    //是否显示秒 针对type为datetime时生效
    showSeconds: {
      type: Boolean,
      default: false
    },
    //初始的值
    value: [String, Array],
    //类型date range datetime rangetime
    type: {
      type: String,
      default: "range"
    },
    // 只能选择当前日期之后的日期
    fromCurrentDate: {
      type: Boolean,
      default: false
    },
    //是否显示
    showCalendar: {
      type: Boolean,
      default: false
    },
    //初始格式
    format: {
      type: String,
      default: ""
    },
    //显示公历节日
    showHoliday: {
      type: Boolean,
      default: true
    },
    //显示提示
    showTips: {
      type: Boolean,
      default: false
    },
    //开始文案 针对type为范围选择时生效
    beginText: {
      type: String,
      default: "开始"
    },
    //结束文案 针对type为范围选择时生效
    endText: {
      type: String,
      default: "结束"
    }
  },
  data() {
    return {
      show: false, //是否显示popup
      isMultiSelect: false, //是否为多选
      isContainTime: false, //是否包含时间
      date: {}, //当前日期对象
      weeks: ["一", "二", "三", "四", "五", "六", "日"],
      title: "初始化", //标题
      calendars: [[], [], []], //日历数组
      calendarIndex: 1, //当前日历索引
      checkeds: [], //选中的日期对象集合
      showTimePicker: false, //是否显示时间选择器
      timeValue: [0, 0, 0], //时间选择器的值
      timeList: [
        new Array(24).fill(1).map((v, i) => i),
        new Array(60).fill(1).map((v, i) => i),
        new Array(60).fill(1).map((v, i) => i)
      ], //时间选择器数据
      timeType: "begin", //当前时间选择的类型
      beginTime: [0, 0, 0], //当前所选的开始时间值
      endTime: [0, 0, 0], //当前所选的结束时间值
      calendarHeight: "375" //高度
    };
  },
  methods: {
    //设置值
    setValue(value) {
      this.date = new Date();
      this.checkeds = [];
      this.isMultiSelect = this.type.indexOf("range") >= 0;
      this.isContainTime = this.type.indexOf("time") >= 0;
      //将字符串解析为Date对象
      let parseDateStr = str =>
        this.format
          ? DateTools.inverse(str, this.format)
          : DateTools.parse(str);
      if (value) {
        if (this.isMultiSelect) {
          Array.isArray(value) &&
            value.forEach((dateStr, index) => {
              let date = parseDateStr(dateStr);
              let time = [
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
              ];
              if (index == 0) this.beginTime = time;
              else this.endTime = time;
              this.checkeds.push(date);
            });
        } else {
          if (this.type == "time") {
            let date = parseDateStr("2019/1/1 " + value);
            this.beginTime = [
              date.getHours(),
              date.getMinutes(),
              date.getSeconds()
            ];
            this.onShowTimePicker("begin");
          } else {
            this.checkeds.push(parseDateStr(value));
            if (this.isContainTime)
              this.beginTime = [
                this.checkeds[0].getHours(),
                this.checkeds[0].getMinutes(),
                this.checkeds[0].getSeconds()
              ];
          }
        }
        if (this.checkeds.length) this.date = new Date(this.checkeds[0]);
      } else {
        if (this.isContainTime) {
          this.beginTime = [
            this.date.getHours(),
            this.date.getMinutes(),
            this.date.getSeconds()
          ];
          if (this.isMultiSelect) this.endTime = [...this.beginTime];
        }
        this.checkeds.push(new Date(this.date));
      }
      if (this.type != "time") this.refreshCalendars(true);
      else this.onShowTimePicker("begin");
    },
    //改变年份
    onSetYear(value) {
      this.date.setFullYear(this.date.getFullYear() + parseInt(value));
      this.refreshCalendars(true);
    },
    //改变月份
    onSetMonth(value) {
      this.date.setMonth(this.date.getMonth() + parseInt(value));
      this.refreshCalendars(true);
    },
    //时间选择变更
    onTimeChange(time) {},
    //设置时间选择器的显示状态
    onShowTimePicker(type) {
      this.showTimePicker = true;
      this.timeType = type;
      this.timeValue =
        type == "begin" ? [...this.beginTime] : [...this.endTime];
      this.timeValue = this.timeValue.map(v => String(v));
    },
    //处理日历
    procCalendar(item) {
      //定义初始样式
      let startDate = new Date(new Date().toLocaleDateString()).getTime();
      let selectDate = new Date(
        new Date(item.dateObj).toLocaleDateString()
      ).getTime();
      let disabledColor = this.fromCurrentDate && startDate > selectDate;
      item.statusStyle = {
        opacity: 1,
        color: item.isOtherMonth || disabledColor ? "#ddd" : "#000",
        background: "transparent"
      };
      item.bgStyle = {
        type: "",
        background: "transparent"
      };
      item.dotStyle = {
        opacity: 1,
        background: "transparent"
      };
      item.tips = "";
      //标记今天的日期
      if (DateTools.isSameDay(new Date(), item.dateObj)) {
        item.statusStyle.color = this.color;
        if (item.isOtherMonth) item.statusStyle.opacity = 0.3;
      }
      //标记选中项
      this.checkeds.forEach(date => {
        if (DateTools.isSameDay(date, item.dateObj)) {
          item.statusStyle.background = this.color;
          item.statusStyle.color = "#fff";
          item.statusStyle.opacity = 1;
          if (this.isMultiSelect && this.showTips) item.tips = this.beginText;
        }
      });
      //节假日或今日的日期标点
      if (item.statusStyle.background != this.color) {
        let holiday = this.showHoliday
          ? DateTools.getHoliday(item.dateObj)
          : false;
        if (holiday || DateTools.isSameDay(new Date(), item.dateObj)) {
          item.title = holiday || item.title;
          item.dotStyle.background = this.color;
          if (item.isOtherMonth) item.dotStyle.opacity = 0.2;
        }
      } else {
        item.title = item.dateObj.getDate();
      }
      //有两个日期
      if (this.checkeds.length == 2) {
        if (DateTools.isSameDay(this.checkeds[0], item.dateObj)) {
          //开始日期
          item.bgStyle.type = "bgbegin";
        }
        if (DateTools.isSameDay(this.checkeds[1], item.dateObj)) {
          //结束日期
          if (this.isMultiSelect && this.showTips)
            item.tips = item.bgStyle.type
              ? this.beginText + " / " + this.endText
              : this.endText;
          if (!item.bgStyle.type) {
            //开始日期不等于结束日期
            item.bgStyle.type = "bgend";
          } else {
            item.bgStyle.type = "";
          }
        }
        if (
          !item.bgStyle.type &&
          +item.dateObj > +this.checkeds[0] &&
          +item.dateObj < +this.checkeds[1]
        ) {
          //中间的日期
          item.bgStyle.type = "bg";
          item.statusStyle.color = this.color;
        }
        if (item.bgStyle.type) {
          item.bgStyle.background = this.color;
          item.dotStyle.opacity = 1;
          item.statusStyle.opacity = 1;
        }
      }
    },
    //刷新日历
    refreshCalendars(refresh = false) {
      let date = new Date(this.date);
      let before = DateTools.getDateToMonth(date, date.getMonth() - 1);
      let after = DateTools.getDateToMonth(date, date.getMonth() + 1);
      if (this.calendarIndex == 0) {
        if (refresh)
          this.calendars.splice(
            0,
            1,
            DateTools.getCalendar(date, this.procCalendar)
          );
        this.calendars.splice(
          1,
          1,
          DateTools.getCalendar(after, this.procCalendar)
        );
        this.calendars.splice(
          2,
          1,
          DateTools.getCalendar(before, this.procCalendar)
        );
      } else if (this.calendarIndex == 1) {
        this.calendars.splice(
          0,
          1,
          DateTools.getCalendar(before, this.procCalendar)
        );
        if (refresh)
          this.calendars.splice(
            1,
            1,
            DateTools.getCalendar(date, this.procCalendar)
          );
        this.calendars.splice(
          2,
          1,
          DateTools.getCalendar(after, this.procCalendar)
        );
      } else if (this.calendarIndex == 2) {
        this.calendars.splice(
          0,
          1,
          DateTools.getCalendar(after, this.procCalendar)
        );
        this.calendars.splice(
          1,
          1,
          DateTools.getCalendar(before, this.procCalendar)
        );
        if (refresh)
          this.calendars.splice(
            2,
            1,
            DateTools.getCalendar(date, this.procCalendar)
          );
      }
      this.title = DateTools.format(this.date, "yyyy年mm月");
    },
    //滑块切换
    onSwiperChange(index) {
      if (this.showCalendar) {
        this.calendarIndex = index;
        let calendar = this.calendars[this.calendarIndex];
        this.date = new Date(calendar[22].dateObj); //取中间一天，保证是当前的月份
        this.refreshCalendars();
      }
    },
    //选中日期
    onSelectDate(date) {
      // 限制从当前日期开始选择
      if (this.fromCurrentDate) {
        let startDate = new Date(new Date().toLocaleDateString()).getTime();
        let selectDate = new Date(
          new Date(date.dateObj).toLocaleDateString()
        ).getTime();
        if (startDate > selectDate) {
          return;
        }
      }
      if (
        (~this.type.indexOf("range") && this.checkeds.length == 2) ||
        (!~this.type.indexOf("range") && this.checkeds.length)
      ) {
        this.checkeds = [];
      }
      this.checkeds.push(new Date(date.dateObj));
      this.checkeds.sort((a, b) => a - b); //从小到大排序
      this.calendars.forEach(calendar => {
        calendar.forEach(this.procCalendar); //重新处理
      });
    },
    //时间选择取消
    onCancelTime() {
      this.showTimePicker = false;
      this.type == "time" && this.onCancel();
    },
    //时间选择确定
    onConfirmTime() {
      if (this.timeType == "begin") this.beginTime = this.timeValue;
      else this.endTime = this.timeValue;
      this.showTimePicker = false;
      this.type == "time" && this.onConfirm();
    },
    //取消
    onCancel() {
      // this.$emit('cancel', false);
      this.show = false;
      this.$emit("update:showCalendar", false);
    },
    //确定
    onConfirm() {
      let result = {
        value: null,
        date: null
      };
      //定义默认格式
      let defaultFormat = {
        date: "yyyy/mm/dd",
        time: "hh:ii" + (this.showSeconds ? ":ss" : ""),
        datetime: ""
      };
      defaultFormat["datetime"] = defaultFormat.date + " " + defaultFormat.time;
      let fillTime = (date, timeArr) => {
        date.setHours(timeArr[0], timeArr[1]);
        if (this.showSeconds) date.setSeconds(timeArr[2]);
      };
      if (this.type == "time") {
        let date = new Date();
        fillTime(date, this.beginTime);
        result.value = DateTools.format(
          date,
          this.format ? this.format : defaultFormat.time
        );
        result.date = date;
      } else {
        if (this.isMultiSelect) {
          let values = [],
            dates = [];
          if (this.checkeds.length < 2) return this.$toast("请选择两个日期");
          this.checkeds.forEach((date, index) => {
            let newDate = new Date(date);
            if (this.isContainTime) {
              let time = [this.beginTime, this.endTime];
              fillTime(newDate, time[index]);
            }
            values.push(
              DateTools.format(
                newDate,
                this.format
                  ? this.format
                  : defaultFormat[this.isContainTime ? "datetime" : "date"]
              )
            );
            dates.push(newDate);
          });
          result.value = values;
          result.date = dates;
        } else {
          let newDate = new Date(this.checkeds[0]);
          if (this.isContainTime) {
            newDate.setHours(this.beginTime[0], this.beginTime[1]);
            if (this.showSeconds) newDate.setSeconds(this.beginTime[2]);
          }
          result.value = DateTools.format(
            newDate,
            this.format
              ? this.format
              : defaultFormat[this.isContainTime ? "datetime" : "date"]
          );
          result.date = newDate;
        }
      }
      this.show = false;
      this.$emit("update:showCalendar", false);
      this.$emit("confirm", result);
    }
  },
  computed: {
    BeginTitle() {
      let value = "未选择";
      if (this.checkeds.length)
        value = DateTools.format(this.checkeds[0], "yyyy/mm/dd");
      return value;
    },
    EndTitle() {
      let value = "未选择";
      if (this.checkeds.length == 2)
        value = DateTools.format(this.checkeds[1], "yyyy/mm/dd");
      return value;
    },
    PickerTimeTitle() {
      return DateTools.formatTimeArray(this.timeValue, this.showSeconds);
    },
    BeginTimeTitle() {
      return this.BeginTitle != "未选择"
        ? DateTools.formatTimeArray(this.beginTime, this.showSeconds)
        : "";
    },
    EndTimeTitle() {
      return this.EndTitle != "未选择"
        ? DateTools.formatTimeArray(this.endTime, this.showSeconds)
        : "";
    }
  },
  mounted() {
    this.calendarHeight = this.$root.$el.clientWidth;
  },
  watch: {
    // 控制日历
    showCalendar(newValue, oldValue) {
      if (newValue) {
        this.setValue(this.value);
        this.showTimePicker = false;
        this.show = newValue;
      }
    },
    // 控制popup层
    show(newValue, oldValue) {
      if (!newValue) {
        this.$emit("update:showCalendar", false);
      }
    },
    // value(newValue, oldValue) {
    //   setTimeout(() => {
    //     this.setValue(newValue);
    //   }, 0);
    // }
  }
};
</script>

<style lang="scss" scoped>
$z-index: 100;
$cell-spacing: 10px;
$calendar-size: 350px;
$calendar-item-size: calc(100% / 7);

.custom-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 700;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  visibility: hidden;
}

.custom-popup-mask.active {
  opacity: 1;
  visibility: visible;
}

.custom-popup {
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f7f7f7;
  border-radius: 12px 12px 0 0;
  transform: translate3d(0, 100%, 0);
  transform-origin: center;
  transition: all 0.3s ease-in-out;
  z-index: 900;
  visibility: hidden;
}

.custom-popup.active {
  transform: translate3d(0, 0, 0);
  visibility: visible;
}

.picker-time-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 900;
}

.picker {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 12px 12px 0 0;
  font-size: 15px;

  &-sure-btn {
    width: 50%;
    height: 40px;
    text-align: center;
    background-color: #00b0f8;
    color: #ffffff !important;
    font-weight: 550;
    font-size: 18px;
    margin: 0 auto;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-btn {
    padding: $cell-spacing * 0.5 $cell-spacing;
    border-radius: 6px;
    color: #666;
  }

  &-cancel-btn {
    background-color: #f2f2f2 !important;
  }

  &-display {
    color: #666;
    padding: 0 5px;

    &-text {
      color: #000;
      margin: 0 $cell-spacing * 0.5;
    }

    &-link {
      display: inline-block;

      &-active {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }

  &-footer-btn-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-time {
    width: 80% !important;
    position: absolute;
    background: #fff;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }

  &-modal {
    background: #fff;
    border-radius: 12px 12px 0 0;
    width: 100%;
    height: 100%;
    padding: 10px 0 0;

    &-header {
      text-align: center;
      line-height: 40px;
      font-size: 16px;

      &-title {
        display: inline-block;
        width: 40%;
      }

      .picker-icon {
        display: inline-block;
        line-height: 25px;
        width: 25px;
        height: 25px;
        border-radius: 25px;
        text-align: center;
        margin: 5px;
        background: #f7f8fc;
        font-size: 18px;
        color: #b8bfc6;
      }
    }

    &-info {
      width: 100%;
      display: flex;
      padding: 5px;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    &-body {
      width: 100% !important;
      height: $calendar-size;
      position: relative;
    }

    &-time {
      width: 100%;
      height: 90px;
      text-align: center;
      line-height: 30px;
    }

    &-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $cell-spacing;

      &-btn {
        flex-shrink: 0;
        display: flex;
      }
    }
  }

  &-calendar {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    &-view {
      position: relative;
      width: $calendar-item-size;
      height: $calendar-item-size;
      text-align: center;

      &-bgbegin,
      &-bg,
      &-bgend,
      &-item,
      &-dot,
      &-tips {
        position: absolute;
        transition: 0.2s;
      }

      &-bgbegin,
      &-bg,
      &-bgend {
        opacity: 0.15;
        height: 80%;
      }

      &-bg {
        left: 0;
        top: 10%;
        width: 100%;
      }

      &-bgbegin {
        border-radius: $calendar-item-size 0 0 $calendar-item-size;
        top: 10%;
        left: 10%;
        width: 90%;
      }

      &-bgend {
        border-radius: 0 $calendar-item-size $calendar-item-size 0;
        top: 10%;
        left: 0%;
        width: 90%;
      }

      &-item {
        left: 5%;
        top: 5%;
        width: 90%;
        height: 90%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &-dot {
        right: 10%;
        top: 10%;
        width: 6px;
        height: 6px;
        border-radius: 6px;
      }

      &-tips {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #4e4b46;
        color: #fff;
        border-radius: 6px;
        padding: 5px 10px;
        font-size: 12px;
        width: max-content;
        margin-bottom: 5px;
        pointer-events: none;

        &:after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 5px 5px 0 5px;
          border-color: #4e4b46 transparent transparent transparent;
        }
      }
    }
  }
}

@font-face {
  font-family: "mxdatepickericon";
  src: url("data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAMYAAsAAAAACBgAAALMAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDIgqDRIJiATYCJAMUCwwABCAFhG0HSRvfBsg+QCa3noNAyAQ9w6GDvbwpNp2vloCyn8bD/x+y+/5qDhtj+T4eRVEcbsCoKMFASzCgLdDkmqYDwgxkWQ6YH5L/YnppOlLEjlnter43YRjU7M6vJ3iGADVAgJn5kqjv/wEii23T86UsAQT+04fV+o97VTMx4PPZt4DlorLXwIQiGMA5uhaVrBWqGHfQXcTEiE+PE+g2SUlxWlLVBHwUYFMgrgwSB3wstTKSGzqF1nOyiGeeOtNjV4An/vvxR58PSc3AzrMViyDvPo/7dVEUzn5GROfIWAcU4rLXfMFdhte56y4We9gGNEVIezkBOOaQXUrbTf/hJVkhGpDdCw7dSOEzByMEn3kIic98hMxnAfeFPKWCbjRcA148/HxhCEkaA94eGWFaGolsblpaWz8/Po2WVuNHh1fmBpZHIpqal9fOjizhTteY+RZ9rv02I/pq0W6QVH3pSncBz3m55r9ZIPycHfmenvxe4uyutIgfT5u4bgkDusl9gcF0rnfnz+b2NpSaQWBFeu8GIL1xQj5AH/6FAsEr/50F28e/gA9ny6KjLrxIp0TE+UucmQOl5AFNLXkzZufWamWHYEI39PEP2If97CMdm51N6DSmIekwAVmneXTBr0PVYx+aTgfQbU3p+R4jKHdRurBq0oEw6AKSfm+QDbpGF/w3VOP+oBnMHbqdx409FjP4RRHHkAj5IWgQiBUjHfMTuQ1Icpg5avI4sQVRu8EHdWptM1aKrIjuscfeL+kZwxBTYoElztOQ2UygjRIjEphaZsyWodHgvm9SC8QC/JygEA6DiCDeEMhAQFhhOpvxa/18A0TiYMahIy0L2hYIZWeYH9JR085Al4qts1re5St2/SR6DINBGEVYQCWOETHDMAHZ+pcZIQJGTV4RtMmg8UbhuWL1+VLLA2RFHYC71kiRo0SNpjwQh8pj2EFU3oTNmS1WqgIA")
    format("woff2");
}

.picker-icon {
  font-family: "mxdatepickericon" !important;
}

.picker-icon-you:before {
  content: "\e63e";
}

.picker-icon-zuo:before {
  content: "\e640";
}

.picker-icon-zuozuo:before {
  content: "\e641";
}

.picker-icon-youyou:before {
  content: "\e642";
}
</style>
