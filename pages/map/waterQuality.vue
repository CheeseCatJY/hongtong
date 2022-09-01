<template>
  <div>
    <template v-for="(item, key) in deviceList">
      <pop-box :position="[item.coordinateLng, item.coordinateLat, 0]" :offset="{x: -30, y: 30}"
               :show="showBox(item)" style="max-width: 260px;"
               :key="key">
        <div class="cursor-pointer" slot="title">
          <span class="text-blue-400 text-lg">[水质]</span>
          <b-badge :variant="stateTag['在线']">在线</b-badge>
          <span>{{ item.deviceName }}</span>
        </div>
        <div class="flex items-center">
          <div class="mr-1">
            <b-card-img :src="item.imgUrl"></b-card-img>
          </div>
          <div class="desc">
            <div>浊度：{{ item.dataLatest['30005'] }}NTU</div>
            <div>余氯：{{ item.dataLatest['30006'] }}mg/L</div>
            <div>PH：{{ item.dataLatest['30007'] }}</div>
            <div>时间：{{ item.dataRefreshTime }}</div>
            <div>坐标：{{ item.coordinateLng.toFixed(4) }}, {{ item.coordinateLat.toFixed(4) }}</div>
          </div>
        </div>
      </pop-box>
    </template>
  </div>
</template>

<script>
import Cesium from './cesium/index';
import {mapActions, mapState} from 'vuex';

export default {
  head: {},
  components: {},
  data() {
    return {
      stateTag: {
        '在线': 'success',
        '离线': 'warning',
        '故障': 'danger',
      },
    }
  },
  computed: {
    ...mapState({
      deviceList: state => state.ht.realtimeData.waterQuality,
    }),
  },
  watch: {
    deviceList(val) {
      this.initMakers();
    },
  },
  methods: {
    initMakers() {
      for (let item of this.deviceList) {
        viewer.entities.add({
          id: item.id,
          name: 'waterQuality',
          position: Cesium.Cartesian3.fromDegrees(Number(item.coordinateLng),
            Number(item.coordinateLat), 0),
          billboard: {image: '/marker/poi.png', scale: 0.3},
        })
      }
    },
    showBox(item) {
      return true;
    },
  },
  created() {
  },
  destroyed() {

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

.desc {
  white-space: nowrap;
}
</style>
