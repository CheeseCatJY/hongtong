import dayjs from 'dayjs'

let qualityImages = {
  '东安水厂二期出水口': '/images/quality/01.ab70be2.png',
  '调度中心': '/images/quality/02.14851e4.png',
  '自来水公司水质': '/images/quality/03.53cea2d.png',
}
let factoryImages = [
  {name: '洪洞县自来水公司东安水厂', src: '/images/factory/01.cb9d172.png'},
  {name: '东安水厂全景', src: '/images/factory/02.50b0b2e.png'},
  {name: '1500m³蓄水池两座', src: '/images/factory/03.f85a02f.png'},
  {name: '3000m³蓄水池两座', src: '/images/factory/04.98043fd.png'},
  {name: '东安水厂水处理车间', src: '/images/factory/05.9f8656e.png'},
  {name: '东安水厂水处理车间', src: '/images/factory/06.e97114a.png'},
]

export const state = () => ({
  signed: false,
  token: JSON.parse(localStorage.getItem('ht-token') || '{}'),
  meterLatestList: [],
  realtimeData: {
    // 液位
    liquidLevel: [],
    // 水质设备
    waterQuality: [],
    // 压力设备
    pressureDevice: [],
    // 流量计
    meterDevice: [],
  },
  factoryData: {},
  flow7Day: {},
})

export const getters = {}

export const mutations = {
  setSigned(state, value) {
    state.signed = value
  },
  setToken(state, value) {
    let expire = dayjs(value.exipreTime, 'YYYYMMDDHHmmss').valueOf();
    let token = {expire, token: value.token};
    localStorage.setItem('ht-token', JSON.stringify(token));
    state.token = token;
  },
  setMeterLatestList(state, value) {
    state.meterLatestList = value
  },
  setRealtimeData(state, value) {
    value.forEach(item => {
      item.dataLatest = JSON.parse(item.dataLatest);
      // item.time = dayjs(item.timemillis).format('YYYY-MM-DD HH:mm:ss');
    })
    state.realtimeData.liquidLevel = value.filter(
      item => item.deviceCategoryName == '水池液位计')
    state.realtimeData.waterQuality = value.filter(
      item => item.deviceCategoryName == '水质三参数设备').map(item => {
      item.imgUrl = qualityImages[item.deviceName]
      if(item.deviceName=='东安水厂二期出水口'){
        item.coordinateLng = 111.77111832
        item.coordinateLat = 36.29601683
      }
      return item
    })
    state.realtimeData.pressureDevice = value.filter(
      item => item.deviceCategoryName == '管网压力设备')
    state.realtimeData.meterDevice = value.filter(
      item => item.deviceCategoryName == '超声波流量计')

  },
  setFactoryData(state, value) {
    state.factoryData = value;
  },
  setFlow7Day(state, value) {
    state.flow7Day = value;
  },
}

export const actions = {
  checkToken({state, commit}) {
    let token = state.token;
    if (!token) {
      return false;
    }
    const valid = token.expire > Date.now();
    return valid;
  },
  async login({dispatch, commit}) {
    const valid = await dispatch('checkToken');
    if (valid) {
      return true
    }

    const formData = {
      companyId: 'C00008',
      // password: 'abc123',
      // userId: 'manager',
      password: 'abc123456',
      userId: 'liulili',
    };

    const res = await this.$axios.$post('/api/ht/platform/login', formData,);

    if (!res.error) {
      commit('setSigned', true);
      commit('setToken', res.data);
      return true;
    } else {
      return false;
    }
  },
  async summary({state, dispatch, commit}) {
    await dispatch('login');
    const reqData = []
    const res = await this.$axios.$post(
      '/api/ht/board/hongdong/screen1/device/list', reqData, {
        headers: {
          'NFSAuthentication': state.token.token
        }
      });
    return res
  },
  //报警信息列表
  async alarmList({state, dispatch, commit}) {
    await dispatch('login');
    const reqData = []
    const res = await this.$axios.$post(
      '/api/ht/board/hongdong/screen1/alarm/list', reqData, {
        headers: {
          'NFSAuthentication': state.token.token
        }
      });

    return res
  },
  //实时数据
  async currentData({state, dispatch, commit}) {
    await dispatch('login');
    const reqData = []
    const res = await this.$axios.$post(
      '/api/ht/board/hongdong/screen1/wcompany', reqData, {
        headers: {
          'NFSAuthentication': state.token.token
        }
      });

    // 30005: 0.03//浊度
    // 30006: 0.16 //余氯
    // 30007: 7.58 //PH
    // 40002-IN-DAY: 13328.900000000838 日流量(源头进水)
    // 40002-IN-MONTH: 421817.50000000093  月流量(源头进水)
    // 40002-IN-YEAR: 5552142.100000001  年流量(源头进水)
    // 40002-OUT-DAY: 14796 日流量(源头出水)
    // 40002-OUT-MONTH: 420627 月流量(源头出水)
    // 40002-OUT-YEAR: 6680086.699999999 年流量(源头出水)
    // YW01-NORTH: 2.768 //液位东安水厂北水池
    // YW01-SOUTH: 2.974 //液位东安水厂南水池

    let data = {
      'zhuodu': res['30005'],
      'yulv': res['30006'],
      'PH': res['30007'],
      'inDay': res['40002-IN-DAY'],
      'inMonth': res['40002-IN-MONTH'],
      'inYear': res['40002-IN-YEAR'],
      'outDay': res['40002-OUT-DAY'],
      'outMonth': res['40002-OUT-MONTH'],
      'outYear': res['40002-OUT-YEAR'],
      'north': res['YW01-NORTH'],
      'south': res['YW01-SOUTH'],
      'east': res['YW01-EAST'],
      'west': res['YW01-WEST'],
    }

    data.imgList = factoryImages;
    commit('setFactoryData', data);

    return data
  },
  //水质实时数据
  async currentWaterQualityData({state, dispatch, commit}) {
    await dispatch('login');
    const reqData = []
    const res = await this.$axios.$post(
      '/api/ht/board/hongdong/screen1/realtime/f6b00d4a835a4bb7ad76654054c3bb44',
      reqData, {
        headers: {
          'NFSAuthentication': state.token.token
        }
      });

    //deviceName 设备名称
    // data.30005: 0.12 浊度
    // data.30006: 0.09 余氯
    // data.30007: 7.94 PH
    // data.timemillis: 1634718315340 时间
    return res
  },
  //流量实时数据
  async currentFlowData({state, dispatch, commit}) {
    await dispatch('login');
    const reqData = []
    const res = await this.$axios.$post(
      '/api/ht/board/hongdong/screen1/realtime/317060ebdec344bfa412bb4f402f9077',
      reqData, {
        headers: {
          'NFSAuthentication': state.token.token
        }
      });

    //deviceName "老庙银楼" 设备名称
    // data.40001: 47.413 瞬时流量
    // data.40002: 1171219
    // data.40003: 1218406  正向累计
    // data.40004: 47187
    // data.40005: 611160
    // data.40006: 0.519 压力
    // data.timemillis: 1634718315340 时间
    res.forEach(item => {
      item.type = '流量'
    })
    return res
  },
  //压力实时数据
  async currentPressureData({state, dispatch, commit}) {
    await dispatch('login');
    const reqData = []
    const res = await this.$axios.$post(
      '/api/ht/board/hongdong/screen1/realtime/5b01bc575f7e4a6ab7f5b750bcb0a38f',
      reqData, {
        headers: {
          'NFSAuthentication': state.token.token
        }
      });

    //deviceName "弯里村" 设备名称
    // data.YL01: 0.358 压力
    // data.YL02: 3.608 电池压力
    // data.YL03: 16
    // data.timemillis: 1634718315340 时间
    res.forEach(item => {
      item.type = '压力'
    })
    return res
  },
  //实时数据液位计、水质、压力、流量计
  async realtimeData({state, dispatch, commit}) {
    await dispatch('login');
    const reqData = {}
    const res = await this.$axios.$post(
      '/api/ht/iot/device/device/query',
      reqData, {
        headers: {
          'NFSAuthentication': state.token.token
        }
      });
    commit('setRealtimeData', res.rows);
    return res.rows;
  },
  //实时数据液位计、水质、压力、流量计
  async flow7Day({state, dispatch, commit}) {
    await dispatch('login');
    const reqData = {}
    const res = await this.$axios.$post(
      '/api/ht/board/hongdong/screen1/dma/7flow',
      reqData, {
        headers: {
          'NFSAuthentication': state.token.token
        }
      });
    commit('setFlow7Day', res);
    return res;
  },
}

