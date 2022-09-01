<template>
  <div class="w-full h-full">
    <box-border-view :showTitle="false">
      <template #box_main>
        <div class="w-full h-full flex flex-nowrap justify-center z-10">
          <box-border-view :showBorder="false" title="分区漏损" class="w-1/2 h-full">
            <template #box_main>
              <div id="barChart" class="w-full h-full z-10"></div>
            </template>
          </box-border-view>
          <box-border-view :showBorder="false" title="口径分析" :subTitle="subTitle" class="w-1/2 h-full">
            <template #box_main>
              <div id="pieChart" class="w-full h-full z-10"></div>
            </template>
          </box-border-view>
        </div>
      </template>
    </box-border-view>
  </div>
</template>
<script>
import BoxBorderView from "@/components/shared/BoxBorderView.vue";
import echarts from "@/plugins/echarts";

const { lineMaterialMap } = require('@/util/lineInfos')
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    BoxBorderView
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
  data() {
    return {
      subTitle: '',
      pieOption: {
        tooltip: {
          trigger: "item"
        },
        legend: {
          type: 'scroll',
          bottom: "3%",
          itemWidth: 20,
          itemHeight: 20,
        },
        xAxis: [
          {
            show: false,
            type: 'category',
          }
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
            splitNumber: 3
          }
        ],
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 30,
              // borderColor: "balck",
              // borderWidth: 10
            },
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              // { value: 1048, name: "(CR)异物穿入" },
              // { value: 735, name: "(PL)破裂" },
              // { value: 580, name: "(TL)接口材料脱落" },
              // { value: 484, name: "(CQ)残墙、坝根" },
              // { value: 300, name: "(JG)结垢" }
            ]
          }
        ]
      },
      barOption: {
        backgroundColor: "rgba(0,0,0,0)",
        tooltip: {
          trigger: "item"
        },
        grid: {
          show: true,
          borderWidth: 1,
          borderColor: "rgba(255, 241, 0, .1)",
          right: '3%',
          left: '3%',
          top: '10%',
          bottom: '8%',
        },
        xAxis: [
          {
            show: true,
            type: 'category',

          }
        ],
        textStyle: {
          fontSize: 50
        },
        yAxis: [
          {
            type: 'value',
            splitNumber: 3
          }
        ],
        legend: {
          bottom: '0',
          type: 'scroll',
          tooltip: {
            formatter: function (e) {
            },
            show: true
          },
          left: 'center'
        },
        series: [
          {
            data: [
              120,
              {
                value: 200
              },
              150,
              80,
              70,
              110,
              130
            ],
            type: "bar",
            itemStyle: {
              color: "#1F88FF"
            },
            barWidth: 24
          }
        ]
      },
      barCharts: null,
      pieCharts: null,

    };
  },
  mounted() {
    this.barCharts = echarts.init(document.getElementById("barChart"), "dark");
    this.pieCharts = echarts.init(document.getElementById("pieChart"), "dark");
    // this.barOption && this.barCharts.setOption(this.barOption);
    // this.pieOption && this.pieCharts.setOption(this.pieOption);
    this.handlePart()
  }, methods: {
    ...mapActions({
      getPartData: 'meter/getPartData',
      getPartNos: 'meter/getPartNos',
    }),
    handleLines(lines) {
      let caliberMap = { '0': 0 }
      let sumLen = 0
      lines.forEach(({ line }) => {
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
        caliber.push({ value: caliberMap[key], name: Number(key) })
      }
      caliber = caliber.sort((a, b) => b.name - a.name)
      // this.subTitle = `总长度：${(sumLen / 1000).toFixed(2)}公里`
      this.pieOption.series[0].data = caliber.map(function (e) {
        e.value = (e.value / 1000).toFixed(2)
        e.name = e.name == 0 ? '其他' : 'DN' + e.name
        return e
      })
      console.log('this.barOption.series')
      console.log(this.barOption.series)
      // this.pieCharts.legend.tooltip.formatter = function(e){
      //   if(e.name == '其他'){
      //     return `${e.name}: ${(caliberMap['0']/ 1000).toFixed(2)}公里`
      //   }
      //   else{
      //     return `${e.name}: ${(caliberMap[e.name.replace('DN','')]/ 1000).toFixed(2)}公里`
      //   }
      // }
      this.pieCharts.setOption(this.pieOption, true);
    },
    async handlePart() {
      let partNos = await this.getPartNos()
      let partData = await this.getPartData({})
      let children = partNos && partNos.children ? partNos.children : []
      if (children) {
        let xAxisData = []
        let leakData = []
        children.forEach(part => {
          let filterData = partData.filter(item => item.no == part.id)
          if (filterData && filterData.length > 0) {
            let data = filterData[0]
            if (data.flowIn) {
              xAxisData.push(data.name)
              leakData.push(data.flowLeak ? Math.abs(parseFloat((data.flowLeak / data.flow * 100).toFixed(2))) : 0)
            }
          }
        })
        this.barOption.series[0].data = leakData
        this.barOption.xAxis[0].data = xAxisData
        this.barCharts.setOption(this.barOption, true);
      }
    }
  }
};
</script>

<style lang='less' scoped>
.page-bg {
  background-color: #152137;
  position: relative;
}
</style>
