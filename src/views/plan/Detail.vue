<template>
  <page-header-wrapper :breadcrumb="{}">
    <a-card :loading="loading" :bodyStyle="{padding: 0}" :bordered="false">
      <a-descriptions bordered :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }">
        <a-descriptions-item :label="$t('plan.order.details.planName')">
          {{ $i18n.locale === 'zh-CN' ? order.planDetailsMap.name : order.planDetailsMap.nameEnglish }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('plan.order.details.orderId')">
          {{ order.orderId }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('plan.order.details.createdTime')">
          {{ order.createTime }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('plan.order.details.expire')">
          {{ order.expire }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('plan.order.details.payPrice')">
          {{ order.price }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('plan.order.details.payStatus')">
          <a-badge v-if="$i18n.locale === 'zh-CN'" :status="order.status === 0 ? 'error' : (order.status === 1 ? 'success' : (order.status === 2 ? 'default' : 'default'))" :text="order.status === 0 ? '待支付' : (order.status === 1 ? '已完成' : (order.status === 2 ? '已取消' : '已失效'))"/>
          <a-badge v-else :status="order.status === 0 ? 'error' : (order.status === 1 ? 'success' : (order.status === 2 ? 'default' : 'default'))" :text="order.status === 0 ? 'Unpaid' : (order.status === 1 ? 'Finished' : (order.status === 2 ? 'Canceled' : 'INVALID'))"/>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('plan.order.details.planContent')">
          <span v-if="order.planDetailsMap.currentMonthTransferEnable">{{ $t('plan.content.currentMonthData') }}: {{ order.planDetailsMap.currentMonthTransferEnable | numberFormat }} GB<br/></span>
          <span>{{ $t('plan.content.data') }}:</span> {{ order.planDetailsMap.transferEnable | numberFormat }} GB<br/>
          <span>{{ $t('plan.content.class') }}:</span> {{ order.planDetailsMap.clazz }}<br/>
          <span>{{ order.planDetailsMap.nodeSpeedlimit === 0 ? $t('plan.content.speedNoLimit') : $t('plan.content.speedLimit') + order.planDetailsMap.nodeSpeedlimit + 'Mbps' }}</span><br/>
          <span>{{ order.planDetailsMap.nodeConnector === 0 ? $t('plan.content.connectors') : $t('plan.content.connector') + order.planDetailsMap.nodeConnector }}</span><br/>
          <!--<span>{{ $t('plan.content.renewEnable') }} {{ order.planDetailsMap.renewEnable ? '开启' : '关闭' }} </span><br/>-->
        </a-descriptions-item>
        <a-descriptions-item :label="$t('plan.order.details.userContent')">
          <span>{{ $t('plan.order.details.userContent.email') }}:</span> {{ order.userDetailsMap.email }}<br/>
          <span>{{ $t('plan.order.details.userContent.expire') }}:</span> {{ order.userDetailsMap.expireIn | moment }}<br/>
          <span>{{ $t('plan.order.details.userContent.class') }}:</span> {{ order.userDetailsMap.clazz }}<br/>
          <span>{{ order.userDetailsMap.nodeSpeedlimit === 0 ? $t('plan.order.details.userContent.nodeSpeedNoLimit') : $t('plan.order.details.userContent.nodeSpeedLimit') + order.userDetailsMap.nodeSpeedlimit + 'Mbps' }}</span><br/>
          <span>{{ order.userDetailsMap.nodeConnector === 0 ? $t('plan.order.details.userContent.connectors') : $t('plan.order.details.userContent.connector') + order.userDetailsMap.nodeConnector }}</span><br/>
        </a-descriptions-item>
      </a-descriptions>
      <a-card>
        <div v-if="order.status === 0">
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="primary" style="width: 30%;margin-left: 18%">
              <router-link :to="{path:'/checkout/' + 'plan/' + order.orderId}">{{ $t('plan.order.pay') }}</router-link>
            </a-button>
          </a-config-provider>
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="danger" style="width: 30%;margin-left: 4%">
              <a-popconfirm :title="$t('plan.order.cancelConfirm')" :ok-text="$t('setting.yes')" :cancel-text="$t('setting.no')" @confirm="cancelOrderByOrderId(order.orderId)">
                <a>{{ $t('plan.order.cancel') }}</a>
              </a-popconfirm>
            </a-button>
          </a-config-provider>
        </div>
      </a-card>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getOrderByOrderId, cancelOrderByOrderId } from '@/api/plan'

export default {
  name: 'Detail',
  components: {
  },
  data () {
    return {
      loading: true,
      order: {
        planDetailsMap: {},
        userDetailsMap: {}
      }
    }
  },
  async created () {
    const orderId = this.$route.params.orderId
    const result = await getOrderByOrderId(orderId)
    if (result.code === 200) {
      this.order = result.data.order
      this.loading = false
    }
  },
  methods: {
    async cancelOrderByOrderId (orderId) {
      const result = await cancelOrderByOrderId(orderId)
      if (result.code === 200) {
        if (this.$i18n.locale === 'zh-CN') {
          this.order = result.data.order
          this.$message.success(result.message)
        } else {
          this.$message.success(result.messageEnglish)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
