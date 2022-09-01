import qs from 'querystring'
import dateUtil from '@/util/date'

export const state = () => ({
  signed: false,
  token: JSON.parse(localStorage.getItem('gis-token') || '{}'),
  meterLatestList: [],
  lineList: [],
  partList: [],
  partDetailList: [],
  meterDayData: {
    day: [],
    month: [],
    year: [],
  },
  partDayData: [],
})

export const getters = {}

export const mutations = {
  setSigned(state, value) {
    state.signed = value
  },
  setToken(state, value) {
    let now = Date.now();
    value.expire = now + value.expires_in * 1000;
    localStorage.setItem('gis-token', JSON.stringify(value));
    state.token = value
  },
  setMeterLatestList(state, value) {
    state.meterLatestList = value
  },
  setLineList(state, value) {
    state.lineList = value
  },
  setPartList(state, value) {
    state.partList = value
  },
  setPartDetailList(state, value) {
    state.partDetailList = value
  },
  setMeterDayData(state, [day, month, year]) {
    state.meterDayData.day = day;
    state.meterDayData.month = month;
    state.meterDayData.year = year;
  },
  setPartDayData(state, data){
    state.partDayData = data;
  }
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
      username: 'htuser',
      password: '123456',
      client_secret: '123',
      client_id: 'javaboy',
      grant_type: 'password',
    };

    const res = await this.$axios.$post('/api/auth/oauth/token',
      qs.stringify(formData),);

    if (!res.error) {
      commit('setSigned', true);
      commit('setToken', res);
      return true;
    } else {
      return false;
    }
  },
  async lineList({state, commit, dispatch},) {
    const login = await dispatch('login');
    if (!login) {
      return
    }
    const reqData = {}
    let {status, data} = await this.$axios.$post(
      'api/gis/pipeline/list', qs.stringify(reqData), {
        headers: {
          'Authorization': 'Bearer ' + state.token.access_token
        }
      });
    data = data || []
    if (status == 'OK') {
      commit('setLineList', data);
    }

    return data;
  },
  async meterDataLatest({state, commit, dispatch}) {
    const login = await dispatch('login');
    if (!login) {
      return
    }
    const reqData = {
      size: 100,
    }

    try {
      const {status, data} = await this.$axios.$post(
        '/api/gis/meterDataLatest/list', qs.stringify(reqData), {
          headers: {
            'Authorization': 'Bearer ' + state.token.access_token
          }
        });
      // data.forEach(item=>item.dataTime = Date.now())
      if (status == 'OK' && data.length > 0) {
        data.forEach(item => {
          item.lng = Number(item.lng);
          item.lat = Number(item.lat);
        });
        commit('setMeterLatestList', data);
      }
    } catch (e) {
      setTimeout(() => {
        dispatch('meterDataLatest');
      }, 1000);
    }
  },
  async meterDataHistory({state, commit, dispatch}, {
    meterNo, time = dateUtil.day(),
  }) {
    const login = await dispatch('login');
    if (!login) {
      return
    }
    const reqData = {
      where: meterNo,
      time: time,
      current: 1,
      size: 2000,
    }
    let {status, data} = await this.$axios.$post(
      '/api/gis/meterDataHistory/list', qs.stringify(reqData), {
        headers: {
          'Authorization': 'Bearer ' + state.token.access_token
        }
      });

    data = data || [];

    if (status == 'OK') {

    }

    return data;
  },
  async getMeterDataLatest({state, commit, dispatch}, {
    meterNo
  }) {
    const login = await dispatch('login');
    if (!login) {
      return
    }
    const reqData = {
      meterNos: meterNo
    }
    let ret
    try {
      ret = await this.$axios.$post(
        '/api/gis/meterDataLatest/list', qs.stringify(reqData), {
          headers: {
            'Authorization': 'Bearer ' + state.token.access_token
          }
        });

    } catch (e) {
      setTimeout(() => {
        dispatch('meterDataLatest');
      }, 1000);
    }
    const {status, data} = ret
    if (status == 'OK') {
      return data && data.length > 0 ? data[0] : {}
    } else {
      return {}
    }
  },
  async meterDataDay({state, commit, dispatch}) {
    const login = await dispatch('login');
    if (!login) {
      return
    }
    const reqData = {
      start: dateUtil.beforeDay(),
      end: dateUtil.beforeDay(),
      dateType: 'date',
    }
    let {status, data} = await this.$axios.$post(
      '/api/gis/meterDataDay/getList', qs.stringify(reqData), {
        headers: {
          'Authorization': 'Bearer ' + state.token.access_token
        }
      });

    data = data || [];

    if (status == 'OK') {

    }

    return data;
  },
  async getMeterDataDay({state, commit, dispatch}, {
    meterNo, time = dateUtil.day(),
  }) {
    const login = await dispatch('login');
    if (!login) {
      return
    }
    const reqData = {
      start: time,
      end: time,
      where: meterNo,
    }
    let {status, data} = await this.$axios.$post(
      '/api/gis/meterDataDay/list', qs.stringify(reqData), {
        headers: {
          'Authorization': 'Bearer ' + state.token.access_token
        }
      });

    data = data || [];

    if (status == 'OK') {

    }

    return data;
  },
  async getPartData({state, commit, dispatch}, {
    dataTime = dateUtil.beforeDay(null, 1),
  }) {
    const login = await dispatch('login');
    if (!login) {
      return
    }
    const reqData = {
      dataTime: dataTime,
    }
    let {status, data} = await this.$axios.$post(
      '/api/gis/partDataDay/getListByDay', qs.stringify(reqData), {
        headers: {
          'Authorization': 'Bearer ' + state.token.access_token
        }
      });
    data = data || [];

    if (status == 'OK') {
      commit('setPartDayData', data)
    }

    return data;
  },
  async getPartNos({state, commit, dispatch}) {
    const login = await dispatch('login');
    if (!login) {
      return
    }
    let {status, data} = await this.$axios.$post(
      '/api/gis/partNode/list', qs.stringify({}), {
        headers: {
          'Authorization': 'Bearer ' + state.token.access_token
        }
      });

    data = data || [];

    if (status == 'OK') {
      commit('setPartList', data);
    }

    return data;
  },
  async getPartDetails({state, commit, dispatch}) {
    const login = await dispatch('login');
    if (!login) {
      return
    }
    let {status, data} = await this.$axios.$post(
      '/api/gis/partDetail/list', qs.stringify({}), {
        headers: {
          'Authorization': 'Bearer ' + state.token.access_token
        }
      });

    data = data || [];

    if (status == 'OK') {
      commit('setPartDetailList', data);
    }

    return data;
  },
  async getMeterDataByDay({state, commit, dispatch}) {
    const login = await dispatch('login');
    if (!login) {
      return
    }
    let dayDataAsync = this.$axios.$post(
      '/api/gis/meterDataDay/getList', qs.stringify({
        start: dateUtil.day(),
        end: dateUtil.day(),
        dateType: 'date',
      }), {
        headers: {
          'Authorization': 'Bearer ' + state.token.access_token
        }
      });
    let monthDataAsync = this.$axios.$post(
      '/api/gis/meterDataDay/getList', qs.stringify({
        start: dateUtil.month() + '-01',
        end: dateUtil.day(),
        dateType: 'month',
      }), {
        headers: {
          'Authorization': 'Bearer ' + state.token.access_token
        }
      });
    let yearDataAsync = this.$axios.$post(
      '/api/gis/meterDataDay/getList', qs.stringify({
        start: dateUtil.year() + '-01' + '-01',
        end: dateUtil.day(),
        dateType: 'year',
      }), {
        headers: {
          'Authorization': 'Bearer ' + state.token.access_token
        }
      });

    let data = (await Promise.all(
      [dayDataAsync, monthDataAsync, yearDataAsync])).map(item => item.data);

    commit('setMeterDayData', data);
  }
}

