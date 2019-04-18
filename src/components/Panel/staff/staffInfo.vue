<template>
  <div id="info-table">
    <div id="panel-title"><h5><strong>基本信息</strong></h5></div>
    <div id="function-bar">
      <div id="operation-bar">
        <button class="btn btn-success" @click="getAllStaffInfo">全部员工</button>
        <button class="btn btn-primary" data-toggle="modal" data-target="#addStaffModal">新增员工</button>
      </div>
      <form class="form-inline my-2 my-lg-0" id="search-bar" @submit="searchStaff">
        <label for="search-input" style="padding-right:15px">搜索员工:</label>
        <input id="search-input" class="form-control mr-sm-2" type="search"
               placeholder="输入ID、姓名" aria-label="Search" required v-model="searchInput">
        <button class="btn btn-success my-2 my-sm-0" type="submit">搜索</button>
      </form>
    </div>

    <!--info table-->
    <table class="table table-hover table-responsive-lg">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">ID</th>
        <th scope="col">姓名</th>
        <th scope="col">性别</th>
        <th scope="col">出生年月</th>
        <th scope="col">电话</th>
        <th scope="col">在岗状态</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="staffs.length === 0" style="text-align: center">
        <td colspan="7">暂无员工</td>
      </tr>
      <tr v-for="(object,index) in staffs" @click="getDetail(index)" id="main-table-tr"
          data-toggle="tooltip" title="点击查看详情">
        <th scope="row">{{index+1}}</th>
        <td v-for="value in object">
          {{value}}
        </td>
      </tr>
      </tbody>
    </table>

    <!--detail modal-->
    <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="infoModalLabel">详细信息</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="text-align: center" v-show="loading">
            {{loadingStatus}}
          </div>
          <div class="modal-body" style="text-align: center" v-show="!loading">
            <div id="staff-info">
              <table class="table table-bordered">
                <tbody>
                <tr>
                  <th scope="row">ID:</th>
                  <td>{{staffDetail.id}}</td>
                  <th scope="row">姓名</th>
                  <td>{{staffDetail.name}}</td>
                  <th scope="row">性别</th>
                  <td>{{staffDetail.sex}}</td>
                  <th scope="row">出生年月</th>
                  <td>{{staffDetail.dob}}</td>
                  <td rowspan="3"><img :src="staffDetail.photoUrl" alt="照片" style="width: 100px"></td>
                </tr>
                <tr>
                  <th scope="row">身份证号</th>
                  <td>{{staffDetail.goverId}}</td>
                  <th scope="row">电话</th>
                  <td>{{staffDetail.phone}}</td>
                  <th scope="row">邮箱</th>
                  <td>{{staffDetail.email}}</td>
                  <th scope="row">入职日期</th>
                  <td>{{staffDetail.moveInDate}}</td>
                </tr>
                <tr>
                  <th scope="row">常用地址</th>
                  <td colspan="7">{{staffDetail.address}}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div id="dateTime">
              <table class="table table-bordered">
                <tbody>
                <tr>
                  <th scope="row">资料创建日期</th>
                  <td>{{staffDetail.createDate}}</td>
                  <th scope="row">资料更新日期</th>
                  <td>{{staffDetail.updateDate}}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="row action-button">
              <div class="col-4">
                <button class="btn btn-primary btn-sm" data-dismiss="modal" @click="modifyStaffSwitchOn">修改资料</button>
                <button class="btn btn-danger btn-sm" @click="destroyStaffSwitchOn">注销账户</button>
              </div>
              <div class="col-4"></div>
              <div class="col-4"></div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>

    <!--add staff modal-->
    <div class="modal fade" id="addStaffModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addStaffModalLabel">添加员工</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit="submitNewStaff" @reset="onReset">
              <label for="newStaffInfo"><strong>员工信息</strong></label>
              <div id="newStaffInfo">
                <div class="form-row">
                  <div class="form-group col-3">
                    <label for="newStaffName">姓名</label>
                    <input type="text" class="form-control" id="newStaffName"
                           placeholder="姓名" required v-model="newStaff.name"
                           :class="{'is-invalid':formFormat.name}">
                    <div class="invalid-feedback">
                      名字长度不可超过10字符
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label for="newStaffSex">性别</label>
                    <select class="form-control" id="newStaffSex" v-model="newStaff.sex" required
                            :class="{'is-invalid':formFormat.sex}">
                      <option value="" selected>选择</option>
                      <option value="MALE">男</option>
                      <option value="FEMALE">女</option>
                    </select>
                    <div class="invalid-feedback">
                      请选择性别
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label for="newStaffDob">出生年月</label>
                    <datepicker id="newStaffDob" format="yyyy-MM-dd" :language="language.zh"
                                placeholder="选择日期" v-model="newStaff.dob" :required="true"
                                :clear-button="true" :bootstrap-styling="true" :typeable="true"
                                :input-class="{'is-invalid':formFormat.dob}"/>
                  </div>
                  <div class="form-group col-3">

                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-3">
                    <label for="newStaffGovId">身份证号码</label>
                    <input type="text" class="form-control" id="newStaffGovId"
                           placeholder="身份证号码" required v-model="newStaff.goverId"
                           :class="{'is-invalid':formFormat.goverId}">
                    <div class="invalid-feedback">
                      身份证号码应为18位数字
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label for="newStaffPhone">电话</label>
                    <input type="text" class="form-control" id="newStaffPhone"
                           placeholder="电话号码" v-model="newStaff.phone"
                           :class="{'is-invalid':formFormat.phone}" required>
                    <div class="invalid-feedback">
                      电话号码应为座机或11位手机号
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label for="newStaffEmail">邮箱</label>
                    <input type="email" class="form-control" id="newStaffEmail"
                           placeholder="邮箱" v-model="newStaff.email"
                           :class="{'is-invalid':formFormat.email}" required>
                    <div class="invalid-feedback">
                      邮箱格式不正确
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label for="newStaffMoveInDate">入职日期</label>
                    <datepicker id="newStaffMoveInDate" format="yyyy-MM-dd" :language="language.zh"
                                placeholder="选择日期" v-model="newStaff.moveInDate" :required="true"
                                :clear-button="true" :bootstrap-styling="true" :typeable="true"
                                :input-class="{'is-invalid':formFormat.moveInDate}"/>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-12">
                    <label for="newStaffAddress">常用地址</label>
                    <input type="text" class="form-control" id="newStaffAddress"
                           placeholder="常用地址" required v-model="newStaff.address"
                           :class="{'is-invalid':formFormat.address}">
                    <div class="invalid-feedback">
                      地址长度不可超过100个字符
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-12">
                    <label for="newStaffPhoto">添加照片</label>
                    <input type="file" id="newStaffPhoto" @change="getFile" required>
                  </div>
                </div>
              </div>

              <div>
                <button class="btn btn-primary" type="submit" v-bind:class="{disabled:hasClicked}">提交</button>
                <button class="btn btn-danger" type="reset" v-bind:class="{disabled:hasClicked}">重置</button>
                <div class="status-info">{{uploadStatus}}</div>
              </div>
            </form>
            <b-alert
              :show="dismissCountDown"
              dismissible
              fade
              variant="success"
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged"
            >
              操作成功！窗口将在 {{ dismissCountDown }} 秒后关闭...
            </b-alert>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>

    <!--modify staff modal-->
    <div class="modal fade" id="modifyStaffModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modifyStaffModalLabel">修改资料</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit="submitModStaff" @reset="onReset">
              <label for="modifyStaffInfo"><strong>员工信息</strong></label>
              <div id="modifyStaffInfo">
                <div class="form-row">
                  <div class="form-group col-3">
                    <label for="modifyStaffName">姓名</label>
                    <input type="text" class="form-control" id="modifyStaffName"
                           placeholder="姓名" required v-model="modifyStaff.name"
                           :class="{'is-invalid':formFormat.name}">
                    <div class="invalid-feedback">
                      名字长度不可超过10字符
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label for="modifyStaffSex">性别</label>
                    <select class="form-control" id="modifyStaffSex" v-model="modifyStaff.sex" required
                            :class="{'is-invalid':formFormat.sex}">
                      <option value="" selected>选择</option>
                      <option value="MALE">男</option>
                      <option value="FEMALE">女</option>
                    </select>
                    <div class="invalid-feedback">
                      请选择性别
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label for="modifyStaffDob">出生年月</label>
                    <datepicker id="modifyStaffDob" format="yyyy-MM-dd" :language="language.zh"
                                placeholder="选择日期" v-model="modifyStaff.dob" :required="true"
                                :clear-button="true" :bootstrap-styling="true" :typeable="true"
                                :input-class="{'is-invalid':formFormat.dob}"/>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-3">
                    <label for="modifyStaffGovId">身份证号码</label>
                    <input type="text" class="form-control" id="modifyStaffGovId"
                           placeholder="身份证号码" required v-model="modifyStaff.goverId"
                           :class="{'is-invalid':formFormat.goverId}">
                    <div class="invalid-feedback">
                      身份证号码应为18位数字
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label for="modifyStaffPhone">电话</label>
                    <input type="text" class="form-control" id="modifyStaffPhone"
                           placeholder="电话号码" v-model="modifyStaff.phone"
                           :class="{'is-invalid':formFormat.phone}">
                    <div class="invalid-feedback">
                      电话号码应为座机或11位手机号
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label for="modifyStaffEmail">邮箱</label>
                    <input type="email" class="form-control" id="modifyStaffEmail"
                           placeholder="邮箱" v-model="modifyStaff.email"
                           :class="{'is-invalid':formFormat.email}">
                    <div class="invalid-feedback">
                      邮箱格式不正确
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label for="modifyStaffMoveInDate">入职日期</label>
                    <datepicker id="modifyStaffMoveInDate" format="yyyy-MM-dd" :language="language.zh"
                                placeholder="选择日期" v-model="modifyStaff.moveInDate" :required="true"
                                :clear-button="true" :bootstrap-styling="true" :typeable="true"
                                :input-class="{'is-invalid':formFormat.moveInDate}"/>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-12">
                    <label for="modifyStaffAddress">常用地址</label>
                    <input type="text" class="form-control" id="modifyStaffAddress"
                           placeholder="常用地址" required v-model="modifyStaff.address"
                           :class="{'is-invalid':formFormat.address}">
                    <div class="invalid-feedback">
                      家庭地址长度不可超过100个字符
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-12">
                    <label for="modifyStaffPhoto">添加照片</label>
                    <input type="file" id="modifyStaffPhoto" @change="getModStaffPhoto">
                  </div>
                </div>
              </div>
              <div>
                <button class="btn btn-primary" type="submit" v-bind:class="{disabled:hasClicked}">提交</button>
                <button class="btn btn-danger" type="reset" v-bind:class="{disabled:hasClicked}">重置</button>
                <div class="status-info">{{uploadStatus}}</div>
              </div>
            </form>
            <b-alert
              :show="dismissCountDown"
              dismissible
              fade
              variant="success"
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged"
            >
              操作成功！窗口将在 {{ dismissCountDown }} 秒后关闭...
            </b-alert>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>

    <!--delete confirmation-->
    <div class="modal" tabindex="-1" role="dialog" id="delConfirmModal">
      <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">注销确认</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>确认注销用户？该操作不可恢复</p>
            <div class="status-info">{{uploadStatus}}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger"
                    :class="{disabled:hasClicked}" @click="submitDesStaff">确定</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    :class="{disabled:hasClicked}">取消</button>
          </div>
        </div>
      </div>
    </div>

    <!--login modal-->
    <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-md" role="document">
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
import Datepicker from 'vuejs-datepicker/dist/vuejs-datepicker.min'
import * as lang from 'vuejs-datepicker/src/locale'

export default {
  name: 'staffInfo',
  components: {
    Datepicker,
    LoginModal
  },
  data () {
    return {
      staffs: [],
      staffDetail: {},
      newStaff: {
        name: '',
        sex: '',
        dob: '',
        goverId: '',
        phone: '',
        email: '',
        address: '',
        photo: '',
        moveInDate: ''
      },
      modifyStaff: {
        name: '',
        sex: '',
        dob: '',
        goverId: '',
        phone: '',
        email: '',
        address: '',
        photo: '',
        moveInDate: ''
      },
      formFormat: {
        name: false,
        sex: false,
        dob: false,
        goverId: false,
        phone: false,
        email: false,
        address: false,
        photo: false,
        moveInDate: false
      },
      loading: true,
      loadingStatus: '加载中...',
      uploadStatus: '',
      dismissSecs: 3,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      hasClicked: false,
      language: lang,
      searchInput: ''
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
        this.getAllStaffInfo()
      }
    },
    dismissCountDown () {
      if (this.dismissCountDown === 0) {
        $('#addStaffModal').modal('hide')
        $('#modifyStaffModal').modal('hide')
        $('#delConfirmModal').modal('hide')
      }
    }
  },
  methods: {
    getAllStaffInfo () {
      this.checkSession().then(response => {
        if (response) {
          this.axios.get(this.getAPI() + '/staff/list').then(response => {
            this.staffs = []
            for (let i = 0; i < response.data.length; i++) {
              let temp = {
                id: response.data[i].staffId,
                name: response.data[i].name,
                sex: this.sexCheck(response.data[i].sex),
                dob: this.dateTrim(response.data[i].dob),
                phone: response.data[i].phone,
                status: this.statusConvert(response.data[i].status)
              }
              this.staffs.push(temp)
            }
          }, response => {
            console.log('Get Failed')
            console.log(response.data)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    getDetail (index) {
      this.checkSession().then(response => {
        if (response) {
          $('#infoModal').modal('show')
          let postData = { staffId: this.staffs[index].id }
          this.axios.post(this.getAPI() + '/staff/detail', postData).then(response => {
            this.staffDetail = {
              id: response.data.staffId,
              name: response.data.name,
              sex: this.sexCheck(response.data.sex),
              dob: this.dateTrim(response.data.dob),
              phone: response.data.phone,
              address: response.data.address,
              email: response.data.email,
              goverId: response.data.goverId,
              moveInDate: this.dateTrim(response.data.moveInDate),
              photoUrl: response.data.photoUrl,
              createDate: this.dateTimeTrim(response.data.createDate),
              updateDate: this.dateTimeTrim(response.data.updateDate)
            }
            this.loadingStatus = '加载完成'
            this.loading = false
          }, response => {
            if (response.code === 'ECONNABORTED' && response.toString().indexOf('timeout') !== -1) {
              this.loadingStatus = '加载超时，请重试'
            } else {
              console.log('post failed')
              console.log(response)
            }
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    getFile (event) {
      this.newStaff.photo = event.target.files[0]
      if (this.newStaff.photo.type.substring(0, 5) !== 'image') {
        alert('文件格式不正确，请重新选取')
        this.newStaff.photo = ''
        $(event.target).val('')
      } else {
        if (this.newStaff.photo.size > 512000) {
          alert('图像大于500k,请重新选取')
          this.newStaff.photo = ''
          $(event.target).val('')
        }
      }
    },
    getModStaffPhoto (event) {
      this.modifyStaff.photo = event.target.files[0]
      if (this.modifyStaff.photo.type.substring(0, 5) !== 'image') {
        alert('文件格式不正确，请重新选取')
        this.modifyStaff.photo = ''
        $(event.target).val('')
      } else {
        if (this.modifyStaff.photo.size > 512000) {
          alert('图像大于500k,请重新选取')
          this.modifyStaff.photo = ''
          $(event.target).val('')
        }
      }
    },
    submitNewStaff (evt) {
      evt.preventDefault()
      if (this.hasClicked) {
        return
      }
      if (this.checkFormat(this.newStaff)) {
        return
      }
      this.hasClicked = true
      this.checkSession().then(response => {
        if (response) {
          let postPhoto = new FormData()
          postPhoto.append('photo', this.newStaff.photo)
          this.uploadStatus = '正在上传照片...'
          this.axios.post(this.getAPI() + '/staff/upload-photo', postPhoto).then(response => {
            if (response.data.operationStatus === 100) {
              let postData = {
                name: this.newStaff.name,
                sex: this.newStaff.sex,
                dob: this.dateTrim(this.newStaff.dob),
                goverId: this.newStaff.goverId,
                photoUrl: response.data.link,
                phone: this.newStaff.phone,
                email: this.newStaff.email,
                address: this.newStaff.address,
                moveInDate: this.dateTrim(this.newStaff.moveInDate)
              }
              this.uploadStatus = '正在上传资料...'
              this.axios.post(this.getAPI() + '/staff/add', postData).then(response => {
                console.log(response.data)
                if (response.data === 100) {
                  this.uploadStatus = ''
                  this.newStaff = {}
                  this.showAlert()
                  this.getAllStaffInfo()
                } else if (response.data === 200) {
                  this.uploadStatus = '上传失败请重试'
                } else if (response.data === -999) {
                  this.uploadStatus = '服务器错误，请稍后尝试'
                }
              }, response => {
                console.log('post photo failed')
                console.log(response.data)
              })
            } else if (response.data === 200) {
              this.uploadStatus = '上传失败请重试'
            } else if (response.data === -999) {
              this.uploadStatus = '服务器错误，请稍后尝试'
            }
          }, response => {
            this.uploadStatus = '上传失败请重试'
            console.log('post info failed')
            console.log(response.data)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
      this.hasClicked = false
    },
    modifyStaffSwitchOn () {
      this.modifyStaff = {}
      this.uploadStatus = ''
      $('#modifyStaffModal').modal('show')
      this.modifyStaff.name = this.staffDetail.name
      if (this.staffDetail.sex === '男') {
        this.modifyStaff.sex = 'MALE'
      } else if (this.staffDetail.sex === '女') {
        this.modifyStaff.sex = 'FEMALE'
      }
      this.modifyStaff.dob = this.staffDetail.dob
      this.modifyStaff.goverId = this.staffDetail.goverId
      this.modifyStaff.phone = this.staffDetail.phone
      this.modifyStaff.email = this.staffDetail.email
      this.modifyStaff.address = this.staffDetail.address
      this.modifyStaff.moveInDate = this.staffDetail.moveInDate
    },
    submitModStaff (evt) {
      evt.preventDefault()
      if (this.hasClicked) {
        return
      }
      if (this.checkFormat(this.modifyStaff)) {
        return
      }
      this.hasClicked = true
      this.uploadStatus = '正在上传资料...'
      this.checkSession().then(response => {
        if (response) {
          if (this.modifyStaff.photo === undefined) {
            let postData = {
              staffId: this.staffDetail.id,
              name: this.modifyStaff.name,
              sex: this.modifyStaff.sex,
              dob: this.dateTrim(this.modifyStaff.dob),
              goverId: this.modifyStaff.goverId,
              phone: this.modifyStaff.phone,
              email: this.modifyStaff.email,
              address: this.modifyStaff.address,
              photoUrl: this.staffDetail.photoUrl,
              moveInDate: this.dateTrim(this.modifyStaff.moveInDate)
            }
            this.axios.post(this.getAPI() + '/staff/modify', postData).then(response => {
              if (response.data === 100) {
                this.uploadStatus = ''
                this.modifyStaff = {}
                this.showAlert()
                $('#modifyStaffPhoto').val('')
                this.getAllStaffInfo()
              } else if (response.data === 200) {
                this.uploadStatus = '上传失败请重试'
              } else if (response.data === -999) {
                this.uploadStatus = '服务器错误，请稍后尝试'
              }
            }, response => {
              this.uploadStatus = '网络连接失败'
              console.log('modify staff post failed')
              console.log(response)
            })
          } else {
            let postPhoto = new FormData()
            postPhoto.append('photo', this.modifyStaff.photo)
            this.uploadStatus = '正在上传照片...'
            this.axios.post(this.getAPI() + '/staff/upload-photo', postPhoto).then(response => {
              let postData = {
                staffId: this.staffDetail.id,
                name: this.modifyStaff.name,
                sex: this.modifyStaff.sex,
                dob: this.dateTrim(this.modifyStaff.dob),
                goverId: this.modifyStaff.goverId,
                phone: this.modifyStaff.phone,
                email: this.modifyStaff.email,
                address: this.modifyStaff.address,
                photoUrl: response.data.link,
                moveInDate: this.dateTrim(this.modifyStaff.moveInDate)
              }
              this.axios.post(this.getAPI() + '/staff/modify', postData).then(response => {
                if (response.data === 100) {
                  this.uploadStatus = ''
                  this.modifyStaff = {}
                  this.showAlert()
                  this.getAllStaffInfo()
                } else if (response.data === 200) {
                  this.uploadStatus = '上传失败请重试'
                } else if (response.data === -999) {
                  this.uploadStatus = '服务器错误，请稍后重试'
                }
              }, response => {
                this.uploadStatus = '网络连接失败'
                console.log('modify staff post failed')
                console.log(response)
              })
            }, response => {
              this.uploadStatus = '网络连接失败'
              console.log('modify staff photo post failed')
              console.log(response)
            })
          }
        } else {
          $('#loginModal').modal('show')
        }
      })
      this.hasClicked = false
    },
    destroyStaffSwitchOn () {
      this.uploadStatus = ''
      $('#delConfirmModal').modal({
        backdrop: 'static'
      })
    },
    submitDesStaff () {
      if (this.hasClicked) {
        return
      }
      this.hasClicked = true
      this.checkSession().then(response => {
        if (response) {
          let postData = {
            staffId: this.staffDetail.id
          }
          this.axios.post(this.getAPI() + '/staff/delete', postData).then(response => {
            if (response.data === 100) {
              this.uploadStatus = '注销成功'
              this.showAlert()// 利用定时器，关闭注销确认对话框
              $('#infoModal').modal('hide')
              this.getAllStaffInfo()
            } else if (response.data === 200) {
              this.uploadStatus = '注销失败，请稍后重试'
            } else if (response.data === -999) {
              this.uploadStatus = '服务器错误，请稍后尝试'
            }
          }, response => {
            this.uploadStatus = '网络连接错误'
            console.log('post destroy failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
      this.hasClicked = false
    },
    searchStaff (evt) {
      evt.preventDefault()
      this.checkSession().then(response => {
        if (response) {
          let searchContent = { 'search': this.searchInput }
          this.axios.post(this.getAPI() + '/staff/search', searchContent).then(response => {
            this.staffs = []
            for (let i = 0; i < response.data.length; i++) {
              let temp = {
                id: response.data[i].staffId,
                name: response.data[i].name,
                sex: this.sexCheck(response.data[i].sex),
                dob: this.dateTrim(response.data[i].dob),
                phone: response.data[i].phone,
                status: this.statusConvert(response.data[i].status)
              }
              this.staffs.push(temp)
            }
          }, response => {
            console.log('search post failed')
            console.log(response.data)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    onReset (evt) {
      evt.preventDefault()
      if (this.hasClicked) {
        return
      }
      this.uploadStatus = ''
      this.newStaff.name = ''
      this.newStaff.sex = ''
      this.newStaff.dob = ''
      this.newStaff.goverId = ''
      this.newStaff.phone = ''
      this.newStaff.email = ''
      this.newStaff.address = ''
      this.newStaff.photo = ''
      this.newStaff.moveInDate = ''
      $('#newStaffPhoto').val('')
    },
    sexCheck (sex) {
      if (sex === 'MALE') {
        return '男'
      } else if (sex === 'FEMALE') {
        return '女'
      } else {
        return 'N/A'
      }
    },
    statusConvert (status) {
      if (status === 0) {
        return '下班'
      } else if (status === 1) {
        return '空闲'
      } else if (status === 2) {
        return '忙碌'
      } else {
        return '未知'
      }
    },
    dateTrim (date) {
      return this.$moment(date).format('YYYY-MM-DD')
    },
    dateTimeTrim (datetime) {
      return this.$moment(datetime).format('YYYY-MM-DD HH:mm:ss')
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    },
    checkFormat (obj) {
      this.formFormat.name = obj.name.length > 10
      this.formFormat.sex = obj.sex.length === 0
      this.formFormat.dob = this.dateTrim(obj.dob) === 'Invalid date'
      this.formFormat.moveInDate = this.dateTrim(obj.moveInDate) === 'Invalid date'
      let goverIdRex = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      this.formFormat.goverId = !goverIdRex.test(obj.goverId)
      let phoneRex = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
      if (obj.phone.length === 0) {
        this.formFormat.phone = false
      } else {
        this.formFormat.phone = !phoneRex.test(obj.phone)
      }
      let emailRex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (obj.email.length === 0) {
        this.formFormat.email = false
      } else {
        this.formFormat.email = !emailRex.test(obj.email)
      }
      this.formFormat.address = obj.address.length > 100
      return this.formFormat.name || this.formFormat.sex || this.formFormat.dob ||
        this.formFormat.goverId || this.formFormat.phone || this.formFormat.email ||
        this.formFormat.address || this.formFormat.moveInDate
    }
  },
  beforeMount () {
    this.getAllStaffInfo()
  }
}
</script>

<style scoped>
  #main-table-tr:hover {
    cursor: pointer;
  }

  #panel-title {
    padding: 20px 0;
    height: 38px;
  }

  #info-table {
    width: 90%;
  }

  #search-bar {
    float: right;
    padding: 20px 0;
  }

  #operation-bar {
    padding: 20px 0;
    float: left;
  }

  #operation-bar button{
    margin-right: 5px;
  }

  #addStaffModal button, #modifyStaffModal button {
    margin-right: 5px;
  }

  #infoModal .action-button button{
    float: left;
    margin-right: 10px;
  }

  #loginModalBody {
    height: 450px;
  }

  .status-info {
    color: red;
    font-size: 13px;
  }

</style>
