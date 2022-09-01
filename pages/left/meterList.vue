<template>
  <div class="plate">
    <div class="theme">
      <div class="title">流量计数据列表</div>
    </div>
    <div class="scroller" style="height: calc(100% - 30px);">
      <b-table :items="dataList" sort-by="time" sort-desc :fields="fields" small borderless
               table-variant="#ffffff" tbody-tr-class="table-tr" thead-tr-class="thead-tr">
        <template #cell(address)="{item}">
          <b-badge :variant="stateTag['在线']">{{ item.address }}</b-badge>
        </template>
        <template #cell(instFlow)="{item}">
          <span>{{ item.instFlow }}</span>
        </template>
        <template #cell(pressure)="{item}">
          <span>{{ item.pressure }}</span>
        </template>
        <template #cell(dataTime)="{item}">
          <span>{{ $fmt.time(item.dataTime, 'MM-DD HH:mm:ss') }}</span>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';

export default {
  name: 'meterList',
  data() {
    return {
      timeIndex: {},
      stateTag: {
        '在线': 'success',
        '离线': 'warning',
        '故障': 'danger',
      },
      fields: [
        {
          key: 'address',
          label: '地址',
          sortable: true
        },
        {
          key: 'instFlow',
          label: '流量',
          sortable: true,
        },
        {
          key: 'pressure',
          label: '压力',
          sortable: true,
        },
        {
          key: 'dataTime',
          label: '时间',
          sortable: true,
        },
      ],
    }
  },
  computed: {
    ...mapState({
      dataList: state => state.meter.meterLatestList,
    }),
  },
  methods: {
    ...mapActions({
      meterLatestList: 'meter/meterDataLatest',
    }),
    init() {
      this.meterLatestList();
      this.timeIndex = setInterval(this.meterLatestList, 60 * 1000);
    },
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    clearInterval(this.timeIndex)
  }
}
</script>

<style lang="less" scoped>

</style>
