<script setup lang="ts" vapor>
import { useQuery } from '@pinia/colada'
import { $fetch } from 'ofetch'
import { computed, ref } from 'vue'

type TenderListResponse = {
  items: Array<{
    id: string
    externalId: string
    title: string
    contractingAuthority: string | null
    deadlineAt: string | null
    publishedAt: string | null
    status: string | null
    cpvCodes: string[]
    categories: string[]
    url: string
    detailFetched: boolean
  }>
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const page = ref(1)
const category = ref<string | null>(null)
const search = ref('')
const searchInput = ref('')

const queryKey = computed(() => ['tenders', page.value, category.value, search.value])

const { data, isLoading, error } = useQuery({
  key: queryKey,
  query: () => {
    const params = new URLSearchParams({
      page: String(page.value),
      pageSize: '25',
    })
    if (category.value) {
      params.set('category', category.value)
    }
    if (search.value) {
      params.set('q', search.value)
    }

    return $fetch<TenderListResponse>(`/api/tenders?${params}`)
  },
})

function applySearch() {
  search.value = searchInput.value.trim()
  page.value = 1
}

function toggleCategory(value: string) {
  category.value = category.value === value ? null : value
  page.value = 1
}

function formatDate(value: string | null): string {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="page">
    <header class="header">
      <h1>Tenders</h1>
      <p
        v-if="data"
        class="meta"
      >
        {{ data.total }} active from Zakázky GOV
      </p>
    </header>

    <div class="toolbar">
      <form
        class="search"
        @submit.prevent="applySearch"
      >
        <input
          v-model="searchInput"
          type="search"
          placeholder="Search title or authority…"
        >
        <button type="submit">
          Search
        </button>
      </form>
      <div class="filters">
        <button
          type="button"
          :class="{ active: category === 'IT' }"
          @click="toggleCategory('IT')"
        >
          IT
        </button>
        <button
          type="button"
          :class="{ active: category === 'Construction' }"
          @click="toggleCategory('Construction')"
        >
          Construction
        </button>
        <button
          type="button"
          :class="{ active: !category }"
          @click="((category = null), (page = 1))"
        >
          All
        </button>
      </div>
    </div>

    <p
      v-if="isLoading"
      class="status"
    >
      Loading…
    </p>
    <p
      v-else-if="error"
      class="status error"
    >
      Failed to load tenders.
    </p>

    <table
      v-else-if="data?.items.length"
      class="table"
    >
      <thead>
        <tr>
          <th>Title</th>
          <th>Authority</th>
          <th>Deadline</th>
          <th>Categories</th>
          <th>CPV</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tender in data.items"
          :key="tender.id"
        >
          <td class="title">
            <a
              :href="tender.url"
              target="_blank"
              rel="noopener"
            >{{ tender.title }}</a>
            <span class="id">{{ tender.externalId }}</span>
          </td>
          <td>{{ tender.contractingAuthority ?? '—' }}</td>
          <td>{{ formatDate(tender.deadlineAt) }}</td>
          <td>
            <span
              v-for="cat in tender.categories"
              :key="cat"
              class="badge"
            >{{ cat }}</span>
            <span
              v-if="!tender.categories.length"
              class="muted"
            >—</span>
          </td>
          <td class="cpv">
            <span v-if="tender.cpvCodes.length">{{ tender.cpvCodes[0] }}</span>
            <span
              v-else
              class="muted"
            >—</span>
          </td>
        </tr>
      </tbody>
    </table>

    <p
      v-else
      class="status"
    >
      No tenders match your filters.
    </p>

    <nav
      v-if="data && data.totalPages > 1"
      class="pagination"
    >
      <button
        type="button"
        :disabled="page <= 1"
        @click="page--"
      >
        Previous
      </button>
      <span>Page {{ data.page }} / {{ data.totalPages }}</span>
      <button
        type="button"
        :disabled="page >= data.totalPages"
        @click="page++"
      >
        Next
      </button>
    </nav>
  </div>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, sans-serif;
}

.header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
}

.meta {
  margin: 0 0 1rem;
  color: #666;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: center;
}

.search {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  min-width: 220px;
}

.search input {
  flex: 1;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.4rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

button.active {
  background: #1a56db;
  border-color: #1a56db;
  color: #fff;
}

.filters {
  display: flex;
  gap: 0.5rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.table th,
.table td {
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid #eee;
  text-align: left;
  vertical-align: top;
}

.title a {
  color: #1a56db;
  text-decoration: none;
}

.title a:hover {
  text-decoration: underline;
}

.id {
  display: block;
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.15rem;
}

.badge {
  display: inline-block;
  margin: 0 0.2rem 0.2rem 0;
  padding: 0.1rem 0.4rem;
  background: #eef2ff;
  color: #3730a3;
  border-radius: 3px;
  font-size: 0.75rem;
}

.cpv {
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
}

.muted {
  color: #aaa;
}

.status {
  color: #666;
}

.status.error {
  color: #b91c1c;
}

.pagination {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
}
</style>
