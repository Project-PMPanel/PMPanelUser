import request from '@/utils/request'

const api = {
  getFunds: '/user/funds',
  withdraw: '/user/withdraw'
}

/**
 * 获取资金详细列表
 * @param parameter
 * @returns {Promise<unknown>}
 */
export function getFunds (params) {
  return new Promise((resolve, reject) => {
    request({
      url: api.getFunds,
      method: 'get',
      params: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 提交提现申请
 * @param params
 */
export function submitWithdraw (params) {
  return new Promise((resolve, reject) => {
    request({
      url: api.withdraw,
      method: 'post',
      data: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
