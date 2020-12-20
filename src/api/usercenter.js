import request from '@/utils/request'

const api = {
  changePass: '/user/password',
  getEmailCheckCode: '/user/getEmailCheckCode',
  changeEmail: '/user/email'
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
