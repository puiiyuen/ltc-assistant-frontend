<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div id="panel-title">
            <h4><strong>意见采集</strong></h4>
          </div>
        </div>
      </div>

      <label for="feedback-list"><strong>意见列表</strong></label>
      <div id="feedback-list">
        <div class="row">
          <div class="col-10">
            <table class="table table-hover table-responsive-lg">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">意见标题</th>
                <th scope="col">提交日期</th>
                <th scope="col">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(object,index) in feedbackRecords">
                <th scope="row">{{index+1}}</th>
                <td v-for="value in object">
                  {{value}}
                </td>
                <td>
                  <button class="btn btn-info btn-sm" >详情</button>
                  <button class="btn btn-danger btn-sm" >删除</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-2"></div>
        </div>
      </div>

      <!--login modal-->
      <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
           aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-md" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="loginModalLabel">会话超时</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div id="loginModalBody" class="modal-body">
              <LoginModal/>
            </div>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
import $ from 'jquery'
import LoginModal from '@/components/LoginModal'
export default {
  name: 'feedback',
  components: {
    LoginModal
  },
  data () {
    return {
      feedbackRecords: [{
        title: '食宿费用过高',
        createDate: '2019-03-31 15:15:20'
      }]
    }
  },
  computed: {
    isOnline () {
      return this.$store.getters.getOnline
    }
  },
  watch: {
    isOnline () {
      if (this.$store.getters.getOnline) {
        $('#loginModal').modal('hide')
      }
    }
  }
}
</script>

<style scoped>
  #loginModalBody {
    height: 450px;
  }

  #panel-title {
    padding: 20px 0;
  }

  #feedback-list button{
    margin-right: 5px;
  }

</style>
