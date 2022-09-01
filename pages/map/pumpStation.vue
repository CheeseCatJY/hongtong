<template>
  <div>
    <template v-for="(item, key) in points">
      <pop-box :position="item.pos" :offset="{x: -30, y: 0}" show :key="key">
        <div slot="title">
          <span class="text-blue-400 text-lg">[泵站]</span>
          <b-badge :variant="stateTag['在线']">在线</b-badge>
          <span>{{ item.address }}</span>
        </div>
        <div>
          <div>压力：{{ item.data.pressureOut }}</div>
          <div>流量：{{ item.data.totalFlow }}</div>
          <div>时间：{{ $fmt.time(item.time, 'MM-DD HH:mm:ss') }}</div>
        </div>
      </pop-box>
    </template>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import coords from '@/static/data/pump-coords.json';
import pumpStation from '@/components/mixin/pumpStation';

export default {
  head: {},
  components: {},
  mixins: [pumpStation],
  data() {
    return {
      showPage: false,
      stateTag: {
        '在线': 'success',
        '离线': 'warning',
        '故障': 'danger',
      },
    }
  },
  computed: {
    ...mapState({
      pumpList: state => state.pump.stationLatestList,
    }),
    points() {
      if (!this.pumpList) {
        return [];
      }
      return this.pumpList.map(item => {
        item = Object.assign(item);
        let key = `${item.lng},${item.lat}`;
        let [lng, lat] = coords[key];
        item.pos = [lng, lat];
        return item;
      });
    },
  },
  methods: {
    toDetail() {
      location.href = 'http://gis.frp.loyal.wiki/gis/';
    },
  },
  mounted() {

  },
  created() {

  },
  beforeDestroy() {

  }
}
</script>

<style lang="less" scoped>

</style>
