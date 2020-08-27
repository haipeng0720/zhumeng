import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import Config from '@/settings'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,

  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 开启进度条
    NProgress.start()
    if (getToken()) {
      // 让每个请求携带自定义token
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error)
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // 关闭进度条
    NProgress.done()
    const res = response.data
    // 处理错误的状态
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
