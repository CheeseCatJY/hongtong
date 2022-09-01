<template>
  <!--  class="bg-gray-300 pl-35/1550 pr-25/1550 box-border " style="width:1550px;height:1161px;padding-top:35px;padding-bottom:35px;" -->
  <!-- 数据展示栏 -->
  <div class="w-full h-full p-35px relative">
    <div class="w-full h-762/1091">
      <el-row class="h-430/740 flex justify-between">
        <!-- 瞬时流量区域 -->
        <div class="w-456/1490 h-full flex flex-col items-center justify-center text-white relative">
          <img src="@/static/images/hongtong/ani_2.png" class="h-full absolute top-0 left-0" alt="">
          <span class="text-30px mb-15.5/430">1794.24</span>
          <span class="text-26px truncate">瞬时流量</span>
        </div>
        <!-- 数据展示区域 -->
        <div class="w-1030/1490 h-full pl-24/1490">
          <!-- 标题 -->
          <div
            class="w-full h-49/430 flex justify-between items-center border-b border-btn_1 box-content"
          >
            <div class="w-full h-full flex items-center">
              <img src="@/static/images/hongtong/bt-l@2x.png" class="h-btIconH" alt />
              <span class="text-white text-32px pl-6.5/1006 flex items-center justify-center">水厂数据总览</span>
            </div>
            <img src="@/static/images/hongtong/bt-r@2x.png" class="self-center" alt />
          </div>
          <!-- 内容 -->
          <div class="mt-25/740 w-full h-245/430 flex justify-between">
            <div
              class="w-229/1227 h-full text-white flex flex-col justify-center items-center relative ml-25px"
            >
              <img
                src="@/static/images/hongtong/zsb1@2x.png"
                class="w-full h-full absolute top-0 left-0"
                alt
              />
              <span class="text-38px font-bold mb-42/810">{{formatValue(data.outDay)}}</span>
              <span class="text-25px truncate">水厂日流量</span>
            </div>
            <div
              class="w-229/1227 h-full text-white flex flex-col justify-center items-center relative ml-25px"
            >
              <img
                src="@/static/images/hongtong/zsb1@2x.png"
                class="w-full h-full absolute top-0 left-0"
                alt
              />
              <span class="text-38px font-bold mb-42/810">{{formatValue(data.outMonth/10000)}}</span>
              <span class="text-25px truncate">月流量（万）</span>
            </div>
            <div
              class="w-229/1227 h-full text-white flex flex-col justify-center items-center relative ml-25px"
            >
              <img
                src="@/static/images/hongtong/zsb1@2x.png"
                class="w-full h-full absolute top-0 left-0"
                alt
              />
              <span class="text-38px font-bold mb-42/810">{{formatValue(data.outYear/10000)}}</span>
              <span class="text-25px truncate">年流量（万）</span>
            </div>
          </div>
        </div>
      </el-row>
      <el-row class="h-309/740  flex justify-between">
        <!-- 按钮切换区域 -->
        <div class="w-456/1490 h-full flex flex-col pl-30/1550">
          <!-- <div class=" w-352/456 h-92/309 border-2 border-btn_1 bg-btn_1 flex justify-center items-center text-3xl text-white mt-10/309">
            <span>1期</span>
          </div>-->
          <div
            :class="titleIndex === index ? 'border-btn_1 bg-btn_1' : 'border-btn_2 bg-btn_2'"
            class="w-352/456 h-92/309 border-2 flex justify-center items-center text-33px text-white mt-10/309 relative"
            v-for="(item, index) in titleList"
            :key="item"
            @click="titleIndex = index"
          >
            <span>{{ item }}</span>
            <img
              v-if="titleIndex === index "
              src="@/static/images/hongtong/leftSel.png"
              class="absolute -right-37/352 h-30/92"
            />
          </div>
        </div>
        <!-- 数据展示区域 -->
        <div
          v-show="titleIndex === 0"
          class="w-1030/1490 h-full  pl-24/1490 flex justify-around"
        >
          <div class="w-221/1006 h-full  flex flex-col items-center relative">
            <img src="@/static/images/hongtong/ani_4.png" class="w-full absolute top-0 left-0" alt=""></img>
            <span class="text-white text-26px mt-109/309 truncate">瞬时流量</span>
            <span class="text-white text-28px font-bold mt-126/309">{{factory1.instFlow ||'-'}}</span>
          </div>
          <div class="w-221/1006 h-full  flex flex-col items-center relative">
            <img src="@/static/images/hongtong/ani_4.png" class="w-full absolute top-0 left-0" alt=""></img>
            <span class="text-white text-26px mt-109/309 truncate">日流量</span>
            <span
              class="text-white text-28px font-bold mt-126/309"
            >{{formatValue(data.outDay ) || '-'}}</span>
          </div>
          <div class="w-221/1006 h-full  flex flex-col items-center relative">
            <img src="@/static/images/hongtong/ani_4.png" class="w-full absolute top-0 left-0" alt=""></img>
            <span class="text-white text-26px mt-109/309 truncate">月流量（万）</span>
            <span
              class="text-white text-28px font-bold mt-126/309"
            >{{formatValue(data.outMonth / 10000) || '-'}}</span>
          </div>
          <div class="w-221/1006 h-full  flex flex-col items-center relative">
            <img src="@/static/images/hongtong/ani_4.png" class="w-full absolute top-0 left-0" alt=""></img>
            <span class="text-white text-26px mt-109/309 truncate">年流量(万)</span>
            <span
              class="text-white text-28px font-bold mt-126/309"
            >{{formatValue(data.outYear / 10000) || '-'}}</span>
          </div>
        </div>
        <div
          v-show="titleIndex === 1"
          class="w-1030/1490 h-full bg-red-500 pl-24/1490 flex justify-around"
        >
          <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center">
            <span class="text-white text-26px mt-109/309 truncate">瞬时流量</span>
            <span class="text-white text-28px font-bold mt-126/309">{{'-'}}</span>
          </div>
          <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center">
            <span class="text-white text-26px mt-109/309 truncate">日流量</span>
            <span class="text-white text-28px font-bold mt-126/309">{{'-'}}</span>
          </div>
          <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center">
            <span class="text-white text-26px mt-109/309 truncate">月流量（万）</span>
            <span class="text-white text-28px font-bold mt-126/309">{{'-'}}</span>
          </div>
          <div class="w-221/1006 h-full bg-gray-500 flex flex-col items-center">
            <span class="text-white text-26px mt-109/309 truncate">年流量(万)</span>
            <span class="text-white text-28px font-bold mt-126/309">{{'-'}}</span>
          </div>
        </div>
      </el-row>
    </div>
    <div class="w-full h-329/1091 border-t-2 border-#1B5EAC flex flex-col justify-center">
      <div class="w-full h-160/327 flex justify-around mb-20/1161">
        <div
          class="h-full w-360/1490 bg-#294E6A border-2 border-#1FB3FF flex flex-col justify-center py-30/1550 px-27/1550"
        >
          <span class="text-35px text-white mb-30/327">东水池</span>
          <span class="text-40px text-#1FCDFF">
            {{formatValue(data.east)}}
            <i class="text-#BDC5CC text-20PX ml-23/1550">m</i>
          </span>
        </div>
        <div
          class="h-full w-360/1490 bg-#294E6A border-2 border-#1FB3FF flex flex-col justify-center py-30/1550 px-27/1550"
        >
          <span class="text-35px text-white mb-30/327">西水池</span>
          <span class="text-40px text-#1FCDFF">
            {{formatValue(data.west)}}
            <i class="text-#BDC5CC text-20PX ml-23/1550">m</i>
          </span>
        </div>
        <div
          class="h-full w-360/1490 bg-#294E6A border-2 border-#1FB3FF flex flex-col justify-center py-30/1550 px-27/1550"
        >
          <span class="text-35px text-white mb-30/327">南水池</span>
          <span class="text-40px text-#1FCDFF">
            {{formatValue(data.south)}}
            <i class="text-#BDC5CC text-20PX ml-23/1550">m</i>
          </span>
        </div>
        <div
          class="h-full w-360/1490 bg-#294E6A border-2 border-#1FB3FF flex flex-col justify-center py-30/1550 px-27/1550"
        >
          <span class="text-35px text-white mb-30/327">北水池</span>
          <span class="text-40px text-#1FCDFF">
            {{formatValue(data.north)}}
            <i class="text-#BDC5CC text-20PX ml-23/1550">m</i>
          </span>
        </div>
      </div>
      <div class="w-full h-120/327 flex justify-between">
        <div
          class="h-full w-479/1490 bg-#294E6A border-2 border-#1FB3FF flex items-center justify-between px-27/1550"
        >
          <span class="text-35px text-white truncate">PH</span>
          <span class="text-40px text-#1FCDFF">
            {{formatValue(data.PH)}}
            <i class="text-#BDC5CC text-20PX">mg/L</i>
          </span>
        </div>
        <div
          class="h-full w-479/1490 bg-#294E6A border-2 border-#1FB3FF flex items-center justify-between px-27/1550"
        >
          <span class="text-35px text-white truncate">浊度</span>
          <span class="text-40px text-#1FCDFF">
            {{formatValue(data.zhuodu)}}
            <i class="text-#BDC5CC text-20PX">mg/L</i>
          </span>
        </div>
        <div
          class="h-full w-479/1490 bg-#294E6A border-2 border-#1FB3FF flex items-center justify-between px-27/1550"
        >
          <span class="text-35px text-white truncate">余氯</span>
          <span class="text-40px text-#1FCDFF">
            {{formatValue(data.yulv)}}
            <i class="text-#BDC5CC text-20PX">mg/L</i>
          </span>
        </div>
      </div>
    </div>
    <img src="@/static/images/hongtong/boxTop.png" alt="" class="absolute w-full top-0 left-0 z-20">
    <img src="@/static/images/hongtong/boxBottom.png" alt="" class="absolute w-full bottom-0 left-0 z-20" >
  </div>
</template>

<script>
import DataOverView from "@/components/left/DataOverView.vue";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    DataOverView
  },
  data() {
    return {
      data: {},
      titleIndex: 0,
      titleList: ["东安水厂", "三期"]
    };
  },
  computed: {
    ...mapState({
      latest: state => state.meter.meterLatestList
    }),
    factory1() {
      return this.latest.find(item => item.deviceNo == "2004170001") || {};
    }
  },
  methods: {
    ...mapActions({
      currentData: "ht/currentData"
    }),
    async initData() {
      this.data = await this.currentData();
    },
    formatValue(value) {
      if (value) {
        return value.toFixed(2);
      } else {
        return 0;
      }
    }
  },
  created() {
    this.initData();
    // this.$bus.$on('update-factory-data', this.updateData)
  },
  mounted() {},
  destroyed() {
    // this.$bus.$off('update-factory-data', this.updateData)
    // clearInterval(this.timeIndex)
  }
};
</script>