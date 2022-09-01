<template>
  <div class="plate">
    <div id="main" class="h-full" :style="{height: height}"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'
  import {TimeSeq} from '@/util/time'

  export default {
    data() {
      return {
        charts: '',
        yesterdayFlow: [],
        yesterdayPressure: [],
        yesterdayAllFlow: [],
        yesterdayAllPressure: [],
        todayFlow: [],
        todayPressure: [],
        nowMaxUnixTime: null,
        xAxisData: [],
        meterName: '二水厂一期',
        option: {
          title: {
            text: '出厂流量计实时曲线',
            textStyle: {
              fontSize: 16,
              color: '#CCCCCC'
            },
            top: '10px'
          },
          grid: {
            left: 35,
            right: 25,
            bottom: 20
          },
          tooltip: {},
          legend: {
            top: 7,
            left: 'right',
            data: ['昨日瞬时', '今日瞬时', '昨日压力', '今日压力']
          },
          xAxis: {
            type: 'category',
            // show: false,
            boundaryGap: false,
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
              splitNumber: 3,
              min: 0,
              max: 1,
            }
          ],
          series: [
            {
              name: '昨日瞬时',
              type: 'line',
              smooth: true,
              connectNulls: true,
              area: true,
              areaStyle: {
                color: '#0A1D39',
                opacity: 1
              },
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              itemStyle: {
                normal: {
                  color: '#40808C',
                  lineStyle: {
                    color: '#1F3F53'
                  }
                }
              }
            },
            {
              name: '今日瞬时',
              type: 'line',
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              itemStyle: {
                normal: {
                  color: '#fff306',
                  lineStyle: {
                    color: '#fff306'
                  }
                }
              },
            }, {
              name: '昨日压力',
              yAxisIndex: 1,
              type: 'line',
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              itemStyle: {
                normal: {
                  color: '#038c05',
                  lineStyle: {
                    color: '#038c05'
                  }
                }
              },
            },
            {
              name: '今日压力',
              yAxisIndex: 1,
              type: 'line',
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              itemStyle: {
                normal: {
                  color: '#ff0000',
                  lineStyle: {
                    color: '#ff0000'
                  }
                }
              },
            }
          ]
        }
      }
    },
    props: ['height'],
    methods: {
      unixTimeToDate(unixtime) {
        return this.$fmt.time(Number(unixtime), 'HH:mm:ss');
      },
      async getData() {
        let yesterdayFlow = [], yesterdayPressure = [], todayFlow = [], todayPressure = []
        let yesterdayFlowMap = [], yesterdayPressureMap = [], todayFlowMap = [],
          todayPressureMap = []

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
        let now = new Date();
        let nowMaxUnixTime = now.getTime()
        let nowMinUnixTime
        if (this.nowMaxUnixTime) {
          nowMinUnixTime = this.nowMaxUnixTime
        } else {
          nowMinUnixTime = nowMaxUnixTime - 1000 * 60 * 60 * 2
        }
        let yesterdayMaxUnixTime = nowMaxUnixTime - 1000 * 60 * 60 * 24
        let yesterdayMinUnixTime = nowMinUnixTime - 1000 * 60 * 60 * 24

        let nowStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0,
          0).getTime()
        let yesterdayStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0,
          0, 0).getTime()
        if (instant[0]) {
          let maxUnixTime = 0
          let i = instant[0].series.findIndex(item=>{return item === this.meterName})
          // for (let i = 0; i < instant[0].series.length; i++) {
          // for (let i = meterSeriesIndex; i < 1; i++) {
            pressureData[i].map(item => {
              if (Number(item.x) >= nowMinUnixTime && Number(item.x) < nowMaxUnixTime) {
                if (maxUnixTime <= item.x) {
                  maxUnixTime = item.x
                }
                todayPressureMap[Number(item.x)] = item.y
              } else if (Number(item.x) < yesterdayMaxUnixTime && Number(item.x)
                >= yesterdayMinUnixTime) {
                yesterdayPressureMap[Number(item.x)] = item.y
              }

              if (Number(item.x) >= yesterdayStartDate && Number(item.x)
                < nowStartDate) {
                this.yesterdayAllPressure.push(item)
              }
            })
            instantData[i].forEach(item => {
              if (Number(item.x) >= nowMinUnixTime && Number(item.x) < nowMaxUnixTime) {
                if (maxUnixTime <= Number(item.x)) {
                  maxUnixTime = Number(item.x)
                }
                todayFlowMap[Number(item.x)] = item.y
              } else if (Number(item.x) < yesterdayMaxUnixTime && Number(item.x)
                >= yesterdayMinUnixTime) {
                yesterdayFlowMap[Number(item.x)] = item.y
              }

              if (Number(item.x) >= yesterdayStartDate && Number(item.x)
                < nowStartDate) {
                this.yesterdayAllFlow.push(item)
              }
            })
          // }

          this.nowMaxUnixTime = maxUnixTime
        }
        for (let key in todayPressureMap) {
          todayPressure.push([key, todayPressureMap[key], key])
        }
        for (let key in yesterdayPressureMap) {
          yesterdayPressure.push([key, yesterdayPressureMap[key], key])
        }
        for (let key in todayFlowMap) {
          todayFlow.push([key, todayFlowMap[key], key])
        }
        for (let key in yesterdayFlowMap) {
          yesterdayFlow.push([key, yesterdayFlowMap[key], key])
        }
        todayPressure = todayPressure.sort((a, b) => {
          if (Number(a[0]) > Number(b[0])) {
            return 1;
          } else {
            return -1;
          }
        })
        yesterdayPressure = yesterdayPressure.sort((a, b) => {
          if (Number(a[0]) > Number(b[0])) {
            return 1;
          } else {
            return -1;
          }
        })
        todayFlow = todayFlow.sort((a, b) => {
          if (Number(a[0]) > Number(b[0])) {
            return 1;
          } else {
            return -1;
          }
        })
        yesterdayFlow = yesterdayFlow.sort((a, b) => {
          if (Number(a[0]) > Number(b[0])) {
            return 1;
          } else {
            return -1;
          }
        })

        todayPressure = this.handleArray(todayPressure)
        yesterdayPressure = this.handleArray(yesterdayPressure)
        todayFlow = this.handleArray(todayFlow)
        yesterdayFlow = this.handleArray(yesterdayFlow)
        return {todayPressure, yesterdayPressure, todayFlow, yesterdayFlow}
      },
      handleArray(oldArray) {
        let arrayMap = []
        oldArray.map(item => {
          item[0] = this.unixTimeToDate(item[0])
          if (!arrayMap[item[0]]) {
            arrayMap[item[0]] = item
          }
        })
        let newArray = []
        for (let key in arrayMap) {
          newArray.push(arrayMap[key])
        }
        return newArray
      },
      getXAxisData(todayPressure, yesterdayPressure, todayFlow, yesterdayFlow) {
        let timeData = []
        todayPressure.map(item => {
          timeData.push(item[2] - 24 * 60 * 60 * 1000)
        })
        yesterdayPressure.map(item => {
          timeData.push(item[2])
        })
        todayFlow.map(item => {
          timeData.push(item[2] - 24 * 60 * 60 * 1000)
        })
        yesterdayFlow.map(item => {
          timeData.push(item[2])
        })
        let newTimeData = timeData.sort((a, b) => {
          if (a > b) {
            return 1;
          } else {
            return -1;
          }
        })
        let xAxisData = []
        newTimeData.map(item => {
          xAxisData.push(this.unixTimeToDate(item))
        })

        let getXAxisDataNum = new Set(xAxisData);
        let getXAxisDataNumArr = Array.from(getXAxisDataNum);

        return getXAxisDataNumArr
      },
      initChart(id) {
        this.charts = echarts.init(document.getElementById(id), 'dark')
        this.charts.setOption(this.option)
      },
      async drawLine() {
        let {todayPressure, yesterdayPressure, todayFlow, yesterdayFlow} = await this.getData()
        let timeData = this.getXAxisData(todayPressure, yesterdayPressure, todayFlow, yesterdayFlow)
        this.todayPressure = todayPressure
        this.yesterdayPressure = yesterdayPressure
        this.todayFlow = todayFlow
        this.yesterdayFlow = yesterdayFlow
        this.xAxisData = timeData
        this.charts.setOption({
          xAxis: {
            data: timeData
          },
          series: [{
            data: this.yesterdayFlow
          }, {
            data: this.todayFlow
          }, {
            data: this.yesterdayPressure
          }, {
            data: this.todayPressure
          }
          ]
        });

      },
      async getlatestData() {
        let yesterdayFlow = [], yesterdayPressure = [], todayFlow = [], todayPressure = []
        let yesterdayFlowMap = [], yesterdayPressureMap = []


        let latestData = await this.$axios.$get('/api/nr/factory/latest');
        let data = latestData.filter(item => {
          return item.address == this.meterName
        })
        if (data.length === 0) {
          return {todayPressure, yesterdayPressure, todayFlow, yesterdayFlow}
        }
        let lastestData = data[0]

        let now = new Date(lastestData.time);
        let nowMaxUnixTime = now.getTime()
        let nowMinUnixTime

        if (this.nowMaxUnixTime) {
          if(this.nowMaxUnixTime>=nowMaxUnixTime){
            return {todayPressure, yesterdayPressure, todayFlow, yesterdayFlow}
          }
          nowMinUnixTime = this.nowMaxUnixTime
        } else {
          nowMinUnixTime = nowMaxUnixTime - 1000 * 60 * 60 * 2
        }
        let yesterdayMaxUnixTime = nowMaxUnixTime - 1000 * 60 * 60 * 24
        let yesterdayMinUnixTime = nowMinUnixTime - 1000 * 60 * 60 * 24
        this.yesterdayAllPressure.map(item => {
          if (Number(item.x) < yesterdayMaxUnixTime && Number(item.x)
            >= yesterdayMinUnixTime) {
            yesterdayPressureMap[Number(item.x)] = item.y
          }

        })
        this.yesterdayAllFlow.forEach(item => {
          if (Number(item.x) < yesterdayMaxUnixTime && Number(item.x)
            >= yesterdayMinUnixTime) {
            yesterdayFlowMap[Number(item.x)] = item.y
          }

        })

        this.nowMaxUnixTime = nowMaxUnixTime
        todayPressure.push([nowMaxUnixTime, lastestData.pressure, nowMaxUnixTime])
        todayFlow.push([nowMaxUnixTime, lastestData.instant, nowMaxUnixTime])
        for (let key in yesterdayPressureMap) {
          yesterdayPressure.push([key, yesterdayPressureMap[key], key])
        }
        for (let key in yesterdayFlowMap) {
          yesterdayFlow.push([key, yesterdayFlowMap[key], key])
        }
        yesterdayPressure = yesterdayPressure.sort((a, b) => {
          if (Number(a[0]) > Number(b[0])) {
            return 1;
          } else {
            return -1;
          }
        })
        yesterdayFlow = yesterdayFlow.sort((a, b) => {
          if (Number(a[0]) > Number(b[0])) {
            return 1;
          } else {
            return -1;
          }
        })
        todayPressure = this.handleArray(todayPressure)
        todayFlow = this.handleArray(todayFlow)
        yesterdayPressure = this.handleArray(yesterdayPressure)
        yesterdayFlow = this.handleArray(yesterdayFlow)
        return {todayPressure, yesterdayPressure, todayFlow, yesterdayFlow}
      },
      async refresh() {
        let {todayPressure, yesterdayPressure, todayFlow, yesterdayFlow} = await this.getlatestData()
        yesterdayFlow.map(item => {
          this.yesterdayFlow.push(item);
        })
        todayFlow.map(item => {
          this.todayFlow.push(item);
        })
        yesterdayPressure.map(item => {
          this.yesterdayPressure.push(item);
        })
        todayPressure.map(item => {
          this.todayPressure.push(item);
        })
        let timeData = this.getXAxisData(this.todayPressure, this.yesterdayPressure, this.todayFlow,
          this.yesterdayFlow)
        if (timeData.length - this.xAxisData.length > 0) {
          for (let i = 0; i < timeData.length - this.xAxisData.length; i++) {
            this.yesterdayFlow = this.yesterdayFlow.filter(item => {
              return item[0] != timeData[0]
            })
            this.todayFlow = this.todayFlow.filter(item => {
              return item[0] != timeData[0]
            })
            this.yesterdayPressure = this.yesterdayPressure.filter(item => {
              return item[0] != timeData[0]
            })
            this.todayPressure = this.todayPressure.filter(item => {
              return item[0] != timeData[0]
            })
            timeData.shift()
          }
        }
        this.xAxisData = timeData
        this.charts.setOption({
          xAxis: {
            data: timeData
          },
          series: [{
            data: this.yesterdayFlow
          }, {
            data: this.todayFlow
          }, {
            data: this.yesterdayPressure
          }, {
            data: this.todayPressure
          }
          ]
        });
      }
    },
    async mounted() {
      this.initChart('main')
      await this.drawLine()
      this.$bus.$on('window-resize', () => this.charts.resize());
      let self = this
      setInterval(function () {
        self.refresh()
      }, 1000);
    },
    destroyed() {
      this.$bus.$off('window-resize')
    }
  }
</script>

<style scoped>

</style>
