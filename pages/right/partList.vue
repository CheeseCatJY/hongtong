<template>
  <div class="plate">
    <div class="theme">
      <div class="title">分区列表</div>
      <div class="sub_title">2021-06-02</div>
    </div>
    <b-table :items="items" :fields="fields" small borderless table-variant="#ffffff"
             tbody-tr-class="table-tr" thead-tr-class="thead-tr">
    </b-table>
    <div class="list">
      <div class="item">

      </div>
    </div>
  </div>
</template>

<script>
import echarts from '@/plugins/echarts'

export default {
  data() {
    return {
      items: [],
      fields: [
        {
          key: 'areaname',
          label: '分区',
          sortable: true
        },
        /* {
           key: 'dateexplain',
           label: '日期',
           sortable: false
         },*/
        {
          key: 'usequantity',
          label: '水量',
          sortable: true,
        },
        /*{
          key: 'time',
          label: '采集时间',
          sortable: true,
        }*/
      ],
    }
  },
  methods: {
    async initData() {
      const data = await this.$axios.$get('/data/remote.json')
      this.items = data
    }
  },
  mounted() {
    this.initData()
  },
  destroyed() {

  }
}
</script>

<style lang="less" scoped>

</style>
