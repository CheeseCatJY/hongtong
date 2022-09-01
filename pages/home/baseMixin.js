export default {
  methods: {
    initLines() {
      this.$store.dispatch('meter/lineList')
    },
  },
  mounted() {
    this.initLines();
  }
}
