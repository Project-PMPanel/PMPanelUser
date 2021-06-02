<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="24">
        <a-form layout="vertical">
          <a-button type="primary" @click="bindTG">{{ $i18n.t('usercenter.settings.binding.tg') }}</a-button>
        </a-form>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import { getTGConfig } from '@/api/usercenter'
export default {
  data () {
    return {
      botUsername: ''
    }
  },
  async created () {
    const result = await getTGConfig()
    if (result.code === 200) {
      this.botUsername = result.data.botUsername
    }
  },
  methods: {
    bindTG () {
      const url = 'https://t.me/' + this.botUsername + '?start=' + this.$store.getters.userInfo.uuid
      window.location.href = url
    }
  }
}
</script>

<style scoped>

</style>
