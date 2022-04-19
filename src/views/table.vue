<script setup lang="tsx">
import { Ref } from 'vue'
import { TableOptions } from '@/components/table/basic-table/table'
const options: Ref<TableOptions> = ref({
  rowKey: 'dictId',
  service: '/api/system/dict/type/list',
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
      render: ({ text }) => (text.length > 8 ? text.substring(0, 8) + '...' : text) || '',
    },
    {
      title: '状态',
      key: 'status',
      render: ({ text }) => (text === '0' ? '使用' : '停用'),
    },
  ],
  data: [
    {
      name: '林霄',
      sex: '男',
      age: '27',
    },
    {
      name: '某某某',
      sex: '女',
      age: '24',
    },
  ],
})
</script>
<template>
  <basic-table :options="options"></basic-table>
</template>

<style scoped></style>
