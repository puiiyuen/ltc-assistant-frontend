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
      meta: {
        requireAuth: false
      },
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        requireAuth: false // require authorization
      },
      component: Login
    },
    {
      path: '/activate',
      name: 'activate',
      meta: {
        requireAuth: false
      },
      component: () => import('./components/Activate')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: {
        requireAuth: true // require authorization
      },
      component: () => import('./views/Dashboard')
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
