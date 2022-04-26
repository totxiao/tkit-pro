import { Method } from 'axios'
import EventEmitter from './EventEmitter'
import { Ref, isProxy } from 'vue'
import { useRequest } from 'vue-request'
import request from '@/utils/request'
import { TableOptions } from './table'
import { PAGER_CONFIG } from '../../../global-types'

enum KEYOF_METHOD {
  get = 1,
  GET,
  delete,
  DELETE,
  head,
  HEAD,
  options,
  OPTIONS,
  post,
  POST,
  put,
  PUT,
  patch,
  PATCH,
  purge,
  PURGE,
  link,
  LINK,
  unlink,
  UNLINK,
}

/**
 * 表格数据处理器
 */
export default class DataHandler {
  data: any // 表格使用的最终数据
  referData: any // 数据来源的引用
  service: TableOptions['service']
  filters?: object
  eventEmitter: EventEmitter
  objectService?: (P: any) => Promise<any>
  run?: (P: object) => void
  loading: Ref<boolean> | undefined
  error?: Ref<Error | undefined>
  custromDataTrans?: (data: any) => object

  constructor(tableOptions: TableOptions, eventEmitter: EventEmitter) {
    this.service = tableOptions.service
    this.filters = tableOptions.filters
    this.custromDataTrans = tableOptions.custromDataTrans

    this.eventEmitter = eventEmitter

    // 用户主动传递数据则直接使用,否则调用接口
    if (tableOptions.data) {
      this.referData = tableOptions.data
      this._dataTransmit(tableOptions.data)
    } else {
      this.fetchData()
    }
  }

  /**
   * 获取表格数据
   * @returns data
   */
  getTableData() {
    return this.data
  }

  /**
   * 获取数据加载状态
   * @returns loading
   */
  getTableLoading() {
    return this.loading
  }

  /**
   * 获取数据加载异常
   * @returns error
   */
  getTableError() {
    return this.error
  }

  /**
   * 清空表格数据
   */
  clearTable() {
    if (this.referData) {
      this.referData.value = {}
    }

    this.eventEmitter._dataClear()
  }

  /**
   * 通过service获取数据
   * @returns void
   */
  fetchData(params?: any) {
    if (!this.run) {
      this._generateRun()
    }

    this.run?.(params)
  }

  /**
   * 生成拉取数据方法
   */
  _generateRun() {
    if (!this.objectService) {
      this._generateService()
    }

    const { objectService } = this

    if (objectService === undefined) return

    //抛出 data-will-loading事件通知
    this.eventEmitter._dataWillLoad(objectService)

    try {
      const { data, run, loading, error } = useRequest(objectService, {
        manual: true,
      })
      // 保存原始数据的引用
      this.referData = data
      this._dataTransmit(data)

      this.run = run
      this.loading = loading
      this.error = error
    } catch {
      console.error('表格数据获取失败,请检查service配置!')
    }
  }

  /**
   * service生成器
   * @param params 可能存在的参数
   * @returns 返回service请求的promise
   */
  _generateService() {
    if (!this.service) {
      console.error('请配置service!')
      return
    }

    let objectService

    if (typeof this.service === 'function') {
      // 函数类型直接使用用户传递的方法作为service
      objectService = this.service
    } else if (typeof this.service === 'string') {
      // 字符类型视为url数据组装service
      const service: string = <string>this.service

      objectService = (params: any) => {
        return request({
          url: service,
          method: 'get',
          params: params,
        })
      }
    } else {
      // 对象类型根据用户配置定义service
      const { service } = this

      const method: Method = <Method>service.method

      // 补充类型判断
      if (!KEYOF_METHOD[method]) {
        console.error(`不存在${method}请求方式, 请检查service配置!`)
        return
      }

      objectService = (params: any) => {
        return request({
          url: service.url,
          method: method || 'get',
          headers: service.headers,
          params: { ...service.params, ...params },
        })
      }
    }

    this.objectService = objectService
  }

  /**
   * 传递响应式数据
   * @param data 获取到的原始数据
   * @returns void 生成直接提供给表格的数据
   */
  _dataTransmit(data: any) {
    let transFunc: (data: any) => object | void = this._dataTransition

    if (this.custromDataTrans) {
      transFunc = this.custromDataTrans
    }

    this.data = computed(() => {
      const dataSource = transFunc(data)

      // 外部传入的相应式数据或生成了响应式数据
      if (isProxy(data) || data.value) {
        // 抛出 data-loaded 事件
        this.eventEmitter._dataLoaded(dataSource)
      }

      return dataSource
    })
  }

  /**
   * 数据格式转换器
   * @param data 获取到的原始数据
   * @return translateData 转换之后的数据
   */
  _dataTransition(data: any) {
    const proxyValue = data.value || data
    if (Array.isArray(proxyValue)) {
      return {
        tableData: proxyValue,
        pagination: {},
      }
    } else if (typeof proxyValue === 'object') {
      return {
        tableData: proxyValue?.[PAGER_CONFIG.result],
        pagination: {
          current: proxyValue?.[PAGER_CONFIG.current],
          pageSize: proxyValue?.[PAGER_CONFIG.pageSize],
          total: proxyValue?.[PAGER_CONFIG.total],
        },
      }
    } else {
      console.error('不支持的数据格式,请修改data数据格式!')
    }
  }
}
