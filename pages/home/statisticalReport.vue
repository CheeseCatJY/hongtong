<template>
  <div class="plate">
    <div id="statisticalReportChart" class="h-full" :style="{height: height}"></div>
  </div>
</template>

<script>
  import echarts from '@/plugins/echarts'
  import {TimeSeq} from '@/util/time'
  import {mapActions} from "vuex";

  export default {
    props:['height'],
    data() {
      return {
        charts: '',
        option: {
          title: {
            text: '分区漏损',
            textStyle: {
              fontSize: 16,
              color: '#CCCCCC'
            },
            top:'10px'
          },
          grid:{
            //left:20,
            right: 20
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            top:7,
            left: 'right',
            data: [ '漏损率']
          },
          xAxis: [
            {
              show:true,
              type: 'category',
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitNumber: 3
            }
          ],
          series: [
            {
              name: '漏损',
              type: 'bar',
              barGap: '50%',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#3ac79c'},
                    {offset: 0.7, color: '#1B7BCF'},
                    {offset: 1, color: '#0135FE'}
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
            }
          ]
        }
      }
    },
    methods: {
      ...mapActions({
        getPartData: 'meter/getPartData',
        getPartNos: 'meter/getPartNos',
      }),
      drawLine(id) {
        this.charts = echarts.init(document.getElementById(id),'dark')
        this.charts.setOption(this.option, true);
        this.$bus.$on('window-resize', () => this.charts.resize());
      }
    },
    async mounted() {
      this.drawLine('statisticalReportChart')
      let partNos = await this.getPartNos()
      let partData = await this.getPartData({})
      let children = partNos && partNos.children?partNos.children:[]
      if (children){
        let xAxisData = []
        let leakData = []
        children.forEach(part =>{
          let filterData = partData.filter(item => item.no == part.id)
          if (filterData && filterData.length>0){
            let data = filterData[0]
            if (data.flowIn) {
              xAxisData.push(data.name)
              leakData.push(data.flowLeak?Math.abs(parseFloat((data.flowLeak / data.flow * 100).toFixed(2))):0)
            }
          }
        })
        this.charts.setOption({
          color: ['#900000', '#0091fd'],
          series: [{data:leakData}],
          xAxis: {
            data: xAxisData
          },
        })
      }

    },
    destroyed() {
      this.$bus.$off('window-resize')
    }
  }
</script>

<style scoped>

</style>

