<template>
  <b-navbar toggleable="md" type="dark" fixed="top" class="dark-primary-color">

    <!--<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>-->

    <b-navbar-brand href="#">
      <img src="../assets/logo.png" alt="Logo" style="width: 30px"/>
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">

      <b-navbar-nav>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item disabled>欢迎使用智慧助手管控平台</b-nav-item>

      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item-dropdown right>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{user.name}}</em>
          </template>
          <b-dropdown-item href="#">个人信息</b-dropdown-item>
          <b-dropdown-item href="#">注销</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      user: {
        name: 'Patrick'
      }
    }
  }
}
</script>

<style scoped>

</style>
