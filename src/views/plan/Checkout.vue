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
              <a-radio-group v-if="config.money" :value="payTypeMoney" @change="onChange">
                <a-radio :style="radioStyle" value="money">
                  <my-icon type="icon-money" :style="{fontSize: '22px'}"/>
                  <span style="font-size: 22px">{{ $t('checkout.order.payType.money') }}: {{ user.money | numberFormat }} <span v-if="this.payTypeList.money">- {{ order.price | numberFormat }} = {{ user.money - order.price | numberFormat }}</span> CNY</span>
                </a-radio>
              </a-radio-group>
              <br/>
              <a-radio-group :value="payTypePayment" @change="onChange">
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
            <p style="margin-top: 10px;font-size: 20px">{{ $t('checkout.order.needPayAmount') }}: {{ needPayAmount | numberFormat }} CNY</p>
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
      payTypeMoney: '',
      payTypePayment: '',
      payTypeList: {},
      needPayAmount: undefined,
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
        this.order = result2.data.order
        this.needPayAmount = this.order.price
        this.loading = false
      }
    } else {
      this.order = undefined
    }
  },
  methods: {
    onChange (e) {
      if (e.target.value === 'money') {
        document.getElementById('qrcode').innerHTML = ''
        if (this.user.money >= this.order.price) {
          // 余额支付钱够
          this.needPayAmount = 0
          // 取消选中互斥选项
          this.payTypePayment = ''
          this.payTypeList.alipay = !e.target.checked
          this.payTypeList.wxpay = !e.target.checked
        } else {
          // 钱不够
          this.needPayAmount = this.order.price - this.user.money
        }
        this.payTypeMoney = 'money'
        this.payTypeList.money = e.target.checked
      } else if (e.target.value === 'alipay') {
        document.getElementById('qrcode').innerHTML = ''
        // 判断是否需要混合支付
        if (this.user.money >= this.order.price) {
          // 初始化需要支付的金额为订单金额
          this.needPayAmount = this.order.price
          // 余额支付钱够,取消选中互斥选项
          this.payTypeMoney = ''
          this.payTypeList.money = !e.target.checked
          this.payTypeList.wxpay = !e.target.checked
        } else {
          // 钱不够
          this.payTypeMoney = 'money'
          this.payTypeList.money = e.target.checked
          // 清空互斥选项
          this.payTypeList.wxpay = !e.target.checked
          this.needPayAmount = this.order.price - this.user.money
        }
        this.payTypeList.alipay = e.target.checked
        this.payTypePayment = 'alipay'
      } else if (e.target.value === 'wxpay') {
        document.getElementById('qrcode').innerHTML = ''
        // 判断是否需要混合支付
        if (this.user.money >= this.order.price) {
          // 初始化需要支付的金额为订单金额
          this.needPayAmount = this.order.price
          // 余额支付钱够,取消选中互斥选项
          this.payTypeMoney = ''
          this.payTypeList.money = !e.target.checked
          this.payTypeList.alipay = !e.target.checked
        } else {
          // 钱不够
          this.payTypeMoney = 'money'
          this.payTypeList.money = e.target.checked
          // 清空互斥选项
          this.payTypeList.alipay = !e.target.checked
          this.needPayAmount = this.order.price - this.user.money
        }
        this.payTypeList.wxpay = e.target.checked
        this.payTypePayment = 'wxpay'
      }
    },
    async payOrder () {
      if (!this.payTypeList.money && !this.payTypeList.alipay && !this.payTypeList.wxpay) {
        this.$message.warning(this.$t('checkout.order.choosePayType'))
        return
      }
      const params = {}
      params.type = this.type
      params.id = this.id
      // 判断混合支付的payType是什么,默认money
      params.payType = 'money'
      for (const item in this.payTypeList) {
        if (this.payTypeList[item]) {
          if (item !== 'money') {
            params.payType = item
          }
        } else {
          delete this.payTypeList[item]
        }
      }
      if (Object.keys(this.payTypeList).length > 1) {
        // 混合支付
        params.isMixedPay = true
        params.mixedMoneyAmount = this.user.money
        params.mixedPayAmount = this.needPayAmount
      } else if (Object.keys(this.payTypeList).length === 1) {
        if (this.user.money < this.order.price && !this.payTypeList.alipay && !this.payTypeList.wxpay) {
          this.$message.warning(this.$t('checkout.order.choosePayType'))
          return
        }
        // 单一支付
        params.isMixedPay = false
        if (this.payTypeList.money) {
          params.mixedMoneyAmount = this.order.price
        } else {
          params.mixedMoneyAmount = 0
        }
        params.mixedPayAmount = this.needPayAmount
      }
      // 设置platform
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        params.platform = 'h5'
      } else {
        params.platform = 'pc'
      }
      params.mixedMoneyAmount = parseFloat(params.mixedMoneyAmount).toFixed(2)
      params.mixedPayAmount = parseFloat(params.mixedPayAmount).toFixed(2)
      console.log(params)
      const result = await payOrder(params)
      const router = this.$router
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
