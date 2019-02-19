import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import session from './util/session'
import BootstrapVue from 'bootstrap-vue'
import palette from './util/palette.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(session)
Vue.use(palette)

Vue.config.productionTip = false
Vue.config.devtools = true

axios.defaults.withCredentials = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
