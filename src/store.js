import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      navname: 'noname',
      online: false
    }
  },
  mutations: {
    setUser () {
      const user = JSON.parse(localStorage.getItem('user'))
      this.state.user.navname = user.username
      this.state.user.online = true
    },
    setDefaultUser () {
      localStorage.clear()
      this.state.user.navname = 'noname'
      this.state.user.online = false
    }
  },
  getters: {
    getNavname (state) {
      return state.user.navname
    },
    getOnline (state) {
      return state.user.online
    }
  },
  actions: {

  }
})
