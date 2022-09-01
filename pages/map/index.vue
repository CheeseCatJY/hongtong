<template>
  <!--  class="h-full relative overflow-hidden z-0" -->
    <div id="map-box">
      <Source v-show="[0,1].includes(selected)"></Source>
      <factory v-show="[0,2].includes(selected)"></factory>
      <flow-meter v-show="[0,3,4].includes(selected)"></flow-meter>
      <pressure v-show="[0,4].includes(selected)"></pressure>
      <water-quality v-show="[0,5].includes(selected)"></water-quality>
      <part v-show="[0,6].includes(selected)"></part>
      <div id="credits-box" style="display: none;"></div>
      <map-title @click.native="rotate" @click.ctrl.native="toDma"></map-title>
      <div class="switch-box">
        <b-form-group v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            v-model="selected"
            :options="options"
            :aria-describedby="ariaDescribedby"
            buttons
          ></b-form-radio-group>
        </b-form-group>
      </div>
    </div>
</template>
<script>
import MapTitle from "./mapTitle";
import PumpStation from "./pumpStation";
import PumpHouse from "./pumpHouse";
import FlowMeter from "./flowMeter";
import Pressure from "./pressure";
import WaterQuality from "./waterQuality";
import Factory from "./factory";
import Part from "./part";
import { mapActions, mapState } from "vuex";

import mapMixin from "./mapMixin";
import Source from "./source";

export default {
  head: {
    link: [
      {
        rel: "stylesheet",
        type: "text/css",
        href: "/Cesium/Widgets/widgets.css"
      }
    ]
  },
  mixins: [mapMixin],
  components: {
    Part,
    Source,
    Factory,
    WaterQuality,
    Pressure,
    FlowMeter,
    PumpHouse,
    PumpStation,
    MapTitle
  },
  data() {
    return {
      now: "",
      showPage: false,
      selected: 1,
      options: [
        { text: "全部", value: 0 },
        { text: "源水", value: 1 },
        { text: "水厂", value: 2 },
        { text: "流量计", value: 3 },
        { text: "压力", value: 4 },
        { text: "水质", value: 5 },
        { text: "分区", value: 6 }
      ]
    };
  },
  computed: {
    ...mapState({
      realtimeData: state => state.ht.realtimeData
    })
  },
  methods: {
    toDma() {
      location.href = "http://gis.frp.loyal.wiki/gis/";
    }
  },
  mounted() {},
  created() {
    this.$store.dispatch("meter/getPartDetails");
    this.$store.dispatch("ht/realtimeData");
    this.timerIndex = setInterval(() => {
      this.$store.dispatch("ht/realtimeData");
    }, 10 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.timerIndex);
  }
};
</script>

<style lang="less" scoped>
@import 'cesium/Build/Cesium/Widgets/widgets.css';
body,
.page-bg {
  background-color: #152137;
}

.box-bg {
  background-color: #1e2c47;
}

.switch-box {
  z-index: 1;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
}
</style>
