<template>
  <a-card :bordered="false">
    <a-result status="error">
      <div class="desc">
        <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 16px">
          您提交的内容有如下错误：
        </div>
        <div style="margin-bottom: 16px">
          <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
          您的账户已被冻结
          <a style="margin-left: 16px">申请解冻 <a-icon type="right" /></a>
        </div>
      </div>
    </a-result>
  </a-card>
</template>

<script>

export default {
  name: 'Unauthorized',
  data () {
    return {
      title: '提交失败',
      description: '请核对并修改以下信息后，再重新提交。'
    }
  }
}
</script>
