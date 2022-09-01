<template>
  <div>
    <pop-box :position="[factory.lng, factory.lat, 0]" :offset="{x: -30, y: 30}"
             :show="showBox(factory)">
      <div class="cursor-pointer" slot="title">
        <span class="text-blue-400 text-lg">[水厂]</span>
        <span>{{ factory.address }}</span>
      </div>
      <b-card-img v-b-modal:img-box v-if="factoryData.imgList" :src="factoryData.imgList[0].src">
      </b-card-img>
    </pop-box>

    <b-modal hide-header hide-footer hide-backdrop id="img-box" size="lg">
      <div v-if="factoryData.imgList">
        <b-carousel
          ref="boxSlide"
          indicators
          img-width="600"
          img-height="480"
        >
          <b-carousel-slide v-for="(item, key) in factoryData.imgList" :key="key"
                            :caption="item.name"
                            :img-src="item.src"
          ></b-carousel-slide>
        </b-carousel>

        <div class="flex gap-1 mt-2 overflow-x-auto">
          <div style="width: 200px;height: 130px" v-for="(item, key) in factoryData.imgList" :key="key" @click="selectImg(key)">
            <b-card-img class="cursor-pointer" :src="item.src"></b-card-img>
          </div>
        </div>
      </div>
      <div class="text-lg mt-1">
        东安水厂占地30余亩，厂内设有1500立方米调压蓄水池两座，3000立方米的调压蓄水池两座。并建有水处理车间一座，对源头水进行常规化处理。为确保出厂水达到生活饮用水卫生标准，每天对源头水，出厂水，管网末梢水日检9项，月检28项，每月送检临汾检测站36项，每年送检太原水质检测网106项。每月的水质报告均在洪洞县政府网站予以公示。
      </div>
    </b-modal>
  </div>
</template>

<script>
import Cesium from './cesium/index'
import {mapActions, mapState} from 'vuex';

export default {
  head: {},
  components: {},
  data() {
    return {
      factory: {
        address: '东安水厂',
        lng: 111.7710,
        lat: 36.2958,
      },
    }
  },
  computed: {
    ...mapState({
      factoryData: state => state.ht.factoryData,
    }),
  },
  methods: {
    ...mapActions({}),
    async onViewer() {
      this.initMakers();
    },
    initMakers() {
      const {lng, lat} = this.factory;
      viewer.entities.add({
        name: 'factory',
        position: Cesium.Cartesian3.fromDegrees(Number(lng), Number(lat), 0),
        billboard: {image: '/marker/house.png', scale: 0.3,}
      })
    },
    showBox(item) {
      return true;
    },
    selectImg(index) {
      this.$refs['boxSlide'].setSlide(index);
    }
  },
  created() {

  },
  destroyed() {

  }
}
</script>

<style lang="less" scoped>
/deep/ .modal-body {
  background-color: #020621;
  color: #fff;
}
</style>
