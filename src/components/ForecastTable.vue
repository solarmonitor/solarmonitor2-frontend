<script setup lang="ts">
import InfoTip from '@/components/InfoTip.vue'
import {
  FORECAST_KEYS,
  FORECAST_LABELS,
  type ForecastTable,
  formatPercent,
  MODEL_TOOLTIPS,
  modelName,
  modelTooltip,
} from '@/utils/forecast'
import { formatDateParam } from '@/utils/time'

defineProps<{ table: ForecastTable; date: Date }>()
</script>

<template>
  <section v-if="table.regions.length" class="mb-4 w-100">
    <div class="card">
      <div class="card-header text-center py-3">
        <h5 class="mb-0 text-center">
          <strong>Flare Probabilities [%] (00:00 UTC +24H)</strong>
          <InfoTip
            text="Flare probabilities for the next 24 hours for each NOAA active region. <br> Forecasts are valid at 00:00 UTC."
          />
        </h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover text-nowrap table-sm table-striped forecast-table">
            <thead>
              <tr>
                <th rowspan="2" scope="col" class="text-center">NOAA <InfoTip text="NOAA Active Region Number" /></th>
                <th v-for="key in FORECAST_KEYS" :key="key" :colspan="table.models.length" class="text-center header-column">
                  {{ FORECAST_LABELS[key] }}
                </th>
                <th colspan="3" class="text-center header-column">Mean <InfoTip :text="MODEL_TOOLTIPS.mean" /></th>
              </tr>
              <tr>
                <template v-for="key in FORECAST_KEYS" :key="key">
                  <th v-for="model in table.models" :key="model" scope="col" class="text-center">
                    {{ modelName(model) }}
                    <InfoTip v-if="key === 'c_plus' && modelTooltip(model)" :text="modelTooltip(model) ?? ''" />
                  </th>
                </template>
                <th v-for="key in FORECAST_KEYS" :key="key" scope="col" class="text-center">{{ FORECAST_LABELS[key] }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="noaa in table.regions" :key="noaa">
                <td class="text-center">
                  <RouterLink :to="{ path: '/ars', query: { date: formatDateParam(date) }, hash: `#${noaa}` }">
                    {{ noaa }}
                  </RouterLink>
                </td>
                <template v-for="key in FORECAST_KEYS" :key="key">
                  <td
                    v-for="(model, i) in table.models"
                    :key="model"
                    class="text-center"
                    :class="{ 'first-column': i === 0 }"
                  >
                    {{ formatPercent(table.value(noaa, model, key)) }}
                  </td>
                </template>
                <td
                  v-for="(key, i) in FORECAST_KEYS"
                  :key="key"
                  class="text-center group-mean"
                  :class="{ 'first-column': i === 0 }"
                >
                  {{ formatPercent(table.mean(noaa, key)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.header-column:first-child {
  border-right: 8px solid transparent;
}

.header-column:not(:first-child) {
  border-left: 8px solid transparent;
}

.forecast-table td.group-mean {
  font-weight: bold;
}

.forecast-table td.first-column {
  border-left: 4px solid transparent;
}
</style>
