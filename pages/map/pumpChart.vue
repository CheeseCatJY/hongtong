<template>
  <b-row style="height:100vh; position:relative;">
    <b-col cols="9" style="height: 100%;">
      <!--<div>-->
      <!--<b-button-group  v-for="(item, key) in pumpData['分区']" @click="changePart(key)">-->
      <!--<b-button>{{key}}</b-button>-->
      <!--</b-button-group>-->
      <!--</div>-->
      <div id="pump" style="width:75vw;height: calc(100vh - 70px);padding:20px 0px 0 20px;"></div>
      <div class="head">
        <div class="back">
          <b-button @click="$emit('close')">返回大屏</b-button>
        </div>
        <div class="title">
          <b-form-group>
            <b-form-radio-group
              v-model="selectPart"
              :options="partNames"
              buttons
              @change="changePart"
            ></b-form-radio-group>
          </b-form-group>
        </div>
      </div>
    </b-col>
    <b-col cols="3" style="padding:10px 20px 0 0;">
      <div class="video-box">
        <iframe
          v-if="video1"
          :src="video1"
          width="100%"
          height="100%"
          allowfullscreen
        >
        </iframe>
        <div class="none" v-else>

        </div>
      </div>
      <div class="video-box">
        <iframe
          v-if="video2"
          :src="video2"
          width="100%"
          height="100%"
          allowfullscreen
        >
        </iframe>
        <div class="none" v-else>

        </div>
      </div>
      <div class="video-box">
        <iframe
          v-if="video3"
          :src="video3"
          width="100%"
          height="100%"
          allowfullscreen
        >
        </iframe>
        <div class="none" v-else>

        </div>
      </div>
      <div class="video-box">
        <iframe
          v-if="video4"
          :src="video4"
          width="100%"
          height="100%"
          allowfullscreen
        >
        </iframe>
        <div class="none" v-else>

        </div>
      </div>

      <!--        <div style="height: 50%; overflow: hidden" id="map">
              </div>-->
    </b-col>
  </b-row>
</template>

<script>
import echarts from '@/plugins/echarts'
import vueFlvPlayer from 'vue-flv-player'
import {mapActions, mapState} from "vuex";

import('echarts/extension/bmap/bmap');

export default {
  name: "pumpChart",
  props: ['pumpData', 'pumpInfo'],
  components: {
    vueFlvPlayer,
  },
  watch: {
    pumpData: {
      handler(val) {
        if (this.option) {
          this.updateRegions()
          this.chart.setOption(this.option);
        } else {
          this.init()
        }
      },
      deep: true
    },
    // pumpInfo: {
    //   handler(val) {
    //     if (this.mapOption) {
    //       this.mapOption.bmap.center = [this.pumpData.lng, this.pumpData.lat],
    //       this.chart.setOption(this.option);
    //     } else {
    //       this.initMap()
    //     }
    //   },
    //   deep: true
    // },
  },
  mounted() {
    this.init();
    // this.initMap();
    this.iniVideo();
    this.rotatePump();
  },
  beforeDestroy() {
    // clearInterval(this.timerIndex);
    // window.cancelAnimationFrame(this.timerIndex);
    window.removeEventListener('message', this.videoHandler);
  },
  data() {
    return {
      chart: null,
      option: null,
      data: {},
      selectPart: null,
      mapOption: null,
      mapChart: null,
      video1: null,
      video2: null,
      video3: null,
      video4: null,
      rotate: 0,
    }
  },
  computed: {
    ...mapState({
      token: state => state.monitor.token.accessToken,
    }),
    partNames(){
      let partMap = this.pumpData['分区'];
      let names = ['低区', '中区', '高区'];
      let partNames = [];
      for (let name of names) {
        if(partMap[name]){
          partNames.push(name);
        }
      }
      return partNames;
    },
  },
  methods: {
    ...mapActions({
      login: 'monitor/login'
    }),
    iniVideo() {
      this.login().then((res) => {
        this.video1 = this.genVideoUrl(1);
        this.video2 = this.genVideoUrl(2);
        this.video3 = this.genVideoUrl(3);
        this.video4 = this.genVideoUrl(4);
      });
      window.addEventListener('message', this.videoHandler);
    },
    videoHandler(event){
      if (event.origin != 'https://open.ys7.com') {
       return;
      }
      let id = event.data.id;
      if(id && event.data.type == 'handleError'){
        this[id] = null;
      }
    },
    genVideoUrl(num = 1) {
      let {vno, vcode} = this.pumpInfo;
      if (!vno) {
        return null
      }
      vcode = vcode || 'jh123456';
      return `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://${vcode}@open.ys7.com/${vno}/${num}.live&autoplay=1&audio=1&accessToken=${this.token}&templete=0&id=video${num}`
    },
    changePart(item) {
      this.selectPart = item
      if (this.option) {
        this.updateRegions()
        this.chart.setOption(this.option);
      } else {
        this.init()
      }
    },
    async init() {
      this.chart = echarts.init(document.getElementById('pump'), null, {renderer: 'svg'});
      // const svg = await this.$axios.$get(location.origin + '/svg/test.svg');
      const svg = await this.$axios.$get(location.origin + '/svg/final.svg');
      echarts.registerMap('pump', {svg: svg});

      this.option = {
        title: {
          textAlign: 'left',
          right: 0,
          bottom: 0,
          text: this.pumpInfo.address,
          subtext: this.getSubtext(),
          textStyle: {
            color: "#F2F2F2",
            fontSize: 24,
          },
          subtextStyle: {
            color: "#C9C9C9",
            fontSize: 16,
          }
        },
        tooltip: {},
        graphic: [
          {
            type: 'group',
            left: '0',
            top: 'top',
            children: [
              {
                type: 'rect',
                left: 'center',
                top: '0',
                shape: {
                  width: 150,
                  height: 122,
                  r: 5
                },
                style: {
                  fill: '#fff',
                  stroke: '#999',
                  lineWidth: 1,
                  shadowBlur: 8,
                  shadowOffsetX: 3,
                  shadowOffsetY: 3,
                  shadowColor: 'rgba(0,0,0,0.2)'
                }
              },
              {
                type: 'rect',
                left: 'center',
                top: '0',
                shape: {
                  width: 150,
                  height: 30,
                  r: [5, 5, 0, 0]
                },
                style: {
                  stroke: '#999',
                  fill: '#009999'
                }
              },
              {
                type: 'text',
                z: 100,
                left: 'center',
                top: '8',
                style: {
                  fill: '#fff',
                  text: '其他指标',
                  fontSize: '14px'
                }
              },
              {
                type: 'rect',
                left: 'center',
                top: '30',
                shape: {
                  width: 148,
                  height: 30
                },
                style: {
                  fill: '#fff',
                  stroke: '#555',
                  lineWidth: 0.1,
                }
              },
              {
                type: 'text',
                z: 100,
                left: 'center',
                top: '40',
                style: {
                  fill: '#333',
                  text: '烟感：正常',
                  fontSize: '14px'
                }
              },
              {
                type: 'rect',
                left: 'center',
                top: '60',
                shape: {
                  width: 148,
                  height: 30
                },
                style: {
                  fill: '#fff',
                  stroke: '#555',
                  lineWidth: 0.1,
                }
              },
              {
                type: 'text',
                z: 100,
                color: '#333',
                left: 'center',
                top: '70',
                style: {
                  fill: '#333',
                  text: '水浸：正常',
                  fontSize: '14px'
                }
              },
              {
                type: 'text',
                z: 100,
                left: 'center',
                top: '100',
                style: {
                  fill: '#333',
                  text: '门禁：正常',
                  fontSize: '14px'
                }
              }
            ]
          }
        ],
        geo: {
          map: 'pump',
          roam: false,
          zoom: 1.5,
          selectedMode: 'multiple',
          layoutCenter: ['50%', '50%'],
          layoutSize: '100%',
          tooltip: {
            show: false
          },
          itemStyle: {
            color: 'rgba(255,0,0,0)'
          },
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              color: null,
              borderColor: 'green',
              borderWidth: 2
            },
            label: {
              show: false
            }
          },
          select: {
            itemStyle: {
              color: 'rgba(255,0,0,0.4)'
            },
            label: {
              show: false,
              textBorderColor: '#fff',
              textBorderWidth: 2
            }
          },
        },
        series: [
          /*{
            name: '1#',
            type: 'gauge',
            startAngle: 0,
            endAngle: 360,
            clockwise: false,
            min: 0,
            max: 360,
            radius: '5%',
            center: ['38.3%', '55%'],
            animation: false,
            splitNumber: 12,

            axisLabel: {
              show: false
            },
            pointer: {
              offsetCenter: [0, '100%'],
              showAbove: false,
              icon: 'image://svg/beng.png',
              length: '200%',
              width: '200%',
              itemStyle: {
                color: '#ff0000'
              }
            },
            anchor: {
              show: false
            },
            detail: {
              show: false
            },
            title: {
              show: false
            },
            data: [{
              value: 0
            }]
          },
          {
            name: '2#',
            type: 'gauge',
            startAngle: 0,
            endAngle: 360,
            clockwise: false,
            min: 0,
            max: 360,
            center: ['53.6%', '55%'],
            radius: '5%',
            animation: false,
            splitNumber: 12,

            axisLabel: {
              show: false
            },
            pointer: {
              offsetCenter: [0, '100%'],
              showAbove: false,
              icon: 'image://svg/beng.png',
              length: '200%',
              width: '200%',
              itemStyle: {
                color: '#ff0000'
              }
            },
            anchor: {
              show: false
            },
            detail: {
              show: false
            },
            title: {
              show: false
            },
            data: [{
              value: 0
            }]
          },
          {
            name: '3#',
            type: 'gauge',
            startAngle: 0,
            endAngle: 360,
            clockwise: false,
            min: 0,
            max: 360,
            center: ['69.2%', '55%'],
            radius: '5%',
            animation: false,
            splitNumber: 12,

            axisLabel: {
              show: false
            },
            pointer: {
              offsetCenter: [0, '100%'],
              showAbove: false,
              icon: 'image://svg/beng.png',
              length: '200%',
              width: '200%',
              itemStyle: {
                color: '#ff0000'
              }
            },
            anchor: {
              show: false
            },
            detail: {
              show: false
            },
            title: {
              show: false
            },
            data: [{
              value: 0
            }]
          },*/
          {
            name: 'Route',
            type: 'lines',
            coordinateSystem: 'geo',
            geoIndex: 0,
            emphasis: {
              label: {
                show: false
              }
            },
            polyline: true,
            lineStyle: {
              color: '#CC3333',
              width: 2,
              opacity: 0.3,
              type: 'dashed'
            },
            effect: {
              show: true,
              period: 8,
              color: '#2e9bee',
              constantSpeed: 90,
              trailLength: 0,
              symbolSize: [12, 12],
            },
            data: [{
              coords: [
                [10, 302],
                [415, 302],
                [425, 312],
                [430, 322],
                [430, 560],
              ]
            },
              {
                coords: [
                  [352, 730],
                  [352, 840],
                  [358, 850],
                  [372, 856],
                  [1230, 856],
                ]
              },
              {
                coords: [
                  [590, 856],
                  [590, 640],
                  [610, 625],
                  [810, 625],
                  [825, 610],
                  [825, 315],
                  [835, 303]
                ]
              },
              {
                coords: [
                  [835, 303],
                  [1900, 303],
                ]
              },
              {
                coords: [
                  [915, 856],
                  [915, 640],
                  [935, 627],
                  [1135, 627],
                  [1157, 612],
                  [1157, 303],
                ]
              },
              {
                coords: [
                  [1230, 856],
                  [1245, 848],
                  [1245, 640],
                  [1260, 627],
                  [1465, 627],
                  [1487, 612],
                  [1487, 303],
                ]
              }
            ]
          },
          {
            name: 'beng',
            type: 'lines',
            coordinateSystem: 'geo',
            geoIndex: 0,
            emphasis: {
              label: {
                show: false
              }
            },
            polyline: true,
            lineStyle: {
              color: '#000',
              width: 0,
            },
            effect: {
              show: true,
              period: 8,
              color: '#009999',
              constantSpeed: 50,
              trailLength: 0,
              symbolSize: [12, 12],
            },
            data: [
              {
                coords: [
                  //[707, 605],
                  [727, 605],
                  [724.3205080756887, 595],
                  [717, 587.6794919243113],
                  [707, 585],
                  [697, 587.6794919243113],
                  [689.6794919243113, 595],
                  [687, 605],
                  [689.6794919243113, 615],
                  [697, 622.3205080756887],
                  [707, 625],
                  [717, 622.3205080756887],
                  [724.3205080756887, 615]
                ]
              },
              {
                coords: [
                  [1060, 605],
                  [1057.3205080756888, 595],
                  [1050, 587.6794919243113],
                  [1040, 585],
                  [1030, 587.6794919243113],
                  [1022.6794919243113, 595],
                  [1020, 605],
                  [1022.6794919243113, 615],
                  [1030, 622.3205080756887],
                  [1040, 625],
                  [1050, 622.3205080756887],
                  [1057.3205080756888, 615]
                ]
              },
              {
                coords: [
                  [1392, 605],
                  [1389.3205080756888, 595],
                  [1382, 587.6794919243113],
                  [1372, 585],
                  [1362, 587.6794919243113],
                  [1354.6794919243112, 595],
                  [1352, 605],
                  [1354.6794919243112, 615],
                  [1362, 622.3205080756887],
                  [1372, 625],
                  [1382, 622.3205080756887],
                  [1389.3205080756888, 615]
                ]
              },
            ]
          }]
      };
      this.updateRegions()

      this.chart.setOption(this.option);

      this.$bus.$on('window-resize', () => {
        this.chart.resize();
      })
    },
    updateRegions() {
      if (this.option) {
        const list = {
          '1#泵': {
            position: 'bottom',
            type: 'beng'
          },
          '2#泵': {
            position: 'bottom',
            type: 'beng'
          },
          '3#泵': {
            position: 'bottom',
            type: 'beng'
          },
          '进水压力': {
            position: 'top',
            type: 'pre'
          },
          '出水压力': {
            position: 'top',
            type: 'pre'
          },
          '进水累计流量': {
            position: 'top',
            type: 'flow'
          },
          '出水累计流量': {
            position: 'top',
            type: 'flow'
          },
          '水质': {
            position: ['-332%', '80%'],
            type: 'qua'
          },
        }
        this.option.geo.regions = this.makeTakenRegions(list)
        this.option.title.subtext = this.getSubtext()
      } else {
        this.init()
      }
    },
    makeTakenRegions(list) {
      let regions = [];
      for (let id in list) {
        regions.push({
          name: id,
          silent: true,
          label: this.getPumpLabel(id, list[id]),
          emphasis: {
            label: {
              show: true
            }
          },
          select: {
            label: {
              show: false
            }
          },
        });
      }
      return regions;
    },
    getPumpLabel(name, e) {
      return {
        show: true,
        position: e.position,
        //position: ['0', '-50%'],
        formatter: this.getPumpText(name, e),
        backgroundColor: '#eee',
        borderColor: '#777',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
          title: {
            color: '#eee',
            align: 'center'
          },
          abg: {
            backgroundColor: '#009999',
            width: '100%',
            align: 'right',
            height: 30,
            borderRadius: [4, 4, 0, 0]
          },
          err: {
            backgroundColor: '#009999',//'#CC3333',
            width: '100%',
            align: 'right',
            height: 30,
            borderRadius: [4, 4, 0, 0]
          },
          normal: {
            width: 40,
            height: 30,
            color: '#333',
            align: 'center',
          },
          big: {
            width: 50,
            height: 30,
            color: '#333',
            align: 'center',
          },
          sig: {
            width: 100,
            height: 30,
            color: '#333',
            align: 'center',
          },
          hr: {
            borderColor: '#777',
            width: '100%',
            borderWidth: 0.5,
            height: 0
          },

        }
      }
    },
    getPumpText(name, e) {
      let partMap = this.pumpData['分区'];
      if (!partMap) {
        return '';
      }
      if (!this.selectPart || !(partMap && partMap[this.selectPart])) {
        this.selectPart = Object.keys(partMap)[0]
      }
      let partData = partMap && partMap[this.selectPart]

      if (!partData) {
        return '';
      }

      let data = [];
      switch (e.type) {
        case 'beng':
          let status = partData[name + '状态'];
          if (!status) {
            return '';
          }

          let title, tbg;
          status = parseInt(status);
          if ([0, 2, 512].includes(status)) {
            title = '正常'
            tbg = 'abg'
          } else if (status == 1) {
            title = '离线'
            tbg = 'err'
          } else if (status == 3) {
            title = '故障'
            tbg = 'err'
          } else {
            title = '异常'
            tbg = 'err'
            console.log('泵房', name, '状态', status)
          }

          return [
            '{title|' + name + '}{' + tbg + '|}',
            '{normal|状态}{normal|电流}{big|频率}',
            '{hr|}',
            '{normal|' + title + '}{normal|' + this.getData(partData[name + '电流']) + ' A}{big|'
            + this.getData(partData[name + '频率']) + ' Hz}'
          ].join('\n');
        case 'pre':
          data.push('{title|' + name + '}{abg|}');
          partData[name] && data.push('{sig|' + this.getData(partData[name]) + ' MPa}');
          return data.length > 1 ? data.join('\n') : '';
        case 'flow':
          data.push('{title|' + name + '}{abg|}');
          partData[name] && data.push('{sig|' + this.getData(partData[name]) + ' m³}');
          return data.length > 1 ? data.join('\n') : '';
        case 'qua':
          data.push('{title|' + name + '}{abg|}');
          this.pumpData['浊度'] && data.push(
            '{sig|浊度：' + this.getData(this.pumpData['浊度']) + ' NTU}\n' + '{hr|}');
          this.pumpData['余氯'] && data.push(
            '{sig|余氯：' + this.getData(this.pumpData['余氯'] / 100) + ' mg/L}\n' + '{hr|}');
          this.pumpData['PH值'] && data.push(
            '{sig|PH值：' + this.getData(this.pumpData['PH值']) / 100 + '}');
          return data.length > 1 ? data.join('\n') : '';
      }
    },
    getData(data) {
      return data || data === 0 ? data : '-'
    },
    initMap() {
      this.mapChart = echarts.init(document.getElementById('map'));

      this.mapOption = {
        bmap: {
          center: [this.pumpInfo.lng, this.pumpInfo.lat],
          zoom: 14,
          roam: true,
        },
        series: [
          {
            name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: [{
              name: this.pumpInfo.address,
              value: [this.pumpInfo.lng, this.pumpInfo.lat, 111]
            }],
            symbolSize: function (val) {
              return val[2] / 5;
            },
            encode: {
              value: 2
            },
            label: {
              formatter: '{b}',
              position: 'top',
              show: true,
              fontWeight: 'bold',
              fontSize: 15
            },
            itemStyle: {
              color: '#2e9bee'
            },
            emphasis: {
              label: {
                show: true
              }
            }
          }]
      }
      this.mapChart.setOption(this.mapOption);
    },
    getSubtext() {
      if (!this.pumpData) {
        return '设定压力：- MPa \n\n更新时间：-';
      }

      let partData = this.pumpData['分区'] && this.pumpData['分区'][this.selectPart]
        ? this.pumpData['分区'][this.selectPart] : {};

      const textList = [];
      partData['出水累计流量'] && textList.push(`累计流量：${partData['出水累计流量']} m³`);
      partData['累计电量'] && textList.push(`累计电量：${partData['累计电量']} kW·h`);
      partData['设定压力'] && textList.push(`设定压力：${partData['设定压力']} MPa`);
      this.pumpData['时间'] && textList.push(`\n\n更新时间：${this.$fmt.time(this.pumpData['时间'])}`);

      return textList.join('，');
    },
    rotatePump() {
      // this.timerIndex = setInterval(this.updateRotate, 50);
      // this.timerIndex = window.requestAnimationFrame(this.updateRotate);
    },
    updateRotate(){
      if (!this.chart) {
        return;
      }
      const rotate = (this.rotate + 20) % 360;
      // this.option.series[0].data[0].value = rotate;
      // this.option.series[1].data[0].value = rotate;
      // this.option.series[2].data[0].value = rotate;
      this.chart.setOption({
        series: [
          {data: [{value: rotate}]},
          {data: [{value: rotate}]},
          {data: [{value: rotate}]},
        ]
      });
      this.rotate = rotate;
    }
  },
}
</script>

<style lang="less" scoped>

.head {
  position: relative;

  .back {
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px;
  }

  .title {
    text-align: center;
    padding: 20px;
  }
}

.video-box {
  height: calc(25vh - 12.5px);;
  margin-bottom: 10px;
  background-color: #000000;
  position: relative;

  .none {
    color: #eeeeee;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: inline-block;
    height: 20px;
  }
}

/deep/ img, video {
  /*height: 30vh !important;*/
  margin-top: 20px !important;
}

/deep/ .ec-extension-bmap {
  height: 50% !important;
}
</style>
