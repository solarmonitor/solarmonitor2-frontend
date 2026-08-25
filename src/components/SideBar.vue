<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import FeatherIcon from '@/components/FeatherIcon.vue'
import { useRequestDate } from '@/composables/useRequestDate'
import { formatDateParam } from '@/utils/time'

const route = useRoute()
const requestDate = useRequestDate()

interface Item {
  key: string
  path: string
  label: string
  aria: string
  icon?: string
  img?: string
  /** carry the current date to the target page */
  dated?: boolean
}

const items: Item[] = [
  { key: 'fulldisk', path: '/fulldisk', label: 'Full Disk', aria: 'Full Disk Images', icon: 'aperture', dated: true },
  { key: 'ars', path: '/ars', label: 'Active Regions', aria: 'Active Region Images', icon: 'trending-up', dated: true },
  { key: 'xrs', path: '/xrs', label: 'X-Rays', aria: 'X-Rays', icon: 'activity', dated: true },
  { key: 'events', path: '/events', label: 'Flares', aria: 'Flares', icon: 'list', dated: true },
  { key: 'forecast', path: '/forecast', label: 'Flare Forecast', aria: 'Flare Forecasts', icon: 'cloud-lightning', dated: true },
  { key: 'orbits', path: '/orbits', label: 'Orbits', aria: 'Orbits', img: '/static/img/orbit.svg' },
  { key: 'archive', path: '/archive', label: 'Archive', aria: 'Archive', icon: 'database' },
  { key: 'status', path: '/status', label: 'Status', aria: 'Data Status', icon: 'heart' },
  { key: 'about', path: '/about', label: 'About', aria: 'About', icon: 'info' },
]

const active = computed(() => {
  if (route.name === 'detail') return route.query.noaa_no ? 'ars' : undefined
  return route.meta.nav
})
const dateQuery = computed(() => ({ date: formatDateParam(requestDate.value) }))
</script>

<template>
  <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="position-sticky pt-3 sidebar-sticky">
      <ul class="nav flex-column">
        <li v-for="item in items" :key="item.key" class="nav-item">
          <RouterLink
            class="nav-link"
            :class="{ active: active === item.key }"
            :aria-current="active === item.key ? 'page' : undefined"
            :aria-label="item.aria"
            :to="{ path: item.path, query: item.dated ? dateQuery : {} }"
          >
            <img v-if="item.img" :src="item.img" class="align-text-bottom feather" alt="" />
            <FeatherIcon v-else-if="item.icon" :name="item.icon" />
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
