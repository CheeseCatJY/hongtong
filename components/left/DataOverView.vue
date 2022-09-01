<template>
  <div class="w-full h-full relative p-35px  box-border">
    <!-- 左边的第一栏 -->
    <!-- bg-gray-300 pl-35/1550 pr-25/1550 box-border  style="height:810px;padding-top:35px;padding-bottom:35px;-->
    <el-row class="h-430/740 flex justify-between">
      <!-- 瞬时流量区域 -->
      <div class="w-456/1490 h-full flex flex-col items-center justify-center text-white relative">
        <img src="@/static/images/hongtong/ani_1.png" class="h-full absolute top-0 left-0" alt="">
        <span class="text-30px mb-15.5/430">{1794.24}</span>
        <span class="text-26px truncate">瞬时流量</span>
      </div>
      <!-- 数据展示区域 -->
      <div class="w-1030/1490 h-full pl-24/1490">
        <!-- 标题 -->
        <div class="w-full h-49/430  flex justify-between items-center border-b border-btn_1 box-content" >
          <div class="w-full h-full flex items-center">
            <img src="@/static/images/hongtong/bt-l@2x.png" class="h-btIconH" alt />
            <span class="text-white text-32px pl-6.5/1006 flex items-center justify-center">源水数据总览</span>
          </div>
          <img src="@/static/images/hongtong/bt-r@2x.png" class=" self-center" alt />
        </div>
        <!-- 内容 -->
        <div class="mt-25/740 w-full h-245/430 flex justify-between                                                                       ">
          <div class="w-229/1227 h-full text-white flex flex-col justify-center items-center relative ml-25px">
            <img src="@/static/images/hongtong/zsb1@2x.png" class="w-full h-full absolute top-0 left-0" alt/>
            <span class="text-38px font-bold mb-42/810">{{formatValue(data.inDay)}}</span>
            <span class="text-25px truncate">源水日流量</span>
          </div>
          <div class="w-229/1227 h-full text-white flex flex-col justify-center items-center relative ml-25px">
            <img src="@/static/images/hongtong/zsb1@2x.png" class="w-full h-full absolute top-0 left-0" alt/>
            <span class="text-38px font-bold mb-42/810">{{formatValue(data.inMonth/10000)}}</span>
            <span class="text-25px truncate">月流量(万)</span>
          </div>
          <div class="w-229/1227 h-full text-white flex flex-col justify-center items-center relative ml-25px">
            <img src="@/static/images/hongtong/zsb1@2x.png" class="w-full h-full absolute top-0 left-0" alt/>
            <span class="text-38px font-bold mb-42/810">{{formatValue(data.inYear/10000)}}</span>
            <span class="text-25px truncate">年流量(万)</span>
          </div>
        </div>
      </div>
    </el-row>
    <el-row class="h-309/740 flex justify-between">
      <!-- 按钮切换区域 -->
      <div class="w-456/1490 h-full flex flex-col pl-30/1550">
        <div @click="titleIndex = index" :class="titleIndex === index ? 'border-btn_1 bg-btn_1' : 'border-btn_2 bg-btn_2'" class="w-352/456 h-92/309 border-2  flex justify-center items-center text-33px text-white mt-10/309 relative" v-for="(item, index) in titleList" :key="item">
          <span>{{item}}</span>
          <img v-if="titleIndex === index" src="@/static/images/hongtong/leftSel.png" class="absolute -right-37/352 h-30/92" />
        </div>
      </div>
      <!-- 数据展示区域 -->
      <!-- 一期的 -->
      <div v-show="titleIndex === 0" class="w-1030/1490 h-full pl-24/1490 flex justify-around">
        <div class="w-221/1006 h-full flex flex-col items-center relative" >
          <img src="@/static/images/hongtong/ani_3.png" class="w-full absolute top-0 left-0" alt="">
          <span class="text-white text-26px mt-109/309 truncate">瞬时流量</span>
          <span class="text-white text-28px font-bold mt-126/309">{{latest1.instFlow ||'-'}}</span>
        </div>
        <div class="w-221/1006 h-full flex flex-col items-center relative" >
          <img src="@/static/images/hongtong/ani_3.png" class="w-full absolute top-0 left-0" alt="">
          <span class="text-white text-26px mt-109/309 truncate">日流量</span>
          <span class="text-white text-28px font-bold mt-126/309">{{formatValue(data1.day.dayFlow) || '-'}}</span>
        </div>
        <div class="w-221/1006 h-full flex flex-col items-center relative" >
          <img src="@/static/images/hongtong/ani_3.png" class="w-full absolute top-0 left-0" alt="">
          <span class="text-white text-26px mt-109/309 truncate">月流量（万）</span>
          <span class="text-white text-28px font-bold mt-126/309">{{formatValue(data1.month.dayFlow / 10000) || '-'}}</span>
        </div>
        <div class="w-221/1006 h-full flex flex-col items-center relative" >
          <img src="@/static/images/hongtong/ani_3.png" class="w-full absolute top-0 left-0" alt="">
          <span class="text-white text-26px mt-109/309 truncate">年流量(万)</span>
          <span class="text-white text-28px font-bold mt-126/309">{{formatValue(data1.year.dayFlow / 10000) || '-'}}</span>
        </div>
      </div>
      <!-- 二期 -->
      <div v-show="titleIndex === 1" class="w-1030/1490 h-full pl-24/1490 flex justify-around">
        <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center" >
          <span class="text-white text-26px mt-109/309 truncate">瞬时流量</span>
          <span class="text-white text-28px font-bold mt-126/309">{{latest2.instFlow ||'-'}}</span>
        </div>
        <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center" >
          <span class="text-white text-26px mt-109/309 truncate">日流量</span>
          <span class="text-white text-28px font-bold mt-126/309">{{formatValue(data2.day.dayFlow) || '-'}}</span>
        </div>
        <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center" >
          <span class="text-white text-26px mt-109/309 truncate">月流量（万）</span>
          <span class="text-white text-28px font-bold mt-126/309">{{formatValue(data2.month.dayFlow / 10000) || '-'}}</span>
        </div>
        <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center" >
          <span class="text-white text-26px mt-109/309 truncate">年流量(万)</span>
          <span class="text-white text-28px font-bold mt-126/309">{{formatValue(data2.year.dayFlow / 10000) || '-'}}</span>
        </div>
      </div>
      <!-- 三期 -->
      <div v-show="titleIndex === 2" class="w-1030/1490 h-full pl-24/1490 flex justify-around">
        <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center" >
          <span class="text-white text-26px mt-109/309 truncate">瞬时流量</span>
          <span class="text-white text-28px font-bold mt-126/309">{{latest3.instFlow ||'-'}}</span>
        </div>
        <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center" >
          <span class="text-white text-26px mt-109/309 truncate">日流量</span>
          <span class="text-white text-28px font-bold mt-126/309">{{'-'}}</span>
        </div>
        <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center" >
          <span class="text-white text-26px mt-109/309 truncate">月流量（万）</span>
          <span class="text-white text-28px font-bold mt-126/309">{{'-'}}</span>
        </div>
        <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center" >
          <span class="text-white text-26px mt-109/309 truncate">年流量(万)</span>
          <span class="text-white text-28px font-bold mt-126/309">{{'-'}}</span>
        </div>
      </div>
    </el-row>
     <img src="@/static/images/hongtong/boxTop.png" alt="" class="absolute w-full top-0 left-0 z-20">
    <img src="@/static/images/hongtong/boxBottom.png" alt="" class="absolute w-full bottom-0 left-0 z-20" >
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "summaryPanel",
  data() {
    return {
      data: {},
      titleList: ['一期','二期','三期'],
      titleIndex: 0
    };
  },
  computed: {
    ...mapState({
      latest: state => state.meter.meterLatestList,
      dayData: state => state.meter.meterDayData
    }),
    latest1() {
      return this.latest.find(item => item.deviceNo == "4111312405964") || {};
    },
    latest2() {
      return this.latest.find(item => item.deviceNo == "4111312405965") || {};
    },
    latest3() {
      return {};
    },
    data1() {
      return {
        day:
          this.dayData.day.find(item => item.deviceNo == "4111312405964") || {},
        month:
          this.dayData.month.find(item => item.deviceNo == "4111312405964") ||
          {},
        year:
          this.dayData.year.find(item => item.deviceNo == "4111312405964") || {}
      };
    },
    data2() {
      return {
        day:
          this.dayData.day.find(item => item.deviceNo == "4111312405965") || {},
        month:
          this.dayData.month.find(item => item.deviceNo == "4111312405965") ||
          {},
        year:
          this.dayData.year.find(item => item.deviceNo == "4111312405965") || {}
      };
    }
  },
  methods: {
    ...mapActions({
      currentData: "ht/currentData"
    }),
    async initData() {
      this.data = await this.currentData();
    },
    formatValue(value, num = 2) {
      return value && value.toFixed(num);
    }
  },
  created() {
    this.initData();
    this.$store.dispatch("meter/getMeterDataByDay");
    // this.$bus.$on('update-factory-data', this.updateData)
  },
  mounted() {},
  destroyed() {
    // this.$bus.$off('update-factory-data', this.updateData)
    // clearInterval(this.timeIndex)
  }
};
</script>