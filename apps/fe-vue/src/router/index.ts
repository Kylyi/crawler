import { createRouter, createWebHistory } from 'vue-router'
import TendersView from '@/views/TendersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tenders',
      component: TendersView,
    },
  ],
})

export default router
