<script setup lang="ts" vapor>
import { useQuery } from '@pinia/colada'
import { $fetch } from 'ofetch'

const { data } = useQuery({
  key: () => ['test'],
  query: () => $fetch('/api/route'),
})
</script>

<template>
  <div>
    <h3>Idk bro</h3>
    <pre>{{ data }}</pre>
  </div>
</template>
