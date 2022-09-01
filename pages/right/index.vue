<template>
  <b-container fluid class="text-white h-screen page-bg">

    <b-row :style="{height:height1}">
      <b-col class="box box1-1">
        <summary-panel class="content"></summary-panel>
      </b-col>
    </b-row>

    <b-row :style="{height:height2}">
      <b-col class="box box2-1">
        <line-chart class="content"></line-chart>
      </b-col>
      <b-col class="box box2-2">
        <read-chart class="content"></read-chart>
      </b-col>
    </b-row>

    <b-row :style="{height:height3}">
      <b-col class="box box3-1">
        <meter-history-chart class="content"></meter-history-chart>
      </b-col>
    </b-row>

    <b-row :style="{height:height4}">
      <b-col class="box box3-2">
        <read-warn-list class="content"></read-warn-list>
      </b-col>
      <b-col class="box box3-3">
        <work-list class="content"></work-list>
      </b-col>
      <b-col class="box box3-4">
        <warn-list class="content"></warn-list>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import SummaryPanel from './summary';
import ReadChart from './readChart';
import MeterChart from './meterChart';
import MeterHistoryChart from './meterHistoryChart';
import ReadWarnList from './readWarnList';
import WorkList from './workList';
import WarnList from './warnList';
import PressureChart from './pressureChart';
import PartLeakChart from './partLeakChart';
import lineChart from './lineChart';

export default {
  data() {
    return {
      height1: '20vh',
      height2: '42vh',
      height3: '20vh',
      height4: '18vh',
    }
  },
  components: {
    SummaryPanel,
    ReadChart,
    MeterChart,
    MeterHistoryChart,
    ReadWarnList,
    WorkList,
    WarnList,
    PressureChart,
    PartLeakChart,
    lineChart,
  },
  methods: {},
  created() {

  },
  destroyed() {

  }
}
</script>

<style scoped>

</style>
