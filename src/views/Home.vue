<template>
  <div>
    <h1>欢迎使用智慧助手</h1>
    <div id="card-container">
      <div class="card-deck">
        <router-link :to="{name: 'senior', params:{toPath:'senior'}}"
                     tag="div" class="card border-primary">
          <div class="card-img-container">
            <img src="../assets/home/senior.png" class="card-img-top" alt="senior"
                 style="background-color: #007bff; padding: 10px;">
          </div>
          <div class="card-body">
            <h5 class="card-title">长者管理</h5>
            <p class="card-text">在住长者的信息管理</p>
          </div>
        </router-link>
        <router-link :to="{name: 'security', params:{toPath:'security'}}"
                     tag="div" class="card border-danger">
          <div class="card-img-container">
            <img src="../assets/home/security.png" class="card-img-top" alt="security"
                 style="background-color: #dc3545;padding: 10px;">
          </div>
          <div class="card-body">
            <h5 class="card-title">安全监控</h5>
            <p class="card-text">实时监测长者安全状态</p>
          </div>
        </router-link>
        <router-link :to="{name: 'message', params:{toPath:'message'}}"
                     tag="div" class="card border-info">
          <div class="card-img-container">
            <img src="../assets/home/message.png" class="card-img-top" alt="message"
                 style="background-color: #17a2b8; padding: 25px">
          </div>
          <div class="card-body">
            <h5 class="card-title">消息管理</h5>
            <p class="card-text">发布公告，查看住户意见反馈</p>
          </div>
        </router-link>
        <router-link :to="{name: 'staff', params:{toPath:'staff'}}"
                     tag="div" class="card border-warning">
          <div class="card-img-container">
            <img src="../assets/home/staff.png" class="card-img-top" alt="staff"
                 style="background-color: #ffc107; padding: 20px">
          </div>
          <div class="card-body">
            <h5 class="card-title">员工管理</h5>
            <p class="card-text">提供人员调动安排等基本管理</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
  h1 {
    padding: 60px 0;
    font-weight: bold;
    text-align: center;
  }

  #card-container {
    width: 60%;
    margin: auto;
  }

  .card-deck {
    padding: 10px 0;
  }

  .card-title {
    font-weight: bold;
  }

  .card{
    height: 380px;
  }

  .card:hover {
    cursor: pointer;
  }

</style>
