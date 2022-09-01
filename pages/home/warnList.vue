<template>
  <div class="plate">
    <div class="theme">
      <div class="title">报警列表</div>
    </div>
    <div class="list">
      <div class="item" v-for="(item, index) in items" :key="index">
        <span>[{{ $fmt.time(item['alarm_time'], 'YYYY-M-D HH:mm:ss') }}]</span>
        <span><b-badge variant="warning">{{ item['alarm_level'] === '1'? '紧急':'' }}</b-badge></span>
        <span>{{ item['device_name'] }}</span>
        <span>{{ item['rule_name'] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex";

  export default {
    name: 'readWarnList',
    data() {
      return {
        items: [],
        allData: [],
        index: 0
      }
    },
    methods: {
      ...mapActions({
        getAlarmList: 'ht/alarmList',
      }),
      async initData() {
        this.allData = await this.getAlarmList()
        this.refresh()
        // alarm_id: "a32f12b37f784ecd936d83353893bbf6"
        // alarm_level: "1"
        // alarm_msg: "液位上限报警,上限值:4.2,实测值:4.223,实测时间:2021-03-21 05:42:15"
        // alarm_time: "2021-03-21 05:44:51"
        // device_name: "东安水厂北水池"
        // install_location: "山西省临汾市洪洞县"
        // rule_id: "560e8df6227f4843a72534ee6662eb38"
        // rule_name: "液位上限报警"
        // const data = await this.$axios.$get('/data/read-warn.json')
        // this.items = data
      },
      refresh() {
        if (this.index+9 >= this.allData.length) {
          this.index = 0
        }
        this.items = this.allData.slice(this.index, this.index + 9)
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
  }
</script>

<style lang="less" scoped>
  .title {
    padding-bottom: 10px;
  }

  .list {
    color: #aaaaaa;
    font-size: 0.8rem;

    .item {
      margin-bottom: 0.4rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
      width: 23vw;
    }
  }
</style>
