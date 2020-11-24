declare module '*.vue' {
  import Vue from 'vue'

  // Place any unimported plugins here:
  import '@nuxtjs/axios'
  import '@nuxtjs/auth'
  import 'cookie-universal-nuxt'

  export default Vue
}
