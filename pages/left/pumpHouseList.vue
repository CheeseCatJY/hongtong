<template>
  <div class="plate">
    <div class="theme">
      <div class="title">泵房数据列表</div>
    </div>
    <div class="scroller" style="height: calc(100% - 30px);">
      <b-table :items="houseList" sort-by="time" sort-desc :fields="fields" small borderless
               table-variant="#ffffff" tbody-tr-class="table-tr" thead-tr-class="thead-tr">
        <template #cell(address)="{item}">
          <b-badge :variant="stateTag['在线']">{{ item.address }}</b-badge>
        </template>
        <template #cell(pressure_in)="{item}">
          <span>{{ partData(item.no, '进水压力') }}</span>
        </template>
        <template #cell(pressure_set)="{item}">
          <span>{{ partData(item.no, '设定压力') }}</span>
        </template>
        <template #cell(pressure_out)="{item}">
          <span>{{ partData(item.no, '出水压力') }}</span>
        </template>
        <template #cell(time)="{item}">
          <span>{{ $fmt.time(getData(item.no, '时间'), 'MM-DD HH:mm:ss') }}</span>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';

const empty = {}
export default {
  name: 'pumpHouseList',
  data() {
    return {
      stateTag: {
        '在线': 'success',
        '离线': 'warning',
        '故障': 'danger',
      },
      latestData: {},
      fields: [
        {
          key: 'address',
          label: '泵房',
          sortable: true
        },
        {
          key: 'pressure_in',
          label: '进水',
          sortable: true,
        },
        {
          key: 'pressure_set',
          label: '设定',
          sortable: true,
        },
        {
          key: 'pressure_out',
          label: '出水',
          sortable: true,
        },
        {
          key: 'time',
          label: '时间',
          sortable: true,
        },
      ],
    }
  },
  computed: {
    ...mapState({
      houseList: state => state.pump.houseList,
    }),
  },
  mqtt: {
    ['jinhu/pump_house/+'](data, topic) {
      let key = topic.split('/')[2];
      let json = JSON.parse(String(data));
      this.convertData(json);
      this.$set(this.latestData, key, json);
    }
  },
  methods: {
    ...mapActions({
      listHouse: 'pump/houseList'
    }),
    async init() {
      await this.listHouse();
      this.subscribe();
    },
    subscribe() {
      this.$mqtt.subscribe('jinhu/pump_house/+');
    },
    convertData(json) {
      let partMap = json['分区'] || {};
      Object.keys(partMap).forEach(key => {
        let {进水压力, 出水压力, 设定压力} = partMap[key];
        partMap[key]['进水压力'] = this.toData(进水压力);
        partMap[key]['出水压力'] = this.toData(出水压力);
        partMap[key]['设定压力'] = this.toData(设定压力);
      })
    },
    toData(val) {
      if (!val) {
        return val;
      }
      if (val < 1.3) {
        return val.toFixed(2);
      }
      val /= 10;
      return this.toData(val);
    },
    partData(name, key) {

      let val = (this.latestData[name] || empty);
      if (!key) {
        return val;
      }
      val = val['分区'];
      if (!val) {
        return '-';
      }
      val = val[Object.keys(val)[0]] || {};
      let val1 = val[Object.keys(val)[1]] || {};
      let arr = []
      if (val[key]) {
        arr.push(val[key])
      }
      if (val1[key]) {
        arr.push(val1[key])
      }
      return arr.join('|');
    },
    getData(name, key) {
      let val = (this.latestData[name] || empty);
      if (!key) {
        return val;
      }
      val = val[key];
      return val || '-';
    },
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.$mqtt.unsubscribe('jinhu/pump_house/+');
  }
}
</script>

<style lang="less" scoped>

</style>
