<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import DateNav from '@/components/DateNav.vue'
import DatePicker from '@/components/DatePicker.vue'
import SideBar from '@/components/SideBar.vue'
import { useRequestDate } from '@/composables/useRequestDate'
import { formatDateParam } from '@/utils/time'

const route = useRoute()
const requestDate = useRequestDate()
const sidebarOpen = ref(false)

const homeLink = computed(() => ({ path: '/', query: { date: formatDateParam(requestDate.value) } }))

watch(() => route.fullPath, () => (sidebarOpen.value = false))
</script>

<template>
  <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <RouterLink class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 bg-dark" :to="homeLink">
      SolarMonitor <span class="border border-2 rounded-1 px-1">Alpha</span>
    </RouterLink>
    <button
      class="navbar-toggler position-absolute d-md-none"
      :class="{ collapsed: !sidebarOpen }"
      type="button"
      aria-controls="sidebarMenu"
      :aria-expanded="sidebarOpen"
      aria-label="Toggle navigation"
      @click="sidebarOpen = !sidebarOpen"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div v-if="route.meta.dateNav" class="d-flex flex-wrap align-items-center px-3 header-controls">
      <DatePicker />
      <DateNav />
    </div>
  </header>
  <div class="container-fluid">
    <div class="row">
      <SideBar :class="{ show: sidebarOpen }" />
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>
