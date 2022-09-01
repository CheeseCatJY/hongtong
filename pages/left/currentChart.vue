<template>
  <div class="plate">
    <div id="currentChart" class="h-full" :style="{height: height}"></div>
  </div>
</template>

<script>
import echarts from '@/plugins/echarts'
import {TimeSeq} from '@/util/time'
import dateUtil from '@/util/date'
import {mapMutations} from "vuex";

export default {
  data() {
    return {
      charts: '',
      todayFlow: [],
      nowMaxUnixTime: [],
      xAxisData: [],
      legendData: [],
      option: {
        title: {
          text: '当日流量曲线',
          textStyle: {
            fontSize: 16,
            color: '#CCCCCC'
          },
          top: '10px'
        },
        grid: {
          left: 35,
          right: 15,
          bottom: 20
        },
        tooltip: {},
        legend: {
          top: 50,
          left: 'right',
          data: []
        },
        xAxis: {
          type: 'category',
          show: false,
          boundaryGap: false,
        },
        // xAxis: [{
        // }],
        yAxis: [{
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        }],
        animation: false,

      }
    }
  },
  props: ['height'],
  mqtt: {
    ['jinhu/factory/latest'](data) {
      let json = JSON.parse(String(data));
      this.$bus.$emit('update-factory-data', json);
      this.refresh(json)
    }
  },
  methods: {
    ...mapMutations(
      {setInstant: 'summary/setItem'}
    ),
    unixTimeToDate(unixtime) {
      return this.$fmt.time(Number(unixtime), 'HH:mm:ss');
    },
    async getData() {
      let todayFlow = [], legendData = []

      let instant = await this.$axios.$get('/api/nr/factory/instant');
      let instantData = {}
      if (instant[0]) {
        instantData = instant[0].data
      }
      let now = new Date();
      let nowMaxUnixTime = now.getTime()
      let nowMinUnixTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0,
        0).getTime()
      if (instant[0]) {
        let maxUnixTime = 0

        for (let i = 0; i < instant[0].series.length; i++) {
          let todayFlowMap = []
          instantData[i].forEach(item => {
            if (Number(item.x) >= nowMinUnixTime && Number(item.x) < nowMaxUnixTime && (Number(
              item.x) + 10 * 60 * 1000) >= nowMaxUnixTime) {
              if (maxUnixTime <= Number(item.x)) {
                maxUnixTime = Number(item.x)
              }
              todayFlowMap[Number(item.x)] = item.y
            }
          })
          let data = []
          for (let key in todayFlowMap) {
            data.push([key, todayFlowMap[key], key])
          }

          data = data.sort((a, b) => {
            if (Number(a[0]) > Number(b[0])) {
              return 1;
            } else {
              return -1;
            }
          })

          legendData.push(instant[0].series[i])
          todayFlow.push(this.handleArray(data))
          this.nowMaxUnixTime.push(maxUnixTime)
        }

      }
      return {todayFlow, legendData}
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
    getXAxisData(todayFlow) {
      let timeData = []
      todayFlow.map(item => {
        item.map(a => {
          timeData.push(a[2] - 24 * 60 * 60 * 1000)
        })
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
      let {todayFlow, legendData} = await this.getData()

      let timeData = this.getXAxisData(todayFlow)
      this.todayFlow = todayFlow
      this.xAxisData = timeData
      let seriesData = []
      for (let i = 0; i < legendData.length; i++) {
        seriesData.push({
          name: legendData[i],
          type: 'line',
          data: todayFlow[i],
          dimensions: ['x', 'y'],
          symbolSize: 2,
          large: true
        })
      }
      this.charts.setOption({
        color: ['#900000', '#0091fd'],
        title: {
          text: '当日流量曲线(' + (timeData.length > 0 ? timeData[timeData.length - 1] : dateUtil.time())
            + ")"
        },
        series: seriesData,
        legend: {
          top: 7,
          left: 'right',
          data: legendData
        },
        xAxis: {
          data: timeData
        },
      })

      this.legendData = legendData
    },
    async getLatestData(latestData) {
      let todayFlow = []
      if (!latestData) {
        return
      }
      for (let i = 0; i < this.legendData.length; i++) {
        let data = latestData.filter(item => {
          return item.address == this.legendData[i]
        })
        if (data.length != 0) {
          let lastestData = data[0]
          let now = new Date(lastestData.time);
          let nowMaxUnixTime = now.getTime()

          if ((this.nowMaxUnixTime[i] && this.nowMaxUnixTime[i] < nowMaxUnixTime)
            || !this.nowMaxUnixTime[i]) {
            this.nowMaxUnixTime[i] = nowMaxUnixTime
            todayFlow[i] = [[nowMaxUnixTime, lastestData.instant, nowMaxUnixTime]]
            todayFlow[i] = this.handleArray(todayFlow[i])
          }
        } else {
          todayFlow[i] = []
        }
      }
      return {todayFlow}
    },
    async refresh(latestData) {
      if (!latestData) {
        return
      }
      let {todayFlow} = await this.getLatestData(latestData)

      if (todayFlow.length == 0) {
        return
      }
      let time = null
      for (let i = 0; i < todayFlow.length; i++) {
        todayFlow[i] && todayFlow[i].map(a => {
          if (!time) {
            time = a[2] - 24 * 60 * 60 * 1000
            this.xAxisData.push(this.unixTimeToDate(time))
            this.xAxisData.shift();
          }
          this.todayFlow[i].push(a);
          this.todayFlow[i].shift()
        })
      }

      if (!time) {
        return
      }

      let seriesData = []
      for (let i = 0; i < this.legendData.length; i++) {
        seriesData.push({
          data: this.todayFlow[i],
        })
      }
      this.charts.setOption({
        title: {
          text: '当日流量曲线(' + this.xAxisData[this.xAxisData.length - 1] + ")"
        },
        xAxis: {
          data: this.xAxisData
        },
        series: seriesData,
      });
    }
  },
  async mounted() {
    this.initChart('currentChart')
    await this.drawLine()
    this.$bus.$on('window-resize', () => this.charts.resize());
    // let self = this
    // setInterval(function () {
    //   self.refresh()
    // }, 1000);
    this.$mqtt.subscribe('jinhu/factory/latest');
  },
  destroyed() {
    this.$bus.$off('window-resize')
  }
}
</script>

<style scoped>

</style>
