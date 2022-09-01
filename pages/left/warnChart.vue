<template>
  <div>
    <div id="warn-chart" class="h-full"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'

  export default {
    data() {
      return {
        myChart:{}
      }
    },
    methods: {
      async initChart() {

        var chartDom = document.getElementById('warn-chart');
        var myChart = echarts.init(chartDom, 'dark');
        var option;

        option = {
          color: ['#FFE434', '#56A3F1', '#FF917C'],
          title: {
            text: '系统报警统计情况',
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
          tooltip: {
            trigger: 'item'
          },
          radar: {
            center: ['50%', '55%'],
            radius:'70%',
            indicator: [
              { name: '进水压力', max: 10},
              { name: '出水压力', max: 15},
              { name: '耗电量', max: 10},
              { name: '流量', max: 20},
              { name: '瞬时', max: 10},
              { name: '余氯', max: 10},
              { name: '浊度', max: 10},
              { name: 'ph', max: 10}
            ]
          },
          series: [{
            name: '实时报警',
            type: 'radar',
            data: [
              {
                value: [5, 12, 3, 15, 8, 1, 7, 2],
                name: '实时报警'
              }
            ]
          }]
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
      console.log(self.myChart.getOption())
      setInterval(function () {
        //run();
        console.log(index,self.myChart);
        index += 1
        index = index%8
        if (self.myChart){
          self.myChart.setOption({
            series: [
              {
                name: '实时报警',
                label:{
                  show:true,
                  formatter:function(e){
                    if(e.dimensionIndex == index){
                      return ` {b|${self.myChart.getOption().radar[0].indicator[index].name}：} {per|${e.value}}  `
                    }
                    return ''
                  },
                  backgroundColor: '#F6F8FC',
                  borderColor: '#8C8D8E',
                  borderWidth: 1,
                  borderRadius: 4,
                  rich: {
                    b: {
                      color: '#4C5058',
                      fontSize: 14,
                      fontWeight: 'bold',
                      lineHeight: 33
                    },
                    per: {
                      color: '#fff',
                      backgroundColor: '#4C5058',
                      padding: [5,3,3, 4],
                      borderRadius: 4
                    }
                  }
                }
              }
            ]
          });
        }

      }, 3000);
    },
    destroyed() {
      this.$bus.$off('window-resize')
    }
  }
</script>

<style lang="less" scoped>

</style>
