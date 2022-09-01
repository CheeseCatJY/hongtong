<template>
  <div class="w-full h-full box-border">
    <box-border-view :title="'全部设备概览'">
      <template #box_main>
        <div class="pt-37px w-full z-10 flex justify-around">
          <div
            class="h-334px w-314px relative flex items-center justify-center"
            v-for="(item,key) in items"
            :key="key"
          >
            <div class="text-white flex flex-col items-center justify-center">
              <span class="text-77px mb-53px">{{ item['online_count']}}</span>
              <span class="text-41px">{{ name_map[item['category_name']] }}</span>
            </div>
            <img
              src="@/static/images/hongtong/sb.png"
              class="w-full h-full absolute top-0 left-0"
              alt
            />
          </div>
        </div>
      </template>
    </box-border-view>
  </div>
</template>
<script>
import BoxBorderView from "@/components/shared/BoxBorderView.vue";
import {mapActions, mapState} from 'vuex';
export default {
  components: {
    BoxBorderView
  },
  data() {
    let now = Date.now();
    return {
      name_map: {
        水池液位计: "液位计",
        超声波流量计: "流量计",
        管网压力设备: "压力",
        水质三参数设备: "水质"
      },
      items: [],
      // clock: {
      //   time: this.$fmt.time(now, "HH:mm:ss"),
      //   date: this.$fmt.time(now, "YYYY-MM-DD"),
      //   week: this.$fmt.week(now)
      // }
    };
  },
  computed: {},
  methods: {
    ...mapActions({
      summary: "ht/summary"
    }),
    async initData() {
      this.items = await this.summary();
      console.log('this.items')
      console.log(this.items)
    },
    // startClock() {
    //   let now = Date.now();
    //   this.clock.time = this.$fmt.time(now, "HH:mm:ss");
    //   this.clock.date = this.$fmt.time(now, "YYYY-MM-DD");
    //   this.clock.week = this.$fmt.week(now);
    // }
  },
  created() {
    // this.timeIndex = setInterval(this.startClock, 1000);
  },
  mounted() {
    this.initData();
  },
  destroyed() {
    clearInterval(this.timeIndex);
  }
};
</script>

<style lang='less' scoped>
</style>
