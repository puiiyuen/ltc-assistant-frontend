<template>
  <div id="option-list">
    <!--<b-nav vertical class="w-25">-->
      <!--<b-nav-item active>Active</b-nav-item>-->
      <!--<b-nav-item>Link</b-nav-item>-->
      <!--<b-nav-item>Another Link</b-nav-item>-->
      <!--<b-nav-item disabled>Disabled</b-nav-item>-->
    <!--</b-nav>-->
    <ul class="list-group">
      <li class="list-group-item">First item</li>
      <li class="list-group-item">Second item</li>
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

#option-list{
  padding-top:50px;
}
.list-group-item{
  cursor: pointer;
  border-style: none;
  background-color: #2196F3;
  color: #FFFFFF;
  font-weight: bold;
}
.list-group-item:hover{
  background-color: #03A9F4;

}
</style>
