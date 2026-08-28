import { api } from '@/api'
import type { Flare } from '@/types'
import { groupFlaresByNoaa, mergeWithPrevious, type SrsRow } from '@/utils/srs'
import { addDays } from '@/utils/time'

export interface SrsTableData {
  rows: SrsRow[]
  flaresByNoaa: Map<number, Flare[]>
}

export const emptySrsTable = (): SrsTableData => ({ rows: [], flaresByNoaa: new Map() })

/**
 * Today's active regions (rotated to `date`) alongside yesterday's, plus each region's
 * flares in the 24 hours before `date`.
 */
export async function loadSrsTable(date: Date, noaa?: number): Promise<SrsTableData> {
  const [today, previous, flares] = await Promise.all([
    api.srs(date, { noaa_no: noaa, rotate: true }),
    api.srs(addDays(date, -1), { noaa_no: noaa }),
    api.flares(addDays(date, -1), { end: date, noaa_no: noaa }),
  ])
  return { rows: mergeWithPrevious(today, previous), flaresByNoaa: groupFlaresByNoaa(flares) }
}
