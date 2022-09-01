export const state = () => ({
  signed: false,
  token: localStorage.getItem('video-token') && JSON.parse(
    localStorage.getItem('video-token')),
})

export const getters = {}

export const mutations = {
  setSigned(state, value) {
    state.signed = value
  },
  setToken(state, value) {
    localStorage.setItem('video-token', JSON.stringify(value));
    state.token = value
  },
  setMeterList(state, value) {
    state.meterList = value
  },
}

export const actions = {
  checkToken({state, commit}) {
    if (!state.token) {
      return false;
    }
    const info = state.token.expireTime;
    const valid = info.exp > Date.now();
    return valid;
  },
  async login({dispatch, commit}) {
    const valid = await dispatch('checkToken');
    if (valid) {
      return true
    }
    const {code, data} = await this.$axios.$post('/api/lapp/token/get',
      null,
      {
        params: {
          appKey: '7cc89b3b289c43c79732f8f857873cd5',
          appSecret: '3112b00ecb64219eee81c4faeac31883',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
    if (code == '200') {
      commit('setSigned', true);
      commit('setToken', data);
      return true;
    } else {
      return false;
    }
  },
  async getVideo({state, commit}, {deviceSerial, channelNo}) {
    const {code, data} = await this.$axios.$post(
      '/api/lapp/v2/live/address/get',
      null,
      {
        params: {
          accessToken: state.token.accessToken,
          deviceSerial: deviceSerial,
          channelNo: channelNo,
          code: 'jh123456',
          // protocol: 3
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': state.token
        }
      });
    if (code == '200') {
      // commit('setMeterList', data);
      return true;
    } else {
      return false;
    }
  }
}
