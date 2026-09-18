<script setup lang="ts">
import { api } from '@/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useRequestDate } from '@/composables/useRequestDate'

const date = useRequestDate()

const { data: plots, loading } = useAsyncData(async () => {
  const [xrs, stix] = await Promise.all([api.xrsPlots(date.value, '3-day'), api.stixPlots(date.value, '3-day')])
  return [...xrs.slice(0, 1), ...stix.slice(0, 1)]
}, [])
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <div v-else class="row pt-4">
    <div v-for="plot in plots" :key="plot.plot_path" class="col-lg-12">
      <figure>
        <img class="img-fluid figure-img" :src="plot.plot_path" :alt="plot.date_obs" />
      </figure>
    </div>
    <p v-if="!plots.length" class="text-secondary">No X-ray data found for this date.</p>
  </div>
</template>
