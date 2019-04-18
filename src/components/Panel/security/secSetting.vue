<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div id="panel-title">
          <h4><strong>安全设置</strong></h4>
        </div>
      </div>
    </div>
    <label for="geo-fence-setting"><strong>设置电子围栏</strong></label>
    <div id="geo-fence-setting">
      <div class="row">
        <div class="col-11">
          <div class="amap-wrapper">
            <el-amap-search-box
              class="search-box"
              :on-search-result="onSearchResult"
            ></el-amap-search-box>
            <el-amap
              class="amap-box"
              vid="amap-vue"
              :plugin="mapView.plugin"
              :center="mapView.mapCenter"
              :zoom="mapView.zoom"
              :amap-manager="amapManager"
            >
              <el-amap-marker
                v-for="marker in mapView.markers"
                :position="marker"
              ></el-amap-marker>
              <el-amap-polygon :path="mapView.polygon.path" :editable="mapView.polygon.editable" :ref="`polygon_0`"
                               :events="mapView.polygon.events" :draggable="mapView.polygon.editable"
                               fillOpacity="0.3" fillColor="blue"
                               strokeOpacity="0.6" strokeColor="pink"
                               zIndex="50" :visible="mapView.polygon.visible">
              </el-amap-polygon>
            </el-amap>
          </div>
          <div class="col-1"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <div class="map-toolbar">
            <template v-if="!disableClk">
            <button type="button" class="btn btn-primary" @click="addGeoFence">添加围栏</button>
            </template>
            <template v-if="disableClk">
              <button type="button" class="btn btn-info" @click="getGeoFence">刷新围栏</button>
              <button type="button" class="btn btn-success" @click="modifyGeoFence">修改围栏</button>
              <button type="button" class="btn btn-danger" @click="deleteGeoFence">删除围栏</button>
            </template>
          </div>
        </div>
        <div class="col-4">
          <div class="status-info">{{operationStatus}}</div>
        </div>
        <div class="col-3">
          <div class="map-toolbar" v-show="showSubmit" style="float: right;">
            <button type="button" class="btn btn-primary" @click="submitGeoFence">提交</button>
            <button type="button" class="btn btn-danger" @click="dismissAction">取消</button>
          </div>
        </div>
        <div class="col-1"></div>
      </div>

      <label for="geo-fence-info"><strong>电子围栏信息</strong></label>
      <div  id="geo-fence-info">
        <div class="row">
          <div class="col-12">
            {{geoFence.name}}<br>
            {{geoFence.valid_time}}<br>
            {{geoFence.enable}}
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
            <p>确认删除围栏？围栏数据不可恢复</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="submitGeoFence">确定</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    @click="dismissAction">取消</button>
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
import VueAMap from 'vue-amap'
let amapManager = new VueAMap.AMapManager()
export default {
  name: 'secSetting',
  components: { LoginModal },
  data () {
    return {
      amapManager,
      mapView: {
        zoom: 14,
        markers: [],
        mapCenter: [113.874908, 22.902537],
        lng: 0,
        lat: 0,
        plugin: [
          {
            pName: 'Geolocation',
            events: {
              // init (o) {
              // o 是高德地图定位插件实例
              // auto load current location
              // o.getCurrentPosition((status, result) => {
              //   if (result && result.position) {
              //     console.log(result.position.lng + ' ' + result.position.lat)
              //     self.mapView.lng = result.position.lng
              //     self.mapView.lat = result.position.lat
              //     self.mapView.mapCenter = [self.mapView.lng, self.mapView.lat]
              //     // self.loaded = true
              //     self.$nextTick()
              //   }
              // })
              // }
            }
          },
          {
            pName: 'OverView',
            isOpen: true
          },
          {
            pName: 'PolyEditor'
          }
        ],
        polygon: {
          visible: false,
          editable: false,
          // Initial path Dongguan University of T
          path: [
            // [113.874908, 22.902537],
            // [113.879000, 22.902537],
            // [113.879000, 22.905000],
            // [113.874908, 22.905000]
          ],
          events: {
            click: () => {
              console.log(this.$refs.polygon_0.$$getPath())
            }
          }
        }

      },
      geoFence: {},
      disableClk: true,
      showSubmit: false,
      hasClicked: false,
      currentAction: -1, // 0:new,1:modify,2:delete,-1:default
      gid: '', // geo fence id
      previousPath: [],
      operationStatus: ''
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
        this.getGeoFence()
      }
    }
  },
  methods: {
    onSearchResult (pois) {
      this.mapView.markers = []
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi
          lngSum += lng
          latSum += lat
          this.mapView.markers.push([poi.lng, poi.lat])
        })
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.mapView.mapCenter = [center.lng, center.lat]
      }
    },
    addGeoFence () {
      this.operationStatus = ''
      if (this.disableClk) {
        return
      }

      let lng = amapManager.getMap().getCenter().lng
      let lat = amapManager.getMap().getCenter().lat
      this.mapView.mapCenter = [lng, lat]
      this.mapView.polygon.path = [
        [lng - 0.005, lat + 0.005],
        [lng + 0.005, lat + 0.005],
        [lng + 0.005, lat - 0.005],
        [lng - 0.005, lat - 0.005]
      ]

      this.currentAction = 0
      this.showSubmit = true
      this.mapView.polygon.visible = true
      this.mapView.polygon.editable = true
    },
    modifyGeoFence () {
      this.operationStatus = ''
      if (!this.disableClk) {
        return
      }

      this.previousPath = this.$refs.polygon_0.$$getPath()
      this.currentAction = 1
      this.showSubmit = true
      this.mapView.polygon.editable = true
    },
    deleteGeoFence () {
      this.operationStatus = ''
      if (!this.disableClk) {
        return
      }
      this.currentAction = 2
      $('#delConfirmModal').modal({
        backdrop: 'static'
      })
      // modal dialog
    },
    dismissAction () {
      this.operationStatus = ''
      if (this.currentAction === 0) {
        this.showSubmit = false
        this.mapView.polygon.visible = false
        this.mapView.polygon.editable = false
      } else if (this.currentAction === 1) {
        this.mapView.polygon.path = this.previousPath
        this.showSubmit = false
        this.mapView.polygon.editable = false
      }
      this.currentAction = -1
    },
    setMapCenter (obj) {
      this.mapView.mapCenter = [
        parseFloat(obj.substring(0, obj.indexOf(','))),
        parseFloat(obj.substring(obj.indexOf(',') + 1))
      ]
    },
    setPolygonPath (obj) {
      this.mapView.polygon.path = []
      let point = []
      do {
        point.push(parseFloat(obj.substring(0, obj.indexOf(','))))
        obj = obj.substring(obj.indexOf(',') + 1)
        if (obj.includes(';')) {
          point.push(parseFloat(obj.substring(0, obj.indexOf(';'))))
          obj = obj.substring(obj.indexOf(';') + 1)
        } else {
          point.push(parseFloat(obj))
        }
        this.mapView.polygon.path.push(point)
        point = []
      } while (obj.includes(','))
    },
    getPolygonPath () {
      let temp = this.$refs.polygon_0.$$getPath()
      let points = ''
      for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < 2; j++) {
          points += temp[i][j]
          if (j === 0) {
            points += ','
          }
        }
        if (i + 1 === temp.length) {
          break
        }
        points += ';'
      }
      return points
    },
    checkNumOfPoints () {
      if (this.$refs.polygon_0.$$getPath().length < 3 || this.$refs.polygon_0.$$getPath() > 5000) {
        alert('围栏点的数量必须大于等于3个小于等于50个(3≤点数≤5000)')
        return false
      } else {
        return true
      }
    },
    getGeoFence () {
      this.checkSession().then(response => {
        if (response) {
          this.hasClicked = true
          this.operationStatus = '获取围栏中...'
          this.axios.get('https://restapi.amap.com/v4/geofence/meta?key=' + this.getMapKey(),
            { withCredentials: false }).then(response => {
            // console.log(response)
            if (response.data.data.total_record === 0) {
              this.operationStatus = '暂无围栏'
              this.disableClk = false
            } else if (response.data.data.total_record > 0) {
              this.disableClk = true
              this.mapView.polygon.visible = true
              this.setPolygonPath(response.data.data.rs_list[0].points)
              this.setMapCenter(response.data.data.rs_list[0].center)
              this.gid = response.data.data.rs_list[0].gid
              amapManager.getMap().setFitView()
              this.geoFence = response.data.data.rs_list[0]
              this.operationStatus = '围栏获取成功'
            } else {
              console.log('获取失败：' + response.data.data.message)
              console.log(response)
            }
          }, response => {
            this.operationStatus = '请求获取围栏失败'
            console.log('get geofence failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
        this.hasClicked = false
      })
    },
    submitGeoFence () {
      if (this.hasClicked) {
        return
      }
      this.hasClicked = true
      this.checkSession().then(response => {
        if (response) {
          this.mapView.polygon.editable = false
          this.showSubmit = false
          if (this.currentAction === -1) {

          } else if (this.currentAction === 0) { // new geo fence
            if (!this.checkNumOfPoints()) {
              this.hasClicked = false
              return
            }
            this.operationStatus = '正在创建围栏...'
            let newGeoFence = {
              name: 'ltcGeoFence',
              points: this.getPolygonPath(),
              valid_time: '2020-12-31',
              repeat: 'Mon,Tues,Wed,Thur,Fri,Sat,Sun',
              alert_condition: 'enter;leave'
            }
            this.axios.post('https://restapi.amap.com/v4/geofence/meta?key=' + this.getMapKey(),
              newGeoFence, { withCredentials: false }).then(response => {
              if (response.data.data.message === '成功') {
                this.gid = response.data.data.gid
                let postData = {
                  gid: this.gid,
                  points: this.$refs.polygon_0.$$getPath()
                }
                this.axios.post(this.getAPI() + '/location/create-geofence', postData).then(response => {
                  if (response.data === 100) {
                    this.operationStatus = '围栏创建成功'
                    console.log('围栏创建成功')
                    amapManager.getMap().setFitView()
                  }
                }, response => {
                  alert('围栏数据储存失败，将影响正常运作')
                  this.operationStatus = '围栏数据储存失败，请删除并重新创建'
                  console.log('围栏数据储存失败，请删除并重新创建')
                  console.log(response)
                })
                this.disableClk = true
              } else {
                this.mapView.polygon.visible = false
                this.operationStatus = '围栏创建失败: ' + response.data.data.message
                console.log('围栏创建失败: ' + response.data.data.message)
              }
            }, response => {
              this.mapView.polygon.visible = false
              this.operationStatus = '请求失败，围栏创建失败'
              console.log('网络请求失败')
              console.log('围栏创建失败')
              console.log(response)
            })
            // end of add new geo fence
          } else if (this.currentAction === 1) { // modify geo fence
            if (!this.checkNumOfPoints()) {
              this.hasClicked = false
              return
            }
            this.operationStatus = '正在更新围栏...'
            let modifyGeoFence = {
              name: 'ltcGeoFence',
              points: this.getPolygonPath(),
              valid_time: '2020-12-31',
              repeat: 'Mon,Tues,Wed,Thur,Fri,Sat,Sun',
              alert_condition: 'enter;leave'
            }
            this.axios.patch('https://restapi.amap.com/v4/geofence/meta?key=' + this.getMapKey() +
              '&gid=' + this.gid, modifyGeoFence, { withCredentials: false }).then(response => {
              if (response.data.data.message === '成功') {
                let postData = {
                  gid: this.gid,
                  points: this.$refs.polygon_0.$$getPath()
                }
                this.axios.post(this.getAPI() + '/location/update-geofence', postData).then(response => {
                  if (response.data === 100) {
                    this.operationStatus = '围栏更新成功'
                    amapManager.getMap().setFitView()
                    console.log('围栏更新成功')
                  }
                }, response => {
                  alert('围栏数据储存失败，将影响正常运作')
                  this.operationStatus = '围栏数据储存失败，请重新更新围栏数据'
                  console.log('围栏数据储存失败，请重新更新围栏数据')
                  console.log(response)
                })
              } else {
                this.mapView.polygon.path = this.previousPath
                this.operationStatus = '围栏更新失败: ' + response.data.data.message
                console.log('围栏更新失败: ' + response.data.data.message)
              }
            }, response => {
              this.mapView.polygon.path = this.previousPath
              this.operationStatus = '请求失败，围栏更新失败'
              console.log('网络请求失败')
              console.log('围栏更新失败')
              console.log(response)
            })
          //  end of modify geo fence
          } else if (this.currentAction === 2) { // delete geo fence
            this.operationStatus = '正在删除围栏...'
            $('#delConfirmModal').modal('hide')
            this.axios.delete('https://restapi.amap.com/v4/geofence/meta?key=' +
              this.getMapKey() + '&gid=' + this.gid,
            { withCredentials: false }).then(response => {
              if (response.data.data.message === '成功') {
                this.operationStatus = '围栏删除成功'
                this.mapView.polygon.visible = false
                this.mapView.polygon.editable = false
                this.disableClk = false
                this.mapView.polygon.path = []
                let postData = {
                  gid: this.gid
                }
                this.axios.post(this.getAPI() + '/location/delete-geofence', postData).then(response => {
                  if (response.data === 100) {
                    console.log('数据库围栏删除成功')
                  }
                }, response => {
                  console.log('数据库围栏删除失败')
                  console.log(response)
                })
              } else {
                this.operationStatus = '围栏删除失败：' + response.data.data.message
                console.log('围栏删除失败：' + response.data.data.message)
              }
            }, response => {
              this.operationStatus = '请求失败，围栏删除失败'
              console.log('网络请求失败')
              console.log('围栏删除失败')
              console.log(response)
            })
            // end of delete geo fence
          } else {

          }
          this.currentAction = -1
        } else {
          $('#loginModal').modal('show')
        }
      })
      this.hasClicked = false
    }
  },
  beforeMount () {
    this.getGeoFence()
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

  .search-box {
    position: absolute;
    top: 25px;
    left: 20px;
  }

  .amap-wrapper {
    width: auto;
    height: 650px;
  }

  .map-toolbar {
       padding: 10px 0;
     }

  .map-toolbar button {
    margin-right: 5px;
  }

  .status-info {
    padding: 15px 0;
  }
</style>
