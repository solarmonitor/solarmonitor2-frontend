<script setup lang="ts">
import { api } from '@/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useRequestDate, useStringQuery } from '@/composables/useRequestDate'

const date = useRequestDate()
const type = useStringQuery('type')

const { data: plots, loading } = useAsyncData(() => api.statusPlots(date.value, type.value), [])
</script>

<template>
  <div class="row">
    <div class="mt-4" style="max-width: 900px">
      <p>
        This page shows the current status of SolarMonitor data; all values displayed are calculated as a fraction of
        the expected data. We are actively working on filling in data gaps where possible, this is contingent on the
        upstream presence of these data.
      </p>
    </div>
    <div class="col-1 mt-4">
      <img
        class="figure-img border"
        src="/static/img/status-legend.png"
        alt="Legend for data status plots"
        style="max-width: 120px; width: 100%"
      />
    </div>
    <LoadingSpinner v-if="loading" />
    <div v-for="plot in plots" v-else :key="plot.plot_path" class="row">
      <div class="col-md-12">
        <figure>
          <img class="img-fluid figure-img" :src="plot.plot_path" :alt="plot.plot_type ?? 'Data status'" />
        </figure>
      </div>
    </div>
  </div>
</template>
