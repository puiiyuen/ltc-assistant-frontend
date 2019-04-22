import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      navname: 'noname',
      adminId: -1,
      online: false
    }
  },
  mutations: {
    setUser () {
      const user = JSON.parse(localStorage.getItem('user'))
      this.state.user.navname = user.username
      this.state.user.adminId = user.userId
      this.state.user.online = true
    },
    setDefaultUser () {
      localStorage.clear()
      this.state.user.navname = 'noname'
      this.state.user.adminId = -1
      this.state.user.online = false
    }
  },
  getters: {
    getNavname (state) {
      return state.user.navname
    },
    getOnline (state) {
      return state.user.online
    },
    getAdminId (state) {
      return state.user.adminId
    }
  },
  actions: {

  }
})
