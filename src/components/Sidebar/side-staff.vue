<template>
  <b-container fluid>
    <b-row>
      <b-col cols="2">
        <b-row>
          <b-col cols="8" id="side-bar" v-bind:style="{height:dashHeight}" class="bg-dark">
            <div id="option-list">
              <router-link :to="{name: 'staff', params:{toPath:'staff'}}"
                           tag="div" id="side-bar-title">员工管理</router-link>
              <ul class="list-group parent-list-group">
                <router-link :to="{name: 'staff', params:{toPath:'staff'}}" class="list-group-item"
                             tag="li">概览</router-link>
                <router-link :to="{name: 'staffInfo', params:{toPath:'staffInfo'}}" class="list-group-item"
                             tag="li" active-class="link-selected">基本信息</router-link>
                <router-link :to="{name: 'assignment', params:{toPath:'assignment'}}" class="list-group-item"
                             tag="li" active-class="link-selected">工作安排</router-link>
                <router-link :to="{name: 'staffMovement', params:{toPath:'staffMovement'}}" class="list-group-item"
                             tag="li" active-class="link-selected">人事调动</router-link>
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
