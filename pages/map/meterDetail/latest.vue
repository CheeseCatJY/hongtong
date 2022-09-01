<template>
  <div>
    <div ref="latestChart" style="height: calc(100vh - 155px)"></div>
  </div>
</template>

<script>
import "echarts/lib/component/marker/MarkAreaView"
import dateUtil from '@/util/date'
import _ from 'lodash'
import {wrapperChart, } from '@/util/meter'
import {TimeSeq} from '@/util/time'
import echarts from '@/plugins/echarts'
import {mapActions, mapState} from 'vuex';

/**
 * 计算 markLines
 * */
const markLines = {
  pressure: [
    {
      name: '最小压力',
      yAxis: 0.0
    },
    {
      name: '最大压力',
      yAxis: 0.0
    }
  ],
  flow: [
    {
      name: '夜间流速',
      yAxis: 0
    },
    {
      name: '最大流速',
      yAxis: 0
    },
    {
      name: '报警流速',
      yAxis: 0
    }
  ]
}

/**
 * 计算markPoints
 * */
const markPoints = (chartRows, flow, inst, minInst) => {
  const points = []
  if (!flow || !inst) {
    return points
  }
  chartRows.map(function (item, index) {
    if (index > 0 && item.instFlow > minInst) {
      let prev = null
      for (let i = index - 1; i > 0; i--) {
        if (chartRows[i].fperiodFlow != '-' && chartRows[i].instFlow != '-') {
          prev = chartRows[i]
          break
        }
      }
      let per
      if (prev != null) {
        per = (item.fperiodFlow - prev.fperiodFlow) / prev.fperiodFlow * 100
      }

      if (per > flow) {
        per = (item.instFlow - prev.instFlow) / prev.instFlow
          * 100
        if (per > inst) {
          points.push({
            name: '报警',
            coord: [item.time, item.instFlow]
          })
        }
      }
    }
  })

  return points
}

export default {
  components: {},
  layout: "no",
  head: {
    title: "实时数据"
  },
  props: ['date', 'meter', 'marksData'],

  data() {
    return {
      chartRows: [],
      dayData: null,
      originData: [],
      brushIndex: 1,
      instFlowList: [],
      pressureList: [],
      fperiodFlowList: [],
      rperiodFlowList: [],
      unit: {
        '流量': ' m³/h',
        '压力': ' MPa',
        '正水量': ' m³',
        '反水量': ' m³'
      },
      lineChart: null,
      option: {}
    };
  },
  computed: {
    summaryData() {
      let dayData = this.dayData;

      let data = {
        flow: '-',
        forward: {
          flow: '-',
          start: '-',
          end: '-',
        },
        reverse: {
          flow: '-',
          start: '-',
          end: '-',
        },
        max: {
          flow: '-',
          time: '-',
        },
        min: {
          flow: '-',
          time: '-',
        },
        night: {
          flow: '-',
          time: '-',
        }
      }
      if (!dayData || Object.keys(dayData).length == 1) {
        return data
      }

      data.forward.start = (Number(dayData.forwardTotalFlow) - Number(
        dayData.forwardDayFlow)).toFixed(2)
      data.reverse.start = (Number(dayData.reverseTotalFlow) - Number(
        dayData.reverseDayFlow)).toFixed(2)

      data.forward.end = Number(dayData.forwardTotalFlow).toFixed(2)
      data.reverse.end = Number(dayData.reverseTotalFlow).toFixed(2)

      data.max.flow = Number(dayData.maxFlow).toFixed(2)
      data.max.time = dayData.maxTime

      data.min.flow = Number(dayData.minFlow).toFixed(2)
      data.min.time = dayData.minTime

      data.forward.flow = Number(dayData.forwardDayFlow).toFixed(2)
      data.reverse.flow = Number(dayData.reverseDayFlow).toFixed(2)
      data.flow = Number(dayData.dayFlow).toFixed(2)

      data.night.flow = Number(dayData.nightMinFlow).toFixed(2)
      data.night.time = dayData.nightMinTime

      return data
    },

  },
  methods: {
    ...mapActions({
      meterDataHistory: 'meter/meterDataHistory',
      getMeterDataDay: 'meter/getMeterDataDay',
    }),
    /**
     * api 获取水表历史数据
     * @param meter
     * @param date
     * @returns {Promise<*>}
     */
    async initLatestData(meter, date) {
      let historyData = await this.meterDataHistory(
        {meterNo: this.meter.meterNo, time: date})
      let dayDataList = await this.getMeterDataDay({meterNo: this.meter.meterNo, time: date})
      if (dayDataList && dayDataList.length>0){
        this.dayData = dayDataList[0]
      }
      this.originData = _.cloneDeep(historyData)
      historyData.forEach((item) => {
        item['flow'] = item.fperiodFlow - item.rperiodFlow
        return item
      })
      return wrapperChart(historyData || [], meter.rate)
    },
    /**
     * 更新图表
     * @param meter
     * @param date
     * @returns {Promise<void>}
     */
    async updateChart(meter, date) {
      if (meter.deviceNo) {
        /*更新图表数据*/
        this.chartRows = await this.initLatestData(meter, dateUtil.day(date));
        this.processData(this.chartRows)

        this.initChart()
        /*更新图标marks*/
        this.updateMarks(this.marksData)
      }
    },
    /**
     * 更新图表marks
     * @param val
     */
    updateMarks(val) {

      if (!this.lineChart) {
        return
      }

      let options = this.option
      /*markLines计算*/
      markLines.pressure[0].yAxis = (val.item2 && val.item2.setValue) || '-'
      markLines.pressure[1].yAxis = (val.item3 && val.item3.setValue) || '-'
      markLines.flow[0].yAxis = (val.item4 && val.item4.setValue) || '-'
      markLines.flow[1].yAxis = (val.item5 && val.item5.setValue) || '-'
      markLines.flow[2].yAxis = (val.item6 && val.item6.setValue) || '-'

      /*设置markLines*/
      options.series[0].markLine = {
        data: markLines.flow
      }
      options.series[1].markLine = {
        data: markLines.pressure
      }

      /*markPoint计算*/
      let flow = (val.item0 && val.item0.setValue) || '-'
        , inst = (val.item1 && val.item1.setValue) || '-'
        , minInst = (val.item6 && val.item6.setValue) || '-'
        , points = markPoints(this.chartRows, flow, inst, minInst)
      let nightArr = this.originData.filter(
        item => {
          return (dateUtil.hour(item.collectTime) >= 1 && dateUtil.hour(item.collectTime) < 5)
            && item.instFlow > 0
        })
      let nightMin = null
      if (nightArr.length > 0) {
        nightMin = nightArr[0]
      }
      nightArr.forEach(item => {
        if (item.instFlow < nightMin.instFlow) {
          nightMin = item
        }
      })
      if (nightMin) {
        points.push({
          name: '夜间最小流量',
          coord: [dateUtil.date(nightMin.collectTime, 'HH:mm'), nightMin.instFlow],
          label: {
            position: 'top',
            formatter: function (e) {
              return e.data.coord[1]
            }
          },
          itemStyle: {
            // normal: {
            color: '#d3758f',
            shadowOffsetX: 3,
            shadowOffsetY: 2,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            shadowBlur: 5
            // }
          }
        })
      }

      options.series[0].markPoint = {
        symbolSize: 35,
        label: {
          position: 'top',
          formatter: function (e) {
            return e.data.coord[1]
          }
        },
        itemStyle: {
          // normal: {
          color: '#FF0000',
          shadowOffsetX: 3,
          shadowOffsetY: 2,
          shadowColor: 'rgba(0, 0, 0, 0.4)',
          shadowBlur: 5
          // }
        },
        data: points
      }

      this.lineChart.setOption(options)
    },
    resize() {
      this.$refs.latestChart.resize()
    },

    processData(data) {
      this.instFlowList = []
      this.pressureList = []
      this.fperiodFlowList = []
      this.rperiodFlowList = []
      let temp = []
      data.map((item, index) => {

        if (item.instFlow === '-') {
          if (temp.length < 2) {
            temp.push({xAxis: index})
          } else {
            temp[1] = {xAxis: index}
          }
        } else {
          this.instFlowList.push([item.time, item.instFlow])
          this.pressureList.push([item.time, item.pressure])
          this.fperiodFlowList.push([item.time, item.fperiodFlow])
          this.rperiodFlowList.push([item.time, item.rperiodFlow])
          if (temp.length === 1) {
            temp.push({xAxis: index - 2})
          }
          if (temp.length === 2) {
            temp = []
          }
        }
      })
    },
    afterConfig(options) {
      // let length = options.yAxis.length
      // if (length < 3) {
      options.yAxis = [
        {
          type: 'value',
          //name: '瞬时',
          position: 'left',
        },
        {
          type: 'value',
          //name: '压力',
          splitLine: {
            show: false
          },
          axisLabel: {
            fontSize: 10,
            inside: true
          },
          position: 'left'
        },
        {
          type: 'value',
          splitLine: {
            show: false
          },
          //name: '正向',
          position: 'right',
        }
      ]
      // }

      /*设置y轴位置*/
      options.series[0].yAxisIndex = 0
      options.series[1].yAxisIndex = 1
      options.series[2].yAxisIndex = 2
      options.series[3].yAxisIndex = 2
      return options;
    },
    toolbox() {
      let self = this
      return {
        iconStyle: {
          // normal: {
          borderWidth: 2,
          borderColor: "#aaaaaa"
          // },

        },
        emphasis: {
          iconStyle: {
            borderWidth: 2,
            borderColor: "#f44d55"
          }

        },
        top: 20,
        feature: {
          dataZoom: {
            yAxisIndex: false
          },
          dataView: {
            title: '表格视图',
            readOnly: true,
            optionToContent: function () {
              let data = self.originData;
              let tablecss = "width:100%;text-align: left;"
              let thcss = "border-bottom: 1px solid #C1DAD7; border-top: 1px solid #C1DAD7;padding: 6px 6px 6px 12px;color:#000000;"
              let tdcss = "background-color:#f5f8f7;padding: 6px 6px 6px 12px;color:#000000;"
              let arr = []
              arr.push(
                `<table style="${tablecss}"><tbody><tr><td style="${thcss}">序号</td><td style="${thcss}">采集时间</td><td style="${thcss}">流量</td><td style="${thcss}">正向流量</td>
                  <td style="${thcss}">正向止度</td><td style="${thcss}">反向流量</td><td style="${thcss}">反向止度</td>
                  <td style="${thcss}">流速</td><td style="${thcss}">压力</td><td style="${thcss}">接收时间</td></tr>`)
              data.map(function (item, i) {
                let flow = item.flow ? item.flow : '-';
                let fperiodFlow = item.fperiodFlow ? item.fperiodFlow : '-';
                let rperiodFlow = item.rperiodFlow ? item.rperiodFlow : '-';
                let ftotalFlow = Number(item.ftotalFlow).toFixed(2);
                let rtotalFlow = Number(item.rtotalFlow).toFixed(2);
                let instFlow = Number(item.instFlow).toFixed(2);
                let pressure = Number(item.pressure).toFixed(2);
                arr.push(
                  `<tr><td style="${tdcss}">${i
                  + 1}</td><td style="${tdcss}">${item.collectTime}</td><td style="${tdcss}">${flow}</td><td style="${tdcss}">${fperiodFlow}</td><td style="${tdcss}">${ftotalFlow}</td>
                    <td style="${tdcss}">${rperiodFlow}</td><td style="${tdcss}">${rtotalFlow}</td><td style="${tdcss}">${instFlow}</td>
                    <td style="${tdcss}">${pressure}</td><td style="${tdcss}">${item.createTime}</td></tr>`)
              })

              arr.push(`</tbody></table>`)
              return arr.join('')
            }
          }
        }
      }
    },
    title() {
      const {flow, forward, reverse, max, min, night} = this.summaryData
      let text = `水量：${flow}，正向【水量：${forward.flow}，起度：${forward.start}，止度：${forward.end}】，反向【水量：${reverse.flow}，起度：${reverse.start}，止度：${reverse.end}】`
      let subtext = `夜间最小流量：【${night.time}】${night.flow} m³/h，最大、最小瞬时：【${max.time}】${max.flow} m³/h，【${min.time}】${min.flow} m³/h`

      return {
        text: text,
        subtext: subtext,
        textStyle: {
          fontSize: 12
        },
        left: 'left'
      }
    },
    initChart() {
      if (!this.lineChart) {
        this.lineChart = echarts.init(this.$refs.latestChart, 'white');
      }
      let unit = this.unit
      this.option = {
        title: this.title(),
        color: ['#3fb1e3', '#FA788E', '#19D4AE', '#ffb248'],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: TimeSeq('00:00', {
            slot: 1,
            separator: ':'
          })
        },
        grid: {
          left: 50,
          right: 20
        },
        toolbox: this.toolbox(),
        legend: {
          show: true,
          right: 0,
          align: 'right',
          selected: {
            '流量': true,
            '压力': true,
            '正水量': false,
            '反水量': false
          },
          data: ['流量', '压力', '正水量', '反水量']
        },
        tooltip: {
          formatter: function (param) {
            let str = param && param[0] && param[0].name || '';
            if (param && param.map) {
              param.map((e) => {
                str += '<br/>' + e.marker + e.seriesName + '：' + e.data[1] + unit[e.seriesName]
              })
            }

            return str
          },
          axisPointer: {
            type: 'cross'
          }
        },
        brush: {
          yAxisIndex: this.brushIndex,
          outOfBrush: {
            colorAlpha: 0.1
          },
          throttleType: 'fixRate',
          throttleDelay: 100
        },
        series: [
          {
            name: '流量',
            type: 'line',
            smooth: true,
            connectNulls: true,
            data: this.instFlowList,
            area: true,
            areaStyle: {
              // normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#5ab1ef'
              }, {
                offset: 1,
                color: '#a5e7f0'
              }])
              // }
            },
            markArea: {
              silent: true,
              itemStyle: {
                // normal: {
                color: "transparent",
                borderColor: 'red',
                borderWidth: 1,
                borderType: "dashed"
                // }
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
          },
          {
            name: '压力',
            type: 'line',
            smooth: true,
            connectNulls: true,
            data: this.pressureList
          },
          {
            name: '正水量',
            type: 'line',
            smooth: true,
            connectNulls: true,
            data: this.fperiodFlowList
          }, {
            name: '反水量',
            type: 'line',
            smooth: true,
            connectNulls: true,
            data: this.rperiodFlowList
          }
        ]
      }
      this.option = this.afterConfig(this.option)

      this.lineChart.setOption(this.option);
    }
  },
  watch: {
    meter(newVal) {
      this.updateChart(newVal, this.date)
    },
    date(newVal) {
      this.updateChart(this.meter, newVal)
    },
    marksData: {
      handler(val, oldVal) {
        this.updateMarks(val)
      },
      deep: true
    },

  },
  mounted() {
    this.updateChart(this.meter, this.date)
    this.$bus.$on('window-resize', () => {
      this.lineChart && this.lineChart.resize()
    });
  },
  created() {
  },
  destroyed() {
    this.$bus.$off('window-resize')
  }
}
</script>

<style scoped>

.el-pagination {
  padding-top: 10px;
}

.chart {
  width: 100%;
}

.table /deep/ .header-cell {
  background-color: #f8f8f8;
}
</style>
