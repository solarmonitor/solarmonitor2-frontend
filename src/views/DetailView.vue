<script setup lang="ts">
import { api } from '@/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useIntQuery, useRequestDate, useStringQuery } from '@/composables/useRequestDate'
import type { FullDiskImage } from '@/types'

const date = useRequestDate()
const noaa = useIntQuery('noaa_no')
const wave = useIntQuery('wave')
const instr = useStringQuery('instr')
const obs = useStringQuery('obs')

const { data: image, loading } = useAsyncData<FullDiskImage | null>(async () => {
  const query = { wave: wave.value, instr: instr.value, obs: obs.value }
  const images =
    noaa.value !== undefined
      ? await api.activeRegionImages(date.value, { ...query, noaa_no: noaa.value })
      : await api.fullDiskImages(date.value, query)
  return images[0] ?? null
}, null)
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <figure v-else-if="image?.image_path" class="mt-3 text-center">
    <img
      class="img-fluid figure-img mx-auto d-block"
      :src="image.image_path"
      :alt="`${image.instrument} ${image.wavelength} - ${image.date_obs}`"
    />
  </figure>
  <p v-else class="mt-4 text-secondary">No image found for this time.</p>
</template>
