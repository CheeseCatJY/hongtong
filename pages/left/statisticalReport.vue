<template>
  <div class="plate">
    <div id="statisticalReportChart" class="h-full" :style="{height: height}"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'
  import {TimeSeq} from '@/util/time'

  export default {
    props:['height'],
    data() {
      return {
        charts: '',
        option: {
          title: {
            text: '万吨水电耗统计报表',
            textStyle: {
              fontSize: 16,
              color: '#CCCCCC'
            },
            top:'10px'
          },
          grid:{
            left:20,
            right: 20,
            bottom: 10
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            top:7,
            left: 'right',
            data: ['供水量', '电耗', '万吨水电耗']
          },
          xAxis: [
            {
              show:false,
              type: 'category',
              data: ['2020-01', '2020-02', '2020-03', '2020-04', '2020-05', '2020-06', '2020-07',
                '2020-08', '2020-09', '2020-10', '12020-11', '2020-12'],

            }
          ],
          yAxis: [
            {
              type: 'value',
              splitNumber: 3
            },
            {
              type: 'value',
              position: 'left',
              axisLabel: {
                inside: true
              },
              splitNumber: 3
            },
            {
              type: 'value',
              splitNumber: 3,
              position: 'right'

            }
          ],
          series: [
            {
              name: '供水量',
              type: 'bar',
              data: [10, 20, 50, 30, 35, 45, 42, 49, 38, 36, 20, 20],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#0135FE'},
                    {offset: 0.5, color: '#1B7BCF'},
                    {offset: 1, color: '#3ac79c'}
                  ]
                )
              },
              emphasis: {
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#3ac79c'},
                      {offset: 0.7, color: '#1B7BCF'},
                      {offset: 1, color: '#0135FE'}
                    ]
                  )
                }
              },
            },

            {
              name: '电耗',
              type: 'bar',
              barGap: '50%',
              yAxisIndex: 1,
              data: [30, 20, 50, 25, 36, 45, 26, 35, 39, 49, 13, 38],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#FC9A67'},
                    {offset: 0.5, color: '#99b182'},
                    {offset: 1, color: '#3ac79c'}
                  ]
                )
              },
              emphasis: {
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#3ac79c'},
                      {offset: 0.7, color: '#99b182'},
                      {offset: 1, color: '#FC9A67'}
                    ]
                  )
                }
              },
            },
            {
              name: '万吨水电耗',
              type: 'line',
              yAxisIndex: 2,
              data: [2.0, 2.2, 3.3, 4.5, 6.3, 7.2, 2.3, 3.4, 3.0, 6.5, 2.0, 6.2],
              itemStyle : {
                normal : {
                  color:'#990000',
                  lineStyle:{
                    color:'#990000'
                  }
                }
              },
            }
          ]
        }
      }
    },
    methods: {
      drawLine(id) {
        this.charts = echarts.init(document.getElementById(id),'dark')
        this.charts.setOption(this.option, true);
        this.$bus.$on('window-resize', () => this.charts.resize());
      }
    },
    async mounted() {
      this.$nextTick(function () {
        this.drawLine('statisticalReportChart')
      })
    },
    destroyed() {
      this.$bus.$off('window-resize')
    }
  }
</script>

<style scoped>

</style>

