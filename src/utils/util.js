import i18n from '@/locales'

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? i18n.t('login.successInfo.morning') : hour <= 11 ? i18n.t('login.successInfo.afterMorning') : hour <= 13 ? i18n.t('login.successInfo.noon') : hour < 20 ? i18n.t('login.successInfo.afternoon') : i18n.t('login.successInfo.evening')
}

export function welcome () {
  const arr = [i18n.t('login.success.welcome.info.1'), i18n.t('login.success.welcome.info.2'), i18n.t('login.success.welcome.info.3'), i18n.t('login.success.welcome.info.4')]
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}
