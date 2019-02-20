<template>
  <div id="option-list">
    <div id="side-bar-title">
      安全监控
    </div>
    <ul class="list-group parent-list-group">
      <li class="list-group-item" data-toggle="collapse" href="#collapseExample">First item</li>
      <ul class="list-group collapse children-list-group" id="collapseExample">
        <li class="list-group-item">Third item</li>
        <li class="list-group-item">Third item</li>
      </ul>
      <li class="list-group-item">Second item</li>
      <li class="list-group-item">Third item</li>
      <li class="list-group-item">Third item</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
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
