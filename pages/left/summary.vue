<template>
  <div class="summary">
    <b-row>
      <b-col>
        <div class="theme">
          <span class="title">水厂实时数据</span>
        </div>
      </b-col>
      <b-col class="text-right">
        <!--        <div class="font-bold">{{ clock.time }}</div>
                <div class="text-gray-400 text-sm unit">{{ clock.date }} {{ clock.week }}</div>-->
      </b-col>
    </b-row>

    <div class="flex list">
      <div class="flex-1 item">
        <div class="plate">今日供水量</div>
        <div>
          <span class="num yellow">
            <animated-number :value="data.todayWaterSupply" :format-value="formatValue"></animated-number>
          </span>
          <span class="ml-0.5 unit">m³</span>
        </div>
      </div>
      <div class="flex-1 item">
        <div class="plate">昨日供水量</div>
        <div>
          <span class="num yellow">
            <animated-number :value="data.yesterdayWaterSupply" :format-value="formatValue"></animated-number>
          </span>
          <span class="ml-0.5 unit">m³</span>
        </div>
      </div>
      <div class="flex-1 item">
        <div class="plate">昨日同比</div>
        <div>
          <span class="num yellow">
            <animated-number :value="data.yesterdayCompared" :format-value="formatValue"></animated-number>
          </span>
          <span class="ml-0.5 unit">%</span>
        </div>
      </div>
    </div>

    <div class="flex list list-1">
      <div class="flex-1 item">
        <div class="plate">瞬时流量</div>
        <div>
          <span class="num blue">
            <animated-number :value="data.instantFlow" :format-value="formatValue"></animated-number>
          </span>
          <span class="ml-0.5 unit">m³/h</span>
        </div>
      </div>
      <div class="flex-1 item">
        <div class="plate">出厂压力</div>
        <div>
          <span class="num blue">
            <animated-number :value="data.outletPressure" :format-value="formatValue"></animated-number>
          </span>
          <span class="ml-0.5 unit">MPa</span>
        </div>
      </div>
      <div class="flex-1 item">
        <div class="plate">余氯</div>
        <div>
          <span class="num blue">
            <animated-number :value="data.chlorineContent" :format-value="formatValue"></animated-number>
          </span>
          <span class="ml-0.5 unit">mg/L</span>
        </div>
      </div>
      <div class="flex-1 item">
        <div class="plate">COD含量</div>
        <div>
          <span class="num blue">
            <animated-number :value="data.CODContent" :format-value="formatValue"></animated-number>
          </span>
          <span class="ml-0.5 unit">mg/L</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  data() {
    return {
      data: {
        todayWaterSupply: '',
        yesterdayWaterSupply: '',
        yesterdayCompared: '',

        instantFlow: '',
        outletPressure: '',
        chlorineContent: '',
        CODContent: '',
      },
      clock: {
        time: this.$fmt.time(undefined, 'HH:mm:ss'),
        date: this.$fmt.time(undefined, 'YYYY-MM-DD'),
        week: this.$fmt.week(),
      },
    }
  },
  computed: {
    ...mapState({})
  },
  methods: {
    async initData() {
      this.data = await this.$axios.$get('/data/testData.json')
    },
    startClock() {
      this.clock.time = this.$fmt.time(undefined, 'HH:mm:ss')
      this.clock.date = this.$fmt.time(undefined, 'YYYY-MM-DD')
      this.clock.week = this.$fmt.week()
    },
    updateData(dataList) {
      if(!dataList){
        return;
      }
      const instantFlow = dataList.reduce((pre, curr) => pre + Number(curr.instant), 0);
      const outletPressure = dataList.reduce((pre, curr) =>  Math.max(pre, Number(curr.pressure)), 0);
      this.data.instantFlow = instantFlow;
      this.data.outletPressure = outletPressure;
    },
    formatValue(value){
      return value.toFixed(2);
    }
  }, created() {
    this.timeIndex = setInterval(this.startClock, 1000)
    this.$bus.$on('update-factory-data', this.updateData)
  },
  mounted() {
    this.initData()
  },
  destroyed() {
    this.$bus.$off('update-factory-data', this.updateData)
    clearInterval(this.timeIndex)
  }
}
</script>

<style lang="less" scoped>

.summary {

  .list {
    @height: 100% ;
    height: @height/3;
    margin-bottom: 0.5rem;

    &.list-1 {
      .item {
        background-color: #1D2B3C;
      }
    }

    .item {
      height: 100%;
      background-color: #131D43;
      border-radius: 0.3rem;
      margin-left: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0.8rem;

      &:first-of-type {
        margin-left: 0;
      }

      .num {
        font-size: 1.5rem;
        font-weight: bold;
      }

      .yellow {
        color: #EEBC36;
      }

      .blue {
        color: #33CCFF;
      }
    }
  }
}
</style>
