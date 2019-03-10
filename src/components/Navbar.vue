<template>
  <div>
  <nav class="navbar navbar-expand-lg navbar-dark rich-black-background">
    <router-link :to="{name:'home'}" class="navbar-brand">
      <img src="../assets/logo.png" alt="Logo" style="width: 30px"/>
    </router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link :to="{name:'home'}" class="nav-link">总览 </router-link>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
             aria-haspopup="true" aria-expanded="false">
            所有功能
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <router-link :to="{name: 'senior', params:{toPath:'senior'}}" class="dropdown-item" >长者管理 </router-link>
            <router-link :to="{name: 'security', params:{toPath:'security'}}" class="dropdown-item" >安全监控 </router-link>
            <router-link :to="{name: 'message', params:{toPath:'message'}}" class="dropdown-item" >消息管理 </router-link>
            <router-link :to="{name: 'staff', params:{toPath:'staff'}}" class="dropdown-item" >员工管理 </router-link>
          </div>
        </li>
      </ul>
      <span class="navbar-text">智慧助手 v0.1.0</span>
      <div class="btn-group" id="user-center"  v-show="!online">
        <router-link :to="{name: 'login'}" tag="span" class="navbar-text">登陆管理系统</router-link>
      </div>
      <div class="btn-group" id="user-center"  v-show="online">
        <span class="navbar-text dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{username}}
        </span>
        <div class="dropdown-menu dropdown-menu-right" >
          <!--<router-link :to="{name: 'dashboard'}" class="dropdown-item" >个人中心 </router-link>-->
          <a class="dropdown-item" @click="logout">登出账户</a>
        </div>
      </div>
    </div>
  </nav>

</div>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
    }
  },
  computed: {
    username () {
      return this.$store.getters.getNavname
    },
    online () {
      return this.$store.getters.getOnline
    }
  },
  methods: {
    logout () {
      this.axios.get('http://localhost:8080/logout').then(response => {
        if (response.data === 100) {
          this.$store.commit('setDefaultUser')
          console.log('Logout Successful')
          this.$router.push({ name: 'home' })
        } else {
          this.$store.commit('setDefaultUser')
        }
      }, response => {
        console.log('get failed logout failed')
        console.log(response.data)
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style scoped>

.dropdown-menu{
  border-radius: 0;
  background-color: #262626;
  color: #bbb;
}
.dropdown-item{
  border-radius: 0;
  color: #bbb;
}
.dropdown-item:hover{
  background-color: #6c757d;
  color: #fff;
}
#user-center{
  padding-left: 15px;
}

#user-center:hover{
  cursor: pointer;
}

</style>
