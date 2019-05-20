<template>
  <div>
    <div class="row">
      <div class="col-12">
        <h5 style="text-align: center">{{title}}</h5>
        <hr>
      </div>
    </div>
    <div class="row">
      <div class="col-12" v-html="notice"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notice3',
  data () {
    return {
      title: '',
      notice: ''
    }
  },
  methods: {
    displayNotice () {
      let postData = { 'position': 3 }
      this.axios.post(this.getAPI() + '/notice/display', postData).then(response => {
        this.title = response.data.noticeTitle
        this.notice = response.data.noticeContent
      }, response => {
        console.log(response)
      })
    }
  },
  beforeMount () {
    this.displayNotice()
  }
}
</script>

<style scoped>

</style>
