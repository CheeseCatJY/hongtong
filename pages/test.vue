<template>
  <div>

  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {
  head: {},
  components: {},
  data() {
    return {
      showPage: false,
      stateTag: {
        '在线': 'success',
        '离线': 'warning',
        '故障': 'danger',
      },
      showChart: false,
      checkItem: {},
      chartTitle: ''
    }
  },
  computed: {
    ...mapState({
      latestList: state => state.meter.meterLatestList,
    }),
  },
  methods: {
    ...mapActions({
      summary: 'ht/summary',
      alarmList: 'ht/alarmList',
      currentData: 'ht/currentData',
      currentWaterQualityData: 'ht/currentWaterQualityData',
      currentFlowData: 'ht/currentFlowData',
      currentPressureData: 'ht/currentPressureData',
    }),
    toDetail(item) {
      this.chartTitle = item.address + `  [坐标：${item.lng}, ${item.lat}]`
      this.checkItem = item
      this.showChart = true
      // location.href = 'http://gis.frp.loyal.wiki/gis/';
    },
  },
  created() {
    // this.summary();
    // this.alarmList();
    // this.currentData()
    // this.currentWaterQualityData()
    // this.currentFlowData()
    // this.currentPressureData()
    // this.meterDataLatest();
    // this.pullTimeIndex = setInterval(this.meterDataLatest, 10 * 1000)
    this.$store.dispatch('ht/realtimeData')
  },
  destroyed() {
    // clearInterval(this.pullTimeIndex)
  }
}
</script>

<style lang="less" scoped>
/deep/ .modal-dialog {
  max-width: 100vw !important;
  margin: 0px !important;

  .modal-content {
    height: 100vh;
  }
}
</style>
