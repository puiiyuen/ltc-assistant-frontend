<template>
  <b-container fluid>
    <div id="panel-detail">
      <h2>操控台</h2>
      <p>请选择左侧菜单功能进行操作</p>
    </div>

  </b-container>
</template>

<script>
export default {
  name: 'Panel',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  #panel-detail {
    padding: 10px 0;
  }
  #panel-detail h2{
    font-weight: bold;
    font-size: 24px;
  }
</style>
