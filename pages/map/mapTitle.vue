<template>
  <div class="head">
    <h1 class="title"></h1>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {},
  mounted() {

  },
  destroyed() {

  }
}
</script>

<style lang="less" scoped>
.head {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: auto;
  padding: 2rem;
  font-size: 1rem;
  z-index: 1;

  .title {
    text-align: center;
    color: red;
    letter-spacing: 1.7rem;
    font-size: 5.5rem;
    font-weight: bold;
  }
}
</style>
