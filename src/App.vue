<template>
  <div id="app">
    <Navbar/>
    <div id="Navbar-height"></div>
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
    this.checkSession()
  }

}
</script>

<style>
#Navbar-height{
  height: 56px;
}
</style>
