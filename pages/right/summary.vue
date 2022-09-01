<template>
  <div class="summary">
    <b-row>
      <b-col>
        <div class="theme">
          <span class="title">系统统计情况</span>
        </div>
      </b-col>
      <b-col class="text-right">
        <div class="font-bold">{{ clock.time }}</div>
        <div class="text-gray-400 text-sm unit">{{ clock.date }} {{ clock.week }}</div>
      </b-col>
    </b-row>

    <div class="flex list">
      <div class="flex-1 item" v-for="(item, key) in item1" :key="key">
        <div class="plate">{{ item.label }}</div>
        <div>
          <span class="num yellow">{{ item.value }}</span>
          <span class="ml-0.5 unit">{{ item.unit }}</span>
        </div>
      </div>
    </div>

    <div class="flex list list-1">
      <div class="flex-1 item" v-for="(item, key) in item2" :key="key">
        <div class="plate">{{ item.label }}</div>
        <div>
          <span class="num blue">{{ item.value }}</span>
          <span class="ml-0.5 unit">{{ item.unit }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  data() {
    let now = Date.now();

    return {
      items: [],
      fields: [],
      clock: {
        time: this.$fmt.time(now, 'HH:mm:ss'),
        date: this.$fmt.time(now, 'YYYY-MM-DD'),
        week: this.$fmt.week(now),
      },
    }
  },
  computed: {
    ...mapState({
      item1: state => state.summary.item1,
      item2: state => state.summary.item2,
    })
  },
  methods: {
    async initData() {

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
