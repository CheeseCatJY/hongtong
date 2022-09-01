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
      let chartDom = document.getElementById('meter-chart');
      let myChart = echarts.init(chartDom, 'dark');
      let option;

      option = {
        color: ['#00ccff', '#FF917C'],
        title: {
          text: '流量计统计',
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
              return e.substring(0, 7)
            }
          },

          data: []
        },
        series: [
          {
            name: '昨日流量',
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
          {
            name: '昨日夜间流量',
            type: 'line',
            yAxisIndex: 1,
            label: {
              show: false,
              color: '#fff',
            },
            data: []
          }
        ]
      };

      option && myChart.setOption(option);

      return myChart;
    },
    async queryData() {
      let data = await this.$store.dispatch('meter/meterDataDay')
      data = _.sortBy(data, ['dayFlow']).reverse();
      this.myChart.setOption({
        xAxis: {
          type: 'category',
          data: data.map(item => item.address)
        },
        series: [
          {
            data: data.map(item => item.dayFlow)
          },
          {
            data: data.map(item => item.nightMinFlow)
          },
        ]
      });
    },
    async init() {
      await this.$store.dispatch('meter/login')

      this.myChart = await this.initChart();
      await this.queryData();
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
