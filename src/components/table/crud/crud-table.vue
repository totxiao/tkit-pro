<script lang="tsx">
import { Action, PresetAction } from '../actions/actions'
import Icon from '../../icon'
import ApiScheduler from './api-scheduler'
import './crud-table.less'
export default defineComponent({
  name: 'CRUDTable',
  components: {
    Icon,
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        rowKey: 'id',
      }),
    },
  },
  setup(props: Record<string, any>) {
    const options = ref(props.options)
    const actionCreate = ref(false)

    const apiScheduler = new ApiScheduler(props.options)

    /**
     * 解析actions
     * @param actions 动作集合
     */
    const actionsHandler = (actions: Array<Action | PresetAction>) => {
      // options.value.columns.push({ title: '操作', key: 'operate' })
      const columnsActions = []
      actions.forEach((action) => {
        if (action === 'create') {
          actionCreate.value = true
        }
        if (action === 'view') {
          columnsActions.push({
            title: '查看',
            icon: 'view',
            type: 'primary',
          })
        }
        if (action === 'update') {
          columnsActions.push({
            title: '编辑',
            icon: 'update',
            type: 'primary',
          })
        }
        if (action === 'delete') {
          columnsActions.push({
            title: '删除',
            icon: 'delete',
            type: 'primary',
            render: ({ record }: { record: Record<string, unknown> }) => {
              const confirm = () => {
                apiScheduler.delete(record)
              }
              return (
                <a-popconfirm title="确认删除吗" ok-text="确定" cancel-text="取消" onConfirm={confirm}>
                  删除
                </a-popconfirm>
              )
            },
          })
        }
      })
    }

    if (props.options.actions) {
      actionsHandler(props.options.actions)
    }

    watch(
      () => props.options,
      (newOptions) => {
        if (newOptions.actions) {
          actionsHandler(newOptions.actions)
        }
      },
      {
        deep: true,
      }
    )

    return {
      options,
      actionCreate,
    }
  },
})
</script>

<template>
  <div class="crud-table">
    <div v-if="actionCreate" class="crud-actions">
      <a-button type="primary">
        <template #icon><Icon icon="PlusOutlined" /></template>
        新增</a-button
      >
    </div>
    <basic-table :options="options"></basic-table>
  </div>
</template>
