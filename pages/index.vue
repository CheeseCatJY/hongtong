<template>
  <b-container fluid class="text-white h-screen page-bg">
    <b-row class="text-lg font-bold shadow text-4xl p-8">
      <b-col>
        <div class="text-center" @dblclick="showForm = !showForm">
          洪洞智慧水务大屏
        </div>
      </b-col>
      <b-col>
        <div class="text-center">
          {{ now }}
        </div>
      </b-col>
    </b-row>

    <b-form v-if="showForm">
      <b-form-group label="服务器地址:" label-for="baseUrl">
        <b-form-input
          id="baseUrl"
          v-model="baseUrl"
          placeholder="请输入服务器地址"
          required></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-button type="button" variant="primary" @click="saveBaseUrl">保存</b-button>
      </b-form-group>
    </b-form>

    <b-row class="mt-40">
      <b-col class="mb-2" md="4">
        <b-link :href="url('/left')" target="_left">
          <div class="h-96 flex justify-center items-center bg-gray-500 shadow rounded">
            <div class="text-4xl">左侧屏</div>
          </div>
        </b-link>
      </b-col>
      <b-col class="mb-2" md="4">
        <b-link :href="url('/map')" target="_center">
          <div class="h-96 flex justify-center items-center bg-gray-500 shadow rounded">
            <div class="text-4xl">中间屏</div>
          </div>
        </b-link>
      </b-col>
      <b-col class="mb-2" md="4">
        <b-link :href="url('/right')" target="_right">
          <div class="h-96 flex justify-center items-center bg-gray-500 shadow rounded">
            <div class="text-4xl">右侧屏</div>
          </div>
        </b-link>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import dayjs from 'dayjs';

const baseUrl = '';

export default {
  components: {},
  data() {
    return {
      now: '',
      baseUrl: '',
      showForm: false,
    }
  },
  methods: {
    startClock() {
      this.now = dayjs(Date.now()).format('YYYY年M月D日 HH:mm:ss');
    },
    url(href) {
      return this.baseUrl + href;
    },
    saveBaseUrl() {
      localStorage.setItem('baseUrl', this.baseUrl);
    },
  },
  mounted() {
    this.baseUrl = localStorage.getItem('baseUrl') || baseUrl;
  },
  created() {
    this.timeIndex = setInterval(this.startClock, 1000)
  },
  destroyed() {
    clearInterval(this.timeIndex)
  },
}
</script>

<style scoped>
.page-bg {
  background-color: #152137;
  position: relative;
}
</style>
