import { SetupContext } from 'vue'
/**
 * 事件发射器
 * 向上级通讯传递事件
 */

export default class EventEmitter {
  ctx: SetupContext<Record<string, any>>
  constructor(context: SetupContext<Record<string, any>>) {
    this.ctx = context
  }

  /**
   * 表格初始化完成后执行
   */
  _tableInited() {
    console.log('_tableInited')
    this.ctx.emit('_tableInited')
  }

  /**
   * 表格销毁后执行
   */
  _tableUnload() {
    console.log('_tableUnload')
    this.ctx.emit('_tableUnload')
  }

  /**
   * 数据加载前执行
   * @param 获取数据的service方法
   */
  _dataWillLoad(params: any) {
    console.log('__dataWillLoad')
    this.ctx.emit('__dataWillLoad', params)
  }

  /**
   * 数据加载完成后执行
   * @param 将渲染的表格数据
   */
  _dataLoaded(data: any) {
    console.log('_dataLoaded')
    this.ctx.emit('_dataLoaded', data)
  }

  /**
   * 清空数据后执行
   */
  _dataClear() {
    console.log('_dataClear')
    this.ctx.emit('_dataClear')
  }
}
