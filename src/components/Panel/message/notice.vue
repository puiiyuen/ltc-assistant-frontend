<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div id="panel-title">
            <h4><strong>公告板</strong></h4>
          </div>
        </div>
      </div>

      <label for="new-notice"><strong>公告发布</strong></label>
      <div id="new-notice">
        <div class="row">
          <div class="col-4">
              <div class="form-group">
                <label for="new-notice-title">公告标题</label>
                <input id="new-notice-title" type="text" class="form-control"
                       aria-describedby="inputGroup-sizing-sm" v-model="newNotice.title">
              </div>
          </div>
          <div class="col-8"></div>
        </div>
        <div class="row">
          <div class="col-11">
            <label for="notice-editor">公告内容</label>
            <div id="notice-editor">
              <froala :tag="'textarea'" :config="froalaConfig" v-model="newNotice.content"></froala>
            </div>
            <div class="row">
              <div class="col-10"></div>
              <div class="col-2">
                <button type="button" class="btn btn-danger"
                        :class="{disabled:hasClicked}" @click="resetNewNotice">重置</button>
                <button type="button" class="btn btn-primary"
                        :class="{disabled:hasClicked}" @click="submitNewNotice">提交</button>
              </div>
            </div>
          </div>
          <div class="col-1"></div>
        </div>
      </div>

      <label for="current-notices"><strong>当前展示公告</strong></label>
      <div id="current-notices">
        <div class="row">
          <div class="col-11">
            <table class="table table-hover table-responsive-lg">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">公告标题</th>
                <th scope="col">创建日期</th>
                <th scope="col">更新日期</th>
                <th scope="col">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="currentRecords.length === 0">
                <td colspan="5" style="text-align: center">暂无公告</td>
              </tr>
              <tr v-for="(object,index) in currentRecords">
                <th scope="row">{{index+1}}</th>
                <td v-for="value in object">
                  {{value}}
                </td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="changeStatus(index,true)">下架</button>
                  <button class="btn btn-info btn-sm" @click="getNoticeDetail(index,true)">详情</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-1"></div>
        </div>
      </div>

      <label for="old-notices"><strong>过去公告</strong></label>
      <div id="old-notices">
        <div class="row">
          <div class="col-11">
            <table class="table table-hover table-responsive-lg">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">公告标题</th>
                <th scope="col">创建日期</th>
                <th scope="col">更新日期</th>
                <th scope="col">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="oldRecords.length === 0">
                <td colspan="5" style="text-align: center">暂无公告</td>
              </tr>
              <tr v-for="(object,index) in oldRecords">
                <th scope="row">{{index+1}}</th>
                <td v-for="value in object">
                  {{value}}
                </td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="changeStatus(index,false)">公布</button>
                  <button class="btn btn-info btn-sm" @click="getNoticeDetail(index,false)">详情</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-1"></div>
        </div>
      </div>

      <!--notice detail-->
      <div class="modal fade" id="noticeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
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
              <div id="modify-notice">
                <div class="row">
                  <div class="col-4">
                    <label for="modify-notice-id"><strong>公告ID</strong></label>
                    <input id="modify-notice-id" type="text" class="form-control"
                           aria-describedby="inputGroup-sizing-sm" v-model="modifyNotice.noticeId" readonly>
                  </div>
                  <div class="col-4">
                    <div class="form-group">
                      <label for="modify-notice-title"><strong>公告标题</strong></label>
                      <input id="modify-notice-title" type="text" class="form-control"
                             aria-describedby="inputGroup-sizing-sm" v-model="modifyNotice.title">
                    </div>
                  </div>
                  <div class="col-4"></div>
                </div>
                <div class="row">
                  <div class="col-4"><strong>创建日期：</strong>{{modifyNotice.createDate}}</div>
                  <div class="col-4"><strong>更新日期：</strong>{{modifyNotice.updateDate}}</div>
                  <div class="col-4"></div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <label for="modify-notice-editor"><strong>公告内容</strong></label>
                    <div id="modify-notice-editor">
                      <froala :tag="'textarea'" :config="froalaConfigModal" v-model="modifyNotice.content"></froala>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-10"></div>
                  <div class="col-2">
                    <button type="button" class="btn btn-danger btn-sm"
                            :class="{disabled:hasClicked}" @click="deleteSwitchOn">删除</button>
                    <button type="button" class="btn btn-warning btn-sm"
                            :class="{disabled:hasClicked}" @click="submitModifyNotice">修改</button>
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
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>确认删除公告？该操作不可恢复</p>
              <!--<div class="status-info">{{uploadStatus}}</div>-->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger"
                      :class="{disabled:hasClicked}" @click="submitDeleteNotice">确定</button>
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
  name: 'notice',
  components: {
    LoginModal
  },
  data () {
    return {
      froalaConfig: {
        toolbarButtons: ['undo', 'redo', 'clearFormatting', '|', 'bold', 'italic', 'underline', 'strikeThrough', '|',
          'fontFamily', 'fontSize', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent',
          'indent', 'insertLink', 'insertImage', 'insertTable',
          '|', 'specialCharacters', 'insertHR', 'selectAll', '|', 'print', 'help', 'fullscreen'],
        placeholder: '请填写内容',
        language: 'zh_cn', // 国际化
        // imageMaxSize: 1024 * 1024,
        imageUploadURL: this.getAPI() + '/notice/upload-picture',
        // imageManagerDeleteMethod:'',
        // imageManagerDeleteURL:'',
        colorsHEXInput: false, // 关闭16进制色值
        toolbarSticky: true, // 操作栏是否自动吸顶
        requestWithCredentials: true
      },
      froalaConfigModal: {
        toolbarButtons: ['undo', 'redo', 'clearFormatting', '|', 'bold', 'italic', 'underline', 'strikeThrough', '|',
          'fontFamily', 'fontSize', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent',
          'indent', 'insertLink', 'insertImage', 'insertTable',
          '|', 'specialCharacters', 'insertHR', 'selectAll', '|', 'print', 'help', 'fullscreen'],
        placeholder: '请填写内容',
        language: 'zh_cn', // 国际化
        // imageMaxSize: 1024 * 1024,
        imageUploadURL: this.getAPI() + '/notice/upload-picture',
        // imageManagerDeleteMethod:'',
        // imageManagerDeleteURL:'',
        colorsHEXInput: false, // 关闭16进制色值
        toolbarSticky: true, // 操作栏是否自动吸顶
        requestWithCredentials: true,
        zIndex: 1050
      },
      newNotice: {
        title: '',
        content: ''
      },
      modifyNotice: {
        noticeId: '',
        title: '',
        content: '',
        createDate: '',
        updateDate: ''
      },
      oldRecords: [],
      oldRecordId: [],
      currentRecords: [],
      currentRecordId: [],
      hasClicked: false,
      loading: true,
      modifyIndex: {
        index: '',
        onboard: false
      }
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
        this.getNoticeList()
      }
    }
  },
  methods: {
    getNoticeList () {
      this.getCurrentList()
      this.getOldList()
    },
    getCurrentList () {
      this.checkSession().then(response => {
        if (response) {
          this.axios.get(this.getAPI() + '/notice/current-list').then(response => {
            this.currentRecords = []
            this.currentRecordId = []
            for (let i = 0; i < response.data.length; i++) {
              let temp = {
                noticeTitle: response.data[i].noticeTitle,
                createDate: this.dateTimeTrim(response.data[i].createDate),
                updateDate: this.dateTimeTrim(response.data[i].updateDate)
              }
              this.currentRecordId.push(response.data[i].noticeId)
              this.currentRecords.push(temp)
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
    getOldList () {
      this.checkSession().then(response => {
        if (response) {
          this.axios.get(this.getAPI() + '/notice/old-list').then(response => {
            this.oldRecords = []
            this.oldRecordId = []
            for (let i = 0; i < response.data.length; i++) {
              let temp = {
                noticeTitle: response.data[i].noticeTitle,
                createDate: this.dateTimeTrim(response.data[i].createDate),
                updateDate: this.dateTimeTrim(response.data[i].updateDate)
              }
              this.oldRecordId.push(response.data[i].noticeId)
              this.oldRecords.push(temp)
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
    getNoticeDetail (index, onboard) {
      this.checkSession().then(response => {
        if (response) {
          $('#noticeModal').modal('show')
          let postData
          if (onboard) {
            postData = {
              noticeId: this.currentRecordId[index]
            }
          } else {
            postData = {
              noticeId: this.oldRecordId[index]
            }
          }
          this.loading = true
          this.axios.post(this.getAPI() + '/notice/detail', postData).then(response => {
            this.modifyNotice.noticeId = response.data.noticeId
            this.modifyNotice.title = response.data.noticeTitle
            this.modifyNotice.content = response.data.noticeContent
            this.modifyNotice.createDate = this.dateTimeTrim(response.data.createDate)
            this.modifyNotice.updateDate = this.dateTimeTrim(response.data.updateDate)
            this.loading = false
            this.modifyIndex.index = index
            this.modifyIndex.onboard = onboard
          }, response => {
            console.log('get notice detail failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    submitNewNotice () {
      if (this.hasClicked) {
        return
      }
      if (this.checkFormat(this.newNotice)) {
        alert('公告标题或内容不能为空')
        return
      }
      this.hasClicked = true
      this.checkSession().then(response => {
        if (response) {
          let postData = {
            noticeTitle: this.newNotice.title,
            noticeContent: this.newNotice.content
          }
          this.axios.post(this.getAPI() + '/notice/new', postData).then(response => {
            if (response.data.operationStatus === 100) {
              let temp = {
                noticeTitle: this.newNotice.title,
                createDate: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
                updateDate: this.$moment().format('YYYY-MM-DD HH:mm:ss')
              }
              this.oldRecords.unshift(temp)
              this.oldRecordId.unshift(response.data.noticeId)
              this.resetNewNotice()
            }
          }, response => {
            console.log('notice post failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
      this.hasClicked = false
    },
    submitModifyNotice () {
      if (this.hasClicked) {
        return
      }
      if (this.checkFormat(this.modifyNotice)) {
        alert('公告标题或内容不能为空')
        return
      }
      this.hasClicked = true
      this.checkSession().then(response => {
        if (response) {
          let postData = {
            noticeId: this.modifyNotice.noticeId,
            noticeTitle: this.modifyNotice.title,
            noticeContent: this.modifyNotice.content
          }
          this.axios.post(this.getAPI() + '/notice/modify', postData).then(response => {
            if (response.data === 100) {
              this.modifyNotice.updateDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
              let temp = {
                noticeTitle: this.modifyNotice.title,
                createDate: this.modifyNotice.createDate,
                updateDate: this.modifyNotice.updateDate
              }
              if (this.modifyIndex.onboard) {
                this.currentRecords.splice(this.modifyIndex.index, 1, temp)
                this.currentRecordId.splice(this.modifyIndex.index, 1, this.modifyNotice.noticeId)
              } else {
                this.oldRecords.splice(this.modifyIndex.index, 1, temp)
                this.oldRecordId.splice(this.modifyIndex.index, 1, this.modifyNotice.noticeId)
              }
              alert('修改成功')
            } else if (response.data === 200) {
              alert('操作失败，请重试')
            }
          }, response => {
            console.log('modify notice post failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
      this.hasClicked = false
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
    submitDeleteNotice () {
      if (this.hasClicked) {
        return
      }
      this.hasClicked = true
      this.checkSession().then(response => {
        if (response) {
          let postData = {
            noticeId: this.modifyNotice.noticeId
          }
          this.axios.post(this.getAPI() + '/notice/delete', postData).then(response => {
            if (response.data === 100) {
              $('#delConfirmModal').modal('hide')
              $('#noticeModal').modal('hide')
              if (this.modifyIndex.onboard) {
                this.currentRecords.splice(this.modifyIndex.index, 1)
                this.currentRecordId.splice(this.modifyIndex.index, 1)
              } else {
                this.oldRecords.splice(this.modifyIndex.index, 1)
                this.oldRecordId.splice(this.modifyIndex.index, 1)
              }
              this.modifyNotice = {}
              this.modifyIndex = {}
              alert('删除成功')
            } else if (response.data === 200) {
              alert('删除失败，请重试')
            } else if (response.data === -999) {
              alert('服务器错误，请重试')
            }
          }, response => {
            console.log('delete notice post failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
      this.hasClicked = false
    },
    changeStatus (index, onboard) {
      this.checkSession().then(response => {
        if (response) {
          let postData
          if (onboard) {
            postData = {
              noticeId: this.currentRecordId[index],
              status: 0
            }
          } else {
            postData = {
              noticeId: this.oldRecordId[index],
              status: 1
            }
          }

          this.axios.post(this.getAPI() + '/notice/change-status', postData).then(response => {
            if (response.data === 100) {
              if (onboard) {
                this.oldRecords.unshift(this.currentRecords[index])
                this.oldRecordId.unshift(this.currentRecordId[index])
                this.currentRecords.splice(index, 1)
                this.currentRecordId.splice(index, 1)
              } else {
                this.currentRecords.unshift(this.oldRecords[index])
                this.currentRecordId.unshift(this.oldRecordId[index])
                this.oldRecords.splice(index, 1)
                this.oldRecordId.splice(index, 1)
              }
            } else if (response.data === 200) {
              alert('操作失败，请重试')
            } else if (response.data === -999) {
              alert('服务器错误，请重试')
            }
          }, response => {
            console.log('change status post failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    dateTimeTrim (datetime) {
      return this.$moment(datetime).format('YYYY-MM-DD HH:mm:ss')
    },
    checkFormat (obj) {
      return obj.title === null || obj.title === '' || obj.content === null || obj.content === ''
    },
    resetNewNotice () {
      this.newNotice.title = ''
      this.newNotice.content = ''
    }
  },
  beforeMount () {
    this.getNoticeList()
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

#new-notice button,#modify-notice button{
  float: right;
  margin-top: 10px ;
  margin-right: 5px;
}

#current-notices button,#old-notices button{
  margin-right: 5px;
}

</style>
