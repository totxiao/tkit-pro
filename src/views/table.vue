<script setup lang="tsx">
import { Ref } from 'vue'
const options: Ref<TableOptions> = ref({
  rowKey: 'name',
  service: '/api/system/dict/type/list',
  columns: [
    {
      title: '姓名',
      key: 'name',
      visible: false,
    },
    {
      title: '性别',
      key: 'sex',
      render: ({ text, record }) => {
        const click = () => {
          setTimeout(() => {
            record.sex = text === '男' ? '女' : '男'
          }, 1000)
        }
        return (
          <div>
            {text === '男' && <a-button onClick={click}>变为女</a-button>}
            {text === '女' && <a-button onClick={click}>变为男</a-button>}
          </div>
        )
      },
    },
    {
      title: '年龄',
      key: 'age',
    },
    {
      title: '操作',
      key: 'operate',
      render: ({ record }) => {
        const func = (record: any) => {
          console.log(record)
        }
        return <a-button onClick={() => func(record)}>删除</a-button>
      },
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
