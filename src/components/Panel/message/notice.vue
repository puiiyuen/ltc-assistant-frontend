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
          <div class="col-2">
              <div class="form-group">
                <label for="new-notice-title">公告标题</label>
                <input id="new-notice-title" type="text" class="form-control" aria-describedby="inputGroup-sizing-sm">
              </div>
          </div>
          <div class="col-10"></div>
        </div>
        <div class="row">
          <div class="col-10">
            <label for="notice-editor">公告内容</label>
            <div id="notice-editor">
              <quill-editor v-model="content"
                            ref="myQuillEditor"
                            :options="editorOption"
              >
              </quill-editor>
            </div>
            <div class="row">
              <div class="col-10"></div>
              <div class="col-2">
                <button type="button" class="btn btn-danger">重置</button>
                <button type="button" class="btn btn-primary">提交</button>
              </div>
            </div>
          </div>
          <div class="col-2"></div>
        </div>
      </div>

      <label for="current-notices"><strong>当前展示公告</strong></label>
      <div id="current-notices">
        <div class="row">
          <div class="col-10">
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
          <div class="col-2"></div>
        </div>
      </div>

      <label for="old-notices"><strong>过去公告</strong></label>
      <div id="old-notices">
        <div class="row">
          <div class="col-10">
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
  name: 'notice',
  components: {
    LoginModal
  },
  data () {
    return {
      content: '',
      editorOption: {
        placeholder: '输入公告',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'align': [] }],
            ['image']
          ]
        }
      },
      oldRecords: [{
        title: '最新活动最新活动最新活动最新活动最新活动最新活动最新活动',
        createDate: '2019-03-15 15:30:15',
        updateDate: '2019-03-15 15:30:15'
      },
      {
        title: '最新活动最新活动最新活动最新活动最新活动最新活动最新活动',
        createDate: '2019-03-15 15:30:15',
        updateDate: '2019-03-15 15:30:15'
      }],
      currentRecords: [
        {
          title: '最新活动最新活动最新活动最新活动最新活动最新活动最新活动',
          createDate: '2019-03-15 15:30:15',
          updateDate: '2019-03-15 15:30:15'
        }
      ]
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
