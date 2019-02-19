<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col cols="2" id="side-bar" v-bind:style="{height:dashHeight}" class="default-primary-color">
          <Sidebar/>
        </b-col>
        <b-col cols="10" id="panel" v-bind:style="{height:dashHeight}">
          <Panel/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar'
import Panel from '../components/Panel'
export default {
  name: 'Dashboard',
  data () {
    return {
      dashHeight: (document.documentElement.clientHeight - 56) + 'px'
    }
  },
  components: { Panel, Sidebar },
  created () {
    this.checkSession()
  },
  mounted () {
    const that = this // 'this' cannot be used directly
    window.onresize = function () {
      that.dashHeight = (document.documentElement.clientHeight - 56) + 'px'
    }
  }
}
</script>

<style scoped>

#side-bar{
  overflow-y: auto;
  padding: 0;
}
#panel{
  overflow-y: auto;
}
</style>
