<template>
  <div id="activateFrame">
    <div id="activate">
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
        <b-form-group id="activateCode"
                      label="激活码:"
                      label-for="activateCodeInput">
          <b-form-input id="activateCodeInput"
                        type="text"
                        v-model="form.activateCode"
                        required
                        placeholder="输入激活码">
          </b-form-input>
        </b-form-group>
        <b-form-group id="password"
                      label="请输入密码:"
                      label-for="passwordInput">
          <b-form-input id="passwordInput"
                        type="password"
                        v-model="form.password"
                        required
                        placeholder="输入密码">
          </b-form-input>
        </b-form-group>
        <b-form-group id="password2"
                      label="请再次输入密码:"
                      label-for="password2Input">
          <b-form-input id="password2Input"
                        type="password"
                        v-model="form.password2"
                        required
                        placeholder="输入密码">
          </b-form-input>
        </b-form-group>
        <div id="activateStatus">
          <span>{{activateStatus}}</span>
        </div>
        <b-button type="submit" variant="primary" size="sm" class="sub-btn" v-bind:class="{disabled:hasClicked}">激活
        </b-button>
        <b-button type="reset" variant="danger" size="sm" class="sub-btn" v-bind:class="{disabled:hasClicked}">重置
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Activate',
  data () {
    return {
      form: {
        userId: '',
        password: '',
        password2: '',
        activateCode: ''
      },
      activateStatus: '',
      show: true,
      activateApi: 'http://localhost:8080/activate',
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
        if (this.form.password === this.form.password2) {
          this.hasClicked = true
          this.activateStatus = '激活中...'
          this.activate().then(response => {
            if (response === 100) {
              this.activateStatus = '激活成功'
              this.$router.push({ name: 'login' })
            } else if (response === 210) {
              this.activateStatus = '请求超时，请重试'
              this.hasClicked = false
            } else if (response === -999) {
              this.activateStatus = '服务器开小差了，请重试'
              this.hasClicked = false
            } else {
              this.activateStatus = 'ID或激活码不正确'
              this.hasClicked = false
            }
          })
        } else {
          this.activateStatus = '两次密码输入不一致'
        }
      } else {
        this.activateStatus = 'ID必须为数字'
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
      this.activateStatus = ''
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    async activate () {
      let postData = { 'userId': this.form.userId,
        'password': this.form.password,
        'activateCode': this.form.activateCode }
      let statusCode = 200
      await this.axios.post(this.activateApi, postData, { timeout: 15000 }).then(response => {
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
    }
  }
}
</script>

<style scoped>
  #activateFrame {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 320px;
    height: 450px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 10px;
  }

  #activate {
    padding: 15px 0;
    width: 280px;
    margin: auto;
  }

  #activateStatus {
    padding-bottom: 10px;
    font-size: 13px;
    color: red;
  }

  .sub-btn {
    padding: 4px 20px;
    margin-right: 5px;
  }
</style>
