<template>
  <div class="main user-layout-register">
    <div v-if="loading" style="text-align: center;margin: 40px 0">
      <a-spin size="large" tip="Loading..." :spinning="loading"/>
    </div>
    <div v-else>
      <h3 style="margin-top:8px;text-align: center"><span>{{ $t('register.title') }}</span></h3>
      <div v-if="(registerEnable && !registerInviteOnly) || (inviteCode !== undefined && inviteCode !== '' && inviteCode.length >= 4)">
        <a-form ref="formRegister" :form="form" id="formRegister">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('register.email')"
              v-decorator="['email', {rules: [{ required: true, message: $t('register.emailMessage') }], validateTrigger: ['change', 'blur']}]">
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              <a-select slot="addonAfter" style="width: 130px" @change="onChange">
                <a-select-option :value="item" :key="index" v-for="(item, index) in emailList" >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-input>
          </a-form-item>

          <a-popover
            placement="rightTop"
            :trigger="['focus']"
            :getPopupContainer="(trigger) => trigger.parentElement"
            v-model="state.passwordLevelChecked">
            <template slot="content">
              <div :style="{ width: '240px' }">
                <div :class="['user-register', passwordLevelClass]"> {{ $t('register.passwordStrength') }}
                  ：<span>{{ passwordLevelName }}</span></div>
                <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
                <div style="margin-top: 10px;">
                  <span>{{ $t('register.passwordStrengthMessage') }}</span>
                </div>
              </div>
            </template>
            <a-form-item>
              <a-input-password
                size="large"
                :placeholder="$t('register.password')"
                @click="handlePasswordInputClick"
                v-decorator="['password', {rules: [{ required: true, message: $t('register.passwordMessage') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
              >
                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input-password>
            </a-form-item>
          </a-popover>

          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('register.repassword')"
              v-decorator="['password2', {rules: [{ required: true, message: $t('register.passwordMessage') }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>

          <a-form-item v-if="inviteCode !== undefined && inviteCode !== '' && inviteCode.length >= 4">
            <a-input
              size="large"
              :placeholder="$t('register.inviteCode') + ': ' + inviteCode"
              disabled
            >
              <a-icon slot="prefix" type="smile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16" v-if="emailEnable">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input
                  size="large"
                  type="text"
                  :placeholder="$t('register.checkCode')"
                  v-decorator="['checkCode', {rules: [{ required: true, message: $t('register.checkCodeMessage') }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="code" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                size="large"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && $t('register.getCheckCode')||(count+' s')"></a-button>
            </a-col>
          </a-row>

          <a-form-item>
            <a-checkbox @change="acceptTOS">
              {{ $t('register.acceptTOS') }}<a @click="showModal">{{ $t('register.tos') }}</a>
            </a-checkbox>
            <a-modal v-model="visible" :title="'Terms of service - ' + title" @ok="handleOk">
              <h6>特别提示</h6>
              <p>
                在此特别提醒您（用户）在注册成为 {{ title }} 用户之前，请认真阅读本《{{ title }} 用户服务协议》 （以下简称"协议"） ，确保您充分理解本协议中各条款。 请您审慎阅读并选择接受或不接受本协议。 除非您接受本协议所有条款， 否则您无权注册、登录或使用本协议所涉服务。您 的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。 本协议约定 {{ title }} 与用户之间关于代理服务（以下简称"服务"） 的权利义务。"用户"是指注册、登录、使用本服务的个人，{{ title }} 有权更新协议内容，更新后的协议条款一旦公布即替代原协议条款，恕不再另行通知。
              </p>

              <h6>账号注册</h6>
              <ol>
                <li>
                  用户在使用本服务前需要注册一个 "{{ title }}" 账号。"{{ title }}" 账号应当使用邮箱绑定注册，请用户使用尚未与其他 "{{ title }}" 账号绑定以及未被 {{ title }} 根据本协议封禁的邮箱注册 "{{ title }}" 账号。{{ title }} 有权根据用户需求或产品需要对账号注册和绑定的方式进行变更，恕不再另行通知。
                </li>
                <li>
                  如果注册申请者有被 {{ title }} 封禁的先例或涉嫌虚假注册及滥用他人名义注册，及其他不能得到许可的理由，{{ title }} 有权拒绝向其提供服务。
                </li>
              </ol>

              <h6>账户安全</h6>
              <ol>
                <li>
                  用户一旦注册成功，成为 {{ title }} 的用户，将得到一个用户名和密码， 并有权利使用自己的用户名及密码随时登陆 {{ title }}。
                </li>
                <li>
                  用户对账户和密码的安全负全部责任，同时对以其账户进行的所有活动和事件负全部责任。
                </li>
                <li>
                  {{ title }} 未经用户允许不得泄露用户的个人隐私与信息。
                </li>
                <li>
                  如果用户密码泄露或者其他任何原因导致用户的密码安全受到威胁，应该及时和 {{ title }} 客服人员取得联系，否则后果自负。
                </li>
                <li>
                  用户注册后只允许本人使用，账户禁止转移、共享、借于他人，如需要特别操作应该及时和 {{ title }} 客服人员取得联系，如被发现不限于对账号进行暂停或删除服务。
                </li>
              </ol>
              <h6>用户声明与保证</h6>
              <ol>
                <li>
                  用户需具有完全民事行为能力，且具有达成交易履行其义务的能力。
                </li>
                <li>
                  用户通过使用 {{ title }} 的过程中所制作、上载、复制、发布、传播的任何内容，包括但不限于账号头像、名称、用户说明等注册信息及认证资料，或文字、语音、图片、视频、图文等发送、回复和相关链接页面，以及其他使用账号或本服务所产生的内容，不得违反国家相关法律制度，包含但不限于如下原则：
                  <ul>
                    <li>
                      反对宪法所确定的基本原则
                    </li>
                    <li>
                      危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一
                    </li>
                    <li>
                      损害国家荣誉和利益
                    </li>
                    <li>
                      煽动民族仇恨、民族歧视，破坏民族团结
                    </li>
                    <li>
                      破坏国家宗教政策，宣扬邪教和封建迷信
                    </li>
                    <li>
                      散布谣言，扰乱社会秩序，破坏社会稳定
                    </li>
                    <li>
                      散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪
                    </li>
                    <li>
                      侮辱或者诽谤他人，侵害他人合法权益
                    </li>
                    <li>
                      含有法律、行政法规禁止的其他内容
                    </li>
                    <li>
                      对历史存在虚构、不真实描述，宣扬反政治或污蔑其他国家政治干扰现执政
                    </li>
                  </ul>
                </li>
                <li>
                  用户不得利用 "{{ title }}" 账号或本服务制作、上载、复制、发布、传播下干扰正常运营，以及侵犯其他用户或第三方合法权益的内容:
                  <ul>
                    <li>
                      含有任何性或性暗示的
                    </li>
                    <li>
                      含有辱骂、恐吓、威胁内容的
                    </li>
                    <li>
                      含有骚扰、垃圾广告、恶意信息、诱骗信息的
                    </li>
                    <li>
                      涉及他人隐私、个人信息或资料的
                    </li>
                    <li>
                      侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的
                    </li>
                    <li>
                      含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息
                    </li>
                  </ul>
                </li>
              </ol>

              <h6>服务内容</h6>
              <ol>
                <li>
                  {{ title }} 具体服务内容由 {{ title }} 根据实际情况提供，包括但不限于：
                  <ul>
                    <li>
                      在线咨询服务
                    </li>
                    <li>
                      网络代理服务
                    </li>
                  </ul>
                </li>
                <li>
                  所有发给用户的通告及其他消息都可通过邮箱或者用户所提供的联系方式发送。
                </li>
                <li>
                  如对服务不满或对产品存在心里差异，可以寻求客服进行协商退款。
                </li>
              </ol>

              <h6>服务的终止</h6>
              <ol>
                <li>
                  在下列情况下， {{ title }} 有权终止向用户提供服务：
                  <ul>
                    <li>
                      用户违反本服务协议相关规定
                    </li>
                    <li>
                      两个月以以上未使用 "{{ title }}" 服务，{{ title }} 有权终止向用户提供服务并不再保留用户相关数据
                    </li>
                    <li>
                      用户不得通过 "{{ title }}" 服务传播违反本协议规定的内容，一经发现，{{ title }} 有权扣留账户内的金额
                    </li>
                    <li>
                      本服务条款终止或更新时，用户明确表示不愿接受新的服务条款
                    </li>
                    <li>
                      其它 {{ title }} 认为需终止服务的情况
                    </li>
                  </ul>
                </li>
                <li>
                  服务终止后，{{ title }} 没有义务为用户保留原账号中或与之相关的任何信息。
                </li>
              </ol>

              <h6>服务的变更、中断</h6>
              <ol>
                <li>
                  鉴于网络服务的特殊性，用户需同意 {{ title }} 会变更、 中断部分或全部的网络服务，并删除（不再保存）用户在使用过程中提交的任何资料，而无需通知用户，也无需对任何用户或任何第三方承担任何责任。
                </li>
                <li>
                  {{ title }} 需要定期或不定期地对提供网络服务的平台进行检测或者更新，造成网络服务在合理时间内的中断，{{ title }} 有义务进行提前通知， 除此之外 {{ title }} 无需为此承担任何责任。
                </li>
              </ol>

              <h6>服务条款修改</h6>
              <ol>
                <li>{{ title }} 有权随时修改本服务条款的任何内容， 一旦本服务条款的任何内容发生变动， {{ title }} 将会通过适当方式向用户提示修改内容。</li>
                <li>如果不同意 {{ title }} 对本服务条款所做的更新及改动，用户有权停止使用 {{ title }} 服务。</li>
                <li>如果用户继续使用网络服务，则视为用户接受 {{ title }} 对本服务条款所做的修改。</li>
              </ol>

              <h6>免责与赔偿声明</h6>
              <ol>
                <li>
                  若 {{ title }} 已经明示其服务提供方式发生变更并提醒用户应当注意事项，如因此类情况而 用户未按要求操作所产生的一切后果由用户自行承担。
                </li>
                <li>
                  用户明确同意其使用 {{ title }} 所存在的风险将完全由其自己承担，因其使用 {{ title }} 而产生的一切后果也由其自己承担。
                </li>
                <li>
                  用户同意保障和维护 {{ title }} 及其他用户的利益，由于用户在使用 {{ title }} 有违法、不真实、 不正当、侵犯第三方合法权益的行为，或用户违反本协议项下的任何条款而给 {{ title }} 及任何其他第三方造成损失，用户同意承担由此造成的损害赔偿责任。
                </li>
              </ol>

              <h6>隐私声明</h6>
              <ol>
                <li>
                  适用范围：
                  <ul>
                    <li>
                      在用户注册 {{ title }} 账户时，根据要求提供的个人注册信息
                    </li>
                    <li>
                      在用户使用 {{ title }}，或访问其相关网页时， {{ title }} 自动接收并记录的用户浏览器上的服 务器数值，包括但不限于 IP 地址等数据及用户要求取用的网页记录
                    </li>
                  </ul>
                </li>
                <li>
                  信息使用：
                  <ul>
                    <li>
                      {{ title }} 不会向任何人出售或出借用户的个人信息，除非事先得到用户的许可
                    </li>
                    <li>
                      {{ title }} 亦不允许任何第三方以任何手段收集、 编辑、出售或者无偿传播用户的个人信息。任何用户如从事上述活动，一经发现，{{ title }} 有权立即终止与该用户的服务协议 ，查封其账号
                    </li>
                    <li>
                      为达到服务用户的目的，{{ title }} 可能通过使用用户的个人信息，向用户提供服务，包括但不限于向用户发出产品和服务信息
                    </li>
                  </ul>
                </li>
                <li>
                  信息披露：
                  用户的个人信息将在下述情况下部分或全部被披露
                  <ul>
                    <li>
                      经用户同意，向第三方披露
                    </li>
                    <li>
                      根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露
                    </li>
                    <li>
                      如果用户出现违反国家有关法律或者网站政策的情况，需要向第三方披露
                    </li>
                    <li>
                      用户使用 {{ title }} 时提供的银行账户信息，{{ title }} 将严格履行相关保密约定
                    </li>
                  </ul>
                </li>
              </ol>

              <h6>其他</h6>
              <ol>
                <li>
                  {{ title }} 郑重提醒用户注意本协议中免除 {{ title }} 责任和限制用户权利的条款，请用户仔细阅读，自主考虑风险。未成年人应在法定监护人的陪同下阅读本协议。
                </li>
                <li>
                  本协议最终解释权归 {{ title }} 所有，并且保留一切解释和修改的权力。
                </li>
              </ol>
            </a-modal>
          </a-form-item>

          <a-form-item>
            <a-button
              size="large"
              type="primary"
              htmlType="submit"
              class="register-button"
              :loading="registerBtn"
              @click.stop.prevent="handleSubmit"
              :disabled="registerBtn"> {{ $t('register.registerBtn') }}
            </a-button>
            <router-link class="login" :to="{ name: 'login' }"> {{ $t('login.loginBtn') }}</router-link>
          </a-form-item>
        </a-form>
      </div>
      <div v-else-if="registerEnable && registerInviteOnly">
        <h2 style="text-align: center"> {{ $t('register.inviteOnlyMessage') }} </h2>
      </div>
      <div v-else>
        <h2 style="text-align: center"> {{ $t('register.closeMessage') }} </h2>
      </div>
      <select-lang style="margin-top: -20px;float: right" />
    </div>
  </div>
</template>

<script>
import { getSiteConfig, getEmailCheckCode, register } from '@/api/auth'
import { deviceMixin } from '@/store/device-mixin'
import i18n from '@/locales'
import storage from 'store'

const levelNames = {
  0: i18n.t('register.passwordLevel.0'),
  1: i18n.t('register.passwordLevel.1'),
  2: i18n.t('register.passwordLevel.2'),
  3: i18n.t('register.passwordLevel.3')
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
const checkCodeCount = 60

export default {
  name: 'Register',
  components: {},
  mixins: [deviceMixin],
  data () {
    return {
      loading: true,
      registerEnable: true,
      registerInviteOnly: false,
      emailEnable: false,
      emailList: [],
      emailSuffix: '',
      form: this.$form.createForm(this),
      count: '',
      timer: null,
      state: {
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      title: '',
      visible: false,
      accept: false,
      inviteCode: undefined,
      registerBtn: false
    }
  },
  async created () {
    // get config
    const result = await getSiteConfig()
    storage.set('SITE_TITLE', result.data.panelSiteTitle)
    this.title = result.data.panelSiteTitle
    if (result.data.panelSiteRegisterEnable) {
      // 允许注册, 判断是否开启邀请注册
      if (result.data.panelSiteRegisterInviteOnly) {
        this.registerInviteOnly = true
      }
    } else {
      // 不允许注册
      this.registerEnable = false
    }
    if (result.data.panelMailRegisterEnable) {
      this.emailEnable = true
    }
    this.emailList = result.data.emailList
    this.emailSuffix = this.emailList[0]
    console.log(this.emailList)
    // 获取url的参数,设置aff到cookie
    if (this.$route.params.inviteCode === undefined) {
      if (this.registerInviteOnly) {

      }
    } else {
      this.inviteCode = this.$route.params.inviteCode
    }
    this.loading = false
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    onChange (value) {
      this.emailSuffix = value
    },
    handlePasswordLevel (rule, value, callback) {
      let level = 0

      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback()
      }
    },

    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      console.log('value', value)
      if (value === undefined) {
        callback()
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error(i18n.t('register.repasswordMessage')))
      }
      callback()
    },

    handlePasswordInputClick () {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },

    async getCaptcha () {
      const param = {
        'email': this.form.getFieldValue('email') + this.emailSuffix,
        'type': 0
      }
      const result = await getEmailCheckCode(param)
      if (result.code === 200) {
        this.count = checkCodeCount
        this.state.smsSendBtn = true
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= checkCodeCount) {
            this.count--
          } else {
            this.state.smsSendBtn = false
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
      console.log(result)
    },

    showModal () {
      this.visible = true
    },

    handleOk (e) {
      console.log(e)
      this.visible = false
    },

    acceptTOS () {
      this.accept = !this.accept
    },

    async handleSubmit () {
      const { form: { validateFields }, state } = this
      let notErr = false
      validateFields({ force: true }, (err) => {
        if (!err) {
          state.passwordLevelChecked = false
          notErr = !err
        }
      })
      if (notErr) {
        var regParam = {
          'email': this.form.getFieldValue('email') + this.emailSuffix,
          'password': this.form.getFieldValue('password'),
          'checkCode': this.form.getFieldValue('checkCode')
        }
        if (this.inviteCode !== undefined) {
          regParam.inviteCode = this.inviteCode
        }
        console.log(regParam)
        if (!this.accept) {
          this.$notification.error({
            message: this.$t('register.acceptTOSInfo')
          })
          return
        }
        const result = await register(regParam)
        console.log(result)
        if (result.code === 200) {
          this.$notification.success({
            description: this.$t('register.registerSuccess')
          })
          // 延迟 1 秒显示欢迎信息
          setTimeout(() => {
            this.$router.push({ path: '/auth/login' })
          }, 2000)
        }
      }
    },

    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.registerBtn = false
    }
  },
  watch: {
    'state.passwordLevel' (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less">
.user-register {

  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }

}

.user-layout-register {
  .ant-input-group-addon:first-child {
    background-color: #fff;
  }
}
</style>
<style lang="less" scoped>
.user-layout-register {

  & > h3 {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .register-button {
    width: 50%;
  }

  .login {
    float: right;
    line-height: 40px;
  }
}
</style>
