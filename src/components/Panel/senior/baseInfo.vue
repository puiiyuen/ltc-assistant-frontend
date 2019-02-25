<template>
  <div id="info-table">
    <div id="panel-title"><h5><strong>基本信息</strong></h5></div>
    <div id="search-info">
      <form class="form-inline my-2 my-lg-0">
        <label for="search-input">搜索住户:</label>
        <input id="search-input" class="form-control mr-sm-2" type="search" placeholder="输入ID、姓名、床号" aria-label="Search" required>
        <button class="btn btn-success my-2 my-sm-0" type="submit">搜索</button>
      </form>
    </div>
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
      <tr v-for="(object,index) in residents" data-target="#infoModal" data-toggle="modal" @click="getDetail(index)">
        <th scope="row">{{index+1}}</th>
        <td v-for="value in object">
          {{value}}
        </td>
      </tr>
      </tbody>
    </table>
    <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">详细信息</h5>
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
                <th scope="row">ID：</th>
                <td>{{residentDetail.id}}</td>
                <th scope="row">姓名：</th>
                <td>{{residentDetail.name}}</td>
                <th scope="row">性别：</th>
                <td>{{residentDetail.sex}}</td>
                <th scope="row">出生年月</th>
                <td>{{residentDetail.dob}}</td>
                <td>照片</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td colspan="2">Larry the Bird</td>
                <td>@twitter</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <!--<button type="button" class="btn btn-primary">Save changes</button>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'baseInfo',
  data () {
    return {
      residents: [],
      residentDetail: {},
      loading: true,
      loadingStatus: '加载中...'
    }
  },
  methods: {
    getAllResidentInfo () {
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
    getDetail (index) {
      let postData = { resId: this.residents[index].id }
      this.axios.post('http://localhost:8080/resident/detailInfo', postData, { timeout: 15000 }).then(response => {
        console.log(response.data)
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
    }
  },
  beforeMount () {
    this.getAllResidentInfo()
  }
}
</script>

<style scoped>
  tr:hover{
    cursor: pointer;
  }
  #panel-title{
    padding: 20px 0;
    float: left;
    height: 38px;
  }
  #info-table{
    width: 90%;
  }
  label{
    padding-right:15px ;
  }
  #search-info{
    padding: 20px 0;
    float: right;
  }

</style>
