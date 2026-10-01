<script setup lang="ts">
import type { Config, Data, Frame, Layout, SliderStep } from 'plotly.js-dist-min'
import { onBeforeUnmount, ref, watch } from 'vue'

import { api } from '@/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useRequestDate } from '@/composables/useRequestDate'
import type { OrbitPlotData } from '@/types'

const SATELLITES = ['STEREO-A', 'PSP', 'SOLO']
const COLOURS: Record<string, string> = {
  Mercury: 'gray',
  Venus: 'brown',
  Earth: 'blue',
  Mars: 'maroon',
  'STEREO-A': 'red',
  PSP: 'purple',
  SOLO: 'green',
}
const N_FRAMES = 360

const date = useRequestDate()
const container = ref<HTMLDivElement>()
const { data, loading } = useAsyncData(() => api.orbitPlotData(date.value), null)

// plotly is large, so only load it on this page
const plotly = import('plotly.js-dist-min').then((m) => m.default)

function traces(plotData: OrbitPlotData, frame: number): Data[] {
  const entries = Object.entries(plotData)
  const orbits = entries.filter(([key]) => key.includes('orbit'))
  const positions = entries.filter(([key]) => !key.includes('orbit'))
  const satellites = positions.filter(([name]) => SATELLITES.includes(name))
  return [
    // full planet orbits
    ...orbits.map(([key, trace]): Data => {
      const name = key.split('_')[0] ?? key
      return {
        x: trace.x,
        y: trace.y,
        mode: 'lines',
        name,
        legendgroup: name,
        line: { color: COLOURS[name], dash: 'dot', width: 1 },
      }
    }),
    // satellite paths
    ...satellites.map(
      ([name, trace]): Data => ({
        x: trace.x,
        y: trace.y,
        mode: 'lines',
        name,
        legendgroup: name,
        line: { color: COLOURS[name], width: 1 },
      }),
    ),
    // current positions
    ...positions.map(
      ([name, trace]): Data => ({
        x: [trace.x[frame] ?? null],
        y: [trace.y[frame] ?? null],
        mode: 'markers',
        name,
        legendgroup: name,
        showlegend: false,
        marker: { color: COLOURS[name] },
      }),
    ),
  ]
}

async function draw(el: HTMLDivElement, plotData: OrbitPlotData) {
  const Plotly = await plotly
  const times = plotData.Earth?.time ?? []
  const sun: Data = { x: [0], y: [0], name: 'Sun', mode: 'markers', showlegend: false, marker: { color: 'gold', size: 10 } }

  const frames: Partial<Frame>[] = times.slice(0, N_FRAMES).map((time, i) => ({ name: time, data: traces(plotData, i) }))
  const steps: Partial<SliderStep>[] = times.slice(0, N_FRAMES).map((time) => ({
    method: 'animate',
    label: time.substring(0, 16),
    args: [[time], { mode: 'immediate', transition: { duration: 0 }, frame: { duration: 0, redraw: false } }],
  }))
  const animation = { transition: { duration: 0 }, frame: { duration: 0, redraw: false } }

  const layout: Partial<Layout> = {
    hovermode: 'closest',
    xaxis: { range: [-1.6, 1.6], title: { text: 'X [AU]' } },
    yaxis: { scaleanchor: 'x', scaleratio: 1, title: { text: 'Y [AU]' } },
    legend: { x: 1, xanchor: 'right', y: 1 },
    annotations: [
      {
        xref: 'paper',
        yref: 'paper',
        x: 0.975,
        xanchor: 'right',
        y: 0.05,
        yanchor: 'bottom',
        text: 'SolarMonitor.org',
        showarrow: false,
      },
    ],
    updatemenus: [
      {
        x: -0.05,
        y: -0.2,
        yanchor: 'bottom',
        xanchor: 'left',
        showactive: false,
        direction: 'left',
        type: 'buttons',
        pad: { t: 10, r: 10 },
        buttons: [
          { method: 'animate', args: [null, { fromcurrent: true, ...animation }], label: 'Play' },
          { method: 'animate', args: [[null], { mode: 'immediate', ...animation }], label: 'Pause' },
        ],
      },
    ],
    sliders: [
      {
        pad: { l: 150, t: 55 },
        currentvalue: { visible: true, prefix: 'Time:', xanchor: 'right' },
        steps,
      },
    ],
  }
  const config: Partial<Config> = {
    responsive: true,
    displaylogo: false,
    displayModeBar: true,
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleHover', 'toggleSpikelines'],
  }

  // start with the markers at the requested time, the middle of the 30 day window
  await Plotly.newPlot(el, [...traces(plotData, Math.floor(N_FRAMES / 2) - 1), sun], layout, config)
  await Plotly.addFrames(el, frames)
}

watch([container, data], ([el, plotData]) => {
  if (el && plotData) draw(el, plotData).catch((error) => console.warn('Failed to draw orbits', error))
})

onBeforeUnmount(() => {
  if (container.value) plotly.then((Plotly) => container.value && Plotly.purge(container.value))
})
</script>

<template>
  <div class="row mt-3">
    <LoadingSpinner v-if="loading" />
    <p v-else-if="!data" class="text-secondary">No orbit data found for this time.</p>
    <div v-show="!loading && data" style="min-height: 90vh">
      <div ref="container" class="h-100" style="min-height: 90vh" />
    </div>
  </div>
</template>
