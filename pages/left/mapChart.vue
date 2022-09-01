<template>
  <div id="map" style="height: calc(100%);position: relative;"></div>
</template>

<script>
import echarts from '@/plugins/echarts'
import 'echarts-gl';

// import china from '@/static/geo/china.json'
import jinhu from '@/static/geo/jinhu.json'

// echarts.registerMap('china', china)
echarts.registerMap('jinhu', jinhu)

// import('echarts/extension/bmap/bmap');
// import('echarts/lib/chart/map');

import mapStyle from './mapStyle'

const lineStyle = (idx, hStep) => ({
  normal: {
    color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
  }
});

import {mapState, mapMutations} from 'vuex';

const coords = require('@/static/data/pump-coords.json');

export default {
  data() {
    return {
      currIndex: 0,
      values: [
        {key: 'pressureIn', name: '入水压力'},
        {key: 'pressureOut', name: '出水压力'},
        {key: 'pressureSet', name: '设定压力'},
        {key: 'totalFlow', name: '累计流量'},
        {key: 'instantFlow', name: '瞬时流量'},
        {key: 'cl', name: '余氯'},
        {key: 'ph', name: 'PH值'},
        {key: 'turbidity', name: '浊度'},
      ],
    }
  },
  computed: {
    ...mapState({
      pumpList: state => state.pump.latest,
    }),
  },
  watch: {
    pumpList(val) {
      if (val && val.length > 0) {
        if (this.currIndex == this.values.length) {
          this.currIndex = 0;
        }
        this.addPumps();
        this.currIndex += 1;
      }
    }
  },
  methods: {
    initChart() {
      var chartDom = document.getElementById('map');
      var myChart = echarts.init(chartDom, 'dark');
      var option;
      option = {
        title: {
          text: '洪洞县智慧水务一体化平台',
          subtext: '中控大屏调度中心',
          textStyle: {
            color: '#ccc',
            fontWeight: 'normal',
            fontSize: 24,
          },
          subtextStyle: {
            color: "#999999",
            fontSize: 16,
          },
          left: 'center',
          padding: 10,
        },
        progressive: 20000,
        geo3D: {
          map: 'jinhu',
          show: false,
          shading: 'lambert',
          light: {
            main: {
              intensity: 5,
              shadow: true,
              shadowQuality: 'high',
              alpha: 70
            },
            ambient: {
              intensity: 0
            },
          },
          viewControl: {
            distance: 100,
            alpha: 25,
            panMouseButton: 'left',
            rotateMouseButton: 'right'
          },
          postEffect: {
            enable: true,
            bloom: {
              enable: false
            },
            SSAO: {
              radius: 1,
              intensity: 1,
              enable: true
            },
            depthOfField: {
              enable: false,
              focalRange: 10,
              blurRadius: 10,
              fstop: 1
            }
          },
          temporalSuperSampling: {
            enable: true
          },
          itemStyle: {
            color: 'rgba(2,15,35,0.1)'
          },
          emphasis: {
            itemStyle: {
              color: 'rgba(2,15,35,0.1)'
            }
          },
          boxHeight: 0,
          regionHeight: 3
        },
        visualMap: {
          max: 60,
          seriesIndex: 2,
          calculable: true,
          realtime: false,
          inRange: {
            color: ['#00ff0d', '#f5f811', '#f09a09', '#fe0300']
          },
          outOfRange: {
            colorAlpha: 0
          }
        },
        series: [
          {
            type: 'lines3D',
            coordinateSystem: 'geo3D',
            // blendMode: 'lighter',
            polyline: true,
            lineStyle: {
              width: 2,
              color: '#09AEE3',
              opacity: 0.1
            },
            data: [],
            //silent: true,
            progressiveThreshold: 500,
            progressive: 200
          },
          {
            type: 'lines3D',
            coordinateSystem: 'geo3D',
            polyline: true,
            data: [],
            lineStyle: {
              width: 0
            },
            effect: {
              constantSpeed: 5,
              show: true,
              trailLength: 0.1,
              trailWidth: 2.5,
            },
            blendMode: 'lighter',
            zlevel: 1
          },
          {
            type: 'bar3D',
            coordinateSystem: 'geo3D',
            //shading: 'lambert',
            data: [],
            barSize: 0.5,
            minHeight: 5,
            label: {
              show: true,
              formatter: ({data}) => {
                return this.values[this.currIndex].name + ': ' + data[2]
              }
            },
            itemStyle: {
              opacity: 0.1
            },
            silent: true
          }
        ]
      };

      option && myChart.setOption(option);

      this.mapEvent = () => {
        myChart.dispatchAction({
          type: 'lines3DToggleEffect',
          seriesIndex: 0
        });
      }
      window.addEventListener('keydown', this.mapEvent);

      this.queryData()
      return myChart;
    },
    initData() {
      this.$store.dispatch('pump/pullLatest');
    },
    async queryData() {

      const efline = await this.$axios.$get('/data/efline.json');
      const effeatures = efline.features;
      let efLines = []
      for (const effeature of effeatures) {
        let coords = [];
        for (let [_1, _2] of effeature.geometry.coordinates) {
          coords.push([_1, _2]);
        }
        efLines.push(coords);
      }
      this.myChart.setOption({
        series: [
          {data: efLines},
          {data: efLines},
        ],
      });
    },
    getData(data) {
      return data[this.values[this.currIndex].key];
    },
    addPumps() {
      let data = this.pumpList.map(item => {
        let key = `${item.lng},${item.lat}`;
        let [lng, lat] = coords[key];
        return [lng, lat, this.getData(item.data)];
      });
      this.myChart && this.myChart.setOption({
        series: [{}, {}, {
          data: data,
        }],
      });
    },
  },
  async mounted() {
    this.myChart = await this.initChart();
    this.$bus.$on('window-resize', () => this.myChart && this.myChart.resize());
    this.initData();
    this.timeIndex = setInterval(this.initData, 10 * 1000);
  },
  destroyed() {
    clearInterval(this.timeIndex);
    this.$bus.$off('window-resize');
    window.removeEventListener('keydown', this.mapEvent);
  }
}
</script>

<style lang="less" scoped>

</style>
