<template>
  <div>
    <template v-for="(item, key) in latestList">
      <pop-box :position="[item.lng, item.lat, 0]" :offset="{x: -30, y: 30}" :show="showBox(item)"
               :key="key">
        <div class="cursor-pointer" slot="title" @click="toDetail(item)">
          <span class="text-blue-400 text-lg">[流量计]</span>
          <b-badge :variant="stateTag['在线']">在线</b-badge>
          <span>{{ item.address }}</span>
        </div>
        <div>
          <div>流量：{{ item.instFlow }}，压力：{{ item.pressure }}</div>
          <div>时间：{{ $fmt.time(item.dataTime, 'MM-DD HH:mm:ss') }}</div>
          <div>坐标：{{ item.lng.toFixed(4) }}, {{ item.lat.toFixed(4) }}</div>
        </div>
      </pop-box>
    </template>
    <b-modal v-model="showChart" :title="chartTitle" :hide-footer="true">
      <meter-detail :meter="checkItem"></meter-detail>
      <!--<pump-chart  :pump-data="detailData" :pump-info="checkItem"></pump-chart>-->
    </b-modal>
  </div>
</template>

<script>
import Cesium from './cesium/index'
import {mapActions, mapState} from 'vuex';
import coords from '@/static/data/pump-coords.json';
import MeterDetail from "./meterDetail/index";

export default {
  head: {},
  components: {MeterDetail},
  data() {
    return {
      showPage: false,
      stateTag: {
        '在线': 'success',
        '离线': 'warning',
        '故障': 'danger',
      },
      showChart: false,
      checkItem: {},
      showItem: {},
      chartTitle: ''
    }
  },
  computed: {
    ...mapState({
      latestList: state => state.meter.meterLatestList,
    }),
  },
  methods: {
    ...mapActions({
      meterDataLatest: 'meter/meterDataLatest',
      meterDataHistory: 'meter/meterDataHistory',
    }),
    toDetail(item) {
      this.chartTitle = `${item.address}  [坐标：${item.lng}, ${item.lat}]`
      this.checkItem = item
      this.showChart = true
      // location.href = 'http://gis.frp.loyal.wiki/gis/';
    },
    async onViewer() {
      this.onEvents();
      await this.meterDataLatest();
      this.initMakers();
      this.pullTimeIndex = setInterval(this.meterDataLatest, 10 * 1000);
    },
    initMakers() {
      for (let item of this.latestList) {
        viewer.entities.add({
          id: item.id,
          name: 'meter',
          position: Cesium.Cartesian3.fromDegrees(Number(item.lng), Number(item.lat), 0),
          billboard: {image: '/marker/meter.png'},
        })
      }
    },
    onEvents() {
      const handler = this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((movement) => {
        const pick = viewer.scene.pick(movement.position);
        if (!pick || !pick.id || pick.id.name != 'meter') {
          this.showItem = {};
          return;
        }
        this.showItem = this.latestList.find(item => item.id == pick.id.id);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    offEvents() {
      this.handler && this.handler.destroy();
      this.handler = null;
    },
    showBox(item) {
      return item == this.showItem || true;
    },
  },
  created() {

  },
  destroyed() {
    this.offEvents();
    clearInterval(this.pullTimeIndex)
  }
}
</script>

<style lang="less" scoped>
/deep/ .modal-dialog {
  max-width: 100vw !important;
  margin: 0px !important;

  .modal-content {
    height: 100vh;
  }
}
</style>
