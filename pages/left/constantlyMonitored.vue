<template>
  <div class="plate">
    <div class="theme">
      <div class="title">水质实时监测</div>
      <div class="sub_title">水源、出厂水监测情况</div>
    </div>
    <div class="h-full">
      <b-table :items="items" :fields="fields" borderless table-variant="#ffffff" tbody-tr-class="table-tr" thead-tr-class="thead-tr">
      </b-table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [],
        fields: [
          {
            key: 'order',
            label: '序号',
            sortable: true
          },
          {
            key: 'zb',
            label: '指标',
            sortable: true,
          },
          {
            key: 'sy',
            label: '水源',
            sortable: true,
          },
          {
            key: 'sc',
            label: '水厂',
            sortable: true,
          }
        ],
      }
    },
    methods: {
      async initData() {
        const data = await this.$axios.$get('/data/constantlyMonitored.json')
        this.items = data
      }
    },
    async mounted() {
      this.initData()
    },
    destroyed() {

    }
  }
</script>

<style scoped lang="less">
  /deep/ th,
  /deep/ td{
    text-align: center !important;
    padding: 0.1rem !important;
  }

</style>
