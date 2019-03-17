<template>
  <div id="info-table">
    <div id="panel-title"><h5><strong>健康报告</strong></h5></div>
    <div id="function-bar">
      <div id="operation-bar">
        <button class="btn btn-success" @click="getAllHealthInfo">全部住户</button>
      </div>
      <!--@submit="searchResident"-->
      <form class="form-inline my-2 my-lg-0" id="search-bar" @submit="searchHealthReport">
        <label for="search-input" style="padding-right:15px">搜索住户:</label>
        <input id="search-input" class="form-control mr-sm-2" type="search"
               placeholder="输入ID、姓名、床号" aria-label="Search" required v-model="searchInput">
        <button class="btn btn-success my-2 my-sm-0" type="submit">搜索</button>
      </form>
    </div>

    <!--info table-->
    <table class="table table-hover table-responsive-lg" id="main-table">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">ID</th>
        <th scope="col">姓名</th>
        <th scope="col">性别</th>
        <th scope="col">出生年月</th>
        <th scope="col">床号</th>
        <th scope="col">最新记录时间</th>
        <th scope="col">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(object,index) in healthReport">
        <th scope="row">{{index+1}}</th>
        <td v-for="value in object">
          {{value}}
        </td>
        <td>
          <button class="btn btn-info btn-sm" @click="getDetail(index)">详情</button>
          <button class="btn btn-primary btn-sm" @click="addRecord(index)">添加</button>
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
            <h5 class="modal-title" id="infoModalLabel">健康报告记录</h5>
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
                <th scope="row">床号</th>
                <td>{{residentDetail.bed}}</td>
              </tr>
              <tr>
                <th scope="row" colspan="10">既往病史</th>
              </tr>
              <tr>
                <td colspan="10" class="medical-text">{{residentDetail.medicalHistory}}</td>
              </tr>
              <tr>
                <th scope="row" colspan="10">健康建议</th>
              </tr>
              <tr>
                <template v-if="modifying===-1">
                  <td colspan="10" class="medical-text" v-show="!addingRecord" v-html="showSgn"></td>
                  <td colspan="10" v-show="addingRecord">
                    <input type="text" class="form-control" v-model="newHealthRecord.suggestion" placeholder="健康建议">
                  </td>
                </template>
                <template v-if="modifying!==-1">
                  <td colspan="10" v-show="modifyFlag[modifying]">
                    <input type="text" class="form-control" v-model="modifyRecord.suggestion">
                  </td>
                </template>
              </tr>
              </tbody>
            </table>
            <button class="btn btn-primary btn-sm" @click="addSwitchOn">添加记录</button>
            {{reportStatus}}
            <table class="table table-hover table-responsive-lg table-sm" id="history-record">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">身高(cm)</th>
                <th scope="col">体重(kg)</th>
                <th scope="col">心率(次/min)</th>
                <th scope="col">血压(收缩压)(mmHg)</th>
                <th scope="col">血压(舒张压)(mmHg)</th>
                <th scope="col">血糖(mmol/L)</th>
                <th scope="col">总胆固醇(mmol/L)</th>
                <th scope="col">尿酸(μmol/L)</th>
                <th scope="col">时间</th>
                <th scope="col">操作</th>
              </tr>
              </thead>
              <tbody>
              <!--add new record-->
              <tr v-show="addingRecord">
                <th scope="row">新</th>
                <td><input type="text" class="form-control" v-model="newHealthRecord.height"></td>
                <td><input type="text" class="form-control" v-model="newHealthRecord.weight"></td>
                <td><input type="text" class="form-control" v-model="newHealthRecord.heartRate"></td>
                <td><input type="text" class="form-control" v-model="newHealthRecord.bpSystolic"></td>
                <td><input type="text" class="form-control" v-model="newHealthRecord.bpDiastolic"></td>
                <td><input type="text" class="form-control" v-model="newHealthRecord.bloodGlucose"></td>
                <td><input type="text" class="form-control" v-model="newHealthRecord.bloodLipids"></td>
                <td><input type="text" class="form-control" v-model="newHealthRecord.uricAcid"></td>
                <td class="status-info">{{uploadStatus}}</td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="submitNewRecord"
                          :class="{disabled:hasClicked}">提交</button>
                  <button class="btn btn-danger btn-sm" @click="addSwitchOff"
                          :class="{disabled:hasClicked}">取消</button>
                </td>
              </tr>
              <!--record each line-->
              <tr v-for="(object,index) in reportDetail" @click="showSuggestion(index)"
                  data-toggle="tooltip" title="点击查看健康建议">
                <th scope="row">{{index+1}}</th>
                <td v-for="value in object" v-show="!modifyFlag[index]">
                  {{value}}
                </td>
                <td v-show="!modifyFlag[index]">
                  <button class="btn btn-warning btn-sm" @click="modifySwitchOn(index)">修改</button>
                  <button class="btn btn-danger btn-sm">删除</button>
                </td>
                <td v-show="modifyFlag[index]"><input type="text" class="form-control" v-model="modifyRecord.height"></td>
                <td v-show="modifyFlag[index]"><input type="text" class="form-control" v-model="modifyRecord.weight"></td>
                <td v-show="modifyFlag[index]"><input type="text" class="form-control" v-model="modifyRecord.heartRate"></td>
                <td v-show="modifyFlag[index]"><input type="text" class="form-control" v-model="modifyRecord.bpSystolic"></td>
                <td v-show="modifyFlag[index]"><input type="text" class="form-control" v-model="modifyRecord.bpDiastolic"></td>
                <td v-show="modifyFlag[index]"><input type="text" class="form-control" v-model="modifyRecord.bloodGlucose"></td>
                <td v-show="modifyFlag[index]"><input type="text" class="form-control" v-model="modifyRecord.bloodLipids"></td>
                <td v-show="modifyFlag[index]"><input type="text" class="form-control" v-model="modifyRecord.uricAcid"></td>
                <td v-show="modifyFlag[index]" class="status-info">{{uploadStatus}}</td>
                <td v-show="modifyFlag[index]">
                  <button class="btn btn-primary btn-sm">提交</button>
                  <button class="btn btn-danger btn-sm" @click="modifySwitchOff(index)">取消</button>
                </td>
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
  name: 'healthReport',
  components: {
    LoginModal
  },
  data () {
    return {
      healthReport: [],
      reportDetail: [],
      reportSuggestion: [],
      showSgn: '',
      reportStatus: '',
      newHealthRecord: {
        height: '',
        weight: '',
        heartRate: '',
        bpSystolic: '',
        bpDiastolic: '',
        bloodGlucose: '',
        bloodLipids: '',
        uricAcid: '',
        suggestion: ''
      },
      addingRecord: false,
      modifyFlag: [],
      modifying: -1,
      modifyRecord: {
        height: '',
        weight: '',
        heartRate: '',
        bpSystolic: '',
        bpDiastolic: '',
        bloodGlucose: '',
        bloodLipids: '',
        uricAcid: '',
        suggestion: ''
      },
      recordFormat: {},
      residentDetail: {},
      loading: true,
      loadingStatus: '加载中...',
      uploadStatus: '',
      hasClicked: false,
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
        this.getAllHealthInfo()
      }
    }
  },
  methods: {
    getAllHealthInfo () {
      this.checkSession().then(response => {
        if (response) {
          this.axios.get(this.getAPI() + '/health/base-info').then(response => {
            this.healthReport = []
            for (var i = 0; i < response.data.length; i++) {
              var temp = {
                id: response.data[i].resId,
                name: response.data[i].name,
                sex: this.sexCheck(response.data[i].sex),
                dob: this.dateTrim(response.data[i].dob),
                bed: response.data[i].numOfBed,
                recordDate: this.dateTimeTrim(response.data[i].recordDate)
              }
              if (temp.recordDate === 'Invalid date') {
                temp.recordDate = '暂无检查记录'
              }
              this.healthReport.push(temp)
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
      this.addSwitchOff()
      this.showSgn = '点击下方记录查看建议'
      this.checkSession().then(response => {
        if (response) {
          $('#infoModal').modal('show')
          let postData = { resId: this.healthReport[index].id }
          this.axios.post(this.getAPI() + '/health/report-detail', postData, { timeout: 15000 }).then(response => {
            this.reportDetail = []
            this.modifyFlag = []
            this.reportSuggestion = []
            this.residentDetail = {
              id: response.data[0].resId,
              name: response.data[0].name,
              sex: this.sexCheck(response.data[0].sex),
              dob: this.dateTrim(response.data[0].dob),
              bed: response.data[0].numOfBed,
              medicalHistory: response.data[0].medicalHistory
            }
            for (var i = 0; i < response.data.length; i++) {
              if (response.data[i].recordDate === null) {
                this.reportStatus = '暂无检查记录'
                break
              } else {
                this.reportStatus = ''
                var record = {
                  height: response.data[i].height,
                  weight: response.data[i].weight,
                  heartRate: response.data[i].heartRate,
                  bpSystolic: response.data[i].bpSystolic,
                  bpDiastolic: response.data[i].bpDiastolic,
                  bloodGlucose: response.data[i].bloodGlucose,
                  bloodLipids: response.data[i].bloodLipids,
                  uricAcid: response.data[i].uricAcid,
                  recordDate: this.dateTimeTrim(response.data[i].recordDate)
                }
                this.modifyFlag.push(false)
                this.modifying = -1
                this.reportDetail.push(record)
                this.reportSuggestion.push(response.data[i].suggestion)
              }
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
    showSuggestion (index) {
      this.showSgn = this.reportSuggestion[index] + '<br>报告时间：' + this.reportDetail[index].recordDate
    },
    // click from table
    addRecord (index) {
      this.getDetail(index)
      this.addSwitchOn()
    },
    addSwitchOn () {
      this.addingRecord = true
      if (this.modifying !== -1) {
        this.modifySwitchOff(this.modifying)
      }
      this.uploadStatus = ''
    },
    addSwitchOff () {
      if (this.hasClicked) {
        return
      }
      this.addingRecord = false
      this.newHealthRecord = {}
    },
    submitNewRecord () {
      if (this.hasClicked) {
        return
      }
      if (this.checkFormat()) {
        return
      }
      this.hasClicked = true
      this.checkSession().then(response => {
        if (response) {
          let postData = {
            resId: this.residentDetail.id,
            height: this.newHealthRecord.height,
            weight: this.newHealthRecord.weight,
            heartRate: this.newHealthRecord.heartRate,
            bpSystolic: this.newHealthRecord.bpSystolic,
            bpDiastolic: this.newHealthRecord.bpDiastolic,
            bloodGlucose: this.newHealthRecord.bloodGlucose,
            bloodLipids: this.newHealthRecord.bloodLipids,
            uricAcid: this.newHealthRecord.uricAcid,
            suggestion: this.newHealthRecord.suggestion
          }
          this.uploadStatus = '正在上传记录...'
          this.axios.post(this.getAPI() + '/health/add-record', postData).then(response => {
            if (response.data === 100) {
              this.uploadStatus = '添加成功'
              this.newHealthRecord = {}
              this.addingRecord = false
              this.hasClicked = false
              let refreshId = { resId: this.residentDetail.id }
              this.axios.post(this.getAPI() + '/health/report-detail',
                refreshId, { timeout: 15000 }).then(response => {
                this.reportDetail = []
                this.modifyFlag = []
                this.reportSuggestion = []
                for (var i = 0; i < response.data.length; i++) {
                  if (response.data[i].recordDate === null) {
                    this.reportStatus = '暂无检查记录'
                    break
                  } else {
                    this.reportStatus = ''
                    var record = {
                      height: response.data[i].height,
                      weight: response.data[i].weight,
                      heartRate: response.data[i].heartRate,
                      bpSystolic: response.data[i].bpSystolic,
                      bpDiastolic: response.data[i].bpDiastolic,
                      bloodGlucose: response.data[i].bloodGlucose,
                      bloodLipids: response.data[i].bloodLipids,
                      uricAcid: response.data[i].uricAcid,
                      recordDate: this.dateTimeTrim(response.data[i].recordDate)
                    }
                    this.modifyFlag.push(false)
                    this.modifying = -1
                    this.reportDetail.push(record)
                    this.reportSuggestion.push(response.data[i].suggestion)
                    this.uploadStatus = ''
                  }
                }
              }, response => {
                if (response.code === 'ECONNABORTED' && response.toString().indexOf('timeout') !== -1) {
                  this.loadingStatus = '加载超时，请重试'
                } else {
                  console.log('post failed')
                  console.log(response)
                }
              })
            } else if (response.data === 200) {
              this.uploadStatus = '添加失败请重试'
              this.hasClicked = false
            } else if (response.data === -999) {
              this.uploadStatus = '服务器错误，请稍后尝试'
              this.hasClicked = false
            }
          }, response => {
            console.log('post info failed')
            console.log(response.data)
          })
        } else {
          this.hasClicked = false
          $('#loginModal').modal('show')
        }
      })
    },
    modifySwitchOn (index) {
      if (this.addingRecord) {
        this.addSwitchOff()
        this.modifying = index
        this.$set(this.modifyFlag, index, !this.modifyFlag[index])
      } else if (this.modifying === -1) {
        this.modifying = index
        this.$set(this.modifyFlag, index, !this.modifyFlag[index])
      } else {
        this.$set(this.modifyFlag, this.modifying, !this.modifyFlag[this.modifying])
        this.modifying = index
        this.$set(this.modifyFlag, index, !this.modifyFlag[index])
      }
      this.modifyRecord.height = this.reportDetail[index].height
      this.modifyRecord.weight = this.reportDetail[index].weight
      this.modifyRecord.heartRate = this.reportDetail[index].heartRate
      this.modifyRecord.bpSystolic = this.reportDetail[index].bpSystolic
      this.modifyRecord.bpDiastolic = this.reportDetail[index].bpDiastolic
      this.modifyRecord.bloodGlucose = this.reportDetail[index].bloodGlucose
      this.modifyRecord.bloodLipids = this.reportDetail[index].bloodLipids
      this.modifyRecord.uricAcid = this.reportDetail[index].uricAcid
      this.modifyRecord.suggestion = this.reportSuggestion[index]
    },
    modifySwitchOff (index) {
      this.$set(this.modifyFlag, index, !this.modifyFlag[index])
      this.modifying = -1
      this.modifyRecord = {}
    },
    searchHealthReport (evt) {
      evt.preventDefault()
      this.checkSession().then(response => {
        if (response) {
          let searchContent = { 'search': this.searchInput }
          this.axios.post(this.getAPI() + '/health/search', searchContent).then(response => {
            this.healthReport = []
            for (var i = 0; i < response.data.length; i++) {
              var temp = {
                id: response.data[i].resId,
                name: response.data[i].name,
                sex: this.sexCheck(response.data[i].sex),
                dob: this.dateTrim(response.data[i].dob),
                bed: response.data[i].numOfBed,
                recordDate: this.dateTimeTrim(response.data[i].recordDate)
              }
              if (temp.recordDate === 'Invalid date') {
                temp.recordDate = '暂无检查记录'
              }
              this.healthReport.push(temp)
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
    checkFormat () {

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
      return this.$moment(date).format('YYYY-MM-DD')
    },
    dateTimeTrim (datetime) {
      return this.$moment(datetime).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  beforeMount () {
    this.getAllHealthInfo()
  }
}
</script>

<style scoped>
  #main-table button{
    margin-right: 5px;
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

  #infoModal .modal-content{
    width: 1285px;
  }

  #infoModal .medical-text {
    text-align: left;
  }

  #infoModal #history-record input{
    width: 55px;
    height: 31px;
    margin: auto;
  }

  #infoModal button{
    margin-bottom: 10px;
    margin-right: 5px;
    float: left;
  }

  #infoModal td button{
    margin-bottom: 5px;
    float: none;
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
