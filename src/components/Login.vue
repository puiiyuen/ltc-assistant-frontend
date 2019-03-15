<template>
  <div>
    <div id="loginFrame">
      <div id="title"><h3>用户登录</h3></div>
      <div id="login">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group id="userId"
                        label="ID:"
                        label-for="userIdInput">
            <b-form-input id="userIdInput"
                          type="text"
                          v-model="form.userId"
                          required
                          placeholder="输入ID">
            </b-form-input>
          </b-form-group>
          <b-form-group id="password"
                        label="密码:"
                        label-for="passwordInput">
            <b-form-input id="passwordInput"
                          type="password"
                          v-model="form.password"
                          required
                          placeholder="输入密码">
            </b-form-input>
          </b-form-group>
          <div id="loginStatus">
            <span>{{loginStatus}}</span>
          </div>
          <b-button type="submit" variant="primary" size="md" class="sub-btn" v-bind:class="{disabled:hasClicked}">登陆
          </b-button>
          <b-button type="reset" variant="danger" size="md" class="sub-btn" v-bind:class="{disabled:hasClicked}">重置
          </b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import vuex from '@/store'
export default {
  data () {
    return {
      form: {
        userId: '',
        password: ''
      },
      loginStatus: '',
      show: true,
      hasClicked: false
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      if (this.hasClicked) {
        return
      }
      let idRex = /[0-9]+/
      if (idRex.test(this.form.userId)) {
        this.hasClicked = true
        this.loginStatus = '登陆中...'
        this.login().then(response => {
          if (response === 100) {
            this.loginStatus = '登陆成功'
            this.fetchData()
            if (this.$route.params.toPath !== undefined) {
              this.$router.push({ name: this.$route.params.toPath })
            } else {
              this.$router.push({ name: 'home' })
            }
          } else if (response === 500) {
            this.loginStatus = '账户尚未激活'
            this.hasClicked = false
            this.$router.push({ name: 'activate' })
          } else if (response === 210) {
            this.loginStatus = '请求超时，请重试'
            this.hasClicked = false
          } else if (response === -999) {
            this.loginStatus = '服务器开小差了，请重试'
            this.hasClicked = false
          } else {
            this.loginStatus = 'ID或密码不正确'
            this.hasClicked = false
          }
        })
      } else {
        this.loginStatus = 'ID必须为数字'
      }
    },
    onReset (evt) {
      evt.preventDefault()
      if (this.hasClicked) {
        return
      }
      /* Reset our form values */
      this.form.userId = ''
      this.form.password = ''
      this.loginStatus = ''
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    async login () {
      let postData = { 'userId': this.form.userId, 'password': this.form.password }
      let statusCode = 200
      await this.axios.post(this.getAPI() + '/login', postData, { timeout: 15000 }).then(response => {
        console.log(response.data)
        statusCode = response.data
      }, response => {
        if (response.code === 'ECONNABORTED' && response.toString().indexOf('timeout') !== -1) {
          statusCode = 210
        } else {
          console.log('post failed')
          console.log(response)
        }
      })
      return statusCode
    },
    fetchData () {
      this.axios.get(this.api + 'user').then(response => {
        localStorage.setItem('user', JSON.stringify(response.data))
        vuex.commit('setUser')
      }, response => {
        console.log('post failed')
        console.log(response)
      })
    }
  },
  created () {
    this.checkSession().then(response => {
      if (response) {
        this.$router.push({ name: 'home' })
      }
    })
  }
}
</script>

<style scoped>
  #title{
    margin: auto;
    text-align: center;
    padding-top: 30px;
  }
  #loginFrame {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 320px;
    height: 350px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    /*border-radius: 10px;*/
  }

  #login {
    padding: 15px 0;
    width: 280px;
    margin: auto;
  }

  #loginStatus {
    padding-bottom: 10px;
    font-size: 13px;
    color: red;
  }

  .sub-btn {
    padding: 4px 20px;
    margin-right: 5px;
    border-radius: 0;
  }
</style>
