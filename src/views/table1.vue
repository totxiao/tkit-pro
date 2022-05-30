<script setup lang="tsx">
import { Ref } from 'vue'
import { TableOptions } from '@/components/table/basic/table'

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
      render: ({ index }) => {
        return (
          <div>
            {index % 2 === 0 && <a-button type="primary">使用</a-button>}
            {index % 2 !== 0 && (
              <a-button type="primary" danger>
                停用
              </a-button>
            )}
          </div>
        )
      },
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
    <a-button type="primary" @click="refreshTable">refreshTable</a-button>
    <BasicTable ref="table" :options="options"></BasicTable>
  </div>
</template>

<style scoped></style>
