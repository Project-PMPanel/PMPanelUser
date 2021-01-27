<template>
  <div class="main user-layout-register">
    <div v-if="loading" style="text-align: center;margin: 40px 0">
      <a-spin size="large" tip="Loading..." :spinning="loading"/>
    </div>
    <div v-else>
      <h3 style="margin-top:8px;text-align: center"><span>{{ $t('register.title') }}</span></h3>
      <div v-if="(registerEnable && !registerInviteOnly) || (inviteCode !== undefined && inviteCode !== '' && inviteCode.length >= 4)">
        <a-form ref="formRegister" :form="form" id="formRegister">
          <a-form-item v-if="!this.emailEnable">
            <a-input
              size="large"
              type="text"
              :placeholder="$t('register.email')"
              v-decorator="['email', {rules: [{ required: true, type: 'email', message: $t('register.emailMessage') }], validateTrigger: ['change', 'blur']}]">
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
          <a-form-item v-else>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('register.email')"
              v-decorator="['email', {rules: [{ required: true, message: $t('register.emailMessage') }], validateTrigger: ['change', 'blur']}]">
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              <a-select slot="addonAfter" v-model="emailList[0]" style="width: 130px" @change="onChange">
                <a-select-option :value="item" :key="index" v-for="(item, index) in emailList" >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-input>
          </a-form-item>

          <a-popover
            placement="rightTop"
            :trigger="['focus']"
            :getPopupContainer="(trigger) => trigger.parentElement"
            v-model="state.passwordLevelChecked">
            <template slot="content">
              <div :style="{ width: '240px' }">
                <div :class="['user-register', passwordLevelClass]"> {{ $t('register.passwordStrength') }}
                  ：<span>{{ passwordLevelName }}</span></div>
                <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
                <div style="margin-top: 10px;">
                  <span>{{ $t('register.passwordStrengthMessage') }}</span>
                </div>
              </div>
            </template>
            <a-form-item>
              <a-input-password
                size="large"
                :placeholder="$t('register.password')"
                @click="handlePasswordInputClick"
                v-decorator="['password', {rules: [{ required: true, message: $t('register.passwordMessage') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
              >
                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input-password>
            </a-form-item>
          </a-popover>

          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('register.repassword')"
              v-decorator="['password2', {rules: [{ required: true, message: $t('register.passwordMessage') }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>

          <a-form-item v-if="inviteCode !== undefined && inviteCode !== '' && inviteCode.length >= 4">
            <a-input
              size="large"
              :placeholder="$t('register.inviteCode') + ': ' + inviteCode"
              disabled
            >
              <a-icon slot="prefix" type="smile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16" v-if="emailEnable">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input
                  size="large"
                  type="text"
                  :placeholder="$t('register.checkCode')"
                  v-decorator="['checkCode', {rules: [{ required: true, message: $t('register.checkCodeMessage') }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="code" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                size="large"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && $t('register.getCheckCode')||(count+' s')"></a-button>
            </a-col>
          </a-row>

          <a-form-item>
            <a-button
              size="large"
              type="primary"
              htmlType="submit"
              class="register-button"
              :loading="registerBtn"
              @click.stop.prevent="handleSubmit"
              :disabled="registerBtn"> {{ $t('register.registerBtn') }}
            </a-button>
            <router-link class="login" :to="{ name: 'login' }"> {{ $t('login.loginBtn') }}</router-link>
          </a-form-item>
        </a-form>
      </div>
      <div v-else-if="registerEnable && registerInviteOnly">
        <h2 style="text-align: center"> {{ $t('register.inviteOnlyMessage') }} </h2>
      </div>
      <div v-else>
        <h2 style="text-align: center"> {{ $t('register.closeMessage') }} </h2>
      </div>
      <select-lang style="margin-top: -20px;float: right" />
    </div>
  </div>
</template>

<script>
import { getSiteConfig, getEmailCheckCode, register } from '@/api/auth'
import { deviceMixin } from '@/store/device-mixin'
import i18n from '@/locales'
import storage from 'store'

const levelNames = {
  0: i18n.t('register.passwordLevel.0'),
  1: i18n.t('register.passwordLevel.1'),
  2: i18n.t('register.passwordLevel.2'),
  3: i18n.t('register.passwordLevel.3')
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
const checkCodeCount = 60

export default {
  name: 'Register',
  components: {},
  mixins: [deviceMixin],
  data () {
    return {
      loading: true,
      registerEnable: true,
      registerInviteOnly: false,
      emailEnable: false,
      emailList: [],
      emailSuffix: '',
      form: this.$form.createForm(this),
      count: '',
      timer: null,
      state: {
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      inviteCode: undefined,
      registerBtn: false
    }
  },
  async created () {
    // get config
    const result = await getSiteConfig()
    storage.set('SITE_TITLE', result.data.panelSiteTitle)
    if (result.data.panelSiteRegisterEnable) {
      // 允许注册, 判断是否开启邀请注册
      if (result.data.panelSiteRegisterInviteOnly) {
        this.registerInviteOnly = true
      }
    } else {
      // 不允许注册
      this.registerEnable = false
    }
    if (result.data.panelMailRegisterEnable) {
      this.emailEnable = true
      this.emailList = result.data.emailList
      this.emailSuffix = this.emailList[0]
      console.log(this.emailList)
    }
    // 获取url的参数,设置aff到cookie
    if (this.$route.params.inviteCode === undefined) {
      if (this.registerInviteOnly) {

      }
    } else {
      this.inviteCode = this.$route.params.inviteCode
    }
    this.loading = false
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    onChange (value) {
      this.emailSuffix = value
    },
    handlePasswordLevel (rule, value, callback) {
      let level = 0

      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback()
      }
    },

    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      console.log('value', value)
      if (value === undefined) {
        callback()
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error(i18n.t('register.repasswordMessage')))
      }
      callback()
    },

    handlePasswordInputClick () {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },

    async getCaptcha () {
      const param = {
        'email': this.form.getFieldValue('email') + this.emailSuffix,
        'type': 0
      }
      const result = await getEmailCheckCode(param)
      if (result.code === 200) {
        this.count = checkCodeCount
        this.state.smsSendBtn = true
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= checkCodeCount) {
            this.count--
          } else {
            this.state.smsSendBtn = false
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
      console.log(result)
    },

    async handleSubmit () {
      const { form: { validateFields }, state } = this
      let notErr = false
      validateFields({ force: true }, (err) => {
        if (!err) {
          state.passwordLevelChecked = false
          notErr = !err
        }
      })
      if (notErr) {
        let regParam
        if (this.emailEnable) {
          regParam = {
            'email': this.form.getFieldValue('email') + this.emailSuffix,
            'password': this.form.getFieldValue('password'),
            'checkCode': this.form.getFieldValue('checkCode')
          }
        } else {
          regParam = {
            'email': this.form.getFieldValue('email'),
            'password': this.form.getFieldValue('password'),
            'checkCode': this.form.getFieldValue('checkCode')
          }
        }
        if (this.inviteCode !== undefined) {
          regParam.inviteCode = this.inviteCode
        }
        console.log(regParam)
        const result = await register(regParam)
        console.log(result)
        if (result.code === 200) {
          this.$notification.success({
            description: this.$t('register.registerSuccess')
          })
          // 延迟 1 秒显示欢迎信息
          setTimeout(() => {
            this.$router.push({ path: '/auth/login' })
          }, 2000)
        }
      }
    },

    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.registerBtn = false
    }
  },
  watch: {
    'state.passwordLevel' (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less">
.user-register {

  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }

}

.user-layout-register {
  .ant-input-group-addon:first-child {
    background-color: #fff;
  }
}
</style>
<style lang="less" scoped>
.user-layout-register {

  & > h3 {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .register-button {
    width: 50%;
  }

  .login {
    float: right;
    line-height: 40px;
  }
}
</style>
