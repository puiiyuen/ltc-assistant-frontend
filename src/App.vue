<template>
  <div id="app">
    <Navbar v-show="!hideNavBar"/>
    <!-- Position it -->
    <div style="position: absolute; top: 60px; right: 0; z-index: 9999">
      <!-- Then put toasts within -->
      <div id="incident-toast" class="toast fade" role="alert" data-autohide="false" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="mr-auto">紧急状况</strong>
          <small class="text-muted">{{alertTime}}</small>
          <button @click="closeToast" type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">
          <div @click="closeToast">
            <router-link :to="{name: 'monitor', params:{toPath:'monitor'}}" @click="closeToast">发生紧急状况，请前往处理</router-link>
          </div>
        </div>
      </div>
    </div>
    <router-view/>
  </div>

</template>

<script>

import Navbar from './components/Navbar'
import $ from 'jquery'
export default {
  name: 'App',
  components: { Navbar },
  data () {
    return {
      timer: 0,
      incidentId: -1,
      alertTime: this.$moment().format('HH:mm'),
      hideNavBar: false
    }
  },
  computed: {
    isOnline () {
      return this.$store.getters.getOnline
    }
  },
  watch: {
    isOnline () {
      if (this.$store.getters.getOnline) {
        this.timer = setInterval(() => {
          this.getIncidentAlert()
        }, 5000)
      }
    },

    '$route.name' (newVal) {
      let routerName = ['notice1', 'notice2', 'notice3']
      this.hideNavBar = routerName.indexOf(newVal) !== -1
    }
  },
  methods: {
    stateSet () {
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
    },
    switchOnToast () {
      this.alertTime = this.$moment().format('HH:mm')
      $('#incident-toast').toast('show')
    },
    closeToast () {
      $('#incident-toast').toast('hide')
    },
    getIncidentAlert () {
      let postData = {
        incidentId: this.incidentId
      }
      this.axios.post(this.getAPI() + '/security/alert', postData).then(response => {
        let n = response.data.length
        if (n > 0) {
          this.switchOnToast()
          this.incidentId = response.data[n - 1].incidentId
        }
      }, response => {
        console.log('get alert failed')
        console.log(response)
      })
    }
  },
  created () {
    this.stateSet()
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>

</style>
