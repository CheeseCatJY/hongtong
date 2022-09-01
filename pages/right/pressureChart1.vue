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
        lastestData: {},
        option: {
          color:["#69d358", "#59c4e6"],
          title: {
            text: '出厂水压力、流量关系图',
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
          grid: {
            left: 30,
            top: 60,
            right: 15,
            bottom: 30
          },
          tooltip: {
            // position: 'top',
            trigger: 'item',
            formatter: function (parms) {
              return `${parms.seriesName}<br/>${parms.marker}流量：${parms.value[0]} m³/h<br/>${parms.marker}压力：${parms.value[1]} MPa<br/>${parms.value[2]}`
            },
            axisPointer: {
              show: true,
              type: 'cross',
              lineStyle: {
                type: 'dashed',
                width: 1
              }
            }
          },
          legend: {
            data: [],
            left: 'right',
            top: 10
          },
          xAxis: [
            {
              type: 'value',
              scale: true,
              splitLine: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              splitLine: {
                show: false
              }
            }
          ],
          series: []
        }
      }
    },
    methods: {
      unixTimeToDate(unixtime) {
        return  this.$fmt.time(unixtime, 'YYYY-M-D HH:mm:ss');
      },
      async initChart() {
        var chartDom = document.getElementById('pressure-chart');
        var myChart = echarts.init(chartDom, 'dark');

        myChart.setOption(this.option);

        return myChart;
      },
      async getLastesData() {
        let latestData = await this.$axios.$get('/api/nr/factory/latest');
        latestData.map(item=>{
          this.lastestData[item.address] = item
        })
      },
      async getData() {
        let gridData = [], markPoint = [], legendName = []
        let instant = await this.$axios.$get('/api/nr/factory/instant');
        let pressure = await this.$axios.$get('/api/nr/factory/pressure');
        let instantData = {}
        if (instant[0]) {
          instantData = instant[0].data
        }
        let pressureData = {}
        if (pressure[0]) {
          pressureData = pressure[0].data
        }
        await this.getLastesData()
        if (instant[0]) {
          let now = new Date();
          let nowUnixTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0,
            0).getTime()

          for (let i = 0; i < instant[0].series.length; i++) {
            let data = []
            let dataMap = {}
            pressureData[i].map(item => {
              if (nowUnixTime < item.x) {
                dataMap[item.x] = {time: item.x, pressure: item.y}
              }
            })
            instantData[i].forEach(item => {
              if (nowUnixTime < item.x) {
                if (dataMap[item.x]) {
                  dataMap[item.x]['instant'] = item.y
                } else {
                  dataMap[item.x] = {time: item.x, instant: item.y}
                }
              }
            })

            for (let key in dataMap) {
              data.push([dataMap[key].instant, dataMap[key].pressure,
                this.unixTimeToDate(dataMap[key].time)])
            }
            legendName.push(instant[0].series[i])
            gridData.push(data)
            markPoint.push(this.getMarkPoint(this.lastestData[instant[0].series[i]]))
          }
        }
        return {legendName, gridData, markPoint}
      },
      async getSeriesData() {
        var chartDom = document.getElementById('pressure-chart');
        this.myChart = echarts.init(chartDom, 'dark');
        let seriesData = []
        let {legendName, gridData, markPoint} = await this.getData()
        if (legendName.length > 0) {
          for (let i = 0; i < legendName.length; i++) {
            seriesData.push({
              name: legendName[i],
              type: 'scatter',
              emphasis: {
                focus: 'series'
              },
              markArea: {
                silent: true,
                itemStyle: {
                  color: 'transparent',
                  borderWidth: 1,
                  borderType: 'dashed'
                },
                data: [[{
                  xAxis: 'min',
                  yAxis: 'min'
                }, {
                  xAxis: 'max',
                  yAxis: 'max'
                }]]
              }, markPoint: markPoint[i],
              symbolSize: 3,
              data: gridData[i],
            })
          }
        }
        this.option.series = seriesData
        this.option.legend.data = legendName
        this.option.title.subtext = '数据更新时间：' + this.$fmt.time(Date.now(), 'YYYY-M-D HH:mm:ss')
        this.myChart.setOption(this.option);
      },
      getMarkPoint(lastData) {

        let self = this
        return {
          "symbolSize": 35,
          "label": {
            "position": "top",
            formatter: function (e) {
              return self.$fmt.time(e.data.coord[2], 'HH:mm:ss')
            }
          },
          "data": [
            {
              "name": "最新数据",
              "coord": [
                lastData.instant,
                lastData.pressure,
                lastData.time
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
      },
      // async refreshData() {
      //   let seriesData = []
      //   let {legendName, gridData, markPoint} = await this.getData()
      //   if (legendName.length > 0) {
      //     for (let i = 0; i < legendName.length; i++) {
      //       // this.myChart.appendData({
      //       //   seriesIndex: i,
      //       //   data: gridData[i]
      //       // });
      //
      //       this.myChart.setOption({
      //         series: [
      //           subtext: '数据更新时间：' + this.$fmt.time(Date.now(), 'YYYY-M-D HH:mm:ss')
      //         ]
      //       });
      //       markPoint: markPoint[i],
      //     }
      //   }
      //   this.option.series = seriesData
      //   this.option.legend.data = legendName
      //   // this.myChart.setOption(this.option);
      //     this.option.series = this.seriesData
      //   }
    },
    async mounted() {
      await this.getSeriesData()
      setInterval(() => {
        this.getSeriesData()
      }, 1000*30)
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
