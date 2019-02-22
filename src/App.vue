<template>
  <div id="app">
    <Navbar/>
    <router-view/>
  </div>

</template>

<script>

import Navbar from './components/Navbar'
export default {
  name: 'App',
  components: { Navbar },
  data () {
    return {

    }
  },
  methods: {
  },
  created () {
    this.axios.get('http://localhost:8080/session').then(response => {
      if (response.data === 300) {
        console.log('App online')
        this.$store.commit('setUser')
      } else {
        this.$store.commit('setDefaultUser')
      }
    }, response => {
      console.log('get online status failed')
      console.log(response.data)
    })
  }
}
</script>

<style>

</style>
