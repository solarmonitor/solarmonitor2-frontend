<script setup lang="ts">
import { computed } from 'vue'

import { api } from '@/api'
import ForecastTable from '@/components/ForecastTable.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useIntQuery, useRequestDate } from '@/composables/useRequestDate'
import type { DerivedImage, Forecast } from '@/types'
import { buildForecastTable } from '@/utils/forecast'
import { startOfUtcDay } from '@/utils/time'

const date = useRequestDate()
const duration = useIntQuery('duration')

const { data, loading } = useAsyncData(
  async () => {
    // forecasts are issued daily, valid from 00:00 UTC
    const day = startOfUtcDay(date.value)
    const [forecasts, images] = await Promise.all([
      api.forecasts(day, duration.value),
      api.derivedImages(day, 'fl_forecast'),
    ])
    return { forecasts, flareVis: images[0] ?? null }
  },
  { forecasts: [] as Forecast[], flareVis: null as DerivedImage | null },
)

const table = computed(() => buildForecastTable(data.value.forecasts))
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <template v-else>
    <figure v-if="data.flareVis?.image_path" class="mt-3 mx-auto" style="max-width: 800px">
      <img
        class="img-fluid figure-img d-block"
        :src="data.flareVis.image_path"
        alt="Full disk flare forecast probabilities"
      />
    </figure>
    <ForecastTable :table="table" :date="date" />
  </template>

  <p>
    SolarMonitor's flare prediction system's probabilities are calculated using the NOAA Space Weather Predicion
    Centre's McIntosh classifications. There are two methods, MCSTAT and MCEVOL, that use sunspot-group McIntosh
    classifications and Poisson statistics to calculate flaring probabilities valid for a 24-hr period starting at 00:00
    UTC. The flaring probabilities are calculated using historical data from solar cycles 23 and 24 (1996-2019).
  </p>
  <b>MCSTAT (McIntosh Statistics)</b>: Uses the point-in-time McIntosh classification to calculate Poisson flaring
  probabilities. Details about the method [1] and forecast verification testing [2] can be found in the following
  papers:
  <p>
    [1]
    <a href="http://www.springerlink.com/content/h02309110582457j/">
      Gallagher, P. T., Moon, Y.-J., Wang, H., <i>Solar Physics</i>, <b>209</b>, 171, (2002)
    </a>
    <br />
    [2]
    <a href="http://adsabs.harvard.edu/abs/2012ApJ...747L..41B">
      Bloomfield <i>et al.</i>, 2012, <i>The Astrophysical Journal Letters</i>, <b>747</b>, L41
    </a>
  </p>
  <b>MCEVOL (McIntosh Evolution)</b>: Uses a combination of previous and current McIntosh classification to calculate
  Poisson flaring probabilities. Details about the method and flaring rate statistics can be found in the following:
  <p>
    [1]
    <a href="https://link.springer.com/article/10.1007/s11207-016-0933-y">
      McCloskey, A.E., Gallagher, P.T. &amp; Bloomfield, D.S., <i>Solar Physics</i>, <b>291</b>, 1711, (2016)
    </a>
  </p>
</template>
