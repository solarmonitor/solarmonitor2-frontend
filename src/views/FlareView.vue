<script setup lang="ts">
import { api } from '@/api'
import FlareTable from '@/components/FlareTable.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useRequestDate, useStringQuery } from '@/composables/useRequestDate'
import type { DerivedImage, Flare, Plot } from '@/types'
import { addDays } from '@/utils/time'

const date = useRequestDate()
const id = useStringQuery('id')

interface FlareData {
  flare: Flare | null
  xrs: Plot | null
  image: DerivedImage | null
}

const { data, loading } = useAsyncData<FlareData>(
  async () => {
    if (!id.value) return { flare: null, xrs: null, image: null }
    const [flare] = await api.flares(addDays(date.value, -2), { id: id.value })
    if (!flare) return { flare: null, xrs: null, image: null }
    const [xrs, images] = await Promise.all([
      api.xrsPlots(flare.start_time, flare.id),
      api.derivedImages(flare.peak_time, 'difference_image'),
    ])
    return { flare, xrs: xrs[0] ?? null, image: images[0] ?? null }
  },
  { flare: null, xrs: null, image: null },
)
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <p v-else-if="!data.flare" class="mt-4 text-secondary">Flare not found.</p>
  <div v-else class="mt-3">
    <FlareTable :flares="[data.flare]" :date="date" />
    <figure v-if="data.xrs">
      <img class="img-fluid figure-img mx-auto d-block" :src="data.xrs.plot_path" alt="GOES X-ray flux during the flare" />
    </figure>
    <figure v-if="data.image?.image_path">
      <img class="img-fluid figure-img mx-auto d-block" :src="data.image.image_path" alt="AIA difference image at flare peak" />
    </figure>
  </div>
</template>
