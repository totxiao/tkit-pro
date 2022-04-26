<script lang="ts">
import EventEmitter from './EventEmitter'
import { optionsHandler } from './BasicTableShape'
import DataHandler from './DataHandler'
import { TableProps } from 'ant-design-vue/lib/table/interface'
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
    const eventEmitter = new EventEmitter(context)

    const tableOptions = ref(optionsHandler(props.options))

    let dataHandler = new DataHandler(props.options, eventEmitter)

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
  <a-table
    :data-source="data.tableData"
    :pagination="data.pagination"
    :loading="loading"
    @change="handleTableChange"
    v-bind="tableOptions"
  ></a-table>
</template>

<style scoped></style>
