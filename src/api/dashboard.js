import request from '@/utils/request'

const api = {
  announcement: '/user/announcement',
  inviteCode: '/user/inviteCode'
}

export default api

/**
 * 获取公告
 * @returns {AxiosPromise}
 */
export function getAnnouncement () {
  return request({
    url: api.announcement,
    method: 'get'
  })
}

/**
 * 重置邀请码
 */
export function resetInviteCode () {
  return request({
    url: api.inviteCode,
    method: 'put'
  })
}
