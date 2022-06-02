import { API_CONFIG } from '../../../global-types'

/**
 * api调度器
 * 通过传入的service生成默认的增删改查接口
 * 需要接口符合Restful规范且遵守约定
 * 查询接口为 module/list
 * 新增接口为 module/add
 * 修改接口为 module/edit
 * 删除接口为module/delete
 * 可在global-types文件中修改默认配置 API_CONFIG
 */

export default class ApiScheduler {
  constructor(props) {
    this.moduleName = props.url.split('/').slice(0, -1).join('/')
  }

  /**
   * 删除方法
   * @param record 行数据
   */
  delete(record) {
    throw new Error('没有配置url参数!')
  }
}
