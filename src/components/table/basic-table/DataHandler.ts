import EventEmitter from './EventEmitter'
import { Ref } from 'vue'
import { useRequest } from 'vue-request'
import request from '@/utils/request'
import { TableOptions } from './table'
// import { PAGER_CONFIG } from '../../../global-types'

/**
 * 表格数据处理器
 */
export default class DataHandler {
  data: any // 表格数据
  service: TableOptions['service']
  filters?: object
  eventEmitter: EventEmitter
  run: (() => void) | undefined
  loading: Ref<boolean> | undefined
  error?: Ref<Error | undefined>

  constructor(tableOptions: TableOptions, _eventEmitter: EventEmitter) {
    this.service = tableOptions.service
    this.filters = tableOptions.filters

    this.eventEmitter = _eventEmitter

    // 用户主动传递数据则直接使用,否则调用接口
    if (!this.data) {
      this.getData()
    }
  }

  /**
   * 通过service获取数据
   * @returns void
   */
  getData(params?: any) {
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

    this.eventEmitter._dataWillLoad(objectService)

    try {
      const { data, loading, mutate, error } = useRequest(objectService)
      this.data = mutate(this.dataTranslate(data.value))
      this.eventEmitter._dataLoaded(this.data.value)
      this.loading = loading
      this.error = error
    } catch {
      console.error('表格数据获取失败,请检查service配置!')
    }
  }

  dataTranslate(data: any) {
    console.log(data)
    return data
  }
}
