<script setup lang="ts">
import InfoTip from '@/components/InfoTip.vue'
import type { SrsTableData } from '@/composables/srsTable'
import { activeRegionLink } from '@/utils/links'
import { flareColour, flareDateParam, haleClass } from '@/utils/srs'

withDefaults(defineProps<{ table: SrsTableData; date: Date; showFlares?: boolean }>(), { showFlares: true })

const show = (v: string | number | null | undefined) => v ?? '-'
</script>

<template>
  <section v-if="table.rows.length" class="mb-4 w-100">
    <div class="card border-0">
      <div class="text-center py-3 border-0">
        <h5 class="mb-0 text-center">
          <strong>Active Regions</strong> (today / <span class="text-secondary">yesterday</span>)
        </h5>
      </div>
      <div class="card-body">
        <div class="table-responsive table-borderless">
          <table class="table table-hover text-nowrap table-striped table-borderless">
            <thead>
              <tr>
                <th scope="col">NOAA <InfoTip text="NOAA Active Region Number" /><br />&nbsp;</th>
                <th scope="col">
                  Type
                  <InfoTip
                    text="Region type. <br> I: active regions with sunspot groups. <br>
                          IA: previously numbered active regions which still contain plage but no visible sunspots"
                  /><br />&nbsp;
                </th>
                <th scope="col">
                  Position
                  <InfoTip
                    text="Active region position in degrees Heliographic Stonyhurst (lat, lon) <br>
                          These positions are differentially rotated from the SRS time (at 00:00 UTC)
                          such that they remain accurate for the requested time throughout the day."
                  /><br />(HG deg)
                </th>
                <th scope="col">
                  Hale <InfoTip text="Hale classification of the active region, valid at 00:00 UTC" /><br />&nbsp;
                </th>
                <th scope="col">
                  McIntosh <InfoTip text="McIntosh classification of the active region, valid at 00:00 UTC" /><br />&nbsp;
                </th>
                <th scope="col">No. Spots <InfoTip text="Number of spots in the sunspot group" /><br />&nbsp;</th>
                <th scope="col">
                  Area
                  <InfoTip
                    text="Area of the sunspots in millionths of a solar hemisphere. This is corrected for observer angle."
                  /><br />(Millionths)
                </th>
                <th scope="col">
                  Long. Extent
                  <InfoTip text="Longitudinal extent of the sunspot group in heliographic degrees." /><br />(Deg)
                </th>
                <th v-if="showFlares" scope="col">
                  Recent Flares
                  <InfoTip text="C class and above recent flares associated with this active region." /><br />&nbsp;
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in table.rows" :key="row.noaa_number">
                <td>
                  <RouterLink :to="activeRegionLink(date, row.noaa_number)">{{ row.noaa_number }}</RouterLink>
                </td>
                <td>{{ row.region_id }}</td>
                <td>
                  <span class="pos">{{ row.latitude }}</span>, <span class="pos">{{ row.longitude }}</span>
                </td>
                <td>
                  {{ show(haleClass(row.mag_type)) }} /
                  <span class="text-secondary">{{ show(haleClass(row.prev?.mag_type)) }}</span>
                </td>
                <td>{{ show(row.z) }} / <span class="text-secondary">{{ show(row.prev?.z) }}</span></td>
                <td>
                  {{ show(row.number_of_sunspots) }} /
                  <span class="text-secondary">{{ show(row.prev?.number_of_sunspots) }}</span>
                </td>
                <td>{{ show(row.area) }} / <span class="text-secondary">{{ show(row.prev?.area) }}</span></td>
                <td>
                  {{ show(row.longitudinal_extent) }} /
                  <span class="text-secondary">{{ show(row.prev?.longitudinal_extent) }}</span>
                </td>
                <td v-if="showFlares">
                  <template v-for="flare in table.flaresByNoaa.get(row.noaa_number) ?? []" :key="flare.id">
                    <RouterLink
                      :style="{ color: flareColour(flare.goes_cls) }"
                      :to="{ path: '/flare', query: { date: flareDateParam(flare), id: flare.id } }"
                    >
                      {{ flare.goes_cls }}&nbsp;{{ flare.start_time.slice(11) }}
                    </RouterLink>
                    <br />
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
