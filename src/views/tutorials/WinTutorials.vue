<template>
  <page-header-wrapper :breadcrumb="{}">
    <div v-if="loading" style="text-align: center;margin: 40px 0">
      <a-spin size="large" tip="Loading..." :spinning="loading"/>
    </div>
    <div v-else>
      <div v-if="tutorials.length === 0">
        <h1>{{ $i18n.locale === 'zh-CN' ? '暂无教程' : 'No tutorials' }}</h1>
      </div>
      <div v-else>
        <a-tabs>
          <a-tab-pane :key="index" v-for="(item, index) in tutorials">
            <span slot="tab" style="font-size: 18px;">
              {{ item.name }}
            </span>
            <a-card :bordered="false">
              <div>
                <v-md-editor :value="item.markdownContent" mode="preview"/>
              </div>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import { getTutorialsByType } from '@/api/tutorials'
export default {
  name: 'WinTutorials',
  data () {
    return {
      loading: true,
      tutorials: []
    }
  },
  async created () {
    const result = await getTutorialsByType('Windows')
    if (result.code === 200) {
      this.tutorials = result.data.tutorials
      this.loading = false
    }
  }
}
</script>

<style scoped>
  /deep/ .ant-tabs-bar {
    border-bottom: none;
  }
  /deep/ .ant-tabs-nav .ant-tabs-tab .anticon {
    margin-right: 0;
    font-size: 18px;
  }

  /deep/ .ant-tabs-nav .ant-tabs-tab {
    margin-right: 0px;
  }

  /deep/ .ant-tabs-ink-bar {
    width: 0!important;
  }
</style>
