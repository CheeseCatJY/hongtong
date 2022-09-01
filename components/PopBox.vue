<template>
  <div v-if="!hide && show" class="pop-box"
       :style="{left: (pos.x+offset.x)+'px', top: (pos.y+offset.y)+'px', backgroundColor: backgroundColor}">
    <div v-if="!!$slots.title" class="title">
      <slot name="title"></slot>
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <span class="arrow arrow-border"></span>
    <span class="arrow"></span>
  </div>
</template>

<script>
import *as Cesium from 'cesium';

export default {
  props: {
    position: {
      type: Array,
      default: () => [0, 0, 0]
    },
    offset: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0
      })
    },
    show: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: 'rgba(2, 6, 33, 0.9)'
    }
  },
  data() {
    return {
      pos: {
        x: 0, y: 0,
      },
      hide: false,
    }
  },
  methods: {
    setStyle() {
      let {position, pos} = this;
      let viewer = global.viewer;
      position = Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2] || 0);
      let winPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);

      if (!winPos) {
        return
      }
      this.hide = true

      if ((pos.x !== winPos.x) || (pos.y !== winPos.y)) {
        pos.x = winPos.x;
        pos.y = winPos.y;
      }

      let {innerWidth, innerHeight} = window
      if (pos.x < innerWidth && pos.y < innerHeight) {
        this.hide = false
      }

      const offset = -this.$el.offsetHeight - 20;
      if (Math.abs(this.offset.y - offset) > 1) {
        this.offset.y = offset;
      }
    },
    init() {
      const viewer = global.viewer;
      if (!viewer) {
        setTimeout(this.init, 300)
        return
      }
      this.setStyle();
      this.eventHandler = viewer.scene.postRender.addEventListener(() => {
        this.setStyle();
      });
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    const viewer = global.viewer;
    viewer && viewer.scene.postRender.removeEventListener(this.eventHandler);
  }
}
</script>
<style lang="less">
.pop-box {
  position: absolute;
  display: inline-block;
  background-color: rgba(2, 6, 33, 0.7);
  padding: 5px;
  min-width: 110px;
  max-width: 220px;
  height: auto;
  text-align: left;
  background-clip: padding-box;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
  font-size: 12px;
  color: rgb(212, 208, 208);
  z-index: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  //pointer-events: none;

  & > .arrow {
    content: '';
    width: 0;
    height: 0;
    border: 10px solid;
    position: absolute;
    bottom: -20px;
    left: 20px;
    border-color: rgba(2, 6, 33, 0.9) transparent transparent transparent;
  }

  & > .arrow-border {
    bottom: -22.5px;
    left: 19px;
    border-width: 11px;
    border-color: rgba(255, 255, 255, 0.5) transparent transparent transparent;
  }

  .title {
    padding-bottom: 2px;
    margin-bottom: 2px;
    font-weight: bold;
    line-height: 18px;
    color: aliceblue;
    border-bottom: 1px solid #b4b4b4;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
  }

  .content {
    font-size: 10px;
    white-space: normal;
  }
}
</style>
