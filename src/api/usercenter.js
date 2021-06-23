import request from '@/utils/request'

const api = {
  changePass: '/user/password',
  getEmailCheckCode: '/user/getEmailCheckCode',
  changeEmail: '/user/email',
  getTGConfig: '/user/tgconfig',
  unBindTG: '/user/unBindTG',
  getBindConfig: '/user/bindConfig',
  getBindInfo: '/user/bindInfo',
  bindAccount: '/user/bindAccount',
  unBindAccount: '/user/unBindAccount'
}

/**
 * 旧密码修改新密码
 * @param parameter
 * @returns {Promise<unknown>}
 */
export function changePass (params) {
  return new Promise((resolve, reject) => {
    request({
      url: api.changePass,
      method: 'put',
      data: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 获取验证码
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getEmailCheckCode (params) {
  return request({
    url: api.getEmailCheckCode + '?email=' + params,
    method: 'get'
  })
}

export function changeEmail (params) {
  return new Promise((resolve, reject) => {
    request({
      url: api.changeEmail,
      method: 'put',
      data: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 获取TG配置
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getTGConfig () {
  return request({
    url: api.getTGConfig,
    method: 'get'
  })
}

/**
 * 解绑TG
 */
export function unBindTG () {
  return new Promise((resolve, reject) => {
    request({
      url: api.unBindTG,
      method: 'post'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 获取绑定配置
 */
export function getBindConfig () {
  return request({
    url: api.getBindConfig,
    method: 'get'
  })
}

/**
 * 获取绑定信息
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getBindInfo () {
  return request({
    url: api.getBindInfo,
    method: 'get'
  })
}

/**
 * 绑定账户
 */
export function bindAccount (params) {
  return new Promise((resolve, reject) => {
    request({
      url: api.bindAccount,
      method: 'post',
      data: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export function unBindAccount (param) {
  return new Promise((resolve, reject) => {
    request({
      url: api.unBindAccount + '/' + param,
      method: 'put'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
