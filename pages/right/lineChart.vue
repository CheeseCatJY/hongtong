<template>
  <div class="plate">
    <div id="lineChart" class="h-full" :style="{height:height}"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'

  export default {
    props:['height'],
    data() {
      return {
        handleHeight:'25vh',
        charts: '',
        option: {
          title: {
             text: '管网资产统计分析',
             subtext: '截至目前管线总长度：200.154公里',
             textStyle: {
               fontSize: 16,
               color: '#CCCCCC'
             }, subStyle: {
               fontSize: 12,
               color: '#868686'
             },
             top: '10px'
           },
          tooltip: {
            trigger: 'item',
            formatter: function(params){
              return params.seriesName + '<br/>' + params.marker + params.name + '：' +  + params.value
            }
          },
          angleAxis: {
            type: 'category',
            data: ['DN40', 'DN50', 'DN65', 'DN80', 'DN100',
              'DN150', 'DN200', 'DN250', 'DN300']
          },
          radiusAxis: {},
          polar: {
            center: ['55%', '55%'],
            radius:'70%',
          },
          series: [{
            type: 'bar',
            data: [1, 2, 3, 4, 3, 5, 1, 5, 4],
            coordinateSystem: 'polar',
            name: '铸铁',
            stack: 'a',
            emphasis: {
              focus: 'series'
            },
            top:40
          }, {
            type: 'bar',
            data: [2, 4, 6, 1, 3, 2, 1, 2, 4],
            coordinateSystem: 'polar',
            name: 'PVC',
            stack: 'a',
            emphasis: {
              focus: 'series'
            },
            top:40
          }, {
            type: 'bar',
            data: [1, 2, 3, 4, 1, 2, 5, 3, 5],
            coordinateSystem: 'polar',
            name: 'PE',
            stack: 'a',
            emphasis: {
              focus: 'series'
            },
            top:40
          }, {
            type: 'bar',
            data: [1, 2, 3, 4, 1, 2, 5, 6, 4],
            coordinateSystem: 'polar',
            name: '镀锌管',
            stack: 'a',
            emphasis: {
              focus: 'series'
            },
            top:40
          }, {
            type: 'bar',
            data: [1, 2, 3, 4, 1, 2, 5, 3, 6],
            coordinateSystem: 'polar',
            name: '钢管',
            stack: 'a',
            emphasis: {
              focus: 'series'
            },
            top:40
          }],
          legend: {
            show: true,
            data: ['铸铁', 'PVC', 'PE', '镀锌管', '钢管'],
            orient: 'vertical',
            left: 'left',
            top:'center'
          },
        }
      }
    },
    methods: {
      drawLine(id) {
        this.charts = echarts.init(document.getElementById(id), 'dark')
        this.charts.setOption(this.option, true);
        this.$bus.$on('window-resize', () => this.charts.resize());
      }
    },
    async mounted() {
      this.$nextTick(function () {
        this.drawLine('lineChart')
      })
      let index = 0
      let self = this
      setInterval(function () {
        //run();
        index += 1
        index = index % 5
        self.charts && self.charts.dispatchAction({type: 'highlight',seriesIndex: index});
      }, 1000);

    },
    destroyed() {
      this.$bus.$off('window-resize')
    }
  }
</script>

<style scoped>

</style>
