import { describe, expect, it } from 'vitest'

import type { Flare, Srs } from '@/types'
import { flareDateParam, groupFlaresByNoaa, haleClass, mergeWithPrevious } from '@/utils/srs'

const srs = (noaa: number, extra: Partial<Srs> = {}): Srs => ({
  date_obs: '2020-01-01T00:00:00',
  region_id: 'I',
  noaa_number: noaa,
  carrington_longitude: 0,
  area: 10,
  z: 'Axx',
  longitudinal_extent: 1,
  number_of_sunspots: 1,
  mag_type: 'Alpha',
  latitude: 10,
  longitude: 20,
  ...extra,
})

const flare = (noaa: number | null, id = 'FL-SSWL-20200101120000'): Flare => ({
  id,
  start_time: '2020-01-01T12:00:00',
  peak_time: '2020-01-01T12:05:00',
  end_time: '2020-01-01T12:10:00',
  goes_cls: 'C1.0',
  flux: 1e-6,
  data_prov: 'ssw',
  data_src: 'SSW Latest Events',
  hgs_lat: 1,
  hgs_lon: 2,
  noaa_number: noaa,
})

describe('haleClass', () => {
  it('uses greek letters', () => {
    expect(haleClass('Beta-Gamma-Delta')).toBe('βγδ')
  })

  it('passes through missing values', () => {
    expect(haleClass(null)).toBeNull()
    expect(haleClass(undefined)).toBeNull()
  })
})

describe('mergeWithPrevious', () => {
  it("attaches yesterday's entry for the same region", () => {
    const rows = mergeWithPrevious([srs(1), srs(2)], [srs(2, { area: 99 }), srs(3)])
    expect(rows.map((r) => r.noaa_number)).toEqual([1, 2])
    expect(rows[0]?.prev).toBeNull()
    expect(rows[1]?.prev?.area).toBe(99)
  })
})

describe('flares', () => {
  it('groups by NOAA number, skipping unassociated flares', () => {
    const groups = groupFlaresByNoaa([flare(1), flare(2), flare(1), flare(null)])
    expect(groups.get(1)).toHaveLength(2)
    expect(groups.get(2)).toHaveLength(1)
    expect(groups.size).toBe(2)
  })

  it('takes the page date from the flare id', () => {
    expect(flareDateParam(flare(1))).toBe('2020010112')
  })
})
