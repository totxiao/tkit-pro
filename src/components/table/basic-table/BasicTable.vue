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
    console.log('setup')
    const _eventEmitter = new EventEmitter(context)

    const _tableOptions = ref(optionsHandler(props.options))

    let _dataHandler = new DataHandler(props.options, _eventEmitter)

    onMounted(() => {
      console.log('init1')
      _dataHandler
      _eventEmitter._tableInited()
    })
    watch(
      () => props.options,
      (newOptions) => {
        _tableOptions.value = optionsHandler(newOptions)
      },
      {
        deep: true,
      }
    )

    const { expose } = context

    expose({
      _tableOptions,
      _dataHandler,
      _eventEmitter,
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
