import { describe, expect, it } from 'vitest'

import { parseApiJson } from '@/api'
import type { Forecast } from '@/types'
import { buildForecastTable, formatPercent } from '@/utils/forecast'

const forecast = (noaa: number, model: string, c: number | null, m = 0.1, x = 0.01): Forecast => ({
  date_obs: '2020-01-01T00:00:00',
  duration: 86400,
  model,
  noaa_no: noaa,
  c_plus: c,
  m_plus: m,
  x_plus: x,
})

describe('buildForecastTable', () => {
  const table = buildForecastTable([
    forecast(200, 'swpc', 0.5),
    forecast(100, 'mcstat', 0.2),
    forecast(100, 'mcevol', NaN),
    forecast(100, 'swpc', 0.4),
  ])

  it('sorts models and regions', () => {
    expect(table.models).toEqual(['mcevol', 'mcstat', 'swpc'])
    expect(table.regions).toEqual([100, 200])
  })

  it('treats NaN and missing models as no value', () => {
    expect(table.value(100, 'mcevol', 'c_plus')).toBeNull()
    expect(table.value(200, 'mcstat', 'c_plus')).toBeNull()
  })

  it('averages the available models', () => {
    expect(table.mean(100, 'c_plus')).toBeCloseTo(0.3)
    expect(table.mean(200, 'c_plus')).toBeCloseTo(0.5)
  })

  it('formats percentages', () => {
    expect(formatPercent(0.256)).toBe('26')
    expect(formatPercent(null)).toBe('-')
  })
})

describe('parseApiJson', () => {
  it('turns bare NaN/Infinity values into null', () => {
    expect(parseApiJson('[{"c_plus": NaN, "m_plus":-Infinity, "x": [1, NaN]}]')).toEqual([
      { c_plus: null, m_plus: null, x: [1, null] },
    ])
  })

  it('leaves strings alone', () => {
    expect(parseApiJson('{"model": "NaN", "note": "a, NaN"}')).toEqual({ model: 'NaN', note: 'a, NaN' })
  })
})
