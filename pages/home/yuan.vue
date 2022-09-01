<template>
  <div class="summary">
    <div style="width: 100%;">
      <div class="flex list">
        <div class="flex-1 item">
          <div class="plate">源水日流量</div>
          <div>
          <span class="num yellow">
            <animated-number :value="data.inDay" :format-value="formatValue"></animated-number>
          </span>

          </div>
        </div>
        <div class="flex-1 item">
          <div class="plate">月流量(万)</div>
          <div>
            <span class="num yellow">
              <animated-number :value="data.inMonth/10000"
                               :format-value="formatValue"></animated-number>
            </span>

          </div>
        </div>
        <div class="flex-1 item">
          <div class="plate">年流量(万)</div>
          <div>
            <span class="num yellow">
              <animated-number :value="data.inYear/10000"
                               :format-value="formatValue"></animated-number>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100%; padding: 5px 0">
      <table style="font-size: 0.8rem;text-align: center;">
        <tr>
          <td style="width: 60px;">名称</td>
          <td style="width: 60px;">瞬时</td>
          <td style="width: 60px;">日流量</td>
          <td style="width: 60px;">月流量(万)</td>
          <td style="width: 60px;">年流量(万)</td>
        </tr>
        <tr>
          <td>一期</td>
          <td>{{ latest1.instFlow || '-' }}</td>
          <td>{{ formatValue(data1.day.dayFlow) || '-' }}</td>
          <td>{{ formatValue(data1.month.dayFlow / 10000) || '-' }}</td>
          <td>{{ formatValue(data1.year.dayFlow / 10000) || '-' }}</td>
        </tr>
        <tr>
          <td>二期</td>
          <td>{{ latest2.instFlow || '-' }}</td>
          <td>{{ formatValue(data2.day.dayFlow) || '-' }}</td>
          <td>{{ formatValue(data2.month.dayFlow / 10000) || '-' }}</td>
          <td>{{ formatValue(data2.year.dayFlow / 10000) || '-' }}</td>
        </tr>
        <tr>
          <td>三期</td>
          <td>{{ latest3.instFlow || '-' }}</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {
  name: 'summaryPanel',
  data() {
    return {
      data: {},
    }
  },
  computed: {
    ...mapState({
      latest: state => state.meter.meterLatestList,
      dayData: state => state.meter.meterDayData,
    }),
    latest1() {
      return this.latest.find(item => item.deviceNo == '4111312405964') || {}
    },
    latest2() {
      return this.latest.find(item => item.deviceNo == '4111312405965') || {}
    },
    latest3() {
      return {}
    },
    data1() {
      return {
        day: this.dayData.day.find(item => item.deviceNo == '4111312405964') || {},
        month: this.dayData.month.find(item => item.deviceNo == '4111312405964') || {},
        year: this.dayData.year.find(item => item.deviceNo == '4111312405964') || {},
      }
    },
    data2() {
      return {
        day: this.dayData.day.find(item => item.deviceNo == '4111312405965') || {},
        month: this.dayData.month.find(item => item.deviceNo == '4111312405965') || {},
        year: this.dayData.year.find(item => item.deviceNo == '4111312405965') || {},
      }
    }
  },
  methods: {
    ...mapActions({
      currentData: 'ht/currentData',
    }),
    async initData() {
      this.data = await this.currentData()
    },
    formatValue(value, num = 2) {
      return value && value.toFixed(num);
    }
  },
  created() {
    this.initData()
    this.$store.dispatch('meter/getMeterDataByDay')
    // this.$bus.$on('update-factory-data', this.updateData)
  },
  mounted() {
  },
  destroyed() {
    // this.$bus.$off('update-factory-data', this.updateData)
    // clearInterval(this.timeIndex)
  }
}
</script>

<style lang="less" scoped>

.summary {
  padding-top: 20px;
  padding-bottom: 10px;

  .right {
    padding-left: 7px;
  }

  .list {
    @height: 100% ;
    height: 60px;
    margin-bottom: 0.5rem;

    &.list-1 {
      .item {
        background-color: #1D2B3C;
      }
    }

    &.list-2 {
      .item {
        background-color: #153c30;
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
      padding: 0.5rem;

      &:first-of-type {
        margin-left: 0;
      }

      .num {
        font-size: 1.2rem;
        font-weight: bold;
      }

      .yellow {
        color: #EEBC36;
      }

      .blue {
        color: #33CCFF;
      }

      .green {
        color: #60ffc1;
      }
    }
  }
}

table {
  tr {
    td {
      padding: 3px 0;
    }
  }
}
</style>
