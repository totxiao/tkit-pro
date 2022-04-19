import axios from 'axios'
// import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN, REQUEST_TYPE } from '@/global-types'
import { message } from 'ant-design-vue'
import { App } from 'vue'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.NODE_ENV === 'local' ? process.env.VUE_APP_API_BASE_URL : process.env.VUE_APP_API_ROOT_URL,
  timeout: 6000, // 请求超时时间
  withCredentials: true,
})

// 异常拦截处理器
const errorHandler = (error: any) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message,
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed',
      })
      if (token) {
        // store.dispatch('Logout').then(() => {
        //   // this.$router.push({ path: '/user/login' })
        //   setTimeout(() => {
        //     window.location.reload()
        //   }, 1500)
        // })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use((config: any) => {
  console.log('in')
  const token = storage.get(ACCESS_TOKEN)
  const requestType = storage.get(REQUEST_TYPE)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  if (requestType) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }
  storage.remove(REQUEST_TYPE)
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  const { data = {} } = response
  const { code = '', msg } = data
  if (code === 401) {
    // store.dispatch('Logout').then((res) => {
    //   // todo 无脑一直登陆 临时备注起来
    //   // const url = window.location.host
    //   // const joinUrl = `http://${url}/user/login`
    //   // window.location.href = joinUrl
    // })
  }
  if (code === 500) {
    message.error(msg)
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue: App) {
    Vue.use(VueAxios, request)
  },
}

export default request

export { installer as VueAxios, request as axios }
