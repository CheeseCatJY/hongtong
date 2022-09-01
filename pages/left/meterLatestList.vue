<template>
  <div class="plate">
    <div class="theme">
      <div class="title">分区数据报表</div>
    </div>
    <b-table :items="items" :fields="fields" borderless table-variant="#ffffff"
             tbody-tr-class="table-tr" thead-tr-class="thead-tr">
    </b-table>
  </div>
</template>

<script>

export default {
  name:'meterLatestList',
  data() {
    return {
      items: [],
      fields: [
        {
          key: 'address',
          label: '地址',
          sortable: true
        },
        {
          key: 'instant',
          label: '流量',
          sortable: true,
        },,
        {
          key: 'pressure',
          label: '压力',
          sortable: true,
        },,
        {
          key: 'collect_time',
          label: '时间',
          sortable: true,
        },
      ],
    }
  },
  mqtt: {
    ['jinhu/factory/latest'](data) {
      let json = JSON.parse(String(data));
      this.initData(json)
    }
  },
  methods: {
    async initData(data) {
      // const data = await this.$axios.$get('/api/nr/factory/latest')

      let b = data.sort((a, b) => {
        if(a.time < b.time){
          return 1;
        }else{
          return -1;
        }
      })
      this.items = b
    }
  },
  mounted() {
    this.$mqtt.subscribe('jinhu/factory/latest');
  },
  beforeDestroy() {
    this.$mqtt.unsubscribe('jinhu/factory/latest');
  }
}
</script>

<style lang="less" scoped>

</style>
