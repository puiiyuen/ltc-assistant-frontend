<template>
  <b-container fluid>
    <b-row>
      <b-col cols="2">
        <b-row>
          <b-col cols="8" id="side-bar" v-bind:style="{height:dashHeight}" class="bg-dark">
            <div id="option-list">
              <router-link :to="{name: 'security', params:{toPath:'security'}}"
                           tag="div" id="side-bar-title">安全监控</router-link>
              <ul class="list-group parent-list-group">
                <router-link :to="{name: 'security', params:{toPath:'security'}}" class="list-group-item"
                             tag="li">概览</router-link>
                <router-link :to="{name: 'SOS', params:{toPath:'SOS'}}" class="list-group-item"
                             tag="li" active-class="link-selected">状况处理</router-link>
                <!--<router-link :to="{name: 'warning', params:{toPath:'warning'}}" class="list-group-item"-->
                             <!--tag="li" active-class="link-selected">安全警告</router-link>-->
                <router-link :to="{name: 'secSetting', params:{toPath:'secSetting'}}" class="list-group-item"
                             tag="li" active-class="link-selected">安全设置</router-link>
              </ul>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="10" id="panel" v-bind:style="{height:dashHeight}">
        <router-view/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import './sidebar-css.css'
export default {
  name: 'side-senior',
  data () {
    return {
      dashHeight: (document.documentElement.clientHeight - 60) + 'px'
    }
  },
  created () {
    // this.checkSession()
  },
  mounted () {
    const that = this // 'this' cannot be used directly
    window.onresize = function () {
      that.dashHeight = (document.documentElement.clientHeight - 60) + 'px'
    }
  }
}
</script>

<style scoped>

</style>
