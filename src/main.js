import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import session from './util/session'
import BootstrapVue from 'bootstrap-vue'
import palette from './util/palette.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Datepicker from 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css'

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(session)
Vue.use(palette)
Vue.use(Datepicker)

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
        if (response === true) { // 获取当前是否online
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
  await axios.get('http://localhost:8080/session').then(response => {
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
