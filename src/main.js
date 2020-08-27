import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'

import TreeTable from 'vue-table-with-tree-grid'
import './assets/styles/element-variables.scss'
import './assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index'

import permission from './directive/permission'
Vue.use(permission)

import { sexFormat, download } from '@/utils/syyo'

// 过滤器
Vue.filter('sexFormat', sexFormat)

// 全局方法挂载
Vue.prototype.download = download

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,

  render: h => h(App)
})
