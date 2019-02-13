<template>
  <div id="loginFrame">
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
        <b-button type="submit" variant="primary" size="sm" class="log-btn" v-bind:class="{disabled:hasClicked}">登陆
        </b-button>
        <b-button type="reset" variant="danger" size="sm" class="log-btn" v-bind:class="{disabled:hasClicked}">重置
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        userId: '',
        password: ''
      },
      loginStatus: '',
      show: true,
      loginApi: 'http://localhost:8080/login',
      hasClicked: false
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.hasClicked = true
      this.login().then(response => {
        if (response) {
          this.loginStatus = '登陆成功'
        } else {
          this.loginStatus = 'ID或密码不正确'
          this.hasClicked = false
        }
      })
    },
    onReset (evt) {
      evt.preventDefault()
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
      var isSuccess = false
      let postData = { 'userId': this.form.userId, 'password': this.form.password }

      await this.axios.post(this.loginApi, postData).then(response => {
        console.log(response.data)
        if (response.data === 100) {
          isSuccess = true
        }
      }, response => {
        console.log('post failed')
      })
      return isSuccess
    }
  }
}
</script>

<style scoped>
  #loginFrame {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 320px;
    height: 280px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 10px;
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

  .log-btn {
    padding: 4px 20px;
    margin-right: 5px;
  }
</style>
