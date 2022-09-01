<template>
  <div class="w-full h-full box-border overflow-hidden">
    <box-border-view :title="'报警列表'">
      <template #box_main>
        <div class="w-full z-10">
          <el-row class="pb-10px text-32px text-#BBBDC0 my-35px">
            <el-col :span="5">时间</el-col>
            <el-col :span="19">地址</el-col>
          </el-row>
          <div class="w-full">
            <el-row
              class="mb-33px text-32px text-white"
              v-for="(item, index) in items"
              :key="index"
            >
              <el-col :span="5" class="truncate">{{ $fmt.time(item['alarm_time'], 'YYYY-M-D HH:mm:ss') }}</el-col>
              <el-col :span="19" class="flex items-center text-center">
                <div
                  v-if="item['alarm_level'] !== '1'" class="w-90px rounded-lg bg-#1F88FF text-white text-33px truncate" >常规</div>
                <div  v-else class="w-90px rounded-4px bg-#FF7F4A text-white text-33px truncate" >紧急</div>
                <span class="ml-15px truncate">{{item['device_name']}}{{item['rule_name']}}</span>
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
    </box-border-view>
  </div>
</template>

<script>
import BoxBorderView from "@/components/shared/BoxBorderView.vue";
import { mapActions } from "vuex";
export default {
  components: {
    BoxBorderView
  },
  data() {
    return {
      items: [],
      allData: [],
      index: 0
    };
  },
  methods: {
    ...mapActions({
      getAlarmList: "ht/alarmList"
    }),
    async initData() {
      this.allData = await this.getAlarmList();
      this.refresh();
    },
    refresh() {
      if (this.index + 9 >= this.allData.length) {
        this.index = 0;
      }
      this.items = this.allData.slice(this.index, this.index + 9);
      this.index = this.index + 1;
    }
  },
  async created() {
    await this.initData();
    let self = this;
    setInterval(function() {
      self.refresh();
    }, 3000);
  },
  destroyed() {}
};
</script>