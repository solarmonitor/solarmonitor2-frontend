<script setup lang="ts">
import { api } from '@/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import SrsTable from '@/components/SrsTable.vue'
import { emptySrsTable, loadSrsTable } from '@/composables/srsTable'
import { useAsyncData } from '@/composables/useAsyncData'
import { useIntQuery, useRequestDate, useStringQuery } from '@/composables/useRequestDate'
import type { FullDiskImage } from '@/types'
import { detailLink } from '@/utils/links'

const date = useRequestDate()
const wave = useIntQuery('wave')
const instr = useStringQuery('instr')
const noaa = useIntQuery('noaa_no')

// The home page shows a summary: magnetograms plus SUVI 171/304 and AIA 1700.
const isSummaryImage = (img: FullDiskImage) =>
  img.observable === 'magnetogram' ||
  (img.instrument === 'suvi' && (img.wavelength === 171 || img.wavelength === 304)) ||
  (img.instrument === 'saia' && img.wavelength === 1700)

const { data, loading } = useAsyncData(
  async () => {
    const [images, xrs, srs] = await Promise.all([
      api.fullDiskImages(date.value, { wave: wave.value, instr: instr.value }),
      api.xrsPlots(date.value, '3-day'),
      loadSrsTable(date.value, noaa.value),
    ])
    return { images: images.filter(isSummaryImage), xrs: xrs.slice(0, 1), srs }
  },
  { images: [], xrs: [], srs: emptySrsTable() },
)
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <section v-else class="mb-4 mt-3 w-100">
    <div class="row justify-content-start">
      <div v-for="image in data.images" :key="`${image.instrument}${image.wavelength}${image.observable}`" class="col">
        <RouterLink :to="detailLink(date, image)">
          <img
            class="img-fluid figure-img"
            :src="image.thumbnail_path ?? undefined"
            :alt="`${image.instrument} - ${image.date_obs}`"
          />
        </RouterLink>
      </div>
    </div>
    <div class="row">
      <div class="py-3 border-0">
        <h5 class="mb-0 text-center"><strong>Latest X-ray data</strong></h5>
      </div>
      <div v-for="plot in data.xrs" :key="plot.plot_path" class="col-lg-12">
        <figure>
          <img class="img-fluid figure-img" :src="plot.plot_path" :alt="plot.date_obs" />
        </figure>
      </div>
    </div>
    <div class="row">
      <SrsTable :table="data.srs" :date="date" />
    </div>
  </section>
</template>
