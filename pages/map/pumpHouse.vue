<template>
  <div>
    <template v-for="(item, key) in houseList">
      <pop-box :position="[item.lng, item.lat]" :offset="{x: -30, y: 0}" show :key="key">
        <div class="cursor-pointer" slot="title" @click="toDetail(item)">
          <span class="text-blue-400 text-lg">[泵房]</span>
          <b-badge :variant="stateTag['在线']">在线</b-badge>
          <span>{{ item.address }}</span>
        </div>
        <div>
          <div>进水压力：{{ partData(item.no, '进水压力') }} Mpa</div>
          <div>出水压力：{{ partData(item.no, '出水压力') }} Mpa</div>
          <div>时间：{{ $fmt.time(getData(item.no, '时间'), 'MM-DD HH:mm:ss') }}</div>
        </div>
      </pop-box>
    </template>

    <div class="pump-detail" v-if="showChart">
      <pump-chart :pump-data="detailData" :pump-info="checkItem"
                  @close="showChart=false"></pump-chart>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import PumpChart from "./pumpChart";

const empty = {}

export default {
  head: {},
  components: {PumpChart},
  data() {
    return {
      showPage: false,
      stateTag: {
        '在线': 'success',
        '离线': 'warning',
        '故障': 'danger',
      },
      latestData: {},
      showChart: false,
      detailData: {},
      checkItem: {},
      chartTitle: ''
    }
  },
  computed: {
    ...mapState({
      houseList: state => state.pump.houseList,
    }),
  },
  watch: {
    latestData: {
      handler(val) {
        this.detailData = this.getData(this.checkItem.no)
      },
      deep: true
    }
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
      if(!val){
        return val;
      }
      if (val < 1.3) {
        return val.toFixed(2);
      }
      val /= 10;
      return this.toData(val);
    },
    toDetail(item) {
      let latestData = this.getData(item.no)
      if (Object.keys(latestData).length > 0) {
        this.detailData = latestData
      }
      this.chartTitle = item.address
      this.checkItem = item
      this.showChart = true
    },
    getData(name, key) {
      let val = (this.latestData[name] || empty);
      if (!key) {
        return val;
      }
      val = val[key];
      return val || '-';
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
      return val[key] || '-';
    },
  },
  created() {
    this.init();
    // this.pullTimeIndex = setInterval(this.initPoints, 10 * 1000)
  },
  destroyed() {
    clearInterval(this.pullTimeIndex)
  }
}
</script>

<style lang="less" scoped>
.pump-detail {
  background-color: #020621;
  z-index: 2;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
