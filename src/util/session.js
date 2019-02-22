exports.install = function (Vue) {
  Vue.prototype.checkSession = function () {
    this.axios.get('http://localhost:8080/session').then(response => {
      if (response.data === 400) {
        console.log('checkSession 400')
        this.$store.commit('setDefaultUser')
        this.$router.push({ name: 'login' })
      }
      if (response.data === 300) {
        console.log('checkSession 300')
        this.$store.commit('setUser')
      }
    }, response => {
      console.log('get failed')
      console.log(response.data)
      this.$router.push({ name: 'error' })
    })
  }
}
