<script setup lang="tsx">
import { Ref } from 'vue'
import { TableOptions } from '@/components/table/basic/table'

const options: Ref<TableOptions> = ref({
  rowKey: 'dictId',
  service: {
    url: '/api/system/dict/type/list',
    method: 'get',
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
      render: ({ text }) => {
        return (
          <div>
            {text === '0' && '使用'}
            {text === '1' && '停用'}
          </div>
        )
      },
    },
    {
      title: '操作',
      key: 'operate',
      render: () => (
        <table-action
          type="text"
          actions={[
            { title: '查看', icon: 'VideoCameraOutlined', type: 'primary', danger: true },
            { title: '查看1', icon: 'VideoCameraOutlined', type: 'primary', danger: true },
            { title: '查看2', icon: 'VideoCameraOutlined', type: 'primary', danger: true },
            { title: '查看3', icon: 'VideoCameraOutlined', type: 'primary', danger: true },
            {
              title: '编辑',
              icon: 'VideoCameraOutlined',
              type: 'primary',
              danger: false,
              render: () => {
                return <a-button>render</a-button>
              },
            },
          ]}
        />
      ),
    },
  ],
})

const table = ref()

const refreshTable = () => {
  table.value.fetchData()
}
</script>
<template>
  <div>
    <basic-table ref="table" :options="options"></basic-table>
  </div>
</template>

<style scoped></style>
