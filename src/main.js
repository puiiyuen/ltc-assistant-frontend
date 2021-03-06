import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import util from './util/util'
import BootstrapVue from 'bootstrap-vue'
import palette from './util/palette.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueMoment from 'vue-moment'
import VueAMap from 'vue-amap'
import VueFroala from 'vue-froala-wysiwyg'
import jQuery from 'jquery'
import VCharts from 'v-charts'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('font-awesome/css/font-awesome.css')
require('froala-editor/js/languages/zh_cn')
require('froala-editor/css/froala_style.min.css')

window.$ = jQuery

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(util)
Vue.use(palette)
Vue.use(VueMoment)
Vue.use(VueAMap)
Vue.use(VueFroala)
Vue.use(VCharts)

Vue.config.productionTip = false
Vue.config.devtools = true
axios.defaults.withCredentials = true
axios.defaults.timeout = 15000

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

VueAMap.initAMapApiLoader({
  key: '59b3f2490ff8de81a4f04dac4b366d21',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar',
    'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    try {
      checkSession().then(response => {
        if (response) { // 获取当前是否online
          next()
        } else {
          next({
            name: 'login',
            params: { toPath: to.params.toPath }
          })
        }
      })
    } catch (e) {
      console.error(e)
      next({ name: 'error' })
    }
  } else {
    next()
  }
})

async function checkSession () {
  let isOnline = false
  await axios.get(Vue.prototype.getAPI() + '/session').then(response => {
    if (response.data === 300) {
      isOnline = true
    }
  }, response => {
    console.log('get failed')
    console.log(response.data)
  })
  return isOnline
}
