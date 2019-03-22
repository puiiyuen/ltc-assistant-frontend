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
              :vid="'amap-vue'"
              :plugin="mapView.plugin"
              :center="mapView.mapCenter"
              :zoom="mapView.zoom"
            >
              <el-amap-marker
                v-for="marker in mapView.markers"
                :position="marker"
              ></el-amap-marker>
              <el-amap-polygon :path="mapView.polygon.path" :editable="mapView.polygon.editable" :ref="`polygon_0`"
                               :events="mapView.polygon.events" :draggable="mapView.polygon.dragEnable"
                               fillOpacity="0.3" fillColor="blue"
                               strokeOpacity="0.6" strokeColor="pink"
                               zIndex="10" :visible="mapView.polygon.visible">
              </el-amap-polygon>
            </el-amap>
          </div>
          <div class="col-1"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <div class="map-toolbar">
            <button type="button" class="btn btn-primary"
                    @click="addGeoFence" :class="{disabled:disableClk}">添加围栏</button>
            <button type="button" class="btn btn-success"
                    @click="modifyGeoFence" :class="{disabled:!disableClk}">修改围栏</button>
            <button type="button" class="btn btn-danger"
                    @click="deleteGeoFence" :class="{disabled:!disableClk}">删除围栏</button>
          </div>
        </div>
        <div class="col-4"></div>
        <div class="col-4">
          <div class="map-toolbar" v-show="showSubmit">
            <button type="button" class="btn btn-primary" @click="submitGeoFence">提交</button>
            <button type="button" class="btn btn-danger" @click="dismissAction">取消</button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          {{geoFence}}
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
  name: 'secSetting',
  components: { LoginModal },
  data () {
    let self = this.mapView
    return {
      mapView: {
        zoom: 14,
        markers: [],
        mapCenter: [113.874908, 22.902537],
        lng: 0,
        lat: 0,
        // loaded: false,
        plugin: [
          {
            pName: 'Geolocation',
            events: {
              click (obj) {
                obj.getCurrentLocation((status, result) => {
                  if (result && result.position) {
                    self.lng = result.position.lng
                    self.lat = result.position.lat
                    self.mapCenter = [self.lng, self.lat]
                  }
                })
              }
              // init (o) {
              //   // o 是高德地图定位插件实例
              //   // auto load current location
              //   o.getCurrentPosition((status, result) => {
              //     if (result && result.position) {
              //       self.lng = result.position.lng
              //       self.lat = result.position.lat
              //       self.center = [self.lng, self.lat]
              //       self.loaded = true
              //       self.$nextTick()
              //     }
              //   })
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
          dragEnable: false,
          editable: false,
          // Initial path Dongguan University of T
          path: [[113.874908, 22.902537],
            [113.879000, 22.902537],
            [113.879000, 22.905000],
            [113.874908, 22.905000]],
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
      currentAction: -1, // 0:new,1:modify,2:delete,-1:default
      gid: '', // geo fence id
      previousPath: []
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
    },
    mapCenter () {

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
      if (this.disableClk) {
        return
      }
      this.currentAction = 0
      this.showSubmit = true
      this.mapView.polygon.visible = true
      this.mapView.polygon.editable = true
      this.mapView.polygon.dragEnable = true
    },
    modifyGeoFence () {
      if (!this.disableClk) {
        return
      }
      this.previousPath = this.$refs.polygon_0.$$getPath()
      this.currentAction = 1
      this.showSubmit = true
      this.mapView.polygon.editable = true
      this.mapView.polygon.dragEnable = true
    },
    deleteGeoFence () {
      if (!this.disableClk) {
        return
      }
      this.currentAction = 2
      // modal dialog
    },
    dismissAction () {
      if (this.currentAction === 0) {
        this.showSubmit = false
        this.mapView.polygon.visible = false
        this.mapView.polygon.editable = false
        this.mapView.polygon.dragEnable = false
      } else if (this.currentAction === 1) {
        this.mapView.polygon.path = this.previousPath
        this.showSubmit = false
        this.mapView.polygon.editable = false
        this.mapView.polygon.dragEnable = false
      }
      this.currentAction = -1
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
    getGeoFence () {
      this.checkSession().then(response => {
        if (response) {
          this.axios.get('https://restapi.amap.com/v4/geofence/meta?key=' + this.getMapKey(),
            { withCredentials: false }).then(response => {
            console.log(response)
            if (response.data.data.total_record === 0) {
              this.disableClk = false
            } else if (response.data.data.total_record > 0) {
              this.disableClk = true
              this.mapView.polygon.visible = true
              this.setPolygonPath(response.data.data.rs_list[0].points)
              this.gid = response.data.data.rs_list[0].gid
            }
          }, response => {
            console.log('get geofence failed')
            console.log(response)
          })
        } else {
          $('#loginModal').modal('show')
        }
      })
    },
    submitGeoFence () {
      this.checkSession().then(response => {
        if (response) {
          if (this.currentAction === -1) {

          } else if (this.currentAction === 0) { // new geo fence
            this.mapView.polygon.editable = false
            let newGeoFence = {
              name: 'ltcGeoFence',
              points: this.getPolygonPath(),
              valid_time: '2020-12-31',
              repeat: 'Mon,Tues,Wed,Thur,Fri,Sat,Sun',
              alert_condition: 'enter;leave'
            }
            console.log(newGeoFence)
            this.axios.post('https://restapi.amap.com/v4/geofence/meta?key=' + this.getMapKey(),
              newGeoFence, { withCredentials: false }).then(response => {
              if (response.data.data.message === '成功') {
                console.log('围栏创建成功')
              } else {
                console.log('围栏创建失败: ' + response.data.data.message)
              }
            }, response => {
              console.log('网络请求失败')
              console.log('围栏创建失败')
              console.log(response)
            })
          } else if (this.currentAction === 1) { // modify geo fence
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
                console.log('围栏更新成功')
              }
            }, response => {
              console.log('网络请求失败')
              console.log('围栏更新失败')
              console.log(response)
            })
          } else if (this.currentAction === 2) { // delete geo fence

          } else {

          }
          this.dismissAction()
        } else {
          $('#loginModal').modal('show')
        }
      })
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
</style>
