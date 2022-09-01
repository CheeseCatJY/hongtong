<template>
  <div class="plate">
    <div id="lineChart" class="h-full" :style="{height:height}"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'
  
  import {mapActions, mapState} from 'vuex'
const {lineMaterialMap} = require('@/util/lineInfos')

export default {
  props: ['height'],
  data() {
    return {
      handleHeight: '85vh',
      charts: '',
      sumLen: 0,
      materialLen: [],
      option: {
        title: {
          text: '口径分析',
          subtext: '总长度：公里',
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
        legend: {
          bottom: '0',
          type: 'scroll',
          tooltip: {
            formatter: function(e){
            },
            show: true
          },
          left: 'center'
        },
        series: [
          {
            name: '管网长度',
            type: 'pie',
            radius: ['40%', '80%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#020621',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [

            ]
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      lineList: state => state.meter.lineList,
    })
  },
  watch: {
    lineList(val) {
      this.handleLines(val);
    }
  },
  methods: {
    async drawLine(id) {
      this.charts = echarts.init(document.getElementById(id), 'dark')
      this.charts.setOption(this.option, true);
      this.$bus.$on('window-resize', () => this.charts.resize());
    },
    handleLines(lines) {
      let caliberMap = {'0': 0}
      let sumLen = 0

      lines.forEach(({line}) => {
          if (line["caliber"] < 100) {
            caliberMap['0'] += Number(line.len)
          } else {
            if (!caliberMap[line["caliber"]]) {
              caliberMap[line["caliber"]] = 0
            }
            caliberMap[line["caliber"]] += Number(line.len)
          }
          sumLen += Number(line.len)
        }
      )
      let caliber = []
      for (let key in caliberMap) {
        caliber.push({value: caliberMap[key], name: Number(key)})
      }
      caliber = caliber.sort((a, b) => b.name -  a.name)
      this.sumLen = sumLen
      this.option.title.subtext = `总长度：${(sumLen / 1000).toFixed(2)}公里`
      this.option.series[0].data = caliber.map(function (e) {
        e.value = (e.value / 1000).toFixed(2)
        e.name = e.name == 0 ? '其他' : 'DN' + e.name
        return e
      })
      //console.log(this.option.series[0].data)
      this.option.legend.tooltip.formatter = function(e){
        if(e.name == '其他'){
          return `${e.name}: ${(caliberMap['0']/ 1000).toFixed(2)}公里`
        }
        else{
          return `${e.name}: ${(caliberMap[e.name.replace('DN','')]/ 1000).toFixed(2)}公里`
        }
      }
      this.charts.setOption(this.option, true);
    }
  },
  mounted() {
    this.drawLine('lineChart');
  },
  destroyed() {
    this.$bus.$off('window-resize')
  }
}
</script>

<style scoped>

</style>
