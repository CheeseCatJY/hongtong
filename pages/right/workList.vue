<template>
  <div class="plate">
    <div class="theme">
      <div class="title">实时工单列表</div>
    </div>
    <div class="list">
      <div class="item" v-for="(item, index) in items" :key="index">
        <span>[{{ $fmt.time(item.time, 'HH:mm:ss') }}]</span>
        <span><b-badge variant="primary">{{ item.type }}</b-badge></span>
        <span>{{ item.address }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
    }
  },
  methods: {
    async initData() {
      const data = await this.$axios.$get('/data/work.json')
      this.items = data
    }
  },
  created() {
    this.initData()
  },
  destroyed() {

  }
}
</script>

<style lang="less" scoped>
.title {
  padding-bottom: 10px;
}
.list {
  color: #aaaaaa;
  font-size: 0.8rem;

  .item{
    margin-bottom: 0.4rem;
  }
}
</style>
