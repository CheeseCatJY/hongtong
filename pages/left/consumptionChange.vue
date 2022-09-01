<template>
  <div class="plate">
    <div class="theme">
    <div class="title">近五年能耗变化情况</div>
    <div class="sub_title">水厂万吨水主要能耗</div>
    </div>
    <b-table :items="items" :fields="fields" borderless table-variant="#ffffff" tbody-tr-class="table-tr" thead-tr-class="thead-tr">
    </b-table>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        items: [],
        fields: [
          {
            key: 'time',
            label: '时间',
            sortable: true,
            width: 20
          },
          {
            key: 'dh',
            label: '电耗',
            sortable: true,
            width: 20
          },
          {
            key: 'xdj',
            label: '消毒剂',
            sortable: true,
            width: 20
          },
          {
            key: 'PAC',
            label: 'PAC',
            sortable: true,
            width: 20
          },
          {
            key: 'qyhn',
            label: '氢氧化钠',
            sortable: true,
            width: 20
          },
        ],
      }
    },
    methods: {
      async initData() {
        const data = await this.$axios.$get('/data/consumption.json')
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
    padding: 0.75rem !important;
  }
</style>
