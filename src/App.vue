<template>
  <div id="app">
    <Navbar/>
    <router-view/>
  </div>

</template>

<script>

import Navbar from './components/Navbar'
import * as lang from 'vuejs-datepicker/src/locale'
export default {
  name: 'App',
  components: { Navbar },
  data () {
    return {
      moveInDate: '',
      language: lang
    }
  },
  methods: {
  },
  created () {
    this.axios.get(this.getAPI() + '/session').then(response => {
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
