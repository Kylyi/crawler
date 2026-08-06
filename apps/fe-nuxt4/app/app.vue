<script setup lang="ts">
import { utilsConfig } from '$utilsConfig'

const formatted = formatValue(42, undefined, { dataType: 'number', localeIso: 'en-US' })
const { sortData } = useSorting()
const sorted = await sortData(
  [
    { id: 2, name: 'b' },
    { id: 1, name: 'a' },
  ],
  [{ field: 'id', name: 'id', sort: 'asc' }],
)
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <p>Utilities layer OK — format: {{ formatted }}, sorted ids: {{ sorted.map((r) => r.id).join(',') }}</p>
    {{ utilsConfig.public.env }}
  </div>
</template>
