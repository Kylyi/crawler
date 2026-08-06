<script setup lang="ts" vapor>
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { ComparatorEnum, filterData, formatValue, normalizeText } from '@gentl/utilities/vue'

const sampleFormatted = computed(() =>
  formatValue(1234.5, undefined, {
    dataType: 'number',
    localeIso: 'en-US',
  }),
)

const sampleFiltered = computed(() =>
  filterData({
    data: [
      { id: 1, name: 'alpha' },
      { id: 2, name: 'beta' },
    ],
    filters: [
      {
        field: 'name',
        value: 'al',
        comparator: ComparatorEnum.STARTS_WITH,
        dataType: 'string',
      },
    ],
    normalizeText,
  }),
)
</script>

<template>
  <div class="app">
    <nav class="nav">
      <div>Idk bro</div>
      <RouterLink to="/"> Tenders </RouterLink>
      <span class="utils-demo">utils: {{ sampleFormatted }} / {{ sampleFiltered }}</span>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #fafafa;
}

.nav {
  padding: 0.75rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.nav a {
  color: #1a56db;
  text-decoration: none;
  font-weight: 600;
}

.nav a.router-link-active {
  text-decoration: underline;
}

.utils-demo {
  margin-left: 1rem;
  color: #64748b;
  font-size: 0.85rem;
}
</style>
