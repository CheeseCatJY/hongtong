<template>
  <div>
    <div id="pressure-chart" class="h-full" :style="{height: height}"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'

  export default {
    props: ['height'],
    data() {
      return {
        myChart: {},
        seriesData: [],
        subtext: '数据更新时间：2021-06-20 15:20:17',
      }
    },
    methods: {
      unixTimeToDate(unixtime) {
        return this.$fmt.time(unixtime, 'YYYY-M-D HH:mm:ss');
      },
      async getSeriesData() {
        const data = await this.$axios.$get('/data/pressureChart.json')
        var chartDom = document.getElementById('pressure-chart');
        this.myChart = echarts.init(chartDom, 'dark');
        let option = {
          color:['#66CCFF','#52A4D3','#4386B1','#346990','#254B6E','#162E4D'],
          title: {
            text: '分区数据报表情况',
            subtext: '数据更新时间：2021-06-20 15:20:17',
            textStyle: {
              fontSize: 16,
              color: '#CCCCCC'
            }, subStyle: {
              fontSize: 12,
              color: '#868686'
            },
            top: '10px'
          },
          legend: {
            data: [],
            left: 'right',
            top: 10
          },
          series: [
            {
              name: '流量',
              type: 'treemap',
              visibleMin: 300,
              // label: {
              //   show: true,
              //   formatter: '{b}'
              // },
              left: 20,
              right: 20,
              top: '20%',
              bottom: '10%',
              label: {
                normal: {
                  show: true,
                  position: 'insideTopLeft',
                  formatter: function (info) {
                    let treePathInfo = info.treePathInfo;
                    var arr = [ '{name|' + info.name + '}', '{hr|}' ];
                    switch (treePathInfo.length) {
                      case 1:
                        return arr[0]
                      case 2:
                        arr.push('{budget|' + treePathInfo[0].name + '：' + info.value.toFixed(2) + '} {label| m³，'  + (100 * info.value  / treePathInfo[0].value).toFixed(2) + ' %}');
                        return arr.join('\n')
                      default:
                        arr.push('{budget|' +  treePathInfo[treePathInfo.length - 2].name + '：' + info.value.toFixed(2) + '} {label|m³，'  + (100 * info.value
                          / treePathInfo[treePathInfo.length - 2].value).toFixed(2) + '%}');
                        arr.push('{household|' + treePathInfo[0].name + '：' + (100 * info.value
                          / treePathInfo[0].value).toFixed(2) + '} {label|%}');
                        return arr.join('\n')
                    }
                  },
                  rich: {
                    budget: {
                      fontSize: 18,
                      lineHeight: 25,
                      color: 'yellow'
                    },
                    household: {
                      fontSize: 12,
                      color: '#fff'
                    },
                    label: {
                      fontSize: 9,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      color: '#fff',
                      borderRadius: 2,
                      padding: [2, 4],
                      lineHeight: 25,
                      align: 'left'
                    },
                    name: {
                      fontSize: 12,
                      color: '#fff'
                    },
                    hr: {
                      width: '100%',
                      borderColor: 'rgba(255,255,255,0.2)',
                      borderWidth: 0.5,
                      height: 0,
                      lineHeight: 10
                    }
                  }
                }
              },
              itemStyle: {
                borderColor: '#fff'
              },
              levels: this.getLevelOption(),
              data: data
            }
          ]
        }
        this.myChart.setOption(option);
      },
      getLevelOption() {
        return [
          {
            itemStyle: {
              borderWidth: 0,
              gapWidth: 5
            }
          },
          {
            itemStyle: {
              gapWidth: 1
            }
          },
          {
            colorSaturation: [0.35, 0.5],
            itemStyle: {
              gapWidth: 1,
              borderColorSaturation: 0.6
            }
          }
        ];
      }
    },
    async mounted() {
      await this.getSeriesData()
      this.$bus.$on('window-resize', () => this.myChart && this.myChart.resize());
    }
    ,
    destroyed() {
      this.$bus.$off('window-resize')
    }
  }
</script>

<style lang="less" scoped>

</style>
