<script setup lang="ts">
import { api } from '@/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useRequestDate } from '@/composables/useRequestDate'

const date = useRequestDate()

const { data: plots, loading } = useAsyncData(() => api.radioPlots(date.value), [])
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <div v-else class="row pt-4">
    <div v-for="plot in plots" :key="plot.plot_path" class="col-md-12">
      <figure>
        <img class="img-fluid figure-img" :src="plot.plot_path" :alt="plot.start_time" />
      </figure>
    </div>
  </div>
</template>
