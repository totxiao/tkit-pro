<script setup lang="tsx">
import { Ref } from 'vue'
import { TableOptions } from '@/components/table/basic/table'

let type = ref('icon')

const options: Ref<TableOptions> = ref({
  rowKey: 'id',
  service: {
    url: '/api/system/dict/type/list',
    method: 'mock',
  },
  columns: [
    {
      title: '字典名称',
      key: 'dictName',
    },
    {
      title: '字典类型',
      key: 'dictType',
    },
    {
      title: '系统字典',
      key: 'isSystem',
      render: ({ text }) => (text === 0 ? '否' : '是'),
    },
    {
      title: '更新时间',
      key: 'updateTime',
    },
    {
      title: '操作人',
      key: 'updateBy',
    },
    {
      title: '备注信息',
      key: 'remark',
    },
    {
      title: '状态',
      key: 'status',
      render: ({ record }) => {
        const changeStatus = () => {
          record.disabled = !record.disabled
        }
        return (
          <div>
            {!record.disabled && (
              <a-button onClick={changeStatus} type="primary">
                使用
              </a-button>
            )}
            {record.disabled && (
              <a-button onClick={changeStatus} type="primary" danger>
                停用
              </a-button>
            )}
          </div>
        )
      },
    },
    {
      title: '操作',
      key: 'operate',
      render: ({ record }) => {
        const actions = [
          {
            title: '查看',
            icon: 'view',
            type: 'primary',
            click: () => {
              type.value === 'icon' ? (type.value = 'text') : (type.value = 'icon')
            },
            danger: false,
            disabled: !record.disabled,
          },
          {
            title: '编辑',
            icon: 'edit',
            type: 'primary',
            danger: true,
            disabled: !record.disabled,
          },
          {
            title: '删除',
            icon: 'delete',
            type: 'primary',
            danger: true,
            disabled: !record.disabled,
          },
          {
            title: '测试1',
            icon: 'VideoCameraOutlined',
            type: 'primary',
            danger: true,
            disabled: !record.disabled,
          },
          {
            title: '测试2',
            render: () => {
              return <a>render</a>
            },
          },
        ]
        return <table-action type={type.value} actions={actions} />
      },
    },
  ],
})

const table = ref()
</script>
<template>
  <div>
    <basic-table ref="table" :options="options"></basic-table>
  </div>
</template>

<style scoped></style>
