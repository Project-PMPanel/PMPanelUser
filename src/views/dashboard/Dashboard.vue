<template>
  <page-header-wrapper :breadcrumb="{}">
    <template v-slot:content>
      <div class="page-header-content">
        <div class="content">
          <div class="content-title">
            {{ user.email }}<span class="welcome-text"></span>
          </div>
          <div>
            {{ $t('dashboard.header.todayUsed') }}: {{ user.todayUsedGb }}
            <a @click.prevent="refreshInfo">{{ $t('dashboard.header.refreshInfo') }}</a>
          </div>
        </div>
      </div>
    </template>
    <div v-if="user.remainTraffic" style="height: 50px;margin-bottom:24px;border-radius: 5px;background: rgb(240 20 20 / 20%);text-align: center;font-size: 20px;line-height: 50px">
      {{ this.$i18n.locale === 'zh-CN' ? '流量已不足30%' : 'Low flow' }}
    </div>
    <div v-if="$moment(user.expireIn).isBefore($moment().add(3, 'days')) && $moment(user.expireIn).isAfter($moment())" style="height: 50px;margin-bottom:24px;border-radius: 5px;background: rgb(240 20 20 / 20%);text-align: center;font-size: 20px;line-height: 50px">
      {{ this.$i18n.locale === 'zh-CN' ? '即将过期,请尽快购买订阅' : 'The plan will expire soon, please subs a new plan quickly' }}
    </div>
    <div v-if="$moment(user.expireIn).isBefore($moment())" style="height: 50px;margin-bottom:24px;border-radius: 5px;background: rgb(240 20 20 / 20%);text-align: center;font-size: 20px;line-height: 50px">
      {{ this.$i18n.locale === 'zh-CN' ? '已过期,请尽快购买订阅' : 'The plan has been expired, please subs a new plan quickly' }}
    </div>
    <div>
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading">
            <template slot="title">
              <span style="font-size: 24px;color: black">
                <my-icon type="icon-flow" />
                {{ $t('dashboard.content.data') }}
              </span>
            </template>
            <template slot="total">
              {{ user.remainingGb }}
            </template>
            <template slot="content">
              <span> {{ $t('dashboard.content.expire') }} </span>:
              <span> {{ user.expireIn }}</span>
            </template>
            <template slot="footer">
            </template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading">
            <template slot="title">
              <span style="font-size: 24px;color: black">
                <my-icon type="icon-money" />
                {{ $t('dashboard.content.balance') }}
              </span>
            </template>
            <template slot="total">
              {{ user.funds | numberFormat }} CNY
            </template>
            <template slot="content">
              <span> {{ $t('dashboard.content.money') }} </span>:
              <span> {{ user.money | numberFormat }}</span>
            </template>
            <template slot="footer">
            </template>
          </chart-card>
        </a-col>

        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading">
            <template slot="title">
              <span style="font-size: 24px;color: black">
                <my-icon type="icon-online" />
                {{ $t('dashboard.content.onlineCount') }}
              </span>
            </template>
            <template slot="total">
              {{ user.aliveCount }} / {{ user.nodeConnector === 0 ? $t('dashboard.content.nodeConnector') : user.nodeConnector }}
            </template>
            <template slot="content">
              {{ user.nodeSpeedlimit === 0 ? $t('dashboard.content.nodeSpeedNoLimit') : $t('dashboard.content.nodeSpeedLimit') + user.nodeSpeedlimit + 'Mbps' }}
            </template>
            <template slot="footer">
            </template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading">
            <template slot="title">
              <span style="font-size: 24px;color: black">
                <a-icon type="usergroup-add" />
                {{ $t('dashboard.content.invite') }}
              </span>
            </template>
            <a-tooltip :title="$t('dashboard.content.inviteMessage')" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <template slot="total">
              <a-button type="dashed" size="small" v-clipboard:copy="user.inviteLink" v-clipboard:success="onCopy" v-clipboard:error="onError">{{ $t('dashboard.content.copyInviteLink') }}</a-button>
              <a-button type="primary" size="small" style="margin-left: 5px" @click="resetInviteCode">{{ $t('dashboard.content.resetInviteCode') }}</a-button>
            </template>
            <template slot="content">
              {{ $t('dashboard.content.inviteLimit') }} <span>: {{ user.inviteCount }}</span>,
              {{ $t('dashboard.content.inviteCount') }} <span>: {{ user.commissionCount }}</span>
            </template>
            <template slot="footer">
            </template>
          </chart-card>
        </a-col>

        <a-col :xl="24" :md="24" :sm="24" :style="{ marginBottom: '24px' }">
          <div v-if="announcement !== null">
            <a-card :loading="loading" :bordered="false" :extra="announcement.time">
              <template slot="title">
                <span>
                  <my-icon type="icon-speaker" />
                  <!-- {{ $t('dashboard.content.announcement') }}: --> {{ announcement.title }}
                </span>
              </template>
              <div>
                <p>
                  <v-md-editor :value="announcement.markdownContent" mode="preview"/>
                </p>
              </div>
            </a-card>
          </div>
          <div v-else>
            <a-card :loading="loading" :bordered="false">
              <template slot="title">
                <span>
                  <my-icon type="icon-speaker" />
                  {{ $t('dashboard.content.announcement') }}: {{ $i18n.locale === 'zh-CN' ? '暂无公告' : 'No announcement' }}
                </span>
              </template>
            </a-card>
          </div>
        </a-col>
        <a-col :xl="12" :md="24" :sm="24">
          <a-card :loading="loading" style="margin-bottom: 24px;" :bordered="false">
            <span slot="title">
              <my-icon type="icon-subscription" />
              {{ $t('dashboard.content.subsCenter') }}
            </span>
            <div>
              <a-button
                class="button-color-cyan"
                style="color: white;font-weight: bold;margin-bottom: 10px"
                block
                v-clipboard:copy="user.subsLink + 'v2ray'"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                <my-icon type="icon-v2ray" />
                V2ray
              </a-button>
              <a-button
                class="button-color-volcano"
                style="color: white;font-weight: bold;margin-bottom: 10px;margin-right: 2%; width: 49%"
                block
                v-clipboard:copy="user.subsLink + 'shadowrocket'"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                <my-icon type="icon-shadowrocket" />
                Shadowrocket
              </a-button>
              <a-button
                class="button-color-volcano"
                style="color: white;font-weight: bold;margin-bottom: 10px; width: 49%"
                block
                @click="shadowrocketOneKey"
              >
                <my-icon type="icon-shadowrocket" />
                Shadowrocket(Safari)
              </a-button>
              <a-button
                class="button-color-dust"
                style="color: white;font-weight: bold;margin-bottom: 10px;margin-right: 2%; width: 49%"
                block
                v-clipboard:copy="user.subsLink + 'clash'"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                <my-icon type="icon-clash" />
                Clash
              </a-button>
              <a-button
                class="button-color-dust"
                style="color: white;font-weight: bold;margin-bottom: 10px;width: 49%"
                block
                @click="clashOneKey"
              >
                <my-icon type="icon-clash" />
                Clash(OneKey)
              </a-button>
              <a-button
                class="button-color-daybreak"
                style="color: white;font-weight: bold;margin-bottom: 10px"
                block
                v-clipboard:copy="user.subsLink + 'surge4'"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                <my-icon type="icon-surge" />
                Surge
              </a-button>
            </div>
          </a-card>
        </a-col>
        <a-col :xl="12" :md="24" :sm="24" :style="{ marginBottom: '24px' }">
          <a-card :loading="loading" style="margin-bottom: 24px" :bordered="false">
            <span slot="title">
              <a-icon type="profile" />
              {{ $t('dashboard.content.trafficDetails') }}
            </span>
            <div>
              <div id="container"></div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { ChartCard } from '@/components'
import { Column } from '@antv/g2plot'
import { getAnnouncement, getTrafficDetails, resetInviteCode } from '@/api/dashboard'
import config from '@/config/defaultSettings'
const Base64 = require('js-base64').Base64

export default {
  name: 'Dashboard',
  components: {
    PageHeaderWrapper,
    ChartCard,
    Column
  },
  data () {
    return {
      loading: true,
      avatar: '',
      user: {},
      announcement: {}
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname
      // welcome: (state) => state.user.welcome
    }),
    currentUser () {
      return {
        avatar: '/avatar.jpg'
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  async created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
    if (!config.disableCrisp) {
      window.CRISP_TOKEN_ID = this.user.uuid
      this.$crisp.push(['set', 'user:email', this.user.email])
      this.$crisp.push(['set', 'session:data', [[['Expire', this.user.expireIn.split(' ')[0]]]]])
      this.$crisp.push(['set', 'session:data', [[['Traffic', this.user.transferEnableGb + 'GB']]]])
      this.$crisp.push(['set', 'session:data', [[['Class', this.user.clazz]]]])
      this.$crisp.push(['set', 'session:data', [[['Money', this.user.money]]]])
    }
    this.getAnnouncement()
    // 当月流量数据
    const result = await getTrafficDetails()
    if (result.code === 200) {
      const column = new Column('container', {
        data: result.data.trafficDetails,
        xField: 'day',
        yField: 'value',
        seriesField: 'traffic',
        isGroup: 'true',
        columnStyle: {
          radius: [20, 20, 0, 0]
        }
      })
      column.render()
    }
  },
  methods: {
    getAnnouncement () {
      getAnnouncement().then(res => {
        if (res.code === 200) {
          if (Object.keys(res.data).length !== 0) {
            this.announcement = res.data.announcement
          }
          this.loading = false
        }
      })
    },
    // 复制成功的回调
    onCopy () {
      this.$message.success(this.$t('dashboard.content.copyInviteLinkSuccess'))
    },
    // 复制失败的回调
    onError () {
    },
    resetInviteCode () {
      resetInviteCode().then(res => {
        if (res.code === 200) {
          this.refreshInfo()
        }
      })
    },
    // shadowrocket一键订阅
    shadowrocketOneKey () {
      const oneKey = 'sub://' + Base64.encode(this.user.subsLink + 'shadowrocket')
      window.location.href = oneKey
    },
    // clash一键订阅
    clashOneKey () {
      const oneKey = 'clash://install-config?url=' + this.user.subsLink + 'clash'
      window.location.href = oneKey
    },
    refreshInfo () {
      this.$http.delete('/user/info')
        .then(res => {
          if (res.code === 200) {
            this.$store.commit('SET_INFO', res.data.user)
            this.user = this.userInfo
            this.$message.success(this.$t('dashboard.content.Success'))
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "./Dashboard.less";

  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }

    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;

      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }

      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }

    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }

      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

  /deep/ .ant-card-body {
    padding: 5px 24px 5px 5px;
  }

  /deep/ .ant-tabs-nav .ant-tabs-tab {
    padding: 0;
  }
  .listContent {
    max-width: 142px;
    width: 90%;
    cursor: pointer;
    float: left;
    margin-right: 10px;
    margin-bottom: 8px;
  }

  .listStyle {
    border-radius: 16px;
    height: 30px;
    transition: box-shadow .5s, transform .5s;
  }

  .listIcon {
    width: 20%;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    vertical-align: top;
  }
  .listText {
    width: 80%;
    line-height: 30px;
    display: inline-block;
    h1 {
      color: #fff
    }
  }

  .shadowrocket {
    background: #4444f5;
  }

  .clash {
    padding-left: 22%;
    background: #1890ff;
  }

  .surge {
    padding-left: 22%;
    background: #a465fa;
  }

  /deep/ .ant-tabs-bar {
    border-bottom: none;
  }

  /deep/ .ant-tabs-nav .ant-tabs-tab .anticon {
    margin-right: 0;
    font-size: 18px;
  }

  /deep/ .ant-tabs-nav .ant-tabs-tab {
    margin-right: 15px;
  }

  /deep/ .ant-tabs-ink-bar {
    width: 0!important;
  }

</style>
