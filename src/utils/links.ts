import type { RouteLocationRaw } from 'vue-router'

import type { ActiveRegionImage, FullDiskImage } from '@/types'
import { formatDateParam } from '@/utils/time'

/** Link to the full-size view of a full disk or active region image. */
export function detailLink(date: Date, image: FullDiskImage | ActiveRegionImage): RouteLocationRaw {
  return {
    path: '/detail',
    query: {
      date: formatDateParam(date),
      wave: image.wavelength,
      instr: image.instrument,
      obs: image.observable,
      ...('noaa_no' in image ? { noaa_no: image.noaa_no } : {}),
    },
  }
}

export function activeRegionLink(date: Date, noaa: number | null): RouteLocationRaw {
  return { path: '/ars', query: { date: formatDateParam(date), ...(noaa != null ? { noaa_no: noaa } : {}) } }
}
