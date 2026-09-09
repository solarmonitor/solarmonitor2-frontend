<script setup lang="ts">
import { computed } from 'vue'

import { api } from '@/api'
import ImageTabs, { type Tab } from '@/components/ImageTabs.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import SrsTable from '@/components/SrsTable.vue'
import { emptySrsTable, loadSrsTable } from '@/composables/srsTable'
import { useAsyncData } from '@/composables/useAsyncData'
import { useIntQuery, useRequestDate, useStringQuery } from '@/composables/useRequestDate'
import type { ActiveRegionImage } from '@/types'
import { detailLink } from '@/utils/links'

const date = useRequestDate()
const noaa = useIntQuery('noaa_no')
const wave = useIntQuery('wave')
const instr = useStringQuery('instr')
const obs = useStringQuery('obs')

const { data, loading } = useAsyncData(
  async () => {
    const [images, srs] = await Promise.all([
      api.activeRegionImages(date.value, { noaa_no: noaa.value, wave: wave.value, instr: instr.value, obs: obs.value }),
      loadSrsTable(date.value, noaa.value),
    ])
    // dopplergrams are not shown for active regions
    return { images: images.filter((img) => img.observable !== 'dopplergram'), srs }
  },
  { images: [] as ActiveRegionImage[], srs: emptySrsTable() },
)

const tabs = computed<Tab[]>(() =>
  [...new Set(data.value.images.map((img) => img.noaa_no))]
    .sort((a, b) => a - b)
    .map((n) => ({ key: String(n), label: String(n) })),
)
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <template v-else>
    <section class="mb-4 mt-3 w-100">
      <ImageTabs v-if="tabs.length" v-slot="{ active }" :tabs="tabs">
        <template
          v-for="image in data.images"
          :key="`${image.noaa_no}${image.instrument}${image.wavelength}${image.observable}`"
        >
          <RouterLink v-if="String(image.noaa_no) === active" :to="detailLink(date, image)">
            <img
              class="img-fluid figure-img"
              :src="image.thumbnail_path ?? undefined"
              :alt="`${image.instrument} - ${image.date_obs}`"
            />
          </RouterLink>
        </template>
      </ImageTabs>
    </section>
    <SrsTable :table="data.srs" :date="date" />
  </template>
</template>
