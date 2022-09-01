<template>
  <div class="w-full h-screen box-border relative flex flex-col">
    <div class="w-full h-275/3240 z-30 px-90/9600 flex items-center justify-between relative">
      <img src="@/static/images/hongtong/top.png" class="w-full h-full absolute top-0 left-0 z-0" alt="" />
      <div class="w-700/9600 h-128/275  flex items-center justify-between px-50px z-10">
        <el-row class="w-full h-full">
          <el-col :span="12" class="flex flex-col items-start justify-between ">
            <p class="text-#B9BABA text-31px">2022</p>
            <p  class="text-white text-47px">08.17/<span class="text-white text-32px">周三</span></p>
          </el-col>
          <el-col :span="12" class="flex flex-col items-start justify-between">
            <span class="text-#B9BABA text-31px">AM</span>
            <span class="text-white text-47px">12:25:36</span>
          </el-col>
        </el-row>
      </div>
      <img src="@/static/images/hongtong/biaoti.png" class="w-2141/9600 z-10" alt />
      <div class="w-700/9600 h-128/275  z-10">
        <iframe width="480" scrolling="no" height="120" frameborder="0" allowtransparency="true" src="https://i.tianqi.com?c=code&id=9&icon=1&py=请选择&site=12"></iframe>
      </div>
    </div>
    <!-- 左右栏 -->
    <div class="flex justify-between h-2885/3240" style="z-index=-1;">
      <div class="w-1550/9600 h-full ml-148/9600 z-20 bg-#020621 box-content flex flex-col justify-between" >
        <div class="w-full h-810/2885">
          <data-over-view></data-over-view>
        </div>
        <div class="w-full h-1161/2885">
          <water-plant-view></water-plant-view>
        </div>
        <div class="w-full h-858/2885">
          <real-time-date-view></real-time-date-view>
        </div>
      </div>
      <div class="w-1550/9600 h-full mr-148/9600 z-20 bg-#020621 box-content flex flex-col justify-between" >
        <div class="w-full h-526/2885">
          <equipment-view></equipment-view>
        </div>
        <div class="w-full h-700/2885">
          <water-supply-view></water-supply-view>
        </div>
        <div class="w-full h-700/2885 ">
          <leakage-diameter-view></leakage-diameter-view>
        </div>
        <div class="w-full h-858/2885 ">
          <alarm-view></alarm-view>
        </div>
      </div>
    </div>
    <!-- 底部栏 -->
    <div class="w-full h-87/3240 z-20 relative">
      <img src="@/static/images/hongtong/bottom.png" class="w-full h-full absolute top-0 left-0" alt=""/>
    </div>
    <!-- 地图 -->
    <!-- <map-panel class="w-full h-full absolute top-0 left-0 bg-gray-500 z-0"></map-panel> -->
    <!-- 其他 -->
    <div class="w-132/9600 h-full absolute top-0 left-0 z-20 ">
      <img src="@/static/images/hongtong/left.png" class="h-full w-full absolute top-0 left-0" alt="" />
    </div>
    <div class="w-132/9600 h-full absolute top-0 right-0 z-20 ">
      <img src="@/static/images/hongtong/right.png" class="h-full w-full absolute top-0 left-0" alt="" />
    </div>
  </div>
</template>
<script>

import MapPanel from "../map/index";
import DataOverView from "@/components/left/DataOverView.vue";
import RealTimeDateView from "@/components/left/realTimeDateView.vue";
import WaterPlantView from "@/components/left/waterPlantView.vue";
import AlarmView from "@/components/right/alarmView.vue";
import EquipmentView from "@/components/right/equipmentView.vue";
import LeakageDiameterView from "@/components/right/leakageDiameterView.vue";
import WaterSupplyView from "@/components/right/waterSupplyView.vue";
import mapMixin from "./baseMixin";
export default {
  components: {
    MapPanel,
    DataOverView,
    RealTimeDateView,
    WaterPlantView,
    AlarmView,
    EquipmentView,
    LeakageDiameterView,
    WaterSupplyView,
  },
  mixins: [mapMixin],
}
</script>

<style scoped lang="less">
</style>
