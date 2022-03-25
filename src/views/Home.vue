<script setup>
import router from '@/router'

const onClickHello = () => {
  router.push({
    path: '/hello',
  })
}
</script>

<template>
  <div>
    notsilent
    <div @click="onClickHello">Hello：）</div>
  </div>
</template>
