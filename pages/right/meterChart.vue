<template>
  <div>
    <div id="meter-chart" class="h-full"></div>
  </div>
</template>

<script>
import echarts from '@/plugins/echarts'
import _ from 'lodash'

import {mapState, mapMutations} from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      item1: state => state.summary.item1
    }),
  },
  methods: {
    ...mapMutations({
      setItem: 'summary/setItem',
    }),
    initChart() {

      var chartDom = document.getElementById('meter-chart');
      var myChart = echarts.init(chartDom, 'dark');
      var option;

      option = {
        color: ['#1F1F1F', '#00ccff', '#FF917C'],
        title: {
          text: '大用户抄表统计情况',
          textStyle: {
            fontSize: 16,
            color: '#CCCCCC'
          },
          top: '10px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          top: '0',
          left: 'right',
        },

        yAxis: {
          type: 'value',
          splitNumber: 2,
          boundaryGap: [0, 0.01]
        },
        xAxis: {
          type: 'category',
          data: []
        },
        series: [
          {
            name: '昨日',
            type: 'bar',
            data: []
          },
          {
            name: '今日',
            type: 'bar',
            barGap: '-100%',
            data: []
          }
        ]
      };

      option && myChart.setOption(option);

      return myChart;
    },
    async queryData() {
      let data = await this.$axios.$get('/api/nr/biguser');
      if(!data){
        return
      }
      data = _.sortBy(data, ['date', 'name'])
      data = _.groupBy(data, (item) => item.date);
      let [_1, _2] = Object.keys(data);
      const yesterday = data[_1];
      const today = data[_2];

      this.setItem({item: this.item1.item1_3, value: today.length})

      this.myChart.setOption({
        xAxis: {
          type: 'category',
          data: today.map(item => item.name)
        },
        series: [
          {
            data: yesterday.map(item => item.flow)
          },
          {
            data: today.map(item => item.flow)
          }
        ]
      });
    },
  },
  async mounted() {
    this.myChart = await this.initChart()
    this.queryData()
    this.$bus.$on('window-resize', () => this.myChart && this.myChart.resize());
  },
  destroyed() {
    this.$bus.$off('window-resize')
  }
}
</script>

<style lang="less" scoped>

</style>
