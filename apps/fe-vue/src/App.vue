<script setup lang="ts" vapor>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <nav class="nav">
      hm?
      <RouterLink to="/"> Tenders </RouterLink>
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
</style>
