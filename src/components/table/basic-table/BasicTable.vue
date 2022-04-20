<script lang="ts">
import EventEmitter from './EventEmitter'
import { optionsHandler } from './BasicTableShape'
import DataHandler from './DataHandler'
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
    console.log('setup1')
    const _eventEmitter = new EventEmitter(context)

    const _tableOptions = ref(optionsHandler(props.options))

    let _dataHandler = new DataHandler(props.options, _eventEmitter)

    onMounted(() => {
      // 抛出 table-inited 事件
      _eventEmitter._tableInited()
    })
    watch(
      () => props.options,
      (newOptions) => {
        _tableOptions.value = optionsHandler(newOptions)
        _dataHandler = new DataHandler(props.options, _eventEmitter)
      },
      {
        deep: true,
      }
    )

    const { expose } = context

    //暴露给外部的方法
    expose({
      fetchData: _dataHandler.fetchData.bind(_dataHandler),
      getTableData: _dataHandler.getTableData.bind(_dataHandler),
      getTableLoading: _dataHandler.getTableLoading.bind(_dataHandler),
      getTableError: _dataHandler.getTableError.bind(_dataHandler),
      clearTable: _dataHandler.clearTable.bind(_dataHandler),
      _tableOptions,
      _dataHandler,
    })

    const { data, loading } = _dataHandler

    return {
      _tableOptions,
      _dataHandler,
      data,
      loading,
    }
  },
})
</script>
<template>
  <a-table v-bind="_tableOptions" :data-source="data?.rows" :loading="loading"></a-table>
</template>

<style scoped></style>
