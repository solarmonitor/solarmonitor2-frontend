<script setup lang="ts">
import { api } from '@/api'
import FlareTable from '@/components/FlareTable.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useIntQuery, useRequestDate } from '@/composables/useRequestDate'
import { addDays } from '@/utils/time'

const date = useRequestDate()
const noaa = useIntQuery('noaa_no')

const { data: flares, loading } = useAsyncData(
  () => api.flares(addDays(date.value, -2), { end: date.value, noaa_no: noaa.value }),
  [],
)
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <div v-else class="mt-3">
    <FlareTable :flares="flares" :date="date" title="Recent Flares" />
  </div>
</template>
