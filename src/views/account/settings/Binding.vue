<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="24">
        <a-form style="margin-top: 10px" layout="vertical">
          <a-button v-if="!bindTGFlag" type="primary" @click="bindTG">{{ $i18n.t('usercenter.settings.binding.tg') }}</a-button>
          <a-button v-else type="danger" @click="unBindTG">{{ $i18n.t('usercenter.settings.binding.unbinding.tg') }}</a-button>
        </a-form>
        <div v-if="bindConfig.enable">
          <a-form v-if="bindConfig.google" style="margin-top: 10px" layout="vertical">
            <a-button v-if="!bindGoogleFlag" type="primary" @click="bindGoogle">{{ $i18n.t('usercenter.settings.binding.google') }}</a-button>
            <a-button v-else type="danger" @click="unBindGoogle">{{ $i18n.t('usercenter.settings.binding.unbinding.google') }}</a-button>
          </a-form>
        </div>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import { getTGConfig, unBindTG, getBindConfig, getBindInfo, bindAccount, unBindAccount } from '@/api/usercenter'
import { loginWithOther } from '@/api/auth'
export default {
  data () {
    return {
      bindTGFlag: false,
      bindGoogleFlag: false,
      botUsername: '',
      user: {},
      bindConfig: {},
      oauths: []
    }
  },
  async created () {
    // 判断设置了什么绑定
    const bindConfigResult = await getBindConfig()
    if (bindConfigResult.code === 200) {
      console.log(bindConfigResult)
      if (bindConfigResult.data.bindConfig.enable) {
        this.bindConfig.enable = true
        // 判断开启了哪些oauth
        if (bindConfigResult.data.bindConfig.google) {
          this.bindConfig.google = true
        }
      }
      console.log(this.bindConfig)
    }
    // 判断url参数是否需要绑定
    if (this.$route.query.action) {
      console.log(this.$route.query)
      const params = {
        'type': this.$route.query.type,
        'email': this.$route.query.email,
        'uuid': this.$route.query.uuid
      }
      const bindResult = await bindAccount(params)
      if (bindResult.code === 200) {
        this.$notification.success({
          message: bindResult.code,
          description: bindResult.message
        })
      }
    }
    const result = await getTGConfig()
    if (result.code === 200) {
      this.botUsername = result.data.botUsername
      this.$store.dispatch('GetInfo').then(res => {
        this.user = res.data.user
        if (this.user.tgId !== null) {
          console.log('tgId !== null')
          this.bindTGFlag = true
        }
      })
    }
    const result2 = await getBindInfo()
    if (result2.code === 200) {
      console.log(result2.data)
        this.oauths = result2.data.oauths
      this.oauths.forEach((oauth) => {
        console.log(oauth)
        if (oauth.oauthType === 'google') {
          this.bindGoogleFlag = true
        }
      })
      // this.bindGoogleFlag = result2.data
    }
  },
  methods: {
    bindTG () {
      const url = 'https://t.me/' + this.botUsername + '?start=' + this.user.uuid
      window.location.href = url
    },
    async unBindTG () {
      const result = await unBindTG()
      if (result.code === 200) {
        this.$notification.success({
          message: result.code,
          description: result.message
        })
        await this.$store.dispatch('GetInfo')
        this.bindTGFlag = false
      }
    },
    async bindGoogle () {
      const result = await loginWithOther('google')
      console.log(result)
      if (result.code === 200) {
        this.href(result.data.url)
      }
    },
    async unBindGoogle () {
      const result = await unBindAccount('google')
      if (result.code === 200) {
        this.$notification.success({
          message: result.code,
          description: result.message
        })
        await this.$store.dispatch('GetInfo')
        this.bindGoogleFlag = false
      }
    },
    href: function (url) {
      window.location.href = url
    }
  }
}
</script>

<style scoped>

</style>
