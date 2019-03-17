<template>
  <div id="info-table">

    <div id="panel-title"><h5><strong>个人账单</strong></h5></div>

    <div class="row">
      <div class="col-6">
        <div id="operation-bar">
          <button class="btn btn-success" @click="getAllBillInfo">全部住户</button>
        </div>
      </div>
      <div class="col-6">
        <form class="form-inline my-2 my-lg-0" id="search-bar" @submit="searchBill">
          <label for="search-input" style="padding-right:15px">搜索住户:</label>
          <input id="search-input" class="form-control mr-sm-2" type="search"
                 placeholder="输入ID、姓名、床号" aria-label="Search" required v-model="searchInput">
          <button class="btn btn-success my-2 my-sm-0" type="submit">搜索</button>
        </form>
      </div>
    </div>

    <!--info table-->
    <table class="table table-hover table-responsive-lg" id="main-table">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">ID</th>
        <th scope="col">姓名</th>
        <th scope="col">床号</th>
        <th scope="col">欠费</th>
        <th scope="col">已付</th>
        <th scope="col">结余</th>
        <th scope="col">最近账单日期</th>
        <th scope="col">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(object,index) in billList">
        <th scope="row">{{index+1}}</th>
        <td v-for="value in object">
          {{value}}
        </td>
        <td>
          <button class="btn btn-primary btn-sm" @click="addBillRecord(index)">添加账单</button>
          <button class="btn btn-warning btn-sm" @click="addPaymentRecord(index)">支付</button>
          <button class="btn btn-info btn-sm" @click="getDetail(index)">详情</button>
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
            <h5 class="modal-title" id="infoModalLabel">账单详情</h5>
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
                <th scope="row">床号</th>
                <td>{{residentDetail.bed}}</td>
              </tr>
              <tr>
                <th>欠款</th>
                <td>{{billNPayment.totalBill}}</td>
                <th>已付</th>
                <td>{{billNPayment.totalPaid}}</td>
                <th>结余</th>
                <td>{{billNPayment.totalPaid-billNPayment.totalBill}}</td>
              </tr>
              </tbody>
            </table>
            <div class="row">
              <div class="col-2">
                <button class="btn btn-primary btn-sm" @click="addBillSwitchOn">添加账单</button>
                <button class="btn btn-warning btn-sm" @click="addPaymentSwitchOn">支付账单</button>
              </div>
              <div class="col-6">
                <div class="form-row">
                  <div class="form-group input-group-sm mb-3 col-4">
                    <datepicker id="detailStartDate" format="yyyy-MM-dd" :language="language.zh"
                                placeholder="起始日期" :required="true"
                                :clear-button="true" :bootstrap-styling="true" :typeable="true"/>
                  </div>
                  <div class="form-group input-group-sm mb-3 col-4">
                    <datepicker id="detailEndDate" format="yyyy-MM-dd" :language="language.zh"
                                placeholder="结束日期" :required="true"
                                :clear-button="true" :bootstrap-styling="true" :typeable="true"/>
                  </div>
                  <div class="col-2">
                    <button class="btn btn-info btn-sm">查询</button>
                  </div>
                </div>
              </div>
              <div class="col-2">{{recordLoadingStatus}}</div>
            </div>
            <div class="row">
              <div class="col-6">
                <table class="table table-hover table-responsive-lg table-sm history-record">
                  <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">消费内容</th>
                    <th scope="col">消费金额</th>
                    <th scope="col">记账时间</th>
                    <th scope="col">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <!--add new record-->
                  <tr v-show="addingBillRecord">
                    <th scope="row">新</th>
                    <td><input type="text" class="form-control" v-model="newBillRecord.item"></td>
                    <td><input type="text" class="form-control" v-model="newBillRecord.amount"></td>
                    <td class="status-info">{{uploadStatus}}</td>
                    <td>
                      <button class="btn btn-primary btn-sm" @click="submitNewBillRecord"
                              :class="{disabled:hasClicked}">提交
                      </button>
                      <button class="btn btn-danger btn-sm" @click="addBillSwitchOff"
                              :class="{disabled:hasClicked}">取消
                      </button>
                    </td>
                  </tr>
                  <!--record each line-->
                  <tr v-for="(object,index) in billDetail">
                    <th scope="row">{{index+1}}</th>
                    <template v-if="!billModifyFlag[index]">
                      <td v-for="value in object">
                        {{value}}
                      </td>
                      <td>
                        <button class="btn btn-warning btn-sm" @click="billModifySwitchOn(index)">修改</button>
                        <button class="btn btn-danger btn-sm">删除</button>
                      </td>
                    </template>
                    <template v-if="billModifyFlag[index]">
                      <td>
                        <input type="text" class="form-control" v-model="modifyBillRecord.item">
                      </td>
                      <td>
                        <input type="text" class="form-control" v-model="modifyBillRecord.amount">
                      </td>
                      <td class="status-info">{{uploadStatus}}</td>
                      <td>
                        <button class="btn btn-primary btn-sm">提交</button>
                        <button class="btn btn-danger btn-sm" @click="billModifySwitchOff(index)">取消</button>
                      </td>
                    </template>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-6">
                <table class="table table-hover table-responsive-lg table-sm history-record">
                  <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">支付金额</th>
                    <th scope="col">支付平台</th>
                    <th scope="col">记账时间</th>
                    <th scope="col">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-show="addingPaymentRecord">
                    <th scope="row">新</th>
                    <td><input type="text" class="form-control" v-model="newPaymentRecord.amount"></td>
                    <td class="status-info" colspan="2">{{uploadStatus}}</td>
                    <td>
                      <button class="btn btn-primary btn-sm" @click="submitNewPaymentRecord"
                              :class="{disabled:hasClicked}">提交
                      </button>
                      <button class="btn btn-danger btn-sm" @click="addPaymentSwitchOff"
                              :class="{disabled:hasClicked}">取消
                      </button>
                    </td>
                  </tr>
                  <tr v-for="(object,index) in paymentDetail">
                    <th scope="row">{{index+1}}</th>
                    <template v-if="!paymentModifyFlag[index]">
                      <td v-for="value in object">
                        {{value}}
                      </td>
                      <td>
                        <button class="btn btn-warning btn-sm" @click="paymentModifySwitchOn(index)">修改</button>
                        <button class="btn btn-danger btn-sm">删除</button>
                      </td>
                    </template>
                    <template v-if="paymentModifyFlag[index]">
                      <td>
                        <input type="text" class="form-control" v-model="modifyPaymentRecord.paid">
                      </td>
                      <td colspan="2" class="status-info">{{uploadStatus}}</td>
                      <td>
                        <button class="btn btn-primary btn-sm">提交</button>
                        <button class="btn btn-danger btn-sm" @click="paymentModifySwitchOff(index)">取消</button>
                      </td>
                    </template>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>

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
import Datepicker from 'vuejs-datepicker/dist/vuejs-datepicker.min'
import * as lang from 'vuejs-datepicker/src/locale'

export default {
  name: 'bill',
  components: {
    LoginModal,
    Datepicker
  },
  data () {
    return {
      billList: [],
      billNPayment: {
        totalBill: '',
        totalPaid: ''
      },
      billDetail: [],
      paymentDetail: [],
      recordLoadingStatus: '',
      newBillRecord: {
        item: '',
        amount: ''
      },
      addingBillRecord: false,
      newPaymentRecord: {
        amount: ''
      },
      addingPaymentRecord: false,
      billModifyFlag: [],
      paymentModifyFlag: [],
      modifying: -1,
      modifyBillRecord: {
        item: '',
        amount: ''
      },
      modifyPaymentRecord: {
        paid: ''
      },
      recordFormat: {},
      residentDetail: {},
      loading: true,
      loadingStatus: '加载中...',
      uploadStatus: '',
      hasClicked: false,
      searchInput: '',
      language: lang
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
        this.getAllBillInfo()
      }
    }
  },
  methods: {
    getAllBillInfo () {
      this.checkSession().then(response => {
        if (response) {
          this.axios.get(this.getAPI() + '/bill/bill-list').then(response => {
            this.billList = []
            for (let i = 0; i < response.data.length; i++) {
              let temp = {
                id: response.data[i].resId,
                name: response.data[i].name,
                bed: response.data[i].numOfBed,
                totalBill: response.data[i].totalBill,
                totalPaid: response.data[i].totalPaid,
                balance: response.data[i].totalPaid - response.data[i].totalBill,
                latestBillDate: this.dateTimeTrim(response.data[i].latestBillDate)
              }
              if (temp.latestBillDate === 'Invalid date') {
                temp.latestBillDate = '暂无记录'
              }
              this.billList.push(temp)
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
      this.addBillSwitchOff()
      this.addPaymentSwitchOff()
      this.recordLoadingStatus = ''
      this.checkSession().then(response => {
        if (response) {
          $('#infoModal').modal('show')
          let postData = { resId: this.billList[index].id }
          this.axios.post(this.getAPI() + '/bill/bill-detail', postData, { timeout: 15000 }).then(response => {
            this.billDetail = []
            this.billModifyFlag = []
            this.residentDetail = {
              id: response.data[0].resId,
              name: response.data[0].name,
              bed: response.data[0].numOfBed
            }
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].recordDate === null) {
                this.recordLoadingStatus = '暂无记录'
                break
              } else {
                let record = {
                  item: response.data[i].item,
                  amount: response.data[i].amount,
                  recordDate: this.dateTimeTrim(response.data[i].recordDate)
                }
                this.billModifyFlag.push(false)
                this.modifying = -1
                this.billDetail.push(record)
              }
            }
            this.loadingStatus = '加载完成'
            this.loading = false
            this.billNPayment.totalBill = this.billList[index].totalBill
            this.billNPayment.totalPaid = this.billList[index].totalPaid
          }, response => {
            if (response.code === 'ECONNABORTED' && response.toString().indexOf('timeout') !== -1) {
              this.loadingStatus = '加载超时，请重试'
            } else {
              console.log('post bill failed')
              console.log(response)
            }
          })
          this.axios.post(this.getAPI() + '/payment/payment-detail', postData, { timeout: 15000 }).then(response => {
            this.paymentDetail = []
            this.paymentModifyFlag = []
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].recordDate == null) {
                this.recordLoadingStatus = '暂无记录'
                break
              } else {
                let record = {
                  paid: response.data[i].paid,
                  platform: this.paymentPlatform(response.data[i].platform),
                  recordDate: this.dateTimeTrim(response.data[i].recordDate)
                }
                this.paymentModifyFlag.push(false)
                this.paymentDetail.push(record)
              }
            }
          }, response => {
            if (response.code === 'ECONNABORTED' && response.toString().indexOf('timeout') !== -1) {
              this.loadingStatus = '加载超时，请重试'
            } else {
              console.log('post payment failed')
              console.log(response)
            }
          })
          this.currentResident = index
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    // click from table
    addBillRecord (index) {
      this.getDetail(index)
      this.addBillSwitchOn()
    },
    addBillSwitchOn () {
      this.addingBillRecord = true
      if (this.modifying !== -1) {
        if (this.billModifyFlag[this.modifying]) {
          this.billModifySwitchOff(this.modifying)
        }
        if (this.paymentModifyFlag[this.modifying]) {
          this.paymentModifySwitchOff(this.modifying)
        }
      }
      if (this.addingPaymentRecord) {
        this.addPaymentSwitchOff()
      }
      this.uploadStatus = ''
    },
    addBillSwitchOff () {
      if (this.hasClicked) {
        return
      }
      this.addingBillRecord = false
      this.newBillRecord = {}
    },
    // click from table
    addPaymentRecord (index) {
      this.getDetail(index)
      this.addPaymentSwitchOn()
    },
    addPaymentSwitchOn () {
      this.addingPaymentRecord = true
      if (this.modifying !== -1) {
        if (this.billModifyFlag[this.modifying]) {
          this.billModifySwitchOff(this.modifying)
        }
        if (this.paymentModifyFlag[this.modifying]) {
          this.paymentModifySwitchOff(this.modifying)
        }
      }
      if (this.addingBillRecord) {
        this.addBillSwitchOff()
      }
      this.uploadStatus = ''
    },
    addPaymentSwitchOff () {
      if (this.hasClicked) {
        return
      }
      this.addingPaymentRecord = false
      this.newPaymentRecord = {}
    },
    submitNewBillRecord () {
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
            item: this.newBillRecord.item,
            amount: this.newBillRecord.amount
          }
          this.uploadStatus = '正在上传记录...'
          this.axios.post(this.getAPI() + '/bill/add-record', postData).then(response => {
            if (response.data === 100) {
              this.uploadStatus = '添加成功'
              this.newBillRecord = {}
              this.addingBillRecord = false
              let refreshId = { resId: this.residentDetail.id }
              this.axios.post(this.getAPI() + '/health/report-detail',
                refreshId, { timeout: 15000 }).then(response => {
                this.billDetail = []
                this.billModifyFlag = []
                for (let i = 0; i < response.data.length; i++) {
                  if (response.data[i].recordDate === null) {
                    this.recordLoadingStatus = '暂无检查记录'
                    break
                  } else {
                    this.recordLoadingStatus = ''
                    let record = {
                      item: response.data[i].item,
                      amount: response.data[i].amount,
                      recordDate: this.dateTimeTrim(response.data[i].recordDate)
                    }
                    this.billModifyFlag.push(false)
                    this.modifying = -1
                    this.billDetail.push(record)
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
    billModifySwitchOn (index) {
      if (this.addingBillRecord) {
        this.addBillSwitchOff()
        this.modifying = index
        this.$set(this.billModifyFlag, index, !this.billModifyFlag[index])
      } else if (this.addingPaymentRecord) {
        this.addPaymentSwitchOff()
        this.modifying = index
        this.$set(this.billModifyFlag, index, !this.billModifyFlag[index])
      } else if (this.modifying === -1) {
        this.modifying = index
        this.$set(this.billModifyFlag, index, !this.billModifyFlag[index])
      } else {
        if (this.billModifyFlag[this.modifying]) {
          this.billModifySwitchOff(this.modifying)
        }
        if (this.paymentModifyFlag[this.modifying]) {
          this.paymentModifySwitchOff(this.modifying)
        }
        this.modifying = index
        this.$set(this.billModifyFlag, index, !this.billModifyFlag[index])
      }
      this.modifyBillRecord.item = this.billDetail[index].item
      this.modifyBillRecord.amount = this.billDetail[index].amount
    },
    billModifySwitchOff (index) {
      this.$set(this.billModifyFlag, index, !this.billModifyFlag[index])
      this.modifying = -1
      this.modifyBillRecord = {}
    },
    paymentModifySwitchOn (index) {
      if (this.addingBillRecord) {
        this.addBillSwitchOff()
        this.modifying = index
        this.$set(this.paymentModifyFlag, index, !this.paymentModifyFlag[index])
      } else if (this.addingPaymentRecord) {
        this.addPaymentSwitchOff()
        this.modifying = index
        this.$set(this.paymentModifyFlag, index, !this.paymentModifyFlag[index])
      } else if (this.modifying === -1) {
        this.modifying = index
        this.$set(this.paymentModifyFlag, index, !this.paymentModifyFlag[index])
      } else {
        if (this.billModifyFlag[this.modifying]) {
          this.billModifySwitchOff(this.modifying)
        }
        if (this.paymentModifyFlag[this.modifying]) {
          this.paymentModifySwitchOff(this.modifying)
        }
        this.modifying = index
        this.$set(this.paymentModifyFlag, index, !this.paymentModifyFlag[index])
      }
      this.modifyPaymentRecord.paid = this.paymentDetail[index].paid
    },
    paymentModifySwitchOff (index) {
      this.$set(this.paymentModifyFlag, index, !this.paymentModifyFlag[index])
      this.modifying = -1
      this.modifyPaymentRecord = {}
    },
    submitNewPaymentRecord () {

    },
    searchBill (evt) {
      evt.preventDefault()
      this.checkSession().then(response => {
        if (response) {
          let searchContent = { 'search': this.searchInput }
          this.axios.post(this.getAPI() + '/bill/search', searchContent).then(response => {
            this.billList = []
            for (let i = 0; i < response.data.length; i++) {
              let temp = {
                id: response.data[i].resId,
                name: response.data[i].name,
                bed: response.data[i].numOfBed,
                totalBill: response.data[i].totalBill,
                totalPaid: response.data[i].totalPaid,
                balance: response.data[i].totalPaid - response.data[i].totalBill,
                latestBillDate: this.dateTimeTrim(response.data[i].latestBillDate)
              }
              if (temp.latestBillDate === 'Invalid date') {
                temp.latestBillDate = '暂无检查记录'
              }
              this.billList.push(temp)
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
    dateTrim (date) {
      return this.$moment(date).format('YYYY-MM-DD')
    },
    dateTimeTrim (datetime) {
      return this.$moment(datetime).format('YYYY-MM-DD HH:mm:ss')
    },
    paymentPlatform (plat) {
      if (plat === 'CONSOLE') {
        return '操控台'
      } else if (plat === 'APP') {
        return 'APP'
      } else {
        return '未知平台'
      }
    }
  },
  beforeMount () {
    this.getAllBillInfo()
  }
}
</script>

<style scoped>
  #main-table button {
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

  #operation-bar button {
    margin-right: 5px;
  }

  #infoModal .history-record input {
    width: 55px;
    height: 31px;
    margin: auto;
  }

  #infoModal button {

    margin-right: 5px;
    float: left;
  }

  #infoModal td button {
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
