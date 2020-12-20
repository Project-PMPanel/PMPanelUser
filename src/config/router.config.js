// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { mac } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home', keepAlive: true },
    redirect: '/dashboard',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Dashboard'),
        meta: { title: 'menu.dashboard', keepAlive: true, icon: 'dashboard', permission: [ 'user', 'admin' ] }
      },
      // plan
      {
        path: '/plan',
        name: 'plan',
        redirect: '/plan/index',
        component: RouteView,
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        meta: { title: 'menu.subscription', keepAlive: true, icon: 'shopping-cart' },
        children: [
          {
            path: 'index',
            name: 'subscriptionIndex',
            component: () => import('@/views/plan/Index'),
            meta: { title: 'menu.subscription', keepAlive: true, icon: 'shopping-cart', permission: [ 'user', 'admin' ] }
          },
          {
            path: 'detail/:orderId',
            name: 'orderDetail',
            component: () => import('@/views/plan/Detail'),
            meta: { title: 'menu.orderDetail', keepAlive: true, permission: [ 'user', 'admin' ] }
          },
          {
            path: 'renew/:orderId',
            name: 'renew',
            component: () => import('@/views/plan/Renew'),
            meta: { title: 'menu.renew', keepAlive: true, permission: [ 'user', 'admin' ] }
          }
        ]
      },
      // checkout
      {
        path: '/checkout/:type/:id',
        name: 'checkout',
        hidden: true,
        component: () => import('@/views/plan/Checkout'),
        meta: { title: 'menu.checkout', keepAlive: true, permission: [ 'user', 'admin' ] }
      },
      // funds
      {
        path: '/funds',
        name: 'funds',
        component: () => import('@/views/funds/Funds'),
        meta: { title: 'menu.funds', keepAlive: true, icon: 'money-collect', permission: [ 'user', 'admin' ] }
      },
      // tutorials
      {
        path: '/tutorials',
        component: RouteView,
        meta: { title: 'menu.tutorials', keepAlive: true, icon: 'profile' },
        children: [
          {
            path: '/tutorials/windows',
            name: 'WinTutorials',
            component: () => import('@/views/tutorials/WinTutorials'),
            meta: { title: 'menu.tutorials.windows', keepAlive: true, icon: 'windows', permission: [ 'user', 'admin' ] }
          },
          {
            path: '/tutorials/android',
            name: 'AndroidTutorials',
            component: () => import('@/views/tutorials/AndroidTutorials'),
            meta: { title: 'menu.tutorials.android', keepAlive: true, icon: 'android', permission: [ 'user', 'admin' ] }
          },
          {
            path: '/tutorials/mac',
            name: 'MacTutorials',
            component: () => import('@/views/tutorials/MacTutorials'),
            meta: { title: 'menu.tutorials.mac', keepAlive: true, icon: mac, permission: [ 'user', 'admin' ] }
          },
          {
            path: '/tutorials/ios',
            name: 'IosTutorials',
            component: () => import('@/views/tutorials/iOSTutorials'),
            meta: { title: 'menu.tutorials.ios', keepAlive: true, icon: 'apple', permission: [ 'user', 'admin' ] }
          }
        ]
      },
      // account
      {
        path: '/account',
        name: 'settings',
        component: () => import('@/views/account/settings/Index'),
        meta: { title: 'menu.usercenter', icon: 'user', hideHeader: true },
        redirect: '/account/settings/security',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/account/settings/security',
            name: 'SecuritySettings',
            component: () => import('@/views/account/settings/Security'),
            meta: { title: 'menu.usercenter.settings.security', hidden: true, keepAlive: true, permission: [ 'user', 'admin' ] }
          },
          {
            path: '/account/settings/binding',
            name: 'BindingSettings',
            component: () => import('@/views/account/settings/Binding'),
            meta: { title: 'menu.usercenter.settings.binding', hidden: true, keepAlive: true, permission: [ 'user', 'admin' ] }
          },
          {
            path: '/account/settings/notification',
            name: 'NotificationSettings',
            component: () => import('@/views/account/settings/Notification'),
            meta: { title: 'menu.usercenter.settings.message', hidden: true, keepAlive: true, permission: [ 'user', 'admin' ] }
          }
        ]
      },
      // admincenter
      {
        path: '/admin/dashboard',
        name: 'admincenter',
        meta: { title: 'menu.admincenter', target: '_self', icon: 'home', permission: ['admin'] }
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        hidden: true,
        meta: { title: '结果页', icon: 'check-circle-o' },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: [ 'user', 'admin' ] }
          },
          {
            path: '/result/unauthorized',
            name: 'Unauthorized',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Unauthorized'),
            meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: [ 'user', 'admin' ] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: [ 'exception' ] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: [ 'exception' ] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: [ 'exception' ] }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/auth',
    component: UserLayout,
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/auth/Login')
      },
      {
        path: 'register/:inviteCode?',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/auth/Register')
      },
      {
        path: 'forgot',
        name: 'forgot',
        component: () => import(/* webpackChunkName: "user" */ '@/views/auth/ForgotPass')
      }
    ]
  },
  {
    path: '/password/reset',
    redirect: '/auth/forgot'
  },
  {
    path: '/user/invite',
    redirect: '/dashboard'
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
