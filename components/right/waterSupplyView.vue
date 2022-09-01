<template>
  <div class="w-full h-full">
    <box-border-view :title="'最近七日供水统计'">
      <template #box_main>
        <div id="chart" class="w-full h-full z-10"></div>
      </template>
    </box-border-view>
  </div>
</template>
<script>
import echarts from '@/plugins/echarts'
import _ from 'lodash'
import {mapState, mapMutations} from 'vuex'
import BoxBorderView from "@/components/shared/BoxBorderView.vue";
export default {
  components: {
    BoxBorderView
  },
  data() {
    return {
      lineOption: {
        grid: {
          bottom: "8%",
          right:'3%',
          left:'1%',
          top:'10%',
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              },
              fontSize:'24'
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              },
              fontSize:'24'
            }
          }
        ],
        series: [
          {
            name: "Email",
            type: "line",
            stack: "Total",
            areaStyle: {
              //覆盖区域的渐变色
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(255,133,46, 0.8)" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(255,133,46, 0)" // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            lineStyle: {
              color: "#FF852E"
            },
            emphasis: {
              focus: "series"
            },
            showSymbol: false,
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({}),
  },
  methods: {
    ...mapMutations({}),
    initChart() {
      let chartDom = document.getElementById("chart");
      let myChart = echarts.init(chartDom, "dark");
      this.lineOption && myChart.setOption(this.lineOption);
      return myChart;
    },
    async queryData() {
      let data = await this.$store.dispatch('ht/flow7Day')
      console.log('data')
      console.log(data)
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


<style lang='less' scoped>
</style>
