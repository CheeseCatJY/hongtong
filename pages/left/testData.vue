<template>
  <div class="plate h-full">
    <b-container fluid class="text-white h-screen">
      <b-row class="item">
        <b-col cols="6">
          <div class="item-content">
            <div class="panel-top">昨日供水量</div>
            <div class="panel-bottom">
              <span class="blue bold">{{data.yesterdayWaterSupply}}</span>
              <span class="unit">㎡</span>
            </div>
          </div>
        </b-col>
        <b-col cols="6">
          <div class="item-content">
            <div class="panel-top">昨日同比</div>
            <div class="panel-bottom">
              <span class="red bold">{{data.yesterdayCompared}}</span>
              <span class="unit">㎡</span>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row class="item">
        <b-col cols="3">
        </b-col>
        <b-col cols="6">
          <div class="item-content">
            <div class="panel-top">今日供水量</div>
            <div class="panel-bottom">
              <span class="red bold">{{data.todayWaterSupply}}</span>
              <span class="unit">㎡</span>
            </div>
          </div>
        </b-col>
        <b-col cols="3">
        </b-col>
      </b-row>
      <b-row class="item">
        <b-col cols="6">
          <div class="item-content">
            <div class="panel-top">瞬时流量</div>
            <div class="panel-bottom">
              <span class="green bold">{{data.instantaneousFlow}}</span>
              <span class="unit">㎡/h</span>
            </div>
          </div>
        </b-col>
        <b-col cols="6">
          <div class="item-content">
            <div class="panel-top">出厂压力</div>
            <div class="panel-bottom">
              <span class="red bold">{{data.outletPressure}}</span>
              <span class="unit">MPa</span>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row class="item">
        <b-col cols="6">
          <div class="item-content">
            <div class="panel-top">余氯</div>
            <div class="panel-bottom"><span class="green bold">{{data.chlorineContent}}</span>
              <span class="unit">mg/L</span></div>
          </div>
        </b-col>
        <b-col cols="6">
          <div class="item-content">
            <div class="panel-top">COD含量</div>
            <div class="panel-bottom"><span class="green bold">{{data.CODContent}}</span>
              <span class="unit">mg/L</span></div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        data: {
          "yesterdayWaterSupply": '',
          "yesterdayCompared": '',
          "todayWaterSupply": '',
          "instantaneousFlow": '',
          "outletPressure": '',
          "chlorineContent": '',
          "CODContent": '',
        }
      }
    },
    methods: {},
    async created() {
      this.data = await this.$axios.$get('/data/testData.json')
    },
    destroyed() {

    }
  }
</script>

<style scoped>
  .item {
    height: 6.5vh;
  }

  .plate {
    padding-top: 30px;
  }

  .item-content {

  }
  .item-content-center {
    text-align: center;
  }


  .panel-top {
    font-size: 14px;
    margin-bottom:-7px;
    color: #CCCCCC;
  }

  .panel-bottom {
    font-size: 22px;
  }
</style>
