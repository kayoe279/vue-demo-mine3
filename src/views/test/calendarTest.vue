<template>
  <!-- Calendar -->
  <div class="test">
    <h1>自定义Calendar组件</h1>
    <div class="test-btn check-btn" @click="showOption=true">查看可配置项</div>
    <div class="test-btn" @click="ClickCalendar('date')">选择日期</div>
    <div :class="{'dateText':siginDate}">{{siginDate||"请选择"}}</div>
    <div class="test-btn" @click="ClickCalendar('range')">选择日期范围</div>
    <div class="dateText" v-if="dateRange.length">
      <span v-for="(item, index) in dateRange" :key="index">{{index==0?item + "至":item}}</span>
    </div>
    <div v-else>请选择</div>
    <div class="test-btn" @click="ClickCalendar('datetime')">选择日期时间</div>
    <div :class="{'dateText':dateTime}">{{dateTime||"请选择"}}</div>
    <div class="test-btn" @click="ClickCalendar('rangetime')">选择日期时间范围</div>
    <div class="dateText" v-if="dateTimeRange.length">
      <span v-for="(item, index) in dateTimeRange" :key="index">{{index==0?item + "至":item}}</span>
    </div>
    <div v-else>请选择</div>
    <div class="test-btn" @click="ClickCalendar('date',true)">限制从起始日期选择</div>
    <div :class="{'dateText':limitSiginDate}">{{limitSiginDate||"请选择"}}</div>
    <v-popup v-model="showOption" mode="center" borderRadius="6">
      <div class="optionsContent">
        <p>
          <span>showCalendar</span> 显示日历(使用时 :showCalendar.sync)
        </p>
        <p>
          <span>type</span> 选择类型(默认range),可选 date单个日期,range日期范围, datetime日期时间 rangetime日期时间范围
        </p>
        <p>
          <span>color</span> 主题色(默认#00b0f8)
        </p>
        <p>
          <span>showSeconds</span> 是否显示秒(默认false),type为datetime时生效
        </p>
        <p>
          <span>fromCurrentDate</span> 是否从当前时间开始选择(默认false)
        </p>
        <p>
          <span>showHoliday</span> 是否显示公历的节日(默认true)
        </p>
        <p>
          <span>showTips</span> 是否显示日期范围提示(默认false)
        </p>
        <p>
          <span>beginText</span> 开始文案(默认"开始"),针对showTips=true以及type为范围选择时生效
        </p>
        <p>
          <span>endText</span> 是否显示日期范围提示(默认"结束"),针对showTips=true以及type为范围选择时生效
        </p>
        <p>
          <span>@confirm</span> 确认选择事件,返回value对象
        </p>
      </div>
    </v-popup>
    <v-calendar
      :showCalendar.sync="show"
      :type="type"
      :fromCurrentDate="fromCurrentDate"
      :value="dateValue"
      @confirm="changeDateRange"
    ></v-calendar>
  </div>
</template>

<script>
import vCalendar from "../../components/v-calendar";
export default {
  name: "loadingTest",
  components: {
    vCalendar
  },
  data() {
    return {
      index: 0,
      showOption: false,
      show: false,
      type: "",
      dateRange: [], //范围
      siginDate: "", //单个日期
      limitSiginDate: "", //限制单个日期
      fromCurrentDate: false,
      dateTime: "", //日期时间
      dateTimeRange: [] //日期时间范围
    };
  },
  computed: {
    // 初始值
    dateValue() {
      if (this.type == "range") return this.dateRange;
      else if (this.type == "date" && !this.fromCurrentDate)
        return this.siginDate;
      else if (this.type == "date" && this.fromCurrentDate)
        return this.limitSiginDate;
      else if (this.type == "datetime") return this.dateTime;
      else if (this.type == "rangetime") return this.dateTimeRange;
    }
  },
  methods: {
    ClickCalendar(type, isLimit) {
      this.fromCurrentDate = !!isLimit;
      this.show = true;
      this.type = type;
    },
    changeDateRange(date) {
      console.log(date);
      if (this.type == "range") {
        let startDate = date.value[0].replace(/\//g, "-");
        let endDate = date.value[1].replace(/\//g, "-");
        this.dateRange = [startDate, endDate];
      } else if (this.type == "date" && !this.fromCurrentDate) {
        this.siginDate = date.value.replace(/\//g, "-");
      } else if (this.type == "date" && this.fromCurrentDate) {
        this.limitSiginDate = date.value.replace(/\//g, "-");
      } else if (this.type == "datetime") {
        this.dateTime = date.value.replace(/\//g, "-");
      } else if (this.type == "rangetime") {
        this.dateTimeRange = [
          date.value[0].replace(/\//g, "-"),
          date.value[1].replace(/\//g, "-")
        ];
      }
    }
  },
  mounted() {}
};
</script>
<style lang="css">
.test {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 0.3rem 0;
  overflow-y: auto;
}
.test h1 {
  font-size: 0.4rem;
  font-weight: 550;
  margin-bottom: 0.4rem;
}
.test .dateText {
  color: sandybrown;
}
.content {
  height: 300px;
  text-align: left;
  padding: 0.3rem;
}
</style>