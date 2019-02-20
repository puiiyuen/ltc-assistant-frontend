<template>
  <nav class="navbar navbar-expand-lg navbar-dark rich-black-background">
    <a class="navbar-brand" href="#">
      <img src="../assets/logo.png" alt="Logo" style="width: 30px"/>
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#">总览 </a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
             aria-haspopup="true" aria-expanded="false">
            所有功能
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </li>
      </ul>
      <span class="navbar-text">欢迎使用智慧助手</span>
      <div class="btn-group" id="user-center">
        <span class="navbar-text dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{username}}
        </span>
        <div class="dropdown-menu dropdown-menu-right">
          <a class="dropdown-item" href="#">个人中心</a>
          <a class="dropdown-item" href="#">注销</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      username: 'Patrick'
    }
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
