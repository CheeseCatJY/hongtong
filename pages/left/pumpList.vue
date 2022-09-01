<template>
  <div class="plate">
    <div class="theme">
      <div class="title">泵站压力数据(MPa)</div>
    </div>

    <div class="scroller" style="height: calc(100% - 30px);">
      <b-table :items="items" sort-by="time" sort-desc :fields="fields" small borderless
               table-variant="#ffffff" tbody-tr-class="table-tr" thead-tr-class="thead-tr">
        <template #cell(address)="{item}">
          <b-badge :variant="stateTag[item.state]"
                   style="max-width: 120px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
            {{ item.address }}
          </b-badge>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
import pumpStation from '@/components/mixin/pumpStation'

export default {
  data() {
    return {
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
          key: 'data.pressureIn',
          label: '进水',
          sortable: true,
          formatter: (value, key, {data}) => {
            return `${value}`;
          }
        },
        {
          key: 'data.pressureSet',
          label: '设定',
          sortable: true,
        },
        {
          key: 'data.pressureOut',
          label: '出水',
          sortable: true,
        },
        {
          key: 'time',
          label: '时间',
          sortable: true,
          formatter: (value, key, item) => {
            return this.$fmt.time(value, 'MM-DD HH:mm:ss');
          }
        }
      ],
    }
  },
  mixins: [pumpStation],
  computed: {
    ...mapState({
      items: state => state.pump.stationLatestList,
    }),
  },
  methods: {
    ...mapActions({
    }),
  },
  mounted() {

  }
}
</script>

<style lang="less" scoped>

</style>
