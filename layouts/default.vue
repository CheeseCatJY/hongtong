<template>
  <div>
    <Nuxt/>
  </div>
</template>
<script>
export default {
  mounted() {
    window.onresize = () => {
      this.$bus.$emit('window-resize');
    }
  }
}
</script>
<style>

</style>
