<template>
  <b-container fluid>
    <b-row>
      <b-col cols="2">
        <b-row>
          <b-col cols="8" id="side-bar" v-bind:style="{height:dashHeight}" class="bg-dark">
            <div id="option-list">
              <router-link :to="{name: 'senior', params:{toPath:'senior'}}"
                           tag="div" id="side-bar-title">长者管理</router-link>
              <ul class="list-group parent-list-group">
                <router-link :to="{name: 'senior', params:{toPath:'senior'}}" class="list-group-item"
                             tag="li" >概览</router-link>
                <!--<li class="list-group-item" data-toggle="collapse" data-target="#personInfo">住户信息-->
                  <!--<i class="bottom-arrow"></i></li>-->
                <!--<ul class="list-group children-list-group collapse" id="personInfo">-->
                  <router-link :to="{name: 'baseInfo', params:{toPath:'baseInfo'}}" class="list-group-item"
                               tag="li" active-class="link-selected">基本信息</router-link>
                  <router-link :to="{name: 'healthReport', params:{toPath:'healthReport'}}" class="list-group-item"
                               tag="li" active-class="link-selected">健康报告</router-link>
                  <router-link :to="{name: 'bill', params:{toPath:'bill'}}" class="list-group-item"
                               tag="li" active-class="link-selected">个人账单</router-link>
                <!--</ul>-->
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
