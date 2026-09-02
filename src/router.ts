import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Sidebar entry to highlight. */
    nav?: string
    /** Show the date picker and prev/next navigation in the header. */
    dateNav?: boolean
    /** Arrow-key step size. */
    step?: 'hour' | 'day'
    /** How to round "now" when no date is given. */
    rounding?: 'up' | 'nearest'
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { dateNav: true } },
    {
      path: '/fulldisk',
      name: 'fulldisk',
      component: () => import('@/views/FullDiskView.vue'),
      meta: { nav: 'fulldisk', dateNav: true },
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
