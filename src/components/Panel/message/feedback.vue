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
          <div class="col-11">
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
              <tr v-if="feedbackRecords.length === 0">
                <td colspan="4" style="text-align: center">暂无意见</td>
              </tr>
              <tr v-for="(object,index) in feedbackRecords">
                <th scope="row">{{index+1}}</th>
                <td v-for="value in object">
                  {{value}}
                </td>
                <td>
                  <button class="btn btn-info btn-sm" @click="getFeedbackDetail(index)">详情</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-1"></div>
        </div>
      </div>

      <!--feedback detail-->
      <div class="modal fade" id="feedbackModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
           aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="infoModalLabel">公告详情</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" style="text-align: center" v-show="loading">
              加载中...
            </div>
            <div class="modal-body" v-show="!loading">
              <div id="feedback-detail">
                <div class="row">
                  <div class="col-4"><strong>意见ID：</strong>{{feedbackDetail.feedbackId}}</div>
                  <div class="col-4"><strong>标题：</strong>{{feedbackDetail.feedbackTitle}}</div>
                  <div class="col-4"><strong>提交日期：</strong>{{feedbackDetail.createDate}}</div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <label for="feedback-content"><strong>意见内容：</strong></label>
                    <div id="feedback-content" class="col-12" v-html="feedbackDetail.feedbackContent" style="border-style: solid"></div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-10"></div>
                  <div class="col-2">
                    <button type="button" class="btn btn-danger btn-sm" @click="deleteSwitchOn">删除</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            </div>
          </div>
        </div>
      </div>

      <!--delete confirm-->
      <div class="modal" tabindex="-1" role="dialog" id="delConfirmModal">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">删除确认</h5>
            </div>
            <div class="modal-body">
              <p>确认删除？该操作不可恢复</p>
              <!--<div class="status-info">{{uploadStatus}}</div>-->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger"
                      :class="{disabled:hasClicked}" @click="submitDeleteFeedback">确定</button>
              <button type="button" class="btn btn-secondary"
                      :class="{disabled:hasClicked}" @click="deleteSwitchOff">取消</button>
            </div>
          </div>
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
      feedbackRecords: [],
      feedbackRecordId: [],
      feedbackDetail: {
        feedbackId: '',
        feedbackTitle: '',
        feedbackContent: '',
        createDate: ''
      },
      loading: true,
      hasClicked: false,
      detailIndex: -1
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
  },
  methods: {
    getFeedbackList () {
      this.checkSession().then(response => {
        if (response) {
          this.axios.get(this.getAPI() + '/feedback/list').then(response => {
            this.feedbackRecords = []
            this.feedbackRecordId = []
            for (let i = 0; i < response.data.length; i++) {
              let temp = {
                feedbackTitle: response.data[i].feedbackTitle,
                createDate: this.dateTimeTrim(response.data[i].createDate)
              }
              this.feedbackRecordId.push(response.data[i].feedbackId)
              this.feedbackRecords.push(temp)
            }
          }, response => {
            console.log('Get Failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    getFeedbackDetail (index) {
      this.checkSession().then(response => {
        let postData = { feedbackId: this.feedbackRecordId[index] }
        if (response) {
          this.detailIndex = index
          $('#feedbackModal').modal('show')
          this.loading = true
          this.axios.post(this.getAPI() + '/feedback/detail', postData).then(response => {
            this.feedbackDetail.feedbackId = response.data.feedbackId
            this.feedbackDetail.feedbackTitle = response.data.feedbackTitle
            this.feedbackDetail.feedbackContent = response.data.feedbackContent
            this.feedbackDetail.createDate = this.dateTimeTrim(response.data.createDate)
            this.loading = false
          }, response => {

          })
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    deleteSwitchOn () {
      $('#delConfirmModal').modal({
        backdrop: 'static'
      })
    },
    deleteSwitchOff () {
      if (this.hasClicked) {
        return
      }
      $('#delConfirmModal').modal('hide')
    },
    submitDeleteFeedback () {
      if (this.hasClicked) {
        return
      }
      this.hasClicked = true
      this.checkSession().then(response => {
        if (response) {
          let postData = {
            feedbackId: this.feedbackDetail.feedbackId
          }
          this.axios.post(this.getAPI() + '/feedback/delete', postData).then(response => {
            if (response.data === 100) {
              $('#delConfirmModal').modal('hide')
              $('#feedbackModal').modal('hide')
              this.feedbackRecords.splice(this.detailIndex, 1)
              this.feedbackRecordId.splice(this.detailIndex, 1)
              this.feedbackDetail = {}
              alert('删除成功')
            } else if (response.data === 200) {
              alert('删除失败，请重试')
            } else if (response.data === -999) {
              alert('服务器错误，请重试')
            }
          }, response => {
            console.log('delete feedback post failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
      this.hasClicked = false
    },
    dateTimeTrim (datetime) {
      return this.$moment(datetime).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  beforeMount () {
    this.getFeedbackList()
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

  #feedback-detail button{
    float: right;
    margin-top: 10px ;
    margin-right: 5px;
  }

  #feedback-list button{
    margin-right: 5px;
  }

</style>
