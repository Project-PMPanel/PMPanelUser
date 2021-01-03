<template>
  <page-header-wrapper :breadcrumb="{}">
    <a-row :gutter="24">
      <a-col v-if="currentPlan !== undefined && currentPlan !== null && currentPlan.planDetailsMap.packagee !== 0" :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <a-card :bordered="false">
          <template v-slot:title>
            <my-icon type="icon-package" />
            {{ $t('plan.package.title') }}
          </template>
          <a @click.prevent="showPackageModal">
            {{ $t('plan.package.purchase') }}
          </a>
          <a-modal :width="300" :visible="packageModalVisible" :title="$t('plan.package.title')" @ok="handleOk" @cancel="handleCancel">
            <template v-slot:footer>
              <a-button key="submit" type="primary" :loading="packageLoading" @click="handleOk">
                {{ $t('setting.confirm') }}
              </a-button>
            </template>
            <div>
              <div style="margin: auto;text-align: center">
                <div style="margin-bottom: 10px">
                  1 {{ $t('setting.money') }} {{ currentPlan.planDetailsMap.packagee | numberFormat }} GB
                </div>
                <a-input v-model="packageCount" style="width: 50%" prefix="￥" suffix="CNY" />
              </div>
            </div>
          </a-modal>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <div>
          <a-spin v-if="loading" size="large" style="width: 100%;margin: 0 auto;" :spinning="loading" tip="Loading...">
            <a-icon slot="indicator" type="loading" style="font-size: 30px" spin />
          </a-spin>
          <a-card v-else :bodyStyle="{padding: 0,background:'#eff2f5'}" :bordered="false">
            <a-card :bodyStyle="{padding: 0,background:'#eff2f5'}" :bordered="false" :key="index" v-for="(item, index) in plan">
              <a-collapse @change="changeActivekey(index)">
                <template slot="expandIcon">
                  <a-icon type="radius-bottomleft" :style="{fontSize:'20px'}"/>
                </template>
                <a-collapse-panel :forceRender="true" :show-arrow="true">
                  <template slot="header">
                    <span style="font-size: 20px">
                      {{ $i18n.locale === 'zh-CN' ? item.name : item.nameEnglish }}
                    </span>
                    <br/>
                    <span style="font-size: 14px">
                      {{ $i18n.locale === 'zh-CN' ? '库存:' + (item.buyLimit < 0 ? '无限制' : item.buyLimit) : 'Stock:' + (item.buyLimit < 0 ? 'No limit' : item.buyLimit) }}
                    </span>
                    <span style="margin-left: 5px" v-if="item.isDiscount">
                      <my-icon :style="{fontSize: '16px'}" type="icon-xianshi" />
                      <div v-if="$i18n.locale === 'zh-CN'" style="margin-left:5px;display: inline-block">
                        <a-statistic-countdown :valueStyle="{fontSize: '16px'}" :value="$moment(item.discountEnd, 'YYYY-MM-DD HH:mm:ss')" format="HH:mm:ss" />
                      </div>
                      <div v-else style="margin-left:5px;display: inline-block">
                        <a-statistic-countdown :valueStyle="{fontSize: '16px'}" :value="$moment(item.discountEnd, 'YYYY-MM-DD HH:mm:ss')" format="HH:mm:ss" />
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
                      v-for="(month, index2) in plan[index].monthsList" >
                      <a-card>
                        <template slot="title">
                          <div style="text-align: center;font-size: 25px">
                            <span style="font-size: 20px">{{ month === 1 ? $t('plan.content.monthPrice') : ( month === 3 ? $t('plan.content.seasonPrice') : (month === 6 ? $t('plan.content.halfOfYearPrice') : (month === 12 ? $t('plan.content.yearPrice') : $t('plan.content.price')))) }}</span>:
                            <span> {{ item.priceList[index2] | numberFormat }}</span>
                            <span style="font-size: 16px"> CNY</span>
                          </div>
                          <div style="text-align: center">
                            <span style="color: red">{{ item.expireList[index2] }}</span>
                          </div>
                        </template>
                        <span style="line-height: 30px">
                          <my-icon type="icon-flow" />
                          {{ $t('plan.content.data') }}:
                        </span> {{ item.transferEnableGb | numberFormat }} GB<br/>
                        <span style="line-height: 30px">
                          <my-icon type="icon-class" />
                          {{ $t('plan.content.class') }}:
                        </span> {{ item.clazz }}<br/>
                        <span style="line-height: 30px">
                          <my-icon type="icon-limit" />
                          {{ item.nodeSpeedlimit === 0 ? $t('plan.content.speedNoLimit') : $t('plan.content.speedLimit') + item.nodeSpeedlimit + 'Mbps' }}
                        </span><br/>
                        <span style="line-height: 30px">
                          <my-icon type="icon-online" />
                          {{ item.nodeConnector === 0 ? $t('plan.content.connectors') : $t('plan.content.connector') + item.nodeConnector }}
                        </span><br/>
                        <span style="line-height: 30px" v-if="item.supportMedia">
                          <my-icon type="icon-media" />
                          {{ $t('plan.content.mediaUnlock') }}
                          <br/>
                        </span>
                        <span style="line-height: 30px" v-if="item.supportDirectline">
                          <my-icon type="icon-directline" />
                          {{ $t('plan.content.DirectLine') }}
                          <br/>
                        </span>
                        <span style="line-height: 30px;" v-if="$i18n.locale === 'zh-CN'">
                          <my-icon type="icon-desc" />
                          <span style="word-break: break-all" :key="i" v-for="(info, i) in item.extraInfo.split(';')">
                            <span v-if="i === 0"> {{ info }}</span>
                            <span v-else style="margin-left: 18px"> {{ info }}</span>
                            <br>
                          </span>
                          <br/>
                        </span>
                        <span style="line-height: 30px" v-else>
                          <my-icon type="icon-desc" />
                          <span style="word-break: break-all" :key="i" v-for="(info, i) in item.extraInfoEnglish.split(';')">
                            <span v-if="i === 0"> {{ info }}</span>
                            <span v-else style="margin-left: 18px"> {{ info }}</span>
                            <br>
                          </span>
                          <br/>
                        </span>

                        <div>
                          <span>
                            <a-popconfirm v-if="currentPlan !== undefined && currentPlan !== null" :title="$t('plan.content.doSubscribeWarning')" :ok-text="$t('setting.yes')" :cancel-text="$t('setting.no')" @confirm="buyPlan(item.id, month)">
                              <a-button type="primary" block>{{ $t('plan.content.subscribe') }}</a-button>
                            </a-popconfirm>
                            <a-popconfirm v-else :title="$t('plan.content.doSubscribeWarning2')" :ok-text="$t('setting.yes')" :cancel-text="$t('setting.no')" @confirm="buyPlan(item.id, month)">
                              <a-button type="primary" block>{{ $t('plan.content.subscribe') }}</a-button>
                            </a-popconfirm>
                          </span>
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
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <a-tabs default-active-key="plan">
          <a-tab-pane key="plan">
            <span slot="tab" style="font-size: 18px;">
              <my-icon type="icon-plan" />
              {{ $t('plan.order.title') }}
            </span>
            <a-card :body-style="{padding: '0'}" :loading="loading" :bordered="false">
              <s-table ref="table" size="default" rowKey="id" :columns="orderColumns" :data="loadOrderData">
                <span slot="price" slot-scope="text">
                  {{ text | numberFormat }}
                </span>
                <span slot="status" slot-scope="text, record">
                  <a-tag :color="text === 0 ? 'red': (text === 1 ? (currentPlan.id === record.id ? 'cyan' : 'blue') : (text === 2 ? '#b5b5b5' : '#b5b5b5'))">
                    {{ text === 0 ? $t('plan.order.unpaid') : (text === 1 ? (currentPlan.id === record.id ? $t('plan.order.active') : $t('plan.order.finished')) : (text === 2 ? $t('plan.order.canceled') : $t('plan.order.invalid'))) }}
                  </a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                  <template>
                    <router-link v-if="record.status !== 0" :to="{path:'/plan/detail/'+record.orderId}">{{ $t('plan.order.detail') }}</router-link>
                    <a-divider v-if="(record.status !== 0 && (record.status === 1 && currentPlan.id === record.id && currentPlan.planDetailsMap.enableRenew)) || record.status === 2/* || record.status === 3*/" type="vertical" />
                    <router-link v-if="record.status === 1 && currentPlan.id === record.id && currentPlan.planDetailsMap.enableRenew" :to="{path:'/plan/renew/'+record.orderId}">{{ $t('plan.order.renew') }}</router-link>
                    <router-link v-if="record.status === 0" :to="{path:'/plan/detail/'+record.orderId}">{{ $t('plan.order.pay') }}</router-link>
                    <a-divider v-if="record.status === 0" type="vertical" />
                    <a-popconfirm :title="$t('plan.order.cancelConfirm')" :ok-text="$t('setting.yes')" :cancel-text="$t('setting.no')" @confirm="cancelOrderByOrderId(record.orderId)">
                      <a v-if="record.status === 0">{{ $t('plan.order.cancel') }}</a>
                    </a-popconfirm>
                    <a-popconfirm :title="$t('plan.order.deleteConfirm')" :ok-text="$t('setting.yes')" :cancel-text="$t('setting.no')" @confirm="deleteOrderByOrderId(record.orderId)">
                      <a v-if="record.status === 2/* || record.status === 3*/">{{ $t('plan.order.delete') }}</a>
                    </a-popconfirm>
                  </template>
                </span>
              </s-table>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="package">
            <span slot="tab" style="font-size: 18px;">
              <my-icon type="icon-flow" />
              {{ $t('plan.order.package.title') }}
            </span>
            <a-card :body-style="{padding: '0'}" :loading="loading" :bordered="false">
              <s-table ref="table" size="default" rowKey="id" :columns="packageColumns" :data="loadPackageOrderData">
                <span slot="orderId" slot-scope="text">
                  <router-link :to="{path:'/plan/detail/'+text}">{{ text }}</router-link>
                </span>
                <span slot="price" slot-scope="text">
                  {{ text | numberFormat }}
                </span>
                <span slot="transferEnableGb" slot-scope="text">
                  {{ text | numberFormat }} GB
                </span>
                <span slot="status" slot-scope="text, record">
                  <a-tag :color="text === 0 ? 'red': (text === 1 ? (currentPlan.id === record.id ? 'cyan' : 'blue') : (text === 2 ? '#b5b5b5' : '#b5b5b5'))">
                    {{ text === 0 ? $t('plan.order.unpaid') : (text === 1 ? (currentPlan.id === record.id ? $t('plan.order.active') : $t('plan.order.finished')) : (text === 2 ? $t('plan.order.canceled') : $t('plan.order.invalid'))) }}
                  </a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                  <template>
                    <router-link v-if="record.status === 0" :to="{path:'/checkout/package/'+record.id}">{{ $t('plan.order.pay') }}</router-link>
                    <a-divider v-if="record.status === 0" type="vertical" />
                    <a-popconfirm :title="$t('plan.order.cancelConfirm')" :ok-text="$t('setting.yes')" :cancel-text="$t('setting.no')" @confirm="cancelPackageOrderById(record.id)">
                      <a v-if="record.status === 0">{{ $t('plan.order.cancel') }}</a>
                    </a-popconfirm>
                    <a-popconfirm :title="$t('plan.order.deleteConfirm')" :ok-text="$t('setting.yes')" :cancel-text="$t('setting.no')" @confirm="deletePackageOrderById(record.id)">
                      <a v-if="record.status === 2 || record.status === 3">{{ $t('plan.order.delete') }}</a>
                    </a-popconfirm>
                  </template>
                </span>
              </s-table>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { getPlan, getCurrentPlan, getOrder, getPackageOrder, buyPackage, buyPlan, cancelOrderByOrderId, deleteOrderByOrderId, cancelPackageOrderById, deletePackageOrderById } from '@/api/plan'
import { STable } from '@/components'

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      user: {},
      loading: true,
      packageCount: 0,
      packageLoading: false,
      packageModalVisible: false,
      plan: [],
      currentPlan: undefined,
      orderColumns: [
        {
          title: '#',
          align: 'center',
          dataIndex: 'orderId'
        },
        {
          title: this.$i18n.t('plan.order.name'),
          align: 'center',
          dataIndex: this.$i18n.locale === 'zh-CN' ? 'planDetailsMap.name' : 'planDetailsMap.nameEnglish'
        },
        {
          title: this.$i18n.t('plan.order.price'),
          align: 'center',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$i18n.t('plan.order.created'),
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: this.$i18n.t('plan.order.expire'),
          align: 'center',
          dataIndex: 'expire'
        },
        {
          title: this.$i18n.t('plan.order.payTime'),
          align: 'center',
          dataIndex: 'payTime'
        },
        {
          title: this.$i18n.t('plan.order.status'),
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$i18n.t('plan.order.operation'),
          align: 'center',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      packageColumns: [
        {
          title: '#',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: this.$i18n.t('plan.order.package.relateOrderId'),
          align: 'center',
          dataIndex: 'orderId',
          scopedSlots: { customRender: 'orderId' }
        },
        {
          title: this.$i18n.t('plan.order.price'),
          align: 'center',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$i18n.t('plan.order.package.transferEnable'),
          align: 'center',
          dataIndex: 'transferEnableGb',
          scopedSlots: { customRender: 'transferEnableGb' }
        },
        {
          title: this.$i18n.t('plan.order.created'),
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: this.$i18n.t('plan.order.expire'),
          align: 'center',
          dataIndex: 'expire'
        },
        {
          title: this.$i18n.t('plan.order.payTime'),
          align: 'center',
          dataIndex: 'payTime'
        },
        {
          title: this.$i18n.t('plan.order.status'),
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$i18n.t('plan.order.operation'),
          align: 'center',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadOrderData: parameter => {
        return getOrder(Object.assign(parameter))
          .then(res => {
            console.log(res.data)
            return res.data
          })
      },
      loadPackageOrderData: parameter => {
        return getPackageOrder(Object.assign(parameter))
          .then(res => {
            return res.data
          })
      }
    }
  },
  watch: {
    '$i18n.locale' () {
      this.orderColumns = [
        {
          title: '#',
          align: 'center',
          dataIndex: 'orderId'
        },
        {
          title: this.$i18n.t('plan.order.name'),
          align: 'center',
          dataIndex: this.$i18n.locale === 'zh-CN' ? 'planDetailsMap.name' : 'planDetailsMap.nameEnglish'
        },
        {
          title: this.$i18n.t('plan.order.price'),
          align: 'center',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$i18n.t('plan.order.created'),
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: this.$i18n.t('plan.order.expire'),
          align: 'center',
          dataIndex: 'expire'
        },
        {
          title: this.$i18n.t('plan.order.payTime'),
          align: 'center',
          dataIndex: 'payTime'
        },
        {
          title: this.$i18n.t('plan.order.status'),
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$i18n.t('plan.order.operation'),
          align: 'center',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
      this.packageColumns = [
        {
          title: '#',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: this.$i18n.t('plan.order.package.relateOrderId'),
          align: 'center',
          dataIndex: 'orderId',
          scopedSlots: { customRender: 'orderId' }
        },
        {
          title: this.$i18n.t('plan.order.price'),
          align: 'center',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$i18n.t('plan.order.package.transferEnable'),
          align: 'center',
          dataIndex: 'transferEnableGb',
          scopedSlots: { customRender: 'transferEnableGb' }
        },
        {
          title: this.$i18n.t('plan.order.created'),
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: this.$i18n.t('plan.order.expire'),
          align: 'center',
          dataIndex: 'expire'
        },
        {
          title: this.$i18n.t('plan.order.payTime'),
          align: 'center',
          dataIndex: 'payTime'
        },
        {
          title: this.$i18n.t('plan.order.status'),
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$i18n.t('plan.order.operation'),
          align: 'center',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
  },
  mounted () {
    this.getPlan()
    this.getCurrentPlan()
  },
  methods: {
    async getPlan () {
      const result = await getPlan()
      if (result.code === 200) {
        this.plan = result.data.plans
        // console.log(this.plan)
        this.loading = false
      }
    },
    async getCurrentPlan () {
      const result = await getCurrentPlan()
      if (result.code === 200) {
        this.currentPlan = result.data.plan
      }
    },
    showPackageModal () {
      this.packageModalVisible = true
    },
    async handleOk (e) {
      if (this.currentPlan !== undefined) {
        this.packageLoading = true
        const params = {
          'price': this.packageCount
        }
        const result = await buyPackage(params)
        if (result.code === 200) {
          this.packageLoading = false
          this.$router.push('/checkout/package/' + result.data.package.id)
        }
      } else {
        this.packageModalVisible = false
      }
    },
    handleCancel (e) {
      this.packageModalVisible = false
    },
    changeActivekey (key) {
      // const id = this.plan[key].id
    },
    async buyPlan (planId, monthCount) {
      // 往后台存储该订单
      const order = {
        'planId': planId,
        'monthCount': monthCount
      }
      const result = await buyPlan(order)
      if (result.code === 200) {
        setTimeout(() => {
          this.$router.push('/plan/detail/' + result.data.orderId)
          // this.$refs.table.refresh() // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 1000)
      }
    },
    async cancelOrderByOrderId (orderId) {
      const result = await cancelOrderByOrderId(orderId)
      if (result.code === 200) {
        if (this.$i18n.locale === 'zh-CN') {
          this.$message.success(result.message)
        } else {
          this.$message.success(result.messageEnglish)
        }
        setTimeout(() => {
          this.$refs.table.refresh() // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 1000)
      }
    },
    async deleteOrderByOrderId (orderId) {
      const result = await deleteOrderByOrderId(orderId)
      if (result.code === 200) {
        if (this.$i18n.locale === 'zh-CN') {
          this.$message.success(result.message)
        } else {
          this.$message.success(result.messageEnglish)
        }
        setTimeout(() => {
          this.$refs.table.refresh() // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 1000)
      }
    },
    async cancelPackageOrderById (id) {
      const result = await cancelPackageOrderById(id)
      if (result.code === 200) {
        if (this.$i18n.locale === 'zh-CN') {
          this.$message.success(result.message)
        } else {
          this.$message.success(result.messageEnglish)
        }
        setTimeout(() => {
          this.$refs.table.refresh() // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 1000)
      }
    },
    async deletePackageOrderById (id) {
      const result = await deletePackageOrderById(id)
      if (result.code === 200) {
        if (this.$i18n.locale === 'zh-CN') {
          this.$message.success(result.message)
        } else {
          this.$message.success(result.messageEnglish)
        }
        setTimeout(() => {
          this.$refs.table.refresh() // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 1000)
      }
    }
  }
}
</script>

<style scoped>

  /deep/ .ant-collapse {
    border: none;
    border-radius: 6px;
  }

 /deep/ .ant-collapse > .ant-collapse-item {
   background: #ffffff;
   margin-bottom: 20px;
   border: none;
   border-radius: 6px;
 }

 /deep/ .ant-collapse > .ant-collapse-item > .ant-collapse-header {
   padding: 30px 16px;
   padding-left: 40px;
 }

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
