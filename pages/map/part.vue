<template>
  <div>
    <template v-for="(item, key) in partList">
      <pop-box :position="[item.lng, item.lat, 0]" :offset="{x: -30, y: 30}" :key="key"
               :show="true">
        <div class="cursor-pointer" slot="title">
          <span class="text-blue-400 text-lg">[分区]</span>
          <span>{{ item.label }}</span>
        </div>
        <div>
          <div>总流量：{{partData(item.id).flow}}m³</div>
          <div>漏损量：{{formatNum(partData(item.id).flowLeak)}}m³</div>
          <div>漏损率：{{formatNum(partData(item.id).flowLeak/partData(item.id).flow * 100)}}%</div>
          <div>分析时间：{{partData(item.id).dataTime}}</div>
          <div class="mt-1">{{ item.tips }}</div>
        </div>
      </pop-box>
    </template>
  </div>
</template>

<script>
import Cesium from './cesium/index'
import {mapActions, mapState} from 'vuex'
import * as turf from '@turf/turf'
import _ from 'lodash'

export default {
  head: {},
  components: {},
  data() {
    return {
      partList: [],
    }
  },
  computed: {
    ...mapState({
      partDetailList: state => state.meter.partDetailList,
      dayData: state => state.meter.partDayData,
    }),
  },
  watch: {
    partDetailList(val) {
      this.initParts()
    }
  },
  methods: {
    ...mapActions({}),
    initParts() {
      let partMap = {};
      for (let item of this.partDetailList) {
        /**
         * @type {number[][]}
         */
        let pointArr = _.chunk(item.points, 2).map((item) => turf.toWgs84(item));
        let polygon = turf.polygon([pointArr]);
        partMap[item.no] = turf.centerOfMass(polygon).geometry.coordinates;
        viewer.entities.add({
          // id: item.id,
          name: 'meter',
          polygon: {
            hierarchy: {
              positions: pointArr.map(([x, y]) => Cesium.Cartesian3.fromDegrees(x, y)),
            },
            outline: item.uiConfig.border,
            outlineWidth: item.uiConfig.width,
            material: Cesium.Color.fromCssColorString(item.uiConfig.fillColor)
          },
        })
      }

      this.$store.dispatch('meter/getPartNos').then((data) => {
        data = data.children;
        data.forEach(item => {
          item.lng = partMap[item.id][0]
          item.lat = partMap[item.id][1]
        })
        this.partList = data;
      })
    },
    partData(partNo) {
      return this.dayData.find(item => item.no == partNo) || {}
    },
    formatNum(val, num = 2){
      return val && val.toFixed(num)
    },
  },
  created() {

  },
  destroyed() {

  }
}
</script>

<style lang="less" scoped>

</style>
