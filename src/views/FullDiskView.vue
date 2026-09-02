<script setup lang="ts">
import { computed } from 'vue'

import { api } from '@/api'
import ImageTabs, { type Tab } from '@/components/ImageTabs.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import SrsTable from '@/components/SrsTable.vue'
import { emptySrsTable, loadSrsTable } from '@/composables/srsTable'
import { useAsyncData } from '@/composables/useAsyncData'
import { useIntQuery, useRequestDate, useStringQuery } from '@/composables/useRequestDate'
import type { FullDiskImage } from '@/types'
import { detailLink } from '@/utils/links'

const INSTRUMENT_NAMES: Record<string, string> = { saia: 'AIA', shmi: 'HMI', gong: 'GONG', suvi: 'SUVI' }

const date = useRequestDate()
const wave = useIntQuery('wave')
const instr = useStringQuery('instr')
const noaa = useIntQuery('noaa_no')

const { data, loading } = useAsyncData(
  async () => {
    const [images, srs] = await Promise.all([
      api.fullDiskImages(date.value, { wave: wave.value, instr: instr.value }),
      loadSrsTable(date.value, noaa.value),
    ])
    return { images, srs }
  },
  { images: [] as FullDiskImage[], srs: emptySrsTable() },
)

const tabs = computed<Tab[]>(() => [
  { key: 'all', label: 'All' },
  ...[...new Set(data.value.images.map((img) => img.instrument))].map((key) => ({
    key,
    label: INSTRUMENT_NAMES[key] ?? key.toUpperCase(),
  })),
])
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <template v-else>
    <section class="mb-4 mt-3 w-100">
      <ImageTabs v-slot="{ active }" :tabs="tabs">
        <div class="d-flex flex-wrap">
          <template v-for="image in data.images" :key="`${image.instrument}${image.wavelength}${image.observable}`">
            <RouterLink v-if="active === 'all' || image.instrument === active" :to="detailLink(date, image)">
              <img
                class="img-fluid figure-img"
                :src="image.thumbnail_path ?? undefined"
                :alt="`${image.instrument} - ${image.date_obs}`"
              />
            </RouterLink>
          </template>
        </div>
      </ImageTabs>
    </section>
    <SrsTable :table="data.srs" :date="date" />
  </template>
</template>
