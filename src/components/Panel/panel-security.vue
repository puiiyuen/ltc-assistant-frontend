<template>
<div>
  <div class="row">
    <div class="col-12">
      <div id="panel-title">
        <h4><strong>安全中心</strong></h4>
      </div>
    </div>
  </div>

  <label for="geo-fence"><strong>电子围栏</strong></label>
  <div id="geo-fence">
    <div class="row">
      <div class="col-11">
       <div class="amap-wrapper">
         <el-amap
           vid="amap-geo-fence"
           :plugin="mapView.plugin"
           :center="mapView.mapCenter"
           :zoom="mapView.zoom"
           :amap-manager="amapManager"
         >
           <el-amap-marker
             v-for="marker in mapView.markers"
             :position="marker">
           </el-amap-marker>
           <el-amap-polygon :path="mapView.polygon.path" :editable="mapView.polygon.editable" :ref="`polygon_0`"
                            :events="mapView.polygon.events" :draggable="mapView.polygon.editable"
                            fillOpacity="0.3" fillColor="blue"
                            strokeOpacity="0.6" strokeColor="pink"
                            zIndex="50" :visible="mapView.polygon.visible">
           </el-amap-polygon>
         </el-amap>
       </div>
      </div>
      <div class="col-1"></div>
    </div>
  </div>
  <div class="row">
    <div class="col-4">
      <div class="map-toolbar">
        <button type="button" class="btn btn-info" @click="getGeoFence">刷新围栏</button>
      </div>
    </div>
    <div class="col-4">
      <div class="status-info">{{operationStatus}}</div>
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
  name: 'panel-security',
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
          path: [[113.874908, 22.902537],
            [113.879000, 22.902537],
            [113.879000, 22.905000],
            [113.874908, 22.905000]]
        }
      },
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
    getGeoFence () {
      this.checkSession().then(response => {
        if (response) {
          this.operationStatus = '获取围栏中...'
          this.axios.get('https://restapi.amap.com/v4/geofence/meta?key=' + this.getMapKey(),
            { withCredentials: false }).then(response => {
            if (response.data.data.total_record === 0) {
              this.operationStatus = '暂无围栏,请前往安全设置添加'
            } else if (response.data.data.total_record > 0) {
              this.mapView.polygon.visible = true
              this.setPolygonPath(response.data.data.rs_list[0].points)
              this.setMapCenter(response.data.data.rs_list[0].center)
              this.mapView.markers.push([113.874908, 22.902537])
              this.operationStatus = '围栏获取成功'
              amapManager.getMap().setFitView()
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

  .amap-wrapper{
    width: 100%;
    height: 700px;
  }

  #panel-title {
    padding: 20px 0;
  }

  .map-toolbar {
    padding: 10px 0;
  }
  .status-info {
    padding: 15px 0;
  }
</style>
