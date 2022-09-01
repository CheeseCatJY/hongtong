<template>
  <div>
    <div id="read-chart" class="h-full"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'

  export default {
    name: 'readChart',
    data() {
      return {}
    },
    methods: {
      initChart() {

        var chartDom = document.getElementById('read-chart');
        var myChart = echarts.init(chartDom, 'dark');
        var option;

        option = {
          title: {
            text: '抄收统计情况',
            subtext: '数据来源：2021年05月营收统计数据',
            textStyle: {
              fontSize: 16,
              color: '#CCCCCC'
            }, subStyle: {
              fontSize: 12,
              color: '#868686'
            },
            top: '10px'
          },
          darkMode: true,
          tooltip: {
            trigger: 'item',
            position: 'inside',
            confine: true
          },
          legend: {
            top: 'bottom',
            left: 'center',
            show: false,
          },

          series: [
            {
              name: '6月抄收统计',
              type: 'pie',
              top: '10%',
              radius: '80%',
              data: [
                {value: 425243, name: '居民用水'},
                {value: 384548, name: '工业用水'},
                {value: 128543, name: '商业用水'},
                {value: 64511, name: '特种用水'},
                {value: 36854, name: '其他用水'}
              ],
              itemStyle: {
                borderRadius: 5,
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 2
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);

        return myChart;
      }
    },
    async mounted() {
      this.myChart = await this.initChart()
      this.$bus.$on('window-resize', () => this.myChart && this.myChart.resize());
      let index = 0
      let self = this
      setInterval(function () {
        //run();
        index += 1
        index = index % 5
        self.myChart && self.myChart.dispatchAction(
          {type: 'showTip', seriesIndex: 0, dataIndex: index});
      }, 3000);
    },
    destroyed() {
      this.$bus.$off('window-resize')
    }
  }
</script>

<style lang="less" scoped>

</style>
