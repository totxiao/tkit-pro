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
    const _eventEmitter = new EventEmitter(context)

    const _tableOptions = ref(optionsHandler(props.options))

    let _dataHandler

    onMounted(() => {
      _dataHandler = new DataHandler(props.options, _eventEmitter)

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

    return {
      _tableOptions,
    }
  },
})
</script>
<template>
  <a-table v-bind="_tableOptions"></a-table>
</template>

<style scoped></style>
