<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="24">

        <a-form layout="vertical">
          <a-form-item :label="$i18n.t('usercenter.settings.security.changePass')" :required="false">
            <a-input type="password" v-model="changePassParams.oldPass" :placeholder="$i18n.t('usercenter.settings.security.changePass.oldPass')"/>
            <br>
            <br>
            <a-input type="password" v-model="changePassParams.newPass" :placeholder="$i18n.t('usercenter.settings.security.changePass.newPass')"/>
            <br>
            <br>
            <a-input type="password" v-model="changePassParams.reNewPass" :placeholder="$i18n.t('usercenter.settings.security.changePass.reNewPass')"/>
          </a-form-item>
          <a-button type="primary" @click="changePass">{{ $i18n.t('setting.change') }}</a-button>

          <br>
          <br>
          <a-form-item :required="false">
            <span slot="label">
              {{ $i18n.t('usercenter.settings.security.changeEmail') }}

            </span>
            <a-input-search v-model="changeEmailParams.checkCode" :placeholder="$i18n.t('usercenter.settings.security.changeEmail.oldEmailCheckCode')" @search="getEmailCheckCode(1)">
              <a-button
                class="getCaptcha"
                type="primary"
                size="small"
                slot="enterButton"
                :disabled="smsSendBtn"
                v-text="!smsSendBtn && $t('forgot.getCheckCode')||(count+' s')">
              </a-button>
            </a-input-search>
            <br>
            <br>
            <a-input v-model="changeEmailParams.email" :placeholder="$i18n.t('usercenter.settings.security.changeEmail.newEmail')"/>
            <br>
            <br>
            <a-input-search v-model="changeEmailParams.newCheckCode" :placeholder="$i18n.t('usercenter.settings.security.changeEmail.newEmailCheckCode')" @search="getEmailCheckCode(2)">
              <a-button
                class="getCaptcha"
                type="primary"
                size="small"
                slot="enterButton"
                :disabled="smsSendBtn2"
                v-text="!smsSendBtn2 && $t('forgot.getCheckCode')||(count2+' s')">
              </a-button>
            </a-input-search>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="changeEmail">{{ $i18n.t('setting.change') }}</a-button>
          </a-form-item>
        </a-form>

      </a-col>
    </a-row>

  </div>
</template>

<script>
import { changePass, getEmailCheckCode, changeEmail } from '@/api/usercenter'
import store from '@/store'

const checkCodeCount = 60

export default {
  data () {
    return {
      count: '',
      count2: '',
      timer: null,
      timer2: null,
      smsSendBtn: false,
      smsSendBtn2: false,
      changePassParams: {
        oldPass: '',
        newPass: '',
        reNewPass: ''
      },
      changeEmailParams: {
        checkCode: '',
        newCheckCode: '',
        email: ''
      }
    }
  },
  methods: {
    async changePass () {
      if (this.changePassParams.newPass !== this.changePassParams.reNewPass) {
        this.$message.error('新密码输入不一致')
      } else {
        if (this.changePassParams.newPass.length < 6) {
          this.$message.warn('新密码需大于6位')
          return
        }
        const params = {
          'password': this.changePassParams.oldPass,
          'newPass': this.changePassParams.newPass
        }
        const result = await changePass(params)
        if (result.code === 200) {
          if (this.$i18n.locale === 'zh-CN') {
            this.$message.success(result.message)
          } else {
            this.$message.success(result.messageEnglish)
          }
          return new Promise((resolve, reject) => {
            store.dispatch('Logout')
            resolve()
            setTimeout(() => {
              this.$router.push('/auth/login')
            }, 1000)
          })
        }
      }
    },
    async getEmailCheckCode (type) {
      const email = (type === 1 ? this.$store.getters.userInfo.email : this.changeEmailParams.email)
      const result = await getEmailCheckCode(email)
      if (result.code === 200) {
        if (type === 1) {
          this.count = checkCodeCount
          this.smsSendBtn = true
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= checkCodeCount) {
              this.count--
            } else {
              this.smsSendBtn = false
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        } else {
          this.count2 = checkCodeCount
          this.smsSendBtn2 = true
          this.timer2 = setInterval(() => {
            if (this.count2 > 0 && this.count2 <= checkCodeCount) {
              this.count2--
            } else {
              this.smsSendBtn2 = false
              clearInterval(this.timer2)
              this.timer2 = null
            }
          }, 1000)
        }
        console.log(result)
      }
    },
    async changeEmail () {
      const params = {
        'checkCode': this.changeEmailParams.checkCode,
        'newCheckCode': this.changeEmailParams.newCheckCode,
        'email': this.changeEmailParams.email
      }
      const result = await changeEmail(params)
      if (result.code === 200) {
        if (this.$i18n.locale === 'zh-CN') {
          this.$message.success(result.message)
        } else {
          this.$message.success(result.messageEnglish)
        }
        return new Promise((resolve, reject) => {
          store.dispatch('Logout')
          resolve()
          setTimeout(() => {
            this.$router.push('/auth/login')
          }, 1000)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
