<template>
  <div style="height: calc(90vh)">
    <b-row>
      <b-col cols="10">
        <b-form inline style="font-size: 15px;">
          <b-badge v-if="isOnline(meter.dataTime)" variant="success" effect="dark"
                   class="badgeClass">
            设备在线
          </b-badge>
          <b-badge v-else variant="danger" effect="dark" class="badgeClass">设备离线</b-badge>
          <b-badge variant="success" class="badgeClass">
            {{ meter.typeName }}
            {{ meter.caliberName }}
          </b-badge>
          <b-badge class="badgeClass">设备号：{{ meter.deviceNo }}</b-badge>
          <!-- <b-badge type="warning" size="medium"></b-badge> -->
          <b-badge variant="danger" class="badgeClass">频率：{{ meter.rate || 1 }}分钟</b-badge>
          <b-badge variant="info" class="badgeClass">{{ meter.address }} {{ meter.tips }}</b-badge>

          <!--<b-button variant="primary" size="sm" @click="historyCompare">历史对比</b-button>-->
        </b-form>
      </b-col>
      <b-col cols="2" align-self="end">
        <div>
          <b-form-datepicker v-model="currDate" :state="true"
                             locale="zh"
                             :date-format-options="{ 'year': 'numeric', 'month': 'long', 'day': 'numeric' }"></b-form-datepicker>
        </div>
      </b-col>
    </b-row>

    <meter-latest :date="currDate"
                  :meter="meter"
                  :marksData="marksData"
                  ref="meterLatest">
    </meter-latest>
  </div>
</template>

<script>
import dateUtil from '@/util/date'
import MeterLatest from "./latest";
import {mapActions} from 'vuex';

export default {
  name: "meterDetail",
  components: {MeterLatest},
  props: ['meter'],
  data() {
    return {
      currDate: '',
      historyData: [],
      days: [],
      dayMinFlows: [],
      dayFlows: [],
      colors: ['#c23531', '#59c4e6'],
      lineChart: null,
      lineChartOption: {},
      marksData: {},
    }
  },
  watch: {},
  methods: {
    ...mapActions({
    }),
    initData() {
      this.currDate = dateUtil.day(this.meter.createTime)
    },
    isOnline(val = 0) {
      return '在线'
    },
  },
  mounted() {
    this.initData()
  },
  destroyed() {
  }
}
</script>

<style scoped>
.badgeClass {
  margin-left: 3px;
}
.badge {
  padding: 8px;
}
/deep/ .form-inline .form-group {
  margin-left: 2px !important;
}
</style>
