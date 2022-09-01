<template>
  <div class="summary">
    <b-row>
      <b-col>
        <iframe width="100%" height="180" scrolling="no" frameborder="0" allowtransparency="true" src="https://i.tianqi.com/?c=code&a=getcode&id=21&color=%23FFFFFF&bgc=%23020621&icon=1"></iframe>
      </b-col>

    </b-row>
    <div class="flex list">
      <div class="flex-1 item" v-for="(item, key) in items" :key="key">
        <div class="plate">{{ name_map[item['category_name']] }}
        </div>
        <div>
          <span class="num yellow">{{ item['category_name']=='管网压力设备'?22:item['total_count'] }}</span>
          <span class="ml-0.5 unit">台</span>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  export default {
    name: 'rightSummary',
    data() {
      let now = Date.now();
      return {
        name_map: {
          '水池液位计': '液位计',
          '超声波流量计': '流量计',
          '管网压力设备': '压力',
          '水质三参数设备': '水质'
        },
        items: [],
        clock: {
          time: this.$fmt.time(now, 'HH:mm:ss'),
          date: this.$fmt.time(now, 'YYYY-MM-DD'),
          week: this.$fmt.week(now),
        },
      }
    },
    computed: {},
    methods: {
      ...mapActions({
        summary: 'ht/summary',
      }),
      async initData() {
        this.items = await this.summary()
      },
      startClock() {
        let now = Date.now();
        this.clock.time = this.$fmt.time(now, 'HH:mm:ss')
        this.clock.date = this.$fmt.time(now, 'YYYY-MM-DD')
        this.clock.week = this.$fmt.week(now)
      },
    },
    created() {
      this.timeIndex = setInterval(this.startClock, 1000)
    },
    mounted() {
      this.initData()
    },
    destroyed() {
      clearInterval(this.timeIndex)
    }
  }
</script>

<style lang="less" scoped>

  .summary {

    .list {
      //height: 30%;
      height: 60px;
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
