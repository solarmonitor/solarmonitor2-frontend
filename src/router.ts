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
    {
      path: '/ars',
      name: 'ars',
      component: () => import('@/views/ActiveRegionsView.vue'),
      meta: { nav: 'ars', dateNav: true },
    },
    { path: '/detail', name: 'detail', component: () => import('@/views/DetailView.vue'), meta: { dateNav: true } },
    {
      path: '/events',
      name: 'events',
      component: () => import('@/views/EventsView.vue'),
      meta: { nav: 'events', dateNav: true },
    },
    { path: '/flare', name: 'flare', component: () => import('@/views/FlareView.vue'), meta: { nav: 'events' } },
    {
      path: '/xrs',
      name: 'xrs',
      component: () => import('@/views/XrsView.vue'),
      meta: { nav: 'xrs', dateNav: true, step: 'day' },
    },
    {
      path: '/radio',
      name: 'radio',
      component: () => import('@/views/RadioView.vue'),
      meta: { nav: 'radio', dateNav: true },
    },
    {
      path: '/forecast',
      name: 'forecast',
      component: () => import('@/views/ForecastView.vue'),
      meta: { nav: 'forecast', dateNav: true, step: 'day', rounding: 'nearest' },
    },
    {
      path: '/orbits',
      name: 'orbits',
      component: () => import('@/views/OrbitsView.vue'),
      meta: { nav: 'orbits', dateNav: true, rounding: 'nearest' },
    },
    { path: '/archive', name: 'archive', component: () => import('@/views/ArchiveView.vue'), meta: { nav: 'archive' } },
    {
      path: '/status',
      name: 'status',
      component: () => import('@/views/StatusView.vue'),
      meta: { nav: 'status', dateNav: true, step: 'day' },
    },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { nav: 'about' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
