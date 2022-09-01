export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  server: {
    host: '0.0.0.0', // default: 0
    port: 4001 // default: 3000
  },

  // Target: https://go.nuxtjs.dev/config-target
  // target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '洪洞智慧水务大屏',
    htmlAttrs: {
      lang: 'zh-cn'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '/Cesium/Widgets/widgets.css' },
    ],
    script: [
      // {src: '//api.map.baidu.com/api?ak=gsgw6ce8LzsD9oRRHfKgpqCshjNyEGaL&v=3.0'}
      // {src: '//api.map.baidu.com/api?ak=gsgw6ce8LzsD9oRRHfKgpqCshjNyEGaL&v=3.0'}
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/styles/base.less',
    '~/assets/styles/common.less',
    'element-ui/lib/theme-chalk/index.css'
    // '~/assets/styles/element-variables.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/mixin',
    { src: '@/plugins/element-ui', ssr: true }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/tailwindcss',
    // 'nuxt-windicss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    browserBaseURL: '',
    credentials: true,
    proxyHeaders: true,
    proxy: true,
  },

  proxy: {
    '/api/ht/': {
      target: 'http://59.48.126.250:9009',
      changeOrigin: true,
      pathRewrite: { '^/api/ht/': '/' },
    },
    '/api/nr/': {
      target: 'http://nr.frp.vfoxs.com',
      changeOrigin: true,
      pathRewrite: { '^/api/nr/': '/' },
    },
    '/api/lapp/': {
      target: 'https://open.ys7.com',
      changeOrigin: true,
    },
    '/api/gis/': {
      target: 'http://admin.vfoxs.com',
      changeOrigin: true,
      pathRewrite: { '^/api/gis/': '/' },
    },
    '/api/auth/': {
      target: 'http://auth.vfoxs.com',
      changeOrigin: true,
      pathRewrite: { '^/api/auth/': '/' },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  env: {
    CESIUM_BASE_URL: JSON.stringify('')
  }


}
