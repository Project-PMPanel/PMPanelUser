import request from '@/utils/request'

const api = {
  plan: '/user/plan',
  currentPlan: '/user/currentPlan',
  package: '/user/package',
  order: '/user/order',
  price: '/user/choosePlanInfo',
  renewOrder: '/user/renewOrder',
  paymentConfig: '/user/paymentConfig',
  payOrder: '/user/payOrder'
}

export default api

/**
 * 获取套餐列表
 * @returns {*}
 */
export function getPlan () {
  return new Promise((resolve, reject) => {
    request({
      url: api.plan,
      method: 'get'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 获取用户当前套餐
 * @returns {*}
 */
export function getCurrentPlan () {
  return new Promise((resolve, reject) => {
    request({
      url: api.currentPlan,
      method: 'get'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 获取用户当前订单
 * @param parameter
 * @returns {*}
 */
export function getOrder (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: api.order,
      method: 'get',
      params: parameter
    }).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 获取用户流量包订单
 * @param parameter
 * @returns {*}
 */
export function getPackageOrder (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: api.package,
      method: 'get',
      params: parameter
    }).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 购买流量包
 * @param parameter
 * @returns {*}
 */
export function buyPackage (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: api.package,
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
 * 购买套餐
 * @param parameter
 * @returns {*}
 */
export function buyPlan (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: api.order,
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
 * 续费套餐
 * @param parameter
 * @returns {*}
 */
export function renewOrder (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: api.renewOrder,
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
 * 取消订单
 * @param parameter
 * @returns {*}
 */
export function cancelOrderByOrderId (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: api.order + '/' + parameter,
      method: 'put'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 删除失效订单
 * @param parameter
 * @returns {*}
 */
export function deleteOrderByOrderId (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: api.order + '/' + parameter,
      method: 'delete'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 获取订单详情
 * @param parameter
 * @returns {*}
 */
export function getOrderByOrderId (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: api.order + '/' + parameter,
      method: 'get'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 取消流量包订单
 * @param parameter
 * @returns {*}
 */
export function cancelPackageOrderById (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: api.package + '/' + parameter,
      method: 'put'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 删除流量包订单
 * @param parameter
 * @returns {*}
 */
export function deletePackageOrderById (parameter) {
  return new Promise((resolve, reject) => {
    request({
      url: api.package + '/' + parameter,
      method: 'delete'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 获取支付配置
 * @returns {*}
 */
export function getPaymentConfig () {
  return new Promise((resolve, reject) => {
    request({
      url: api.paymentConfig,
      method: 'get'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 根据类型和id获取订单详情
 * @param type
 * @param id
 * @returns {*}
 */
export function getOrderByTypeAndId (type, id) {
  return new Promise((resolve, reject) => {
    request({
      url: api.order + '/' + type + '/' + id,
      method: 'get'
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 订单支付
 * @param params
 * @returns {*}
 */
export function payOrder (params) {
  return new Promise((resolve, reject) => {
    request({
      url: api.payOrder,
      method: 'post',
      data: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
