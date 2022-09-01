export const state = () => ({
  stationLatestList: [],
  houseList: [],
})

export const mutations = {
  setStationLatestList(state, value) {
    state.stationLatestList = value
  },
  setHouseList(state, value) {
    state.houseList = value;
  },
}

export const actions = {
  async houseList({commit}) {
    let data = await this.$axios.$get('/data/pump-house.json');
    data = data || [];
    commit('setHouseList', data);
  },
  async stationList({commit}) {
    let data = await this.$axios.$get('/api/nr/pump/latest',
      {timeout: 5000}).catch(() => null);
    data = data || [];
    data = data.filter(item => item != null);
    commit('setStationLatestList', data);
  },
}
