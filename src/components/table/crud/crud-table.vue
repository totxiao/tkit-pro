<script lang="ts">
export default defineComponent({
  props: {
    options: {
      type: Object,
      default: () => ({
        rowKey: 'id',
      }),
    },
  },
  setup(props: Record<string, any>) {
    const options = toRef(props, 'options')

    // 解析actions

    return {
      options,
    }
  },
})
</script>

<template>
  <basic-table :options="options"></basic-table>
</template>
