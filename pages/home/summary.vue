<template>
  <div class="summary">
    <div class="flex">
      <div style="width: 100%;">
        <div class="flex list">
          <div class="flex-1 item">
            <div class="plate">水厂日流量</div>
            <div>
              <span class="num yellow">
                <animated-number :value="data.outDay" :format-value="formatValue"></animated-number>
              </span>
            </div>
          </div>
          <div class="flex-1 item">
            <div class="plate">月流量(万)</div>
            <div>
            <span class="num yellow">
              <animated-number :value="data.outMonth/10000"
                               :format-value="formatValue"></animated-number>
            </span>
            </div>
          </div>
          <div class="flex-1 item">
            <div class="plate">年流量(万)</div>
            <div>
            <span class="num yellow">
              <animated-number :value="data.outYear/10000"
                               :format-value="formatValue"></animated-number>
            </span>
            </div>
          </div>
        </div>
        <div style="padding: 5px 0;">
          <table style="font-size: 0.8rem;text-align: center;">
            <tr>
              <td style="width: 70px;">名称</td>
              <td style="width: 60px;">瞬时</td>
              <td style="width: 60px;">日流量</td>
              <td style="width: 70px;">月流量(万)</td>
              <td style="width: 70px;">年流量(万)</td>
            </tr>
            <tr>
              <td>东安水厂</td>
              <td>{{ factory1.instFlow }}</td>
              <td>{{ data.outDay }}</td>
              <td>{{ (data.outMonth / 10000).toFixed(2) }}</td>
              <td>{{ (data.outYear / 10000).toFixed(2) }}</td>
            </tr>
            <tr>
              <td>三期</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </table>
        </div>
        <div class="flex list">
          <div class="flex-1 item">
            <div class="plate">东水池</div>
            <div>
              <span class="num green">
                <animated-number :value="data.east" v-if="data.east"></animated-number>
                <template v-else>-</template>
              </span>
              <span class="ml-0.5 unit">m</span>
            </div>
          </div>
          <div class="flex-1 item">
            <div class="plate">西水池</div>
            <div>
            <span class="num green">
              <animated-number :value="data.west" v-if="data.west"></animated-number>
                <template v-else>-</template>
            </span>
              <span class="ml-0.5 unit">m</span>
            </div>
          </div>
          <div class="flex-1 item">
            <div class="plate">南水池</div>
            <div>
              <span class="num green">
                <animated-number :value="data.south" :format-value="formatValue"></animated-number>
              </span>
              <span class="ml-0.5 unit">m</span>
            </div>
          </div>
          <div class="flex-1 item">
            <div class="plate">北水池</div>
            <div>
              <span class="num green">
                <animated-number :value="data.north" :format-value="formatValue"></animated-number>
              </span>
              <span class="ml-0.5 unit">m</span>
            </div>
          </div>
        </div>
        <div class="flex list list-1">
          <div class="flex-1 item">
            <div class="plate">PH</div>
            <div>
          <span class="num blue">
            <animated-number :value="data.PH" :format-value="formatValue"></animated-number>
          </span>
              <span class="ml-0.5 unit"></span>
            </div>
          </div>
          <div class="flex-1 item">
            <div class="plate">浊度</div>
            <div>
          <span class="num blue">
            <animated-number :value="data.zhuodu" :format-value="formatValue"></animated-number>
          </span>
              <span class="ml-0.5 unit">mg/L</span>
            </div>
          </div>
          <div class="flex-1 item">
            <div class="plate">余氯</div>
            <div>
          <span class="num blue">
            <animated-number :value="data.yulv" :format-value="formatValue"></animated-number>
          </span>
              <span class="ml-0.5 unit">mg/L</span>
            </div>
          </div>
        </div>
      </div>
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
    }),
    factory1() {
      return this.latest.find(item => item.deviceNo == '2004170001') || {}
    }
  },
  methods: {
    ...mapActions({
      currentData: 'ht/currentData',
    }),
    async initData() {
      this.data = await this.currentData()
    },
    formatValue(value) {
      return value.toFixed(2);
    }
  },
  created() {
    this.initData()
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
