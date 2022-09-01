<template>
  <div>
    <div id="part-leak" class="h-full"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'
  import {TimeSeq} from '@/util/time'
  export default {
    data() {
      return {}
    },
    methods: {
      async initChart() {

        var chartDom = document.getElementById('part-leak');
        var myChart = echarts.init(chartDom, 'dark');
        var option;

        option = {
          color: ['#3fb1e3'],
          title: {
            text: '分区漏损统计情况',
            textStyle: {
              fontSize: 16,
              color: '#CCCCCC'
            },
            top: '10px'
          },
          tooltip: {
            trigger: 'axis'
          },
          grid:{
            bottom: 10
          },
          legend: {
            top: 7,
            left: 'right',
          },
          xAxis: {
            type: 'category',
            show: false,
            boundaryGap: false,
            data: TimeSeq('00:00', {
              slot: 1,
              separator: ':'
            })
          },
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
            {
              type: 'value',
              position: 'right',
              splitNumber: 3
            }
          ],
          series: [
            {
              type: 'line',
              smooth: true,
              connectNulls: true,
              area: true,
              areaStyle: {
                normal: {
                  color: 'rgba(18, 69, 134, 0.5)'
                }
              },
              markArea: {
                silent: true,
                itemStyle: {
                  normal: {
                    color: "transparent",
                    borderColor: 'red',
                    borderWidth: 1,
                    borderType: "dashed"
                  }
                },
                data: [
                  [
                    {
                      xAxis: '01:00'
                    },
                    {
                      xAxis: '05:00'
                    }
                  ]
                ]
              }
            }
          ]
        };
        let todayFlow = await this.$axios.$get('/data/partflow06-01.json')
        option.series[0].data = todayFlow.map(item=>{
          return [item.time,item.instFlow]
        })
        option.series[0].markPoint = {
          "symbolSize": 35,
          "label": {
            "position": "top",
            formatter: function (e) {
              return e.data.coord[1]
            }
          },
          "data": [
            {
              "name": "夜间最小流量",
              "coord": [
                "03:34",
                649.65
              ],
              "label": {
                "position": "top",
                color: '#FF0000'
              },
              "itemStyle": {
                "normal": {
                  "color": "#FF0000",
                  "shadowOffsetX": 3,
                  "shadowOffsetY": 2,
                  "shadowColor": "rgba(0, 0, 0, 0.4)",
                  "shadowBlur": 5
                }
              }
            }
          ]
        }
        option && myChart.setOption(option);

        return myChart;
      }
    },
    async mounted() {
      this.myChart = await this.initChart()
      this.$bus.$on('window-resize', () => this.myChart && this.myChart.resize());
    },
    destroyed() {
      this.$bus.$off('window-resize')
    }
  }
</script>

<style lang="less" scoped>

</style>
