export default {
  install (Vue) {
    Vue.prototype.checkSession = async function () {
      let online = false
      await this.axios.get(Vue.prototype.getAPI() + '/session').then(response => {
        if (response.data === 400) {
          this.$store.commit('setDefaultUser')
        }
        if (response.data === 300) {
          this.$store.commit('setUser')
          online = true
        }
      }, response => {
        console.log('get failed')
        console.log(response.data)
        this.$router.push({ name: 'error' })
      })
      return online
    }
    Vue.prototype.getAPI = function () {
      // test
      let api = 'http://localhost:8080'
      // live
      // let api = ''
      return api
    }
  }
}
