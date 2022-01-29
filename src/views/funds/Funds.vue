<template>
  <page-header-wrapper :breadcrumb="{}">
    <a-row :gutter="24">
      <div v-if="loading" style="text-align: center;margin: 40px 0">
        <a-spin size="large" tip="Loading..." :spinning="loading"/>
      </div>
      <a-col :sm="24" :md="24" :xl="24" v-if="enableWithdraw && !loading">
        <div class="listContent">
          <h1>
            <my-icon style="margin-right: 5px" type="icon-withdraw"/>
            <span style="margin-right: 5px">{{ $t('funds.withdraw') }}</span>
            <a-tooltip>
              <template slot="title">
                <span>
                  {{ $i18n.locale === 'zh-CN' ? minWithdraw + ' CNY起' : 'At least ' + minWithdraw + 'CNY' }}
                </span>
                ,
                <span v-if="withdrawRate === 0">
                  {{ $i18n.locale === 'zh-CN' ? '免提现手续费' : 'No withdrawal fee' }}
                </span>
                <span v-else>
                  {{ $i18n.locale === 'zh-CN' ? '提现会扣除' + withdrawRate + '%手续费' : 'Withdrawal will deduct ' + withdrawRate + '% handling fee' }}
                </span>
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>
          </h1>
          <div>
            <a-input prefix="￥" v-model="amount" suffix="CNY" />
            <br />
            <br />
            <a-input ref="userNameInput" v-model="account" :placeholder=" $i18n.locale === 'zh-CN' ? '提现账号(支付宝)' : 'Account(Alipay)' ">
              <my-icon slot="prefix" type="icon-account" />
            </a-input>
            <br/>
            <br/>
            <a-input ref="userNameInput" v-model="account2" :placeholder=" $i18n.locale === 'zh-CN' ? '再次输入提现账号' : 'Repeat' ">
              <my-icon slot="prefix" type="icon-account" />
            </a-input>
            <br/>
            <br/>
            <a-button type="primary" style="float: right" @click="submitWithdraw">{{ $t('setting.confirm') }}</a-button>
          </div>
        </div>
      </a-col>
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <div class="listContent">
          <div class="listStyle" :key="index" v-for="(item, index) in funds">
            <div class="listIcon">
              <my-icon v-if="item.price > 0" type="icon-income2"/>
              <my-icon v-else type="icon-purchase" />
            </div>
            <div class="listText">
              <h1>
                <span>{{ $i18n.locale === 'zh-CN' ? item.content : item.contentEnglish }}</span>
                <span style="font-size:12px;float:right"></span>
              </h1>
              <p>
                <span v-if="item.price > 0">+</span>
                <span>{{ item.price | numberFormat }} CNY</span>
                <span style="font-size: 12px;margin-top: 3px;float: right">{{ item.time }}</span>
              </p>
            </div>
          </div>
          <span v-if="funds.length !== 0" style="float: right;margin-top: 15px">
            <a-pagination simple :current="pageNo" :pageSize="pageSize" :total="total" @change="onChange" />
          </span>
        </div>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>

import { getFunds, submitWithdraw } from '@/api/funds'

export default {
  name: 'Funds',
  data () {
    return {
      loading: true,
      user: {},
      funds: [],
      pageNo: 1,
      pageSize: 5,
      total: 0,
      enableWithdraw: false,
      minWithdraw: 0,
      withdrawRate: 0,
      amount: 0,
      account: '',
      account2: ''
    }
  },
  mounted () {
    this.user = this.$store.getters.userInfo
    this.amount = this.user.money
    this.getFunds()
  },
  methods: {
    async getFunds () {
      const params = {
        'pageNo': this.pageNo,
        'pageSize': this.pageSize
      }
      const result = await getFunds(params)
      if (result.code === 200) {
        this.funds = result.data.funds.data
        this.pageNo = result.data.funds.pageNo
        this.total = result.data.funds.totalCount
        this.withdrawRate = result.data.funds.withdrawRate
        this.enableWithdraw = result.data.funds.enableWithdraw
        this.minWithdraw = result.data.funds.minWithdraw
        console.log(result.data.funds)
        this.loading = false
      }
    },
    async submitWithdraw () {
      if (this.account === undefined || this.account === '' || this.account === null) {
        const msg = this.$i18n.locale === 'zh-CN' ? '请输入提现账号' : 'Please input account'
        this.$message.error(msg)
        return
      }
      if (this.account !== this.account2) {
        const msg = this.$i18n.locale === 'zh-CN' ? '两次账号输入不一致' : 'The input account is different'
        this.$message.error(msg)
        return
      }
      const params = {
        'amount': this.amount,
        'account': this.account
      }
      const result = await submitWithdraw(params)
      if (result.code === 200) {
        const msg = this.$i18n.locale === 'zh-CN' ? result.message : result.messageEnglish
        this.$notification.success({
          description: msg
        })
        setTimeout(() => {
          this.refreshInfo()
        }, 1000)
      }
    },
    onChange (current) {
      this.pageNo = current
      this.getFunds()
    },
    refreshInfo () {
      this.$http.get('/user/info')
        .then(res => {
          console.log(res)
          this.$store.commit('SET_INFO', res.data.user)
          this.user = this.userInfo
          this.amount = res.data.user.money
          this.account = ''
          this.account2 = ''
        })
    }
  }
}
</script>

<style scoped>

.listContent {
  margin: 40px auto;
  max-width: 400px;
  width: 90%;
  /*cursor: url(http://gtms02.alicdn.com/tps/i2/T1_PMSFLBaXXcu5FDa-20-20.png) 10 10,pointer!important;*/
  position: relative;
}

.listStyle {
  background: #fff;
  border-radius: 6px;
  margin: 10px auto;
  padding: 10px;
  height: 70px;
  transition: box-shadow .5s, transform .5s;
}

.listIcon {
  width: 20%;
  display: inline-block;
  text-align: center;
  font-size: 24px;
  line-height: 50px;
  vertical-align: top;
}
.listText {
  width: 80%;
  display: inline-block;
}
</style>
