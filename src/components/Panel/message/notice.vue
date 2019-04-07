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
                <button type="button" class="btn btn-danger" @click="resetNewNotice">重置</button>
                <button type="button" class="btn btn-primary" @click="submitNewNotice">提交</button>
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
                <th scope="col">发布日期</th>
                <th scope="col">更新日期</th>
                <th scope="col">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(object,index) in currentRecords">
                <th scope="row">{{index+1}}</th>
                <td v-for="value in object">
                  {{value}}
                </td>
                <td>
                  <button class="btn btn-primary btn-sm" >下架</button>
                  <button class="btn btn-warning btn-sm" >修改</button>
                  <button class="btn btn-danger btn-sm" >删除</button>
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
                <th scope="col">发布日期</th>
                <th scope="col">更新日期</th>
                <th scope="col">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(object,index) in oldRecords">
                <th scope="row">{{index+1}}</th>
                <td v-for="value in object">
                  {{value}}
                </td>
                <td>
                  <button class="btn btn-primary btn-sm" >公布</button>
                  <button class="btn btn-warning btn-sm" >修改</button>
                  <button class="btn btn-danger btn-sm" >删除</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-1"></div>
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
        zIndex: 1,
        colorsHEXInput: false, // 关闭16进制色值
        toolbarSticky: true, // 操作栏是否自动吸顶
        requestWithCredentials: true
      },
      newNotice: {
        title: '',
        content: ''
      },
      oldRecords: [],
      oldRecordId: [],
      currentRecords: [],
      currentRecordId: []
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
    submitNewNotice () {
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

#new-notice button{
  float: right;
  margin-top: 10px ;
  margin-right: 5px;
}

#current-notices button,#old-notices button{
  margin-right: 5px;
}

</style>
