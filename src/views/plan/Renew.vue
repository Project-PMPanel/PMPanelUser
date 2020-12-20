<template>
  <page-header-wrapper :breadcrumb="{}">
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <div>
          <a-spin v-if="loading" size="large" style="width: 100%;margin: 0 auto;" :spinning="loading" tip="Loading...">
            <a-icon slot="indicator" type="loading" style="font-size: 30px" spin />
          </a-spin>
          <a-card v-else :bodyStyle="{padding: 0,background:'#eff2f5'}" :bordered="false">
            <a-card :bodyStyle="{padding: 0,background:'#eff2f5'}" :bordered="false">
              <a-collapse default-active-key="renew">
                <template slot="expandIcon">
                  <a-icon type="radius-bottomleft" :style="{fontSize:'20px'}"/>
                </template>
                <a-collapse-panel key="renew" :forceRender="true" :show-arrow="true">
                  <template slot="header">
                    <span style="font-size: 20px">
                      {{ $i18n.locale === 'zh-CN' ? order.planDetailsMap.name : order.planDetailsMap.nameEnglish }}
                    </span>
                    <br/>
                    <span style="font-size: 14px">
                      {{ $i18n.locale === 'zh-CN' ? '库存:' + (order.planDetailsMap.buyLimit < 0 ? '无限制' : order.planDetailsMap.buyLimit) : 'Stock:' + (order.planDetailsMap.buyLimit < 0 ? 'No limit' : order.planDetailsMap.buyLimit) }}
                    </span>
                    <span style="margin-left: 5px" v-if="order.planDetailsMap.isDiscount">
                      <my-icon :style="{fontSize: '16px'}" type="icon-xianshi" />
                      <div v-if="$i18n.locale === 'zh-CN'" style="margin-left:5px;display: inline-block">
                        <a-statistic-countdown :valueStyle="{fontSize: '16px'}" :value="Date.parse(order.planDetailsMap.discountEnd)" format="D 天 H 时 m 分" />
                      </div>
                      <div v-else style="margin-left:5px;display: inline-block">
                        <a-statistic-countdown :valueStyle="{fontSize: '16px'}" :value="Date.parse(order.planDetailsMap.discountEnd)" format="Dd HH:mm" />
                      </div>
                    </span>
                  </template>
                  <a-row :gutter="24" justify="space-around">
                    <a-col
                      :xs="24"
                      :sm="12"
                      :md="12"
                      :lg="8"
                      :xl="6"
                      :value="month"
                      :style="{ marginBottom: '24px' }"
                      :key="index2"
                      v-for="(month, index2) in order.planDetailsMap.monthsList" >
                      <a-card>
                        <template slot="title">
                          <div style="text-align: center;font-size: 25px">
                            <span style="font-size: 20px">{{ month === 1 ? $t('plan.content.monthPrice') : ( month === 3 ? $t('plan.content.seasonPrice') : (month === 6 ? $t('plan.content.halfOfYearPrice') : (month === 12 ? $t('plan.content.yearPrice') : $t('plan.content.price')))) }}</span>:
                            <span> {{ order.planDetailsMap.priceList[index2] | numberFormat }}</span>
                            <span style="font-size: 16px"> CNY</span>
                          </div>
                          <div style="text-align: center">
                            <span style="color: red">{{ order.planDetailsMap.expireList[index2] }}</span>
                          </div>
                        </template>
                        <span style="line-height: 30px">
                          <my-icon type="icon-flow" />
                          {{ $t('plan.content.data') }}:
                        </span> {{ order.planDetailsMap.transferEnable | numberFormat }} GB<br/>
                        <span style="line-height: 30px">
                          <my-icon type="icon-class" />
                          {{ $t('plan.content.class') }}:
                        </span> {{ order.planDetailsMap.clazz }}<br/>
                        <span style="line-height: 30px">
                          <my-icon type="icon-limit" />
                          {{ order.planDetailsMap.nodeSpeedlimit === 0 ? $t('plan.content.speedNoLimit') : $t('plan.content.speedLimit') + order.planDetailsMap.nodeSpeedlimit + 'Mbps' }}
                        </span><br/>
                        <span style="line-height: 30px">
                          <my-icon type="icon-online" />
                          {{ order.planDetailsMap.nodeConnector === 0 ? $t('plan.content.connectors') : $t('plan.content.connector') + order.planDetailsMap.nodeConnector }}
                        </span><br/>
                        <span style="line-height: 30px" v-if="order.planDetailsMap.supportMedia">
                          <my-icon type="icon-media" />
                          {{ $t('plan.content.mediaUnlock') }}
                          <br/>
                        </span>
                        <span style="line-height: 30px" v-if="order.planDetailsMap.supportDirectline">
                          <my-icon type="icon-directline" />
                          {{ $t('plan.content.DirectLine') }}
                          <br/>
                        </span>
                        <div>
                          <a-button type="primary" block @click="renewOrder(order.orderId, month)">{{ $t('plan.content.subscribe') }}</a-button>
                        </div>
                      </a-card>
                    </a-col>
                  </a-row>
                </a-collapse-panel>
              </a-collapse>
            </a-card>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { getOrderByOrderId, renewOrder } from '@/api/plan'

export default {
  name: 'Renew',
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
      console.log(this.order)
      this.loading = false
    }
  },
  methods: {
    async renewOrder (orderId, monthCount) {
      // 往后台存储该订单
      const order = {
        'orderId': orderId,
        'monthCount': monthCount,
        'price': this.calcPrice,
        'expire': this.calcExpire
      }
      const result = await renewOrder(order)
      if (result.code === 200) {
        setTimeout(() => {
          this.$router.push('/plan/detail/' + result.data.orderId)
          // this.$refs.table.refresh() // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 1000)
      }
    }
  }
}
</script>

<style scoped>

</style>
