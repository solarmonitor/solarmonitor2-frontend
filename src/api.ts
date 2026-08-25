import type {
  ActiveRegionImage,
  DerivedImage,
  Flare,
  Forecast,
  FullDiskImage,
  OrbitPlotData,
  Plot,
  Srs,
} from '@/types'
import { toApiTime } from '@/utils/time'

type Params = Record<string, string | number | boolean | Date | null | undefined>

/**
 * Flask's jsonify writes float NaN/Infinity as bare tokens (e.g. forecasts with no value),
 * which JSON.parse rejects. Replace them with null where they appear as values.
 */
export function parseApiJson(text: string): unknown {
  return JSON.parse(text.replace(/([[:,]\s*)-?(?:NaN|Infinity)(?=\s*[,\]}])/g, '$1null'))
}

async function get<T>(path: string, params: Params, fallback: T): Promise<T> {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue
    query.set(key, value instanceof Date ? toApiTime(value) : String(value))
  }
  try {
    const response = await fetch(`/api${path}?${query}`)
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    return parseApiJson(await response.text()) as T
  } catch (error) {
    console.warn(`API request ${path} failed`, error)
    return fallback
  }
}

export interface ImageQuery {
  wave?: number
  instr?: string
  obs?: string
}

export const api = {
  fullDiskImages: (time: Date, q: ImageQuery = {}) =>
    get<FullDiskImage[]>('/images/full_disk', { time, ...q }, []),

  activeRegionImages: (time: Date, q: ImageQuery & { noaa_no?: number } = {}) =>
    get<ActiveRegionImage[]>('/images/active_regions', { time, ...q }, []),

  derivedImages: (time: Date | string, dataType: string) =>
    get<DerivedImage[]>('/images/full_disk_derived', { time, data_type: dataType }, []),

  /** Sunspot region summaries; `rotate` returns positions differentially rotated to `time`. */
  srs: (time: Date, q: { noaa_no?: number; rotate?: boolean } = {}) =>
    get<Srs[]>('/metadata/srs', { time, ...q }, []),

  flares: (time: Date, q: { end?: Date; noaa_no?: number; id?: string } = {}) =>
    get<Flare[]>('/events/flares', { time, ...q }, []),

  forecasts: (time: Date, duration?: number) =>
    get<Forecast[]>('/metadata/forecast', { time, duration }, []),

  xrsPlots: (time: Date | string, type: string) => get<Plot[]>('/plots/timeseries/xrs', { time, type }, []),

  stixPlots: (time: Date, type: string) => get<Plot[]>('/plots/timeseries/stix', { time, type }, []),

  statusPlots: (time: Date, type?: string) => get<Plot[]>('/plots/status', { time, type }, []),

  radioPlots: (time: Date) => get<Plot[]>('/plots/radio', { time }, []),

  orbitPlotData: (time: Date) => get<OrbitPlotData | null>('/metadata/orbit/plot-data', { time }, null),
}
