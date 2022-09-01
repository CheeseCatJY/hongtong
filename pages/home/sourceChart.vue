<template>
  <div class="plate">
    <div id="sourceChart" class="h-full"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'
  import {TimeSeq} from '@/util/time'
  import dateUtil from '@/util/date'
  import {mapActions} from "vuex";

  export default {
    name: 'sourceChart',
    data() {
      return {
        charts: '',
        todayFlow: [],
        nowMaxUnixTime: [],
        xAxisData: [],
        legendData: [],
        meterNo: 'M10000183',
        option: {
          title: {
            text: '源水当日流量曲线',
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
    methods: {
      ...mapActions({
        getMeterDataHistory: 'meter/meterDataHistory',
        getMeterDataLatest: 'meter/getMeterDataLatest',
      }),
      unixTimeToDate(unixtime) {
        return this.$fmt.time(Number(unixtime), 'HH:mm:ss');
      },
      async getData() {
        let todayFlow = [], legendData = []
        let now = new Date();
        let instantData = []
        if (now.getHours() === 0){
          instantData = await this.getMeterDataHistory({meterNo: this.meterNo,time:dateUtil.beforeDay(now,1)})
          instantData = instantData.concat(await this.getMeterDataHistory({meterNo: this.meterNo}));
        }else{
          instantData = await this.getMeterDataHistory({meterNo: this.meterNo});
        }

        legendData.push('洪洞县')
        let nowMaxUnixTime = now.getTime()
        let nowMinUnixTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0,
          0).getTime()
        if (instantData) {
          let maxUnixTime = 0
          let data = []
          instantData.forEach(item => {
            let time = dateUtil.unix(item.collectTime) * 1000
            if (time >= nowMinUnixTime && time < nowMaxUnixTime && (time + 60 * 60 * 1000)
              >= nowMaxUnixTime) {
              if (maxUnixTime <= time) {
                maxUnixTime = time
              }
              data.push([dateUtil.time(item.collectTime), item.instFlow, time])
            }
          })
          todayFlow.push(data)
          this.nowMaxUnixTime.push(maxUnixTime)
        }

        return {todayFlow, legendData}
      },

      getXAxisData(todayFlow) {
        let timeData = []
        todayFlow.map(item => {
          item.map(a => {
            timeData.push(a[2])
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
            symbolSize: 5,
            large: true
          })
        }
        this.charts.setOption({
          color: ['#00CCCC', '#0091fd'],
          title: {
            text: '源水当日流量曲线(' + (timeData.length > 0 ? timeData[timeData.length - 1]
              : dateUtil.time())
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
        if (this.nowMaxUnixTime[0]) {
          let time = dateUtil.unix(latestData.dataTime) * 1000
          if ((this.nowMaxUnixTime[0] && this.nowMaxUnixTime[0] < time)
            || !this.nowMaxUnixTime[0]) {
            this.nowMaxUnixTime[0] = time
            todayFlow.push([dateUtil.time(latestData.dataTime), latestData.instFlow, time])
          }
        } else {
          todayFlow = []
        }
        return {latestData:todayFlow}
      },
      async refresh() {
        let instant = await this.getMeterDataLatest({meterNo: this.meterNo});

        if (!instant) {
          return
        }
        let {latestData} = await this.getLatestData(instant)
        if (latestData.length == 0) {
          return
        }
        latestData && latestData.map(a => {
          this.todayFlow[0].push(a);
          this.todayFlow[0].shift()
          this.xAxisData.push(a[0])
          this.xAxisData.shift();
        })
        let seriesData = []
        seriesData.push({
          data: this.todayFlow[0],
        })
        this.charts.setOption({
          title: {
            text: '源水当日流量曲线(' + this.xAxisData[this.xAxisData.length - 1] + ")"
          },
          xAxis: {
            data: this.xAxisData
          },
          series: seriesData,
        });
      }
    },
    async mounted() {
      this.initChart('sourceChart')
      // await this.drawLine()
      let self = this
      setInterval(function () {
        self.refresh()
      }, 3000);
      this.$bus.$on('window-resize', () => this.charts.resize());
    },
    destroyed() {
      this.$bus.$off('window-resize')
    }
  }
</script>

<style scoped>

</style>
