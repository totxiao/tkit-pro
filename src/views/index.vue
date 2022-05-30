<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const jump = (path: string): void => {
  router.push({
    path: path,
  })
}
</script>
<template>
  <div>
    <a-button @click="jump('table1')">table-1</a-button>
    <a-button @click="jump('table2')">table-2</a-button>
  </div>
</template>
