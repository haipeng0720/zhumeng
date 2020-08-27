import router from './routers'
import store from '@/store'
import Config from '@/settings'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { buildMenu } from '@/api/system/menu'
import { filterAsyncRouter } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login']// 白名单

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title // 标题名
  }

  if (getToken()) {
    // console.log('已登录1')
    // console.log(store.getters)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        // console.log('是否已拉取完user_info信息')
        // console.log(store.getters.roles)
        store.dispatch('GetInfo').then(res => { // 拉取user_info
        // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch((err) => {
          console.log(err)
          // console.log('退出')
          store.dispatch('Logout').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      // 登录时未拉取 菜单，在此处拉取
      } else if (store.getters.loadMenus) {
        // console.log('登录时未拉取 菜单，在此处拉取')
        // 修改成false，防止死循环
        store.dispatch('updateLoadMenus').then(res => { })
        loadMenus(next, to)
      } else {
      // console.log('已登录3')
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      // console.log('白名单')
      next()
    } else {
      // console.log('重定向')
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to) => {
  buildMenu().then(res => {
    const asyncRouter = filterAsyncRouter(res.data)
    asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
      router.addRoutes(asyncRouter) // 动态添加可访问路由表
      next({ ...to, replace: true })
    })
  })
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
