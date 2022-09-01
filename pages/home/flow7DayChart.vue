<template>
  <div id="flow7day-chart" class="h-full"></div>
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
    ...mapState({}),
  },
  methods: {
    ...mapMutations({}),
    initChart() {
      let chartDom = document.getElementById('flow7day-chart');
      let myChart = echarts.init(chartDom, 'dark');
      let option;

      option = {
        color: ['#00ccff', '#FF917C'],
        title: {
          text: '供水统计',
          textStyle: {
            fontSize: 16,
            color: '#CCCCCC'
          },
          top: '10px'
        },
        grid: {
          left: 50
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
        yAxis: [
          {
            type: 'value',
            splitLine: {show: false},
          },
          {
            type: 'value',
            position: 'right',
            axisLabel: {
              inside: true
            },
            splitLine: {show: false},
            boundaryGap: [0, 0.01],
          },
        ],
        xAxis: {
          type: 'category',
          axisLabel: {
            //margin: 0,
            hideOverlap: false,
            formatter: function (e) {
              return e.substring(5)
            }
          },

          data: []
        },
        series: [
          {
            name: '最近7日',
            type: 'bar',
            yAxisIndex: 0,
            label: {
              show: true,
              position: 'top',
              color: '#aaa',
              textBorderWidth: 1,
            },
            data: [],
          },
        ]
      };

      option && myChart.setOption(option);

      return myChart;
    },
    async queryData() {
      let data = await this.$store.dispatch('ht/flow7Day')
      this.myChart.setOption({
        xAxis: {
          type: 'category',
          data: Object.keys(data),
        },
        series: [
          {
            data: Object.values(data).map(item => item < 0 ? 0 : item)
          }
        ]
      });
    },
    async init() {
      this.myChart = await this.initChart();
      this.queryData();
    },
  },
  mounted() {
    this.init();
    this.$bus.$on('window-resize', () => this.myChart && this.myChart.resize());
  },
  destroyed() {
    this.$bus.$off('window-resize')
  }
}
</script>

<style lang="less" scoped>

</style>
