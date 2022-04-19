import { cloneDeep } from 'lodash'

/**
 * 自定义的表格参数
 */
enum CUSTOM_OPTIONS {
  // 数据访问路径
  service,
  // 用户传递的数据
  data,
  // 用于获取数据的固定参数
  params,
  // 用于获取数据的筛选参数(与antd表格中的filters不同)
  filters,
  // columns为自定义属性,将生成antd原属性配置
  columns,
}

/**
 *
 * @param columns table 的columns 属性
 * @returns columns 将返回 columns处理后的columns
 */
function columnHandler(columns: TableColumn[]) {
  columns.forEach((col) => {
    const current = { ...col, dataIndex: col.key }

    // render函数赋值
    if (current.render) {
      if (typeof current.render !== 'function') {
        console.warn('The render options of column must be a function')
      } else {
        current.customRender = current.render
        delete current.render
      }
    }
  })
  return columns
}

/**
 *
 * @param options table options, 兼容所有antd api
 * @returns options 将返回options处理后的复制,不更改原属性
 */
function optionsHandler(options: TableOptions): TableOptions {
  // 复制参数
  const copyOptions = cloneDeep(options)
  // 处理列表配置
  const columns = columnHandler(copyOptions.columns)

  // 参数过滤
  for (const key in CUSTOM_OPTIONS) {
    if (copyOptions[key]) {
      delete copyOptions[key]
    }
  }

  return { ...options, columns }
}

export { optionsHandler }
