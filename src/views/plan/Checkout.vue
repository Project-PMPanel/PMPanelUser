<template>
  <page-header-wrapper :breadcrumb="{}">
    <a-row :gutter="24">
      <div v-if="loading" style="text-align: center;margin-top: 20%">
        <a-spin :spinning="loading" size="large" />
      </div>
      <div v-else>
        <a-col :sm="24" :md="{span: 12, offset: 6}" :xl="{span: 12, offset: 6}" :style="{ marginBottom: '24px' }">
          <span v-if="order !== undefined" style="font-size: 20px">
            <my-icon type="icon-success" :style="{fontSize: '24px'}"/>
            {{ $t('checkout.order.success') }}
          </span>
        </a-col>
        <a-col :sm="24" :md="{span: 12, offset: 6}" :xl="{span: 12, offset: 6}" :style="{ marginBottom: '24px' }">
          <div style="margin: -20px 0 0 30px;">
            <span>
              {{ $t('checkout.order.info') }}
            </span>
            <br>
            <span v-if="type === 'plan' ">
              {{ $i18n.locale === 'zh-CN' ? order.planDetailsMap.name : order.planDetailsMap.nameEnglish }} - {{ order.expire }}
            </span>
            <span v-if="type === 'package' ">
              {{ $t('plan.package') }} - {{ order.transferEnableGb }} GB - {{ order.expire }}
            </span>
          </div>
        </a-col>
        <a-col :sm="24" :md="{span: 12, offset: 6}" :xl="{span: 12, offset: 6}" :style="{ marginBottom: '24px' }">
          <div style="float:right;font-size: 26px;color: #FFA014;font-weight: bold">
            {{ order.price | numberFormat }} CNY
          </div>
        </a-col>
        <a-col :sm="24" :md="{span: 12, offset: 6}" :xl="{span: 12, offset: 6}" :style="{ marginBottom: '24px' }">
          <a-col :sm="24" :md="24" :lg="24" :xl="12">
            <a-card :body-style="{padding: '0 0 0 15px'}" :bordered="false">
            </a-card>
            <div style="padding-left: 15px">
              <a-radio-group v-if="config.money" :value="payType" @change="onChange">
                <a-radio :style="radioStyle" value="money">
                  <my-icon type="icon-money" :style="{fontSize: '22px'}"/>
                  <span style="font-size: 22px">{{ $t('checkout.order.payType.money') }}: {{ user.money | numberFormat }} <span v-if="this.payType === 'money'">- {{ order.price | numberFormat }} = {{ user.money - order.price | numberFormat }}</span> CNY</span>
                </a-radio>
                <a-radio v-if="config.alipay" :style="radioStyle" value="alipay">
                  <my-icon type="icon-alipay" :style="{fontSize: '22px'}"/>
                  <span style="font-size: 22px">{{ $t('checkout.order.payType.alipay') }}</span>
                </a-radio>
                <a-radio v-if="config.wxpay" :style="radioStyle" value="wxpay">
                  <my-icon type="icon-wxpay" :style="{fontSize: '22px'}"/>
                  <span style="font-size: 22px">{{ $t('checkout.order.payType.wxpay') }}</span>
                </a-radio>
              </a-radio-group>
            </div>
            <p style="margin-top: 10px;font-size: 20px">{{ $t('checkout.order.needPayAmount') }}: {{ payAmount | numberFormat }} CNY</p>
          </a-col>
          <a-col :sm="24" :md="24" :lg="24" :xl="12">
            <div style="display: inline-block;margin: 10% 0 10px 25%;">
              <div id="qrcode"/> <!-- 创建一个div，并设置id为qrcode -->
            </div>
          </a-col>
          <a-col :sm="24" :md="24" :xl="24">
            <a-button style="float: right" type="primary" @click="payOrder">{{ $t('plan.order.pay') }}</a-button>
          </a-col>
        </a-col>
      </div>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { getPaymentConfig, getOrderByTypeAndId, payOrder } from '@/api/plan'
import QRCode from 'qrcodejs2'

export default {
  name: 'Checkout',
  data () {
    return {
      timer: null,
      type: '',
      id: '',
      user: {},
      config: {},
      order: {
        userDetailsMap: {},
        planDetailsMap: {}
      },
      loading: true,
      payType: '',
      payAmount: undefined,
      radioStyle: {
        display: 'block',
        height: '50px',
        lineHeight: '50px',
        marginTop: '5px'
      }
    }
  },
  async created () {
    this.type = this.$route.params.type
    this.id = this.$route.params.id
    this.user = this.$store.getters.userInfo
    // 根据type和key去后台查询详情
    const result = await getPaymentConfig()
    if (result.code === 200) {
      this.config = result.data.config
      const result2 = await getOrderByTypeAndId(this.type, this.id)
      if (result2.code === 200) {
        if (result2.data.order.status === 1) {
          this.$router.push('/result/success')
        }
        this.order = result2.data.order
        this.payAmount = this.order.price
        this.loading = false
      }
    } else {
      this.order = undefined
    }
  },
  methods: {
    onChange (e) {
      document.getElementById('qrcode').innerHTML = ''
      switch (e.target.value) {
        case 'money':
          this.payType = 'money'
          break
        case 'alipay':
          this.payType = 'alipay'
          break
        case 'wxpay':
          this.payType = 'wxpay'
          break
      }
    },
    async payOrder () {
      if (['money', 'alipay', 'wxpay'].indexOf(this.payType) === -1) {
        this.$message.warning(this.$t('checkout.order.choosePayType'))
        return
      }
      const params = {}
      params.type = this.type
      params.id = this.id
      // 判断混合支付的payType是什么,默认money
      params.payType = this.payType
      // 单一支付
      if (this.payType === 'money' && (this.user.money - this.order.price < 0)) {
        this.$message.warning(this.$t('checkout.order.moneyError'))
        return
      }
      params.payAmount = this.payAmount
      // 设置platform
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        params.platform = 'h5'
      } else {
        params.platform = 'pc'
      }
      params.payAmount = parseFloat(params.payAmount).toFixed(2)
      console.log(params)
      const result = await payOrder(params)
      const router = this.$router
      if (result.code === 5015) {
        this.$message.warning(result.message)
      }
      if (result.code === 200) {
        if (result.data.type === 'money') {
          setTimeout(() => {
            this.$router.push('/result/success')
          }, 1000)
        } else if (result.data.type === 'qr') {
          // 展现二维码
          this.qrcode(result.data.url)
          // 循环查询订单状态
          this.timer = setInterval(async function () {
            const result = await getOrderByTypeAndId(params.type, params.id)
            console.log(result)
            if (result.data.order.status === 1) {
              router.push('/result/success')
            }
          }, 1000)
        } else if (result.data.type === 'link') {
          window.location.href = result.data.url
        }
      }
    },
    qrcode (url) {
      document.getElementById('qrcode').innerHTML = ''
      this.qrcodee = new QRCode('qrcode', {
        width: 150,
        height: 150,
        text: url,
        colorDark: '#000',
        colorLight: '#fff'
      })
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    if (document.getElementById('qrcode') !== null) {
      console.log(document.getElementById('qrcode'))
      document.getElementById('qrcode').innerHTML = ''
    }
  }
}
</script>

<style scoped>

</style>
