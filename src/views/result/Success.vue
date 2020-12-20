<template>
  <a-card :bordered="false">
    <a-result status="success" :title="$t('result.success.title')">
      <template #extra>
        <router-link to="/dashboard">{{ $t('menu.dashboard') }}</router-link><br>
        {{ $t('menu.tutorials') }}
        (
        <router-link to="/tutorials/windows">Windows</router-link>|
        <router-link to="/tutorials/android">Android</router-link>|
        <router-link to="/tutorials/mac">Mac</router-link>|
        <router-link to="/tutorials/ios">iOS</router-link>
        )
      </template>
    </a-result>
  </a-card>
</template>

<script>

export default {
  name: 'Success',
  data () {
    return {
    }
  },
  created () {
    this.refreshInfo()
  },
  methods: {
    refreshInfo () {
      this.$http.get('/user/info')
        .then(res => {
          this.$store.commit('SET_INFO', res.data.user)
          this.user = this.userInfo
        })
    }
  }
}
</script>
