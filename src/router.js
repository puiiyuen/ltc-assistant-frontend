import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Error from './views/Error'
import App from './App'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: App
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/login/activate',
      name: 'activate',
      component: () => import('./components/Activate')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard')
    },
    {
      path: '/error',
      name: 'error',
      component: Error
    }
  ]
})
