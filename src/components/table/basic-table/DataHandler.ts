import EventEmitter from './EventEmitter'
import { Ref } from 'vue'
import { useRequest } from 'vue-request'
import request from '@/utils/request'
import { TableOptions } from './table'
import { PAGER_CONFIG } from '../../../global-types'

/**
 * 表格数据处理器
 */
export default class DataHandler {
  data: any // 表格数据
  service: TableOptions['service']
  filters?: object
  eventEmitter: EventEmitter
  objectService?: () => Promise<any>
  loading: Ref<boolean> | undefined
  error?: Ref<Error | undefined>

  constructor(tableOptions: TableOptions, _eventEmitter: EventEmitter) {
    this.service = tableOptions.service
    this.filters = tableOptions.filters

    this.eventEmitter = _eventEmitter

    // 用户主动传递数据则直接使用,否则调用接口
    if (!this.data) {
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
    this.data = undefined
    this.loading = undefined
    this.error = undefined
    this.eventEmitter._dataClear()
  }

  /**
   * service生成器
   * @param params 可能存在的参数
   * @returns 返回service请求的promise
   */
  generateService(params?: any) {
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
      objectService = () => {
        const service: string = <string>this.service
        return request({
          url: service,
          method: 'get',
          params: params,
        })
      }
    } else {
      // 对象类型根据用户配置定义service
      const { service } = this
      objectService = () => {
        return request({
          url: service.url,
          method: service.method,
          headers: service.headers,
          params: { ...service.params, params },
        })
      }
    }

    this.objectService = objectService
  }

  /**
   * 数据格式转换器
   * @param data 获取到的原始数据
   * @returns tableData 返回直接提供给表格的数据
   */
  dataTranslation(data: any) {
    this.data = computed(() => {
      const dataSource = {
        tableData: data.value?.[PAGER_CONFIG.result],
        pagination: {
          current: data.value?.[PAGER_CONFIG.current],
          pageSize: data.value?.[PAGER_CONFIG.pageSize],
          total: data.value?.[PAGER_CONFIG.total],
        },
      }

      if (data.value) {
        // 抛出 data-loaded 事件
        this.eventEmitter._dataLoaded(dataSource)
      }

      return dataSource
    })
  }

  //   const pagination = {
  //   current: toRef(data, PAGER_CONFIG.current),
  //   pageSize: toRef(data, PAGER_CONFIG.pageSize),
  //   total: toRef(data, PAGER_CONFIG.total),
  // }

  /**
   * 通过service获取数据
   * @returns void
   */
  fetchData(params?: any) {
    if (!this.objectService) {
      this.generateService(params)
    }

    const { objectService } = this

    if (objectService === undefined) {
      return
    }

    //抛出 data-will-loading事件通知
    this.eventEmitter._dataWillLoad(objectService)

    try {
      const { data, loading, error } = useRequest(objectService)
      this.dataTranslation(data)

      this.loading = loading
      this.error = error
    } catch {
      console.error('表格数据获取失败,请检查service配置!')
    }
  }
}
