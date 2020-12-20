import request from '@/utils/request'

const authApi = {
  getSiteConfig: '/auth/getSiteConfig',
  Register: '/auth/register',
  Login: '/auth/login',
  findPass: '/auth/findPass',
  getEmailCheckCode: '/auth/getEmailCheckCode',
  // get my info after login & get token
  UserInfo: '/user/info'
}

/**
 * 注册
 * @param parameter
 * @returns {Promise<unknown>}
 */
export function register (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: authApi.Register,
      method: 'post',
      data: parameter
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 登陆
 * @param parameter
 * @returns {AxiosPromise}
 */
export function auth (parameter) {
  return request({
    url: authApi.Login,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取站点配置
 * @returns {AxiosPromise}
 */
export function getSiteConfig () {
  return request({
    url: authApi.getSiteConfig,
    method: 'get'
  })
}

/**
 * 获取验证码
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getEmailCheckCode (parameter) {
  return request({
    url: authApi.getEmailCheckCode,
    method: 'get',
    params: parameter
  })
}

/**
 * 找回密码
 * @param parameter
 * @returns {Promise<unknown>}
 */
export function findPass (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: authApi.findPass,
      method: 'post',
      data: parameter
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 获取用户信息
 * @returns {AxiosPromise}
 */
export function getInfo () {
  return request({
    url: authApi.UserInfo,
    method: 'get'
  })
}
