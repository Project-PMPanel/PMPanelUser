import request from '@/utils/request'

const api = {
  tutorial: '/user/tutorial'
}

export default api

/**
 * 获取教程byType
 * @returns {AxiosPromise}
 */
export function getTutorialsByType (type) {
  return new Promise((resolve, reject) => {
    request({
      url: api.tutorial + '/' + type,
      method: 'get'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
