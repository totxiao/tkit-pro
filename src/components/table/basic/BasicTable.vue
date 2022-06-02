<script lang="ts">
import EventEmitter from './EventEmitter'
import DataHandler from './DataHandler'
import { TableProps } from 'ant-design-vue/lib/table/interface'
import { cloneDeep } from 'lodash'
import { TableColumn, TableOptions } from './table'

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

export default defineComponent({
  name: 'BasicTable',
  props: {
    options: {
      type: Object,
      default: () => ({
        rowKey: 'id',
      }),
    },
  },
  setup(props: Record<string, any>, context) {
    /**
     * @param columns table 的columns 属性
     * @returns columns 将返回 columns处理后的columns
     */
    const columnHandler = (columns: TableColumn[]) => {
      const finalColumns = columns.map((col) => {
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
        return current
      })
      return finalColumns
    }

    /**
     *
     * @param options table options, 兼容所有antd api
     * @returns options 将返回options处理后的复制,不更改原属性
     */
    const optionsHandler = (options: TableOptions): TableOptions => {
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

    const eventEmitter = new EventEmitter(context)
    const tableOptions = ref(optionsHandler(props.options))
    const dataHandler = new DataHandler(props.options, eventEmitter)

    const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
      // 广播表格变化事件
      eventEmitter._tableChanged({
        pagination,
        filters,
        sorter,
      })
      // TODO:暂不确定filters与sorter的数据类型,后期完善
      dataHandler.fetchData({
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
        ...sorter,
      })
    }

    watch(
      () => props.options,
      (newOptions) => {
        tableOptions.value = optionsHandler(newOptions)
      },
      {
        deep: true,
      }
    )

    const { expose } = context

    //暴露给外部的方法
    expose({
      fetchData: dataHandler.fetchData.bind(dataHandler),
      getTableData: dataHandler.getTableData.bind(dataHandler),
      getTableLoading: dataHandler.getTableLoading.bind(dataHandler),
      getTableError: dataHandler.getTableError.bind(dataHandler),
      clearTable: dataHandler.clearTable.bind(dataHandler),
      tableOptions,
      dataHandler,
    })

    const { data, loading } = dataHandler

    return {
      tableOptions,
      dataHandler,
      data,
      loading,
      handleTableChange,
    }
  },
})
</script>
<template>
  <div class="basic-table">
    <a-table
      :data-source="data.tableData"
      :pagination="data.pagination"
      :loading="loading"
      @change="handleTableChange"
      v-bind="tableOptions"
    ></a-table>
  </div>
</template>
