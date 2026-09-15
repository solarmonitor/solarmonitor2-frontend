<script setup lang="ts">
import { computed } from 'vue'

import InfoTip from '@/components/InfoTip.vue'
import type { Flare } from '@/types'
import { activeRegionLink } from '@/utils/links'
import { flareDateParam } from '@/utils/srs'

const props = withDefaults(
  defineProps<{
    flares: Flare[]
    date: Date
    /** Only show flares from this catalogue, or all of them with 'all'. */
    source?: string
    title?: string
  }>(),
  { source: 'SSW Latest Events', title: undefined },
)

const shown = computed(() =>
  props.flares.filter((flare) => props.source === 'all' || flare.data_src === props.source),
)

const position = (v: number | null) => (v === null ? '-' : Math.round(v).toFixed(0))
</script>

<template>
  <section v-if="shown.length" class="mb-4 w-100">
    <div class="card">
      <div class="card-header text-center py-3">
        <h5 v-if="title" class="mb-0 text-center">
          <strong>{{ title }}</strong>
        </h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover text-nowrap">
            <thead>
              <tr>
                <th scope="col">
                  Flare Start <InfoTip text="Flare start time (UTC), defined by the observer source." /><br />&nbsp;
                </th>
                <th scope="col">
                  Flare Peak <InfoTip text="Flare peak time (UTC), defined by the observer source." /><br />&nbsp;
                </th>
                <th scope="col">
                  Flare End <InfoTip text="Flare end time (UTC), defined by the observer source." /><br />&nbsp;
                </th>
                <th scope="col">
                  Position
                  <InfoTip
                    text="Active region position in degrees Heliographic Stonyhurst (lat, lon) <br>
                          These positions are differentially rotated from the SRS time (at 00:00 UTC)
                          such that they remain accurate for the time shown in the page header."
                  /><br />(HG deg)
                </th>
                <th class="text-center" scope="col">
                  Associated AR <InfoTip text="NOAA number of the associated active region, if any." /><br />&nbsp;
                </th>
                <th class="text-center" scope="col">
                  Goes Class <InfoTip text="Goes X-ray class of the Flare." /><br />&nbsp;
                </th>
                <th scope="col">
                  Data Source
                  <InfoTip
                    text="Details of the origins of the flare event in the form 'provider:source': <br>
                          Provider: Where solarmonitor gets the data, e.g. HEK <br>
                          Source: The flare catalogue."
                  /><br />&nbsp;
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="flare in shown" :key="`${flare.data_src}|${flare.start_time}`">
                <td>
                  <RouterLink
                    v-if="flare.flux >= 1e-6"
                    :to="{ path: '/flare', query: { date: flareDateParam(flare), id: flare.id } }"
                  >
                    {{ flare.start_time }}
                  </RouterLink>
                  <template v-else>{{ flare.start_time }}</template>
                </td>
                <td>{{ flare.peak_time?.slice(-8) }}</td>
                <td>{{ flare.end_time?.slice(-8) }}</td>
                <td>
                  <span class="pos">{{ position(flare.hgs_lat) }}</span>,
                  <span class="pos">{{ position(flare.hgs_lon) }}</span>
                </td>
                <td class="text-center">
                  <RouterLink v-if="flare.noaa_number != null" :to="activeRegionLink(date, flare.noaa_number)">
                    {{ flare.noaa_number }}
                  </RouterLink>
                </td>
                <td class="text-center">{{ flare.goes_cls }}</td>
                <td>{{ flare.data_prov }} : {{ flare.data_src }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
