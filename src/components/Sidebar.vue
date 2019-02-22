<template>
  <div id="option-list">
    <div id="side-bar-title">操控台</div>
    <ul class="list-group parent-list-group">
      <router-link :to="{name: 'senior', params:{toPath:'senior'}}" tag="li" class="list-group-item" >长者管理 </router-link>
      <router-link :to="{name: 'security', params:{toPath:'security'}}" tag="li" class="list-group-item" >安全监控 </router-link>
      <router-link :to="{name: 'message', params:{toPath:'message'}}" tag="li" class="list-group-item" >消息管理 </router-link>
      <router-link :to="{name: 'staff', params:{toPath:'staff'}}" tag="li" class="list-group-item" >员工管理 </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data () {
    return {
    }
  }
}
</script>

<style scoped>

#side-bar-title{
  color: #FFFFFF;
  padding: 20px 20px;
  font-weight: bolder;
  font-size: 18px;
}

.list-group{
  padding: 0;
}

.list-group-item{
  cursor: pointer;
  border-style: none;
  border-radius: 0;
  color: #bbb;
  font-weight: bold;
}

.parent-list-group .list-group-item{
  background-color: #343a40;
  font-weight: bold;
}

.children-list-group .list-group-item{
  background-color: #262626;
  font-weight: normal;
}

.list-group-item:hover{
  background-color: #6c757d;
  color: #FFFFFF;
}
</style>
