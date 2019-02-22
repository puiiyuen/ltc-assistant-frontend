<template>
  <b-container fluid>
    <div id="panel-detail">
      <h2>员工管理</h2>
      <p>请选择在左侧选取</p>
    </div>

  </b-container>
</template>

<script>
export default {
  name: 'Panel',
  data () {
    return {}
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
