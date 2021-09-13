<template>
  <div class="main user-layout-register">
    <div>
      <a-form ref="formRegister" :form="form" id="formRegister">
        <a-form-item>
          <a-input
            type="text"
            :placeholder="$t('forgot.email')"
            v-decorator="['email', {rules: [{ required: true, type: 'email', message: $t('forgot.emailMessage') }], validateTrigger: ['change', 'blur']}]">
            <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>

        <a-row :gutter="16">
          <a-col class="gutter-row" :span="16">
            <a-form-item>
              <a-input type="text" :placeholder="$t('forgot.checkCode')" v-decorator="['checkCode', {rules: [{ required: true, message: $t('forgot.checkCodeMessage') }], validateTrigger: 'blur'}]">
                <a-icon slot="prefix" type="code" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8" style="padding-left: 0">
            <a-button class="getCaptcha" size="small" :disabled="state.smsSendBtn" @click.stop.prevent="getCaptcha" v-text="!state.smsSendBtn && $t('forgot.getCheckCode')||(count+' s')"></a-button>
          </a-col>
        </a-row>

        <a-popover
          placement="rightTop"
          :trigger="['focus']"
          :getPopupContainer="(trigger) => trigger.parentElement"
          v-model="state.passwordLevelChecked">
          <template slot="content">
            <div :style="{ width: '240px' }">
              <div :class="['user-register', passwordLevelClass]"> {{ $t('forgot.passwordStrength') }}
                ：<span>{{ passwordLevelName }}</span></div>
              <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
              <div style="margin-top: 10px;">
                <span>{{ $t('forgot.passwordStrengthMessage') }}</span>
              </div>
            </div>
          </template>
          <a-form-item>
            <a-input-password
              :placeholder="$t('forgot.password')"
              @click="handlePasswordInputClick"
              v-decorator="['password', {rules: [{ required: true, message: $t('forgot.passwordMessage') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
        </a-popover>

        <a-form-item>
          <a-button
            size="small"
            type="primary"
            htmlType="submit"
            class="forgot-button"
            :loading="forgotBtn"
            @click.stop.prevent="handleSubmit"
            :disabled="forgotBtn"> {{ $t('forgot.forgotBtn') }}
          </a-button>
          <router-link class="login" :to="{ name: 'login' }"> {{ $t('login.loginBtn') }}</router-link>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getEmailCheckCode, findPass } from '@/api/auth'
import { deviceMixin } from '@/store/device-mixin'
import i18n from '@/locales'

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
  name: 'ForgotPass',
  components: {},
  mixins: [deviceMixin],
  data () {
    return {
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
      forgotBtn: false
    }
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

    handlePasswordInputClick () {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },

    async getCaptcha () {
      const param = {
        'email': this.form.getFieldValue('email'),
        'type': 1
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
        const regParam = {
          'email': this.form.getFieldValue('email'),
          'password': this.form.getFieldValue('password'),
          'checkCode': this.form.getFieldValue('checkCode')
        }
        const result = await findPass(regParam)
        console.log(result)
        if (result.code === 200) {
          this.$notification.success({
            description: this.$t('forgot.success')
          })
          // 延迟 1 秒显示欢迎信息
          setTimeout(() => {
            this.$router.push({ name: 'login' })
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
      this.forgotBtn = false
    }
  },
  watch: {
    'state.passwordLevel' (val) {
      console.log(val)
    }
  }
}
</script>

<style scoped>

</style>
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
    height: 32px;
    margin-top: 3px;
    text-align: center;
    float: right;
  }

  .forgot-button {
    font-size: 16px;
    height: 30px;
    width: 100%;
    border-radius: 4px;
  }

  .login {
    float: right;
    line-height: 40px;
  }
}
</style>
