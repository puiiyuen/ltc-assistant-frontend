exports.install = function (Vue) {
  Vue.prototype.checkSession = function () {
    let pushPage = 'error'
    this.axios.get('http://localhost:8080/session').then(response => {
      console.log(response.data)
      if (response.data === 400) {
        pushPage = 'login'
      } else if (response.data === 300) {
        pushPage = 'dashboard'
      } else {
        pushPage = 'error'
      }
      this.$router.push({ name: pushPage })
    }, response => {
      console.log('get failed')
      console.log(response.data)
    })
  }
}
