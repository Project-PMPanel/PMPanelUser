<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="24">
        <a-form layout="vertical">
          <a-button v-if="!bindTGFlag" type="primary" @click="bindTG">{{ $i18n.t('usercenter.settings.binding.tg') }}</a-button>
          <a-button v-else type="danger" @click="unBindTG">{{ $i18n.t('usercenter.settings.binding.unbinding.tg') }}</a-button>
        </a-form>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import { getTGConfig, unBindTG } from '@/api/usercenter'
export default {
  data () {
    return {
      bindTGFlag: false,
      botUsername: '',
      user: this.$store.getters.userInfo
    }
  },
  async created () {
    const result = await getTGConfig()
    if (result.code === 200) {
      this.botUsername = result.data.botUsername
      if (this.user.uuid !== null) {
        this.bindTGFlag = true
      }
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
        this.bindTGFlag = false
      }
    }
  }
}
</script>

<style scoped>

</style>
