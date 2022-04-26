import { SetupContext } from 'vue'
/**
 * 事件发射器
 * 向上级通讯传递事件
 */

export default class EventEmitter {
  ctx: SetupContext<Record<string, any>>
  constructor(context: SetupContext<Record<string, any>>) {
    this.ctx = context

    onMounted(() => {
      // 抛出 table-inited 事件
      this._tableInited()
    })
  }

  /**
   * 表格初始化完成后执行
   */
  _tableInited() {
    this.ctx.emit('_tableInited')
  }

  /**
   * @param changed 更改的值
   * 表格变化时执行
   */
  _tableChanged(changed: { pagination: object; filters: any; sorter: any }) {
    this.ctx.emit('_tableChanged', changed)
  }

  /**
   * 表格销毁后执行
   */
  _tableUnload() {
    this.ctx.emit('_tableUnload')
  }

  /**
   * 数据加载前执行
   * @param 获取数据的service方法
   */
  _dataWillLoad(params: any) {
    this.ctx.emit('__dataWillLoad', params)
  }

  /**
   * 数据加载完成后执行
   * @param 将渲染的表格数据
   */
  _dataLoaded(data: any) {
    console.log(data)
    this.ctx.emit('_dataLoaded', data)
  }

  /**
   * 清空数据后执行
   */
  _dataClear() {
    this.ctx.emit('_dataClear')
  }
}
