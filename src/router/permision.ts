import { store } from '../store'
import { getlocalStorageToken } from '../utils/_ls'
import NProgress from 'nprogress'
import router from './index'

router.beforeEach((to, from, next) => {
  NProgress.start()
  const hasToken = getlocalStorageToken() || store?.state?.token || ''
  if (hasToken) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.path === '/login'){
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach((to, from) => {
  NProgress.done()
  document!.title = to?.meta?.title as string || '后台管理模板'
})