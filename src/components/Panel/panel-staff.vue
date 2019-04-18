<template>
  <b-container fluid>
    <div id="panel-detail">
      <h2>员工管理</h2>
      <div class="row">
        <div class="col-6">
          <ve-histogram :data="chartData" :extend="extend"></ve-histogram>
        </div>
        <div class="col-6">
          <ve-histogram :data="chartData" :extend="extend"></ve-histogram>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <ve-histogram :data="chartData" :extend="extend"></ve-histogram>
        </div>
        <div class="col-6">
          <ve-histogram :data="chartData" :extend="extend"></ve-histogram>
        </div>
      </div>
    </div>

  </b-container>
</template>

<script>
export default {
  name: 'Panel',
  data () {
    this.extend = {
      series: {
        label: { show: true, position: 'top' }
      }
    }
    return {
      chartData: {
        columns: ['员工', '空闲', '忙碌', '下班'],
        rows: [
          { '员工': '人员状态分布', '空闲': 1, '忙碌': 3, '下班': 2 }
        ]
      }
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
