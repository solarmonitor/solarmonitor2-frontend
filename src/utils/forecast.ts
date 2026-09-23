import type { Forecast } from '@/types'

export const FORECAST_KEYS = ['c_plus', 'm_plus', 'x_plus'] as const
export type ForecastKey = (typeof FORECAST_KEYS)[number]

export const FORECAST_LABELS: Record<ForecastKey, string> = { c_plus: 'C+', m_plus: 'M+', x_plus: 'X+' }

const MODEL_NAMES: Record<string, string | undefined> = {
  mcstat: 'MCSTAT',
  mcevol: 'MCEVOL',
  swpc: 'SWPC',
  mean: 'Mean',
}

export const MODEL_TOOLTIPS = {
  mcstat: "McIntosh Statistics: Poisson flaring probabilities based on a region's current McIntosh class.",
  mcevol:
    "McIntosh Evolution: Poisson flaring probabilities based on evolution of a region's McIntosh class;" +
    " the combination of today's and yesterday's class.",
  swpc: "NOAA SWPC's official flare forecast.",
  mean: 'Mean of all the shown flare models, discounting NaNs.',
}

export const modelName = (model: string) => MODEL_NAMES[model] ?? model
export const modelTooltip = (model: string): string | undefined =>
  (MODEL_TOOLTIPS as Record<string, string | undefined>)[model]

const isNumber = (v: number | null | undefined): v is number => typeof v === 'number' && !Number.isNaN(v)

export interface ForecastTable {
  /** Model names in display order (sorted), excluding the mean. */
  models: string[]
  /** NOAA numbers with at least one forecast, ascending. */
  regions: number[]
  value(noaa: number, model: string, key: ForecastKey): number | null
  /** Mean over models, ignoring missing values (numpy.nanmean). */
  mean(noaa: number, key: ForecastKey): number | null
}

export function buildForecastTable(forecasts: Forecast[]): ForecastTable {
  const models = [...new Set(forecasts.map((f) => f.model))].sort()
  const regions = [...new Set(forecasts.map((f) => f.noaa_no))].sort((a, b) => a - b)
  const lookup = new Map(forecasts.map((f) => [`${f.noaa_no}|${f.model}`, f]))

  const value = (noaa: number, model: string, key: ForecastKey) => {
    const v = lookup.get(`${noaa}|${model}`)?.[key]
    return isNumber(v) ? v : null
  }
  const mean = (noaa: number, key: ForecastKey) => {
    const values = models.map((m) => value(noaa, m, key)).filter(isNumber)
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null
  }
  return { models, regions, value, mean }
}

/** Probability (0-1) as a whole percentage, or `-` when missing. */
export function formatPercent(v: number | null): string {
  return v === null ? '-' : Math.round(v * 100).toFixed(0)
}
