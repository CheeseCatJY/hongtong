<template>
  <div class="plate">
    <div class="theme">
      <div class="title">实时数据列表</div>
    </div>
    <div class="list">
      <b-table :items="items" sort-by="time" sort-desc :fields="fields" small borderless
               table-variant="#ffffff" tbody-tr-class="table-tr" thead-tr-class="thead-tr">
        <template #cell(dataTime)="{item}">
          <span>{{ $fmt.time(item.data.timemillis, 'MM-DD HH:mm:ss') }}</span>
        </template>
        <template #cell(deviceName)="{item}">
          <b-badge :variant="item.type=='流量'?'primary':'warning'">{{ item.type }}</b-badge>
          <div style="width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap; display: inline-block; vertical-align: middle;">{{ item.deviceName }}</div>
        </template>
        <template #cell(value)="{item}">
          <span>{{ item.data['40001']? item.data['40001']:item.data['YL01']}}</span>
        </template>

      </b-table>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex";
  export default {
    name: 'workList',
    data() {
      return {
        items: [],
        allData: [],
        index: 0,
        fields: [
          {
            key: 'dataTime',
            label: '时间',
            sortable: true,
            thStyle:{width:'30%'}
          },
          {
            key: 'deviceName',
            label: '地址',
            sortable: true,
            thStyle:{width:'50%'}
          },
          {
            key: 'value',
            label: '值',
            sortable: true,
          }
        ],
      }
    },
    methods: {
      ...mapActions({
        getCurrentFlowData: 'ht/currentFlowData',
        getCurrentPressureData: 'ht/currentPressureData',
      }),
      async initData() {
        this.allData = await this.getCurrentFlowData()
        this.allData = this.allData.concat(await this.getCurrentPressureData())
        this.allData = this.allData.sort((a,b) => b.data.timemillis - a.data.timemillis)
        this.refresh()
      },
      refresh() {
        if (this.index+8 >= this.allData.length) {
          this.index = 0
        }
        this.items = this.allData.slice(this.index, this.index + 8)
        this.index = this.index + 1
      }
    },
    async created() {
      await this.initData()
      let self = this
      setInterval(function () {
        self.refresh()
      }, 3000);
    },
    destroyed() {

    }
  }
</script>

<style lang="less" scoped>
  .title {
    padding-bottom: 10px;
  }

  .list {
    color: #aaaaaa;
    font-size: 0.8rem;

    .item {
      margin-bottom: 0.4rem;
    }
  }
</style>
