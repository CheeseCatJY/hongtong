import {mapMutations} from 'vuex';

export default {
  mqtt: {
    ['jinhu/pump_station/latest'](data, topic){
      let json = JSON.parse(String(data));
      this.setStationLatest(json);
    }
  },
  methods:{
    ...mapMutations({
      setStationLatest: 'pump/setStationLatestList'
    }),
  },
  mounted() {
    this.$mqtt.subscribe('jinhu/pump_station/latest');
  },
  beforeDestroy() {
    this.$mqtt.unsubscribe('jinhu/pump_station/latest');
  }
}
