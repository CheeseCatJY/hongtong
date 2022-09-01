import Vue from 'vue';
import VueMqtt from 'vue-mqtt';
import dayjs from 'dayjs';

Vue.use(VueMqtt, 'ws://frp.vfoxs.com:33184', {})

const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
Vue.prototype.$fmt = {
  time(time, fmt = 'YYYY-MM-DD HH:mm:ss') {
    if (!time || time == '-') {
      return '-';
    }
    return dayjs(time).format(fmt)
  },
  week(time) {
    return weeks[dayjs(time).day()]
  },
}

Vue.prototype.$bus = new Vue();

Vue.mixin({
  created() {
    this.onViewer && this.$bus.$on('viewer', this.onViewer);
  },
  beforeDestroy() {
    this.onViewer && this.$bus.$off('viewer', this.onViewer);
  }
});


import AnimatedNumber from 'animated-number-vue';

Vue.component('animated-number', AnimatedNumber)
