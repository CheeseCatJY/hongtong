<template>
  <b-container fluid class="text-white h-screen page-bg">

    <b-row :style="{height:height}">
      <b-col class="box box1-1" cols="7">
        <b-row>
          <b-col class="box box2-1-1" cols="12" :style="{height:height1}">
             <summary-panel class="content"></summary-panel>
          </b-col>
          <b-col class="box box2-1-1" cols="12" :style="{height:height3}">
            <current-chart class="content"></current-chart>
          </b-col>
          <b-col class="box box2-1-2" cols="12" :style="{height:height3}">
            <statistical-report class="content"></statistical-report>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="box box1-2" cols="5">
        <b-row>
          <b-col class="box box2-1-1" cols="12" :style="{height:height2}">
             <warn-chart class="content"></warn-chart>
          </b-col>
          <b-col class="box box2-1-1" cols="12" :style="{height:height5}">
            <constantly-monitored class="content"></constantly-monitored>
          </b-col>
          <b-col class="box box2-1-1" cols="12" :style="{height:height6}">
            <meter-latest-list></meter-latest-list>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row :style="{height:height4}">
      <b-col class="box box3-1" cols="4">
        <pump-list></pump-list>
      </b-col>
      <b-col class="box box3-2" cols="4">
        <pump-house-list></pump-house-list>
      </b-col>
      <b-col class="box box3-2" cols="4">
        <meter-list></meter-list>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import lossChart from './lossChart'
import ConsumptionChange from './consumptionChange'
import TestData from "./testData";
import SummaryPanel from "./summary";
import LossChange from "./lossChange";
import realTimeChart from "./realTimeChart";
import StatisticalReport from "./statisticalReport";
import ConstantlyMonitored from "./constantlyMonitored";
import CurrentChart from "./currentChart";

import WarnChart from './warnChart';
import PumpList from './pumpList'
import MeterLatestList from "./meterLatestList";
import PumpHouseList from "./pumpHouseList";
import MeterList from "./meterList";

export default {
  components: {
    MeterList,
    PumpHouseList,
    StatisticalReport,
    LossChange,
    TestData,
    SummaryPanel,
    lossChart,
    ConsumptionChange,
    realTimeChart,
    ConstantlyMonitored,
    CurrentChart,
    WarnChart,
    PumpList,
    MeterLatestList,
  },
  data() {
    return {
      height: '72vh',
      height1: '20vh',
      height2: '37vh',
      height3: '26vh',
      height4: '28vh',
      height5: '20vh',
      height6: '15vh',
    }
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
