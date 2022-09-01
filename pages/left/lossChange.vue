<template>
  <div class="plate" id="platDiv">
    <div id="lossChange" class="h-full" :style="{height: height}"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'
  import {TimeSeq} from '@/util/time'

  export default {
    data() {
      return {
        charts: '',
        option: {
          title: {
            text: '近五年产销差情况',

            textStyle: {
              fontSize: 16,
              color: '#CCCCCC'
            }, subStyle: {
              fontSize: 12,
              color: '#868686'
            },
            top:'10px'
          },
          grid:{
            bottom: 10
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            top:7,
            right: 0,
            data: ['供水量', '抄收量']
          },
          xAxis: {
            show: false,
            type: 'value'
          },
          yAxis: [
            {
              type: 'category',
              data: ['2021', '2020', '2019', '2018', '2017']
            },
            {
              type: 'category',
              data: ['30%', '30%', '30%', '30%', '30%']
            }
          ]
          ,
          series: [
            {
              name: '供水量',
              type: 'bar',
              barWidth: '60%',
              data: [520, 502, 501, 434, 490],
              itemStyle: {
                normal: {
                  color: '#122627'
                }
              }
            },
            {
              name: '抄收量',
              type: 'bar',
              barGap: '-100%',
              barWidth: '60%',
              label: {
                show: true
              },
              emphasis: {
                focus: 'series'
              },
              data: [320, 302, 301, 334, 390],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 1, 0,
                  [
                    {offset: 0, color: '#3ac79c'},
                    {offset: 0.5, color: '#1B7BCF'},
                    {offset: 1, color: '#0135FE'}
                  ]
                )
              }
            }
          ]
        }
      }
    },
    props:['height'],
    methods: {
      drawLine(id) {
        this.charts = echarts.init(document.getElementById(id),'dark')
        this.charts.setOption(this.option, true);
      }
    },
    async mounted() {
      this.$nextTick(function () {
        this.drawLine('lossChange')
      })
    },
    destroyed() {

    }
  }
</script>

<style scoped>
.h-full{
  /*height: 100vh;*/
}
</style>
