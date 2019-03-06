<template>
  <div id="info-table">
    <div id="panel-title"><h5><strong>基本信息</strong></h5></div>
    <div id="function-bar">
      <div id="operation-bar">
        <button class="btn btn-primary" data-toggle="modal" data-target="#addResidentModal">添加住户</button>
      </div>
      <form class="form-inline my-2 my-lg-0" id="search-bar">
        <label for="search-input" style="padding-right:15px">搜索住户:</label>
        <input id="search-input" class="form-control mr-sm-2" type="search" placeholder="输入ID、姓名、床号" aria-label="Search"
               required>
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
        <th scope="col">床号</th>
        <th scope="col">电话</th>
        <th scope="col">紧急联系人</th>
        <th scope="col">紧急联系电话</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(object,index) in residents" @click="getDetail(index)" id="main-table-tr">
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
      <div class="modal-dialog modal-xl" role="document">
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
            <table class="table table-bordered">
              <tbody>
              <tr>
                <th scope="row">ID:</th>
                <td>{{residentDetail.id}}</td>
                <th scope="row">姓名</th>
                <td>{{residentDetail.name}}</td>
                <th scope="row">性别</th>
                <td>{{residentDetail.sex}}</td>
                <th scope="row">出生年月</th>
                <td>{{residentDetail.dob}}</td>
                <td><img :src="residentDetail.photoUrl" alt="照片" style="width: 100px"></td>
                <!--<td rowspan="3"><img src="../../../assets/graduate.jpg" alt="照片" style="width: 100px"></td>-->
              </tr>
              <tr>
                <th scope="row">床号</th>
                <td>{{residentDetail.bed}}</td>
                <th scope="row">身份证号</th>
                <td>{{residentDetail.goverId}}</td>
                <th scope="row">电话</th>
                <td>{{residentDetail.phone}}</td>
                <th scope="row">邮箱</th>
                <td>{{residentDetail.email}}</td>

              </tr>
              <tr>
                <th scope="row">家庭住址</th>
                <td colspan="7">{{residentDetail.address}}</td>
              </tr>
              <tr>
                <th scope="row">联系人</th>
                <td>{{residentDetail.egName}}</td>
                <th scope="row">联系电话</th>
                <td>{{residentDetail.egPhone}}</td>
                <th scope="row">入院日期</th>
                <td>{{residentDetail.moveInDate}}</td>
                <th scope="row">离院日期</th>
                <td colspan="2">{{residentDetail.moveOutDate}}</td>
              </tr>
              <tr>
                <th scope="row" colspan="9">既往病史</th>
              </tr>
              <tr>
                <td colspan="9" id="medical-text">{{residentDetail.medicalHistory}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>

    <!--add resident modal-->
    <div class="modal fade" id="addResidentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addResidentModalLabel">添加住户</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit="submitNewRes" @reset="onReset">
              <label for="newResInfo"><strong>住户信息</strong></label>
              <div id="newResInfo">
                <div class="form-row">
                  <div class="form-group col-3">
                    <label for="newResName">姓名</label>
                    <input type="text" class="form-control" id="newResName"
                           placeholder="姓名" required v-model="newResident.name">
                  </div>
                  <div class="form-group col-3">
                    <label for="newResSex">性别</label>
                    <select class="form-control" id="newResSex" v-model="newResident.sex">
                      <option value="" selected>选择</option>
                      <option value="MALE">男</option>
                      <option value="FEMALE">女</option>
                    </select>
                  </div>
                  <div class="form-group col-3">
                    <label for="newResDob">出生年月</label>
                    <input type="text" class="datepicker form-control" id="newResDob" data-provide="datepicker"
                           data-date-format="yyyy-mm-dd" placeholder="选择日期" required v-model="newResident.dob">
                  </div>
                  <div class="form-group col-3">
                    <label for="newResBed">床号</label>
                    <input type="text" class="form-control" id="newResBed"
                           placeholder="床号" required v-model="newResident.bed">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-3">
                    <label for="newResGovId">身份证号码</label>
                    <input type="text" class="form-control" id="newResGovId"
                           placeholder="身份证号码" required v-model="newResident.goverId">
                  </div>
                  <div class="form-group col-3">
                    <label for="newResPhone">电话</label>
                    <input type="text" class="form-control" id="newResPhone"
                           placeholder="电话号码" v-model="newResident.phone">
                  </div>
                  <div class="form-group col-3">
                    <label for="newResEmail">邮箱</label>
                    <input type="email" class="form-control" id="newResEmail"
                           placeholder="邮箱" v-model="newResident.email">
                  </div>
                  <div class="form-group col-3">
                    <label for="newResMoveInDate">入住日期</label>
                    <input type="text" class="datepicker form-control" id="newResMoveInDate" data-provide="datepicker"
                           data-date-format="yyyy-mm-dd" placeholder="选择日期" required v-model="newResident.moveInDate">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-12">
                    <label for="newResAddress">家庭地址</label>
                    <input type="text" class="form-control" id="newResAddress"
                           placeholder="家庭地址" required v-model="newResident.address">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-12">
                    <label for="newResMedicalHis">既往病史</label>
                    <input type="text" class="form-control" id="newResMedicalHis"
                           placeholder="病史" required v-model="newResident.medicalHistory">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-12">
                    <label for="newResPhoto">添加照片</label>
                    <input type="file" id="newResPhoto" @change="getFile" required>
                  </div>
                </div>
              </div>
              <label for="newResFamily"><strong>家属信息</strong></label>
              <div id="newResFamily">
                <div class="form-row">
                  <div class="form-group col-4">
                    <label for="newResFamName">姓名</label>
                    <input type="text" class="form-control" id="newResFamName"
                           placeholder="姓名" required v-model="newResident.famName">
                  </div>
                  <div class="form-group col-4">
                    <label for="newResFamPhone">电话</label>
                    <input type="text" class="form-control" id="newResFamPhone"
                           placeholder="电话" required v-model="newResident.famPhone">
                  </div>
                  <div class="form-group col-4">
                    <label for="newResFamEmail">邮箱</label>
                    <input type="email" class="form-control" id="newResFamEmail"
                           placeholder="邮箱" v-model="newResident.famEmail">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-12">
                    <label for="newResFamAddress">常用地址</label>
                    <input type="text" class="form-control" id="newResFamAddress"
                           placeholder="地址" required v-model="newResident.famAddress">
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
              variant="warning"
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged"
            >
              添加成功！窗口将在 {{ dismissCountDown }} 秒后关闭...
            </b-alert>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
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

export default {
  name: 'baseInfo',
  components: {
    LoginModal
  },
  data () {
    return {
      residents: [],
      residentDetail: {},
      newResident: {
        name: '',
        sex: '',
        dob: '',
        bed: '',
        goverId: '',
        phone: '',
        email: '',
        address: '',
        medicalHistory: '',
        photo: '',
        moveInDate: '',
        famName: '',
        famPhone: '',
        famEmail: '',
        famAddress: ''
      },
      loading: true,
      loadingStatus: '加载中...',
      uploadStatus: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      hasClicked: false
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
        if (this.residents.length === 0) {
          this.getAllResidentInfo()
        }
      }
    },
    dismissCountDown () {
      if (this.dismissCountDown === 0) {
        $('#addResidentModal').modal('hide')
      }
    }
  },
  methods: {
    getAllResidentInfo () {
      this.checkSession().then(response => {
        if (response) {
          this.axios.get('http://localhost:8080/resident/baseInfo').then(response => {
            for (var i = 0; i < response.data.length; i++) {
              var temp = {
                id: response.data[i].resId,
                name: response.data[i].name,
                sex: this.sexCheck(response.data[i].sex),
                dob: this.dateTrim(response.data[i].dob),
                bed: response.data[i].numOfBed,
                phone: response.data[i].phone,
                egName: response.data[i].egName,
                egPhone: response.data[i].egPhone
              }
              this.residents.push(temp)
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
          let postData = { resId: this.residents[index].id }
          this.axios.post('http://localhost:8080/resident/detailInfo', postData, { timeout: 15000 }).then(response => {
            this.residentDetail = {
              id: response.data.resId,
              name: response.data.name,
              sex: this.sexCheck(response.data.sex),
              dob: this.dateTrim(response.data.dob),
              bed: response.data.numOfBed,
              phone: response.data.phone,
              egName: response.data.egName,
              egPhone: response.data.egPhone,
              address: response.data.address,
              email: response.data.email,
              goverId: response.data.goverId,
              medicalHistory: response.data.medicalHistory,
              moveInDate: this.dateTrim(response.data.moveInDate),
              moveOutDate: this.dateTrim(response.data.moveOutDate),
              photoUrl: response.data.photoUrl
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
    sexCheck (sex) {
      if (sex === 'MALE') {
        return '男'
      } else if (sex === 'FEMALE') {
        return '女'
      } else {
        return 'N/A'
      }
    },
    dateTrim (date) {
      return date.substring(0, 10)
    },
    getFile (event) {
      this.newResident.photo = event.target.files[0]
      if (this.newResident.photo.type.substring(0, 5) !== 'image') {
        alert('文件格式不正确，请重新选取')
        this.newResident.photo = ''
        $(event.target).val('')
      } else {
        if (this.newResident.photo.size > 512000) {
          alert('图像大于500k,请重新选取')
          this.newResident.photo = ''
          $(event.target).val('')
        }
      }
    },
    submitNewRes (evt) {
      evt.preventDefault()
      this.hasClicked = true
      this.checkSession().then(response => {
        if (response) {
          let postPhoto = new FormData()
          postPhoto.append('photo', this.newResident.photo)
          let postData = {
            name: this.newResident.name,
            sex: this.newResident.sex,
            dob: this.newResident.dob,
            bed: this.newResident.bed,
            goverId: this.newResident.goverId,
            phone: this.newResident.phone,
            email: this.newResident.email,
            address: this.newResident.address,
            medicalHistory: this.newResident.medicalHistory,
            moveInDate: this.newResident.moveInDate,
            famName: this.newResident.famName,
            famPhone: this.newResident.famPhone,
            famEmail: this.newResident.famEmail,
            famAddress: this.newResident.famAddress
          }
          this.uploadStatus = '正在上传资料...'
          this.axios.post('http://localhost:8080/resident/add-resident', postData).then(response => {
            if (response.data === 100) {
              this.uploadStatus = '正在上传照片...'
              this.axios.post('http://localhost:8080/resident/upload-photo', postPhoto).then(response => {
                console.log(response.data)
                if (response.data === 100) {
                  this.uploadStatus = ''
                  this.newResident.name = ''
                  this.newResident.sex = ''
                  this.newResident.dob = ''
                  this.newResident.bed = ''
                  this.newResident.goverId = ''
                  this.newResident.phone = ''
                  this.newResident.email = ''
                  this.newResident.address = ''
                  this.newResident.photo = ''
                  this.newResident.moveInDate = ''
                  this.newResident.famName = ''
                  this.newResident.famPhone = ''
                  this.newResident.famEmail = ''
                  this.newResident.famAddress = ''
                  this.showAlert()
                }
              }, response => {
                console.log('post photo failed')
                console.log(response.data)
              })
            }
          }, response => {
            console.log('post info failed')
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
      this.newResident.name = ''
      this.newResident.sex = ''
      this.newResident.dob = ''
      this.newResident.bed = ''
      this.newResident.goverId = ''
      this.newResident.phone = ''
      this.newResident.email = ''
      this.newResident.address = ''
      this.newResident.photo = ''
      this.newResident.moveInDate = ''
      this.newResident.famName = ''
      this.newResident.famPhone = ''
      this.newResident.famEmail = ''
      this.newResident.famAddress = ''
      $('#newResPhoto').val('')
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    }
  },
  beforeMount () {
    this.getAllResidentInfo()
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

  #infoModal #medical-text {
    text-align: left;
  }

  #addResidentModal button {
    margin-right: 5px;
  }

  #loginModalBody {
    height: 450px;
  }

  .status-info {
    color: red;
    font-size: 13px;
  }

</style>
