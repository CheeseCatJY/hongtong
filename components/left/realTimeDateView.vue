<template>
  <div class="w-full h-full">
    <box-border-view :title="'水厂数据总览'">
      <template #box_main>
        <div class="w-full z-10">
          <el-row class="pb-10px text-32px text-#BBBDC0 my-35px">
            <el-col :span="8">时间</el-col>
            <el-col :span="12">地址</el-col>
            <el-col :span="4">值</el-col>
          </el-row>
          <div class="w-full">
            <el-row class="mb-33px text-32px text-white" v-for="(item, index) in items" :key="index" >
              <el-col :span="8" class="truncate">{{$fmt.time(item.data.timemillis, 'MM-DD HH:mm:ss')}}</el-col>
              <el-col :span="12" class="flex items-center text-center truncate">
                <div v-if="item.type === '流量'" class="w-90px rounded-lg bg-#1F88FF text-white text-33px truncate" >{{item.type}}</div>
                <div v-else class="w-90px rounded-lg bg-#FF7F4A text-white ext-33px">{{item.type}}</div>
                <span class="ml-15px truncate">{{item.deviceName}}</span>
              </el-col>
              <el-col :span="4">{{ item.data['40001']? item.data['40001']:item.data['YL01']}}</el-col>
            </el-row>
          </div>
        </div>
      </template>
    </box-border-view>
  </div>
</template>

<script>
import BoxBorderView from "@/components/shared/BoxBorderView.vue";
import {mapActions} from "vuex";
export default {
  components: {
    BoxBorderView,
  },
  data() {
      return {
        items: [],
        allData: [],
        index: 0,
      }
    },
    methods: {
      ...mapActions({
        getCurrentFlowData: 'ht/currentFlowData',
        getCurrentPressureData: 'ht/currentPressureData',
      }),
      async initData() {
        this.allData = await this.getCurrentFlowData()
        this.allData = this.allData.concat(await this.getCurrentPressureData())
        this.allData = this.allData.sort((a,b) => b.data.timemillis - a.data.timemillis)
        this.refresh()
      },
      refresh() {
        if (this.index+8 >= this.allData.length) {
          this.index = 0
        }
        this.items = this.allData.slice(this.index, this.index + 8)
        this.index = this.index + 1
      }
    },
    async created() {
      await this.initData()
      let self = this
      setInterval(function () {
        self.refresh()
      }, 3000);
    },
    destroyed() {
    }
};
</script>