import axios from 'axios'
// import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN, REQUEST_TYPE } from '@/global-types'
import { message } from 'ant-design-vue'
import { App } from 'vue'
import { PAGER_CONFIG } from '../global-types'
import Mock from 'mockjs'

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

const _generateMock = (params: any) => {
  const mockParams = params?.mockParams
  if (!mockParams) throw new Error('mock数据缺少必须的参数!')

  let mockTemp: any
  if (mockParams.type === 'table') {
    mockTemp = {
      [`${PAGER_CONFIG.result}|10`]: [
        {
          'id|+1': 0,
          ...mockParams.template.reduce((acc: any, col: any) => {
            acc[col.key] = /[\w]{3,10}/
            return acc
          }, {}),
        },
      ],
      [`${PAGER_CONFIG.current}`]: 1,
      [`${PAGER_CONFIG.pageSize}`]: 10,
      [`${PAGER_CONFIG.total}`]: 10,
    }
  } else {
    mockTemp = mockParams.reg
  }

  return Mock.mock(mockTemp)
}

// request mock包装
function requestEnhance(params: any) {
  if (params?.method === 'mock' || params?.method === 'MOCK') {
    const a = new Promise((resolve) => {
      const data = _generateMock(params)
      resolve(data)
    })
    return a
  } else {
    return request(params)
  }
}

const installer = {
  vm: {},
  install(Vue: App) {
    Vue.use(VueAxios, requestEnhance)
  },
}

export default requestEnhance

export { installer as VueAxios, requestEnhance as axios }
