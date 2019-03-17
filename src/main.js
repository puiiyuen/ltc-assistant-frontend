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

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(util)
Vue.use(palette)
Vue.use(VueMoment)

Vue.config.productionTip = false
Vue.config.devtools = true
axios.defaults.withCredentials = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

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
      console.log('online ' + response.data)
      isOnline = true
    }
  }, response => {
    console.log('get failed')
    console.log(response.data)
  })
  return isOnline
}
