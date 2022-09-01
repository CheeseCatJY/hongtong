<template>
  <div class="plate">
    <div id="lossChart" class="h-full" :style="{height: height}"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'
  export default {
    data() {
      return {
        charts: '',
        option: {
          title: {
            text: '2021年产销差分析',
            subtext: '总供水量：83413.34 吨，售水量：23542.34 吨',
            textStyle: {
              fontSize: 16,
              color: '#CCCCCC'
            }, subStyle: {
              fontSize: 12,
              color: '#868686'
            },
            top:'10px'
          },
          series: [{
            type: 'gauge',
            center: ['50%', '53%'],
            radius: '78%',
            min: 0,
            max: 50,
            anchor: {
              show: true,
              showAbove: true,
              size: 12,
              itemStyle: {
                color: '#FAC858'
              }
            },
            pointer: {
              icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
              width: 3,
              length: '88%',
              offsetCenter: [0, '15%']
            },
            progress: {
              show: true,
              overlap: true,
              roundCap: true
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                color: [
                  [1, '#122627']
                ]
              }
            },
            data: [{
              value: 28.54,
              name: '漏损率',
              title: {
                offsetCenter: ['-40%', '80%']
              },
              detail: {
                offsetCenter: ['-40%', '100%']
              }
            },{
              value: 35.12,
              name: '产销差',
              title: {
                offsetCenter: ['40%', '80%']
              },
              detail: {
                offsetCenter: ['40%', '100%']
              }
            }
            ],
            title: {
              fontSize: 12,
              color: '#999',
            },
            detail: {
              width: 40,
              height: 12,
              fontSize: 12,
              color: '#222',
              backgroundColor: 'auto',
              borderRadius: 3,
              formatter: '{value}%'
            }
          }]
        }
      }
    },
    props:['height'],
    methods: {
      drawLine(id) {
        this.charts = echarts.init(document.getElementById(id),'dark')
        this.charts.setOption(this.option, true);
        this.$bus.$on('window-resize', () => this.charts.resize());
      }
    },
    async mounted() {
      this.$nextTick(function () {
        this.drawLine('lossChart')
      })
    },
    destroyed() {
      this.$bus.$off('window-resize')
    }
  }
</script>

<style scoped>

</style>
