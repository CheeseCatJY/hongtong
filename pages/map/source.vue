<template>
  <div>
    <pop-box v-b-modal:info-box :position="[waterSource.lng, waterSource.lat, 0]" :offset="{x: -30, y: 30}" :show="showBox(waterSource)">
      <div class="cursor-pointer" slot="title">
        <span class="text-blue-400 text-lg">[源水]</span>
        <span>{{ waterSource.address }}</span>
      </div>
      <b-card-img v-b-modal:img-box v-if="waterSource.imgList" :src="waterSource.imgList[0].src">
      </b-card-img>
    </pop-box>

    <b-modal hide-header hide-footer hide-backdrop id="info-box" size="lg">
      <div v-if="waterSource.imgList">
        <b-carousel
          ref="boxSlide"
          indicators
          img-width="600"
          img-height="480"
        >
          <b-carousel-slide v-for="(item, key) in waterSource.imgList" :key="key"
                            :caption="item.name"
                            :img-src="item.src"
          ></b-carousel-slide>
        </b-carousel>

        <div class="flex gap-1 mt-2 overflow-x-auto">
          <div style="width: 200px;height: 130px" v-for="(item, key) in waterSource.imgList" :key="key" @click="selectImg(key)">
            <b-card-img class="cursor-pointer" :src="item.src"></b-card-img>
          </div>
        </div>
      </div>
      <div class="text-lg mt-1">
        洪洞县自来水公司水源头为国家一级保护水源地——广胜寺霍泉，该泉是我省著名的历史大泉，北魏郦道元的《水经注》记载：“霍泉出自霍太山，积水成潭，数丈之深，又名广胜寺泉”，霍泉秒流量为2.79立方米，水量充沛，碧绿清澈，四季长流，泉水水质良好，是我县农业灌溉和县城居民生产生活用水的主要水源地。
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
      waterSource: {
        address: '东安水厂源水',
        lng: 111.8028,
        lat: 36.3020,
        imgList: [
          {name: '场景1', src: '/images/source/1.jpg'},
          {name: '场景2', src: '/images/source/2.jpg'},
          {name: '场景3', src: '/images/source/3.jpg'},
          {name: '场景4', src: '/images/source/4.jpg'},
        ],
      },
    }
  },
  computed: {
    ...mapState({
    }),
  },
  methods: {
    ...mapActions({
    }),
    async onViewer() {
      this.initMakers();
    },
    initMakers() {
        const {lng, lat} = this.waterSource;
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
    },
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
