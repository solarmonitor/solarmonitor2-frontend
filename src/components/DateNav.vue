<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { type RouteLocationRaw, useRoute, useRouter } from 'vue-router'

import { useRequestDate } from '@/composables/useRequestDate'
import { addDays, addHours, formatDateParam, roundHour } from '@/utils/time'

const route = useRoute()
const router = useRouter()
const requestDate = useRequestDate()

// keep the other query parameters (noaa_no, wave, ...) and the selected tab
const linkTo = (date: Date): RouteLocationRaw => ({
  path: route.path,
  query: { ...route.query, date: formatDateParam(date) },
  hash: route.hash,
})

const links = computed(() => ({
  minusDay: linkTo(addDays(requestDate.value, -1)),
  minusHour: linkTo(addHours(requestDate.value, -1)),
  today: linkTo(roundHour(new Date())),
  plusHour: linkTo(addHours(requestDate.value, 1)),
  plusDay: linkTo(addDays(requestDate.value, 1)),
}))

// Left/right arrows step back/forward an hour, or a day on daily pages (xrs, status, forecast).
function onKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  const target = event.target as HTMLElement | null
  if (target?.closest('input, textarea, select, [contenteditable]')) return
  const daily = route.meta.step === 'day'
  if (event.key === 'ArrowLeft') router.push(daily ? links.value.minusDay : links.value.minusHour)
  else if (event.key === 'ArrowRight') router.push(daily ? links.value.plusDay : links.value.plusHour)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <nav class="date-nav d-flex align-items-center" aria-label="Date navigation">
    <RouterLink class="nav-link px-3" :to="links.minusDay" title="Back 1 day" aria-label="Back 1 day">
      <i class="text-light bi bi-box-arrow-in-left bi-hover-bold" />
    </RouterLink>
    <RouterLink class="nav-link px-3" :to="links.minusHour" title="Back 1 hour" aria-label="Back 1 hour">
      <i class="text-light bi bi-arrow-left bi-hover-bold" />
    </RouterLink>
    <RouterLink class="nav-link px-3 text-light bi-hover-bold" :to="links.today">Today</RouterLink>
    <RouterLink class="nav-link px-3" :to="links.plusHour" title="Forward 1 hour" aria-label="Forward 1 hour">
      <i class="text-light bi bi-arrow-right bi-hover-bold" />
    </RouterLink>
    <RouterLink class="nav-link px-3" :to="links.plusDay" title="Forward 1 day" aria-label="Forward 1 day">
      <i class="text-light bi bi-box-arrow-in-right bi-hover-bold" />
    </RouterLink>
  </nav>
</template>

<style scoped>
.bi-hover-bold:hover {
  -webkit-text-stroke: 1px;
}
</style>
