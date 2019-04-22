<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div id="panel-title">
            <h4><strong>事件处理</strong></h4>
          </div>
        </div>
      </div>

      <!--pending list-->
      <label for="pending-incident"><strong>待处理</strong></label>
      <div id="pending-incident">
        <div class="row">
          <div class="col-11">
            <table class="table table-hover table-responsive-lg">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">住户</th>
                <th scope="col">事件类型</th>
                <th scope="col">状态</th>
                <th scope="col">创建时间</th>
                <th scope="col">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="pendingList.length === 0">
                <td colspan="6" style="text-align: center">暂无待处理事件</td>
              </tr>
              <tr v-for="(object,index) in pendingList">
                <th scope="row">{{index+1}}</th>
                <td>{{object.name}}</td>
                <td>{{object.type}}</td>
                <td>{{object.processStatus}}</td>
                <td>{{object.recordTime}}</td>
                <td>
                  <button class="btn btn-info btn-sm" @click="showDetail(1,index)">详情</button>
                  <button class="btn btn-primary btn-sm" @click="toProcessOn(object.incidentId,index)">处理</button>
                  <button class="btn btn-danger btn-sm" @click="toIgnoreOn(object.incidentId,index)">忽略</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-1"></div>
        </div>
      </div>

      <!--processing list-->
      <label for="processing-incident"><strong>正在处理</strong></label>
      <div id="processing-incident">
        <div class="row">
          <div class="col-11">
            <table class="table table-hover table-responsive-lg">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">住户</th>
                <th scope="col">事件类型</th>
                <th scope="col">状态</th>
                <th scope="col">创建时间</th>
                <th scope="col">处理时间</th>
                <th scope="col">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="processingList.length === 0">
                <td colspan="7" style="text-align: center">暂无正在处理事件</td>
              </tr>
              <tr v-for="(object,index) in processingList">
                <th scope="row">{{index+1}}</th>
                <td>{{object.name}}</td>
                <td>{{object.type}}</td>
                <td>{{object.processStatus}}</td>
                <td>{{object.recordTime}}</td>
                <td>{{object.processTime}}</td>
                <td>
                  <button class="btn btn-info btn-sm" @click="showDetail(2,index)">详情</button>
                  <button class="btn btn-primary btn-sm" @click="toFinishOn(object.incidentId,index)">完成</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-1"></div>
        </div>
      </div>

      <!--finished list-->
      <label for="finished-incident"><strong>已完成</strong></label>
      <div id="finished-incident">
        <div class="row">
          <div class="col-11">
            <table class="table table-hover table-responsive-lg">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">住户</th>
                <th scope="col">事件类型</th>
                <th scope="col">状态</th>
                <th scope="col">创建时间</th>
                <th scope="col">完成时间</th>
                <th scope="col">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="finishedList.length === 0">
                <td colspan="7" style="text-align: center">暂无已完成事件</td>
              </tr>
              <tr v-for="(object,index) in finishedList">
                <th scope="row">{{index+1}}</th>
                <td>{{object.name}}</td>
                <td>{{object.type}}</td>
                <td>{{object.processStatus}}</td>
                <td>{{object.recordTime}}</td>
                <td>{{object.finishTime}}</td>
                <td>
                  <button class="btn btn-info btn-sm" @click="showDetail(3,index)">详情</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="col-1"></div>
        </div>
      </div>

      <!--incident detail-->
      <div class="modal fade" id="incidentDetailModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
           aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="incidentDetailLabel">事件详情</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-12">
                  <table class="table table-bordered">
                    <tbody>
                    <tr>
                      <th scope="row">事件ID</th>
                      <td>{{incidentDetail.incidentId}}</td>
                      <th scope="row">住户</th>
                      <td>{{incidentDetail.name}}</td>
                      <th scope="row">事件类型</th>
                      <td>{{incidentDetail.type}}</td>
                      <th scope="row">创建时间</th>
                      <td>{{incidentDetail.recordTime}}</td>
                    </tr>
                    <tr>
                      <th scope="row">状态</th>
                      <td>{{incidentDetail.processStatus}}</td>
                      <th scope="row">处理人员ID</th>
                      <td>{{incidentDetail.staffId}}</td>
                      <th scope="row">处理时间</th>
                      <td>{{incidentDetail.processTime}}</td>
                      <th scope="row">完成时间</th>
                      <td>{{incidentDetail.finishTime}}</td>
                    </tr>
                    <tr>
                      <th scope="row">备注</th>
                      <td colspan="7">{{incidentDetail.comment}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <label for="last-location">位置</label>
                  <div class="amap-wrapper" id="last-location">
                    <el-amap
                      vid="amap-geo-fence"
                      :plugin="mapView.plugin"
                      :center="mapView.mapCenter"
                      :zoom="mapView.zoom"
                    >
                      <el-amap-marker
                        v-for="marker in mapView.markers"
                        :position="marker"
                      >
                      </el-amap-marker>
                    </el-amap>
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

      <!--free staffs list-->
      <div class="modal fade" id="freeStaffModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
           aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="freeStaffModalLabel">处理事件</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="toProcessOff">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" style="text-align: center" v-show="loading">
              加载中...
            </div>
            <div class="modal-body" v-show="!loading">
             <div class="row">
               <div class="col-12">
                 <table class="table table-hover table-responsive-lg">
                   <thead>
                   <tr>
                     <th scope="col">#</th>
                     <th scope="col">ID</th>
                     <th scope="col">姓名</th>
                     <th scope="col">性别</th>
                     <th scope="col">电话</th>
                     <th scope="col">操作</th>
                   </tr>
                   </thead>
                   <tbody>
                   <tr v-if="freeStaff.length === 0">
                     <td colspan="6" style="text-align: center">暂无空闲员工</td>
                   </tr>
                   <tr v-for="(object,index) in freeStaff">
                     <th scope="row">{{index+1}}</th>
                     <td v-for="value in object">
                       {{value}}
                     </td>
                     <td>
                       <button class="btn btn-primary btn-sm" @click="submitProcess(object.id,1)">安排处理</button>
                     </td>
                   </tr>
                   </tbody>
                 </table>
               </div>
             </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="toProcessOff">关闭</button>
            </div>
          </div>
        </div>
      </div>

      <!--finish confirm-->
      <div class="modal" tabindex="-1" role="dialog" id="finishConfirmModal">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">完成确认</h5>
            </div>
            <div class="modal-body">
              <p>确认完成事件处理？该操作不可恢复</p>
              <div class="row">
                <div class="col-12">
                  <label for="finished-comment">备注：</label>
                  <textarea id="finished-comment" class="form-control" aria-label="With textarea" v-model="comment"></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger"
                      :class="{disabled:hasClicked}"
                      @click="submitProcess(processingList[currentIndex].staffId,2)">确定</button>
              <button type="button" class="btn btn-secondary"
                      :class="{disabled:hasClicked}" @click="toFinishOff">取消</button>
            </div>
          </div>
        </div>
      </div>

      <!--ignore confirm-->
      <div class="modal" tabindex="-1" role="dialog" id="ignoreConfirmModal">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">忽略确认</h5>
            </div>
            <div class="modal-body">
              <p>确认忽略该事件？该操作不可恢复</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger"
                      :class="{disabled:hasClicked}" @click="submitProcess(-1,3)">确定</button>
              <button type="button" class="btn btn-secondary"
                      :class="{disabled:hasClicked}" @click="toIgnoreOff">取消</button>
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
  name: 'monitor',
  data () {
    return {
      pendingList: [],
      processingList: [],
      finishedList: [],
      incidentDetail: {},
      freeStaff: [],
      currentIncidentId: '',
      currentIndex: -1,
      comment: '',
      loading: true,
      timer: 0,
      hasClicked: false,
      mapView: {
        zoom: 14,
        markers: [],
        mapCenter: [113.874908, 22.902537],
        lng: 0,
        lat: 0,
        plugin: [
          {
            pName: 'Geolocation'
          },
          {
            pName: 'OverView',
            isOpen: true
          },
          {
            pName: 'PolyEditor'
          }
        ]
      }
    }
  },
  components: {
    LoginModal
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
        this.getIncidentList()
      }
    }
  },
  methods: {
    getIncidentList () {
      this.checkSession().then(response => {
        if (response) {
          this.axios.post(this.getAPI() + '/security/monitor').then(response => {
            this.pendingList = []
            this.processingList = []
            this.finishedList = []
            if (response.data.length > 0) {
              for (let i = 0; i < response.data.length; i++) {
                let temp = {
                  incidentId: response.data[i].incidentId,
                  name: response.data[i].name,
                  type: this.incidentTypeConverter(response.data[i].type),
                  longitude: response.data[i].longitude,
                  latitude: response.data[i].latitude,
                  processStatus: this.processStatusConverter(response.data[i].processStatus),
                  recordTime: this.dateTimeTrim(response.data[i].recordTime),
                  staffId: response.data[i].staffId,
                  processTime: this.dateTimeTrim(response.data[i].processTime),
                  finishTime: this.dateTimeTrim(response.data[i].finishTime),
                  comment: response.data[i].comment
                }
                if (response.data[i].processStatus === 0) {
                  this.pendingList.push(temp)
                } else if (response.data[i].processStatus === 1) {
                  this.processingList.push(temp)
                } else if (response.data[i].processStatus === 2 ||
                  response.data[i].processStatus === 3) {
                  this.finishedList.push(temp)
                }
              }
            } else if (response.data === 200) {
              console.log('获取事件列表失败')
              console.log(response.data)
            }
          }, response => {
            console.log('获取事件列表失败')
            console.log(response.data)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    getFreeStaffs () {
      this.loading = true
      this.checkSession().then(response => {
        if (response) {
          this.axios.get(this.getAPI() + '/staff/list').then(response => {
            this.freeStaff = []
            for (let i = 0; i < response.data.length; i++) {
              let temp = {
                id: response.data[i].staffId,
                name: response.data[i].name,
                sex: this.sexCheck(response.data[i].sex),
                phone: response.data[i].phone
              }
              if (response.data[i].status === 1) {
                this.freeStaff.push(temp)
              }
            }
            this.loading = false
          }, response => {
            console.log('获取空闲员工列表失败')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    showDetail (type, index) {
      this.mapView.markers = []
      this.checkSession().then(response => {
        if (response) {
          if (type === 1) {
            this.incidentDetail = this.pendingList[index]
            this.incidentDetail.staffId = '未安排'
            this.incidentDetail.processTime = '未知'
            this.incidentDetail.finishTime = '未知'
          } else if (type === 2) {
            this.incidentDetail = this.processingList[index]
            this.incidentDetail.finishTime = '未知'
          } else if (type === 3) {
            this.incidentDetail = this.finishedList[index]
          }
          let lastLocation = []
          lastLocation.push(this.incidentDetail.longitude)
          lastLocation.push(this.incidentDetail.latitude)
          this.mapView.markers.push(lastLocation)
          this.mapView.mapCenter = lastLocation
          $('#incidentDetailModal').modal('show')
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    toProcessOn (incidentId, index) {
      $('#freeStaffModal').modal('show')
      this.currentIncidentId = incidentId
      this.currentIndex = index
      this.getFreeStaffs()
    },
    toProcessOff () {
      $('#freeStaffModal').modal('hide')
      this.currentIncidentId = ''
      this.currentIndex = -1
    },
    toFinishOn (incidentId, index) {
      $('#finishConfirmModal').modal('show')
      this.currentIncidentId = incidentId
      this.currentIndex = index
    },
    toFinishOff () {
      $('#finishConfirmModal').modal('hide')
      this.currentIncidentId = ''
      this.currentIndex = -1
      this.comment = ''
    },
    toIgnoreOn (incidentId, index) {
      $('#ignoreConfirmModal').modal('show')
      this.currentIncidentId = incidentId
      this.currentIndex = index
    },
    toIgnoreOff () {
      $('#ignoreConfirmModal').modal('hide')
      this.currentIncidentId = ''
      this.currentIndex = -1
    },
    submitProcess (staffId, processStatus) {
      if (this.hasClicked) {
        return
      }
      this.hasClicked = true
      this.checkSession().then(response => {
        if (response) {
          let postData
          if (processStatus === 1) {
            postData = {
              incidentId: this.currentIncidentId,
              processStatus: processStatus,
              staffId: staffId
            }
          } else if (processStatus === 2) {
            postData = {
              incidentId: this.currentIncidentId,
              processStatus: processStatus,
              staffId: staffId,
              comment: this.comment
            }
          } else if (processStatus === 3) {
            postData = {
              incidentId: this.currentIncidentId,
              processStatus: processStatus
            }
          }
          this.axios.post(this.getAPI() + '/security/process-incident',
            postData).then(response => {
            if (response.data === 100) {
              console.log('事件处理操作成功')
              if (processStatus === 1) {
                let temp = this.pendingList[this.currentIndex]
                temp.processStatus = '正在处理'
                temp.staffId = staffId
                temp.processTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                this.processingList.unshift(temp)
                this.pendingList.splice(this.currentIndex, 1)
                this.toProcessOff()
              } else if (processStatus === 2) {
                let temp = this.processingList[this.currentIndex]
                temp.processStatus = '已完成'
                temp.finishTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                temp.comment = this.comment
                this.finishedList.unshift(temp)
                this.processingList.splice(this.currentIndex, 1)
                this.toFinishOff()
              } else if (processStatus === 3) {
                let temp = this.pendingList[this.currentIndex]
                temp.processStatus = '已忽略'
                temp.processTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                temp.finishTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                temp.staffId = this.$store.getters.getAdminId
                this.finishedList.unshift(temp)
                this.pendingList.splice(this.currentIndex, 1)
                this.toIgnoreOff()
              }
              alert('事件处理操作成功')
            } else if (response.data === 200) {
              console.log('事件处理失败')
              alert('事件处理失败,请重试')
            }
          }, response => {
            console.log('post process failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
      this.hasClicked = false
    },
    incidentTypeConverter (type) {
      if (type === 0) {
        return '围栏之外'
      } else if (type === 1) {
        return '接近围栏'
      } else if (type === 2) {
        return '紧急求助'
      } else if (type === 3) {
        return '异常离线'
      }
    },
    processStatusConverter (state) {
      if (state === 0) {
        return '待处理'
      } else if (state === 1) {
        return '正在处理'
      } else if (state === 2) {
        return '已完成'
      } else if (state === 3) {
        return '已忽略'
      }
    },
    dateTimeTrim (datetime) {
      return this.$moment(datetime).format('YYYY-MM-DD HH:mm:ss')
    },
    sexCheck (sex) {
      if (sex === 'MALE') {
        return '男'
      } else if (sex === 'FEMALE') {
        return '女'
      } else {
        return 'N/A'
      }
    }
  },
  beforeMount () {
    this.getIncidentList()
  },
  created () {
    this.timer = setInterval(() => {
      this.getIncidentList()
    }, 5000)
  },
  destroyed () {
    clearInterval(this.timer)
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

  #pending-incident button,
  #processing-incident button,
  #finished-incident button{
    margin-right: 5px;
  }

  .amap-wrapper{
    width: 100%;
    height: 450px;
  }

</style>
