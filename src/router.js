import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Error from './views/Error'
import Home from './views/Home'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requireAuth: false },
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      meta: { requireAuth: false },
      component: Login
    },
    {
      path: '/activate',
      name: 'activate',
      meta: { requireAuth: false },
      component: () => import('./components/Activate')
    },
    {
      path: '/senior',
      component: () => import('./components/Sidebar/side-senior'),
      meta: { requireAuth: true },
      children: [
        {// default senior page
          path: '',
          name: 'senior',
          component: () => import('./components/Panel/panel-senior'),
          meta: { requireAuth: true }
        },
        {// base information
          path: 'base-information',
          name: 'baseInfo',
          component: () => import('./components/Panel/senior/baseInfo'),
          meta: { requireAuth: true }
        },
        {// health report
          path: 'health-report',
          name: 'healthReport',
          component: () => import('./components/Panel/senior/healthReport'),
          meta: { requireAuth: true }
        },
        {// personal bill
          path: 'bill',
          name: 'bill',
          component: () => import('./components/Panel/senior/bill'),
          meta: { requireAuth: true }
        }
      ]
    },
    {
      path: '/security',
      component: () => import('./components/Sidebar/side-security'),
      meta: { requireAuth: true },
      children: [
        {// default security page
          path: '',
          name: 'security',
          component: () => import('./components/Panel/panel-security'),
          meta: { requireAuth: true }
        },
        {// security setting
          path: 'security-setting',
          name: 'secSetting',
          component: () => import('./components/Panel/security/secSetting'),
          meta: { requireAuth: true }
        },
        {// SOS
          path: 'monitor',
          name: 'monitor',
          component: () => import('./components/Panel/security/monitor'),
          meta: { requireAuth: true }
        }
        // add more children
      ]
    },
    {
      path: '/message',
      component: () => import('./components/Sidebar/side-message'),
      meta: { requireAuth: true },
      children: [
        {// default message page
          path: '',
          name: 'message',
          component: () => import('./components/Panel/panel-message'),
          meta: { requireAuth: true }
        },
        {// notice
          path: 'notice',
          name: 'notice',
          component: () => import('./components/Panel/message/notice'),
          meta: { requireAuth: true }
        },
        {// bulletin board
          path: 'feedback',
          name: 'feedback',
          component: () => import('./components/Panel/message/feedback'),
          meta: { requireAuth: true }
        }
        // add more children
      ]
    },
    {
      path: '/staff',
      component: () => import('./components/Sidebar/side-staff'),
      meta: { requireAuth: true },
      children: [
        {// default staff page
          path: '',
          name: 'staff',
          component: () => import('./components/Panel/panel-staff'),
          meta: { requireAuth: true }
        },
        {// staff information
          path: 'staff-information',
          name: 'staffInfo',
          component: () => import('./components/Panel/staff/staffInfo'),
          meta: { requireAuth: true }
        },
        {// assignment for staff
          path: 'assignment',
          name: 'assignment',
          component: () => import('./components/Panel/staff/assignment'),
          meta: { requireAuth: true }
        },
        {// staff movement
          path: 'staff-movement',
          name: 'staffMovement',
          component: () => import('./components/Panel/staff/staffMovement'),
          meta: { requireAuth: true }
        }
        // add more children
      ]
    },
    {
      // 404 error page
      path: '*',
      name: 'error',
      meta: {
        requireAuth: false
      },
      component: Error
    }
  ]

})
