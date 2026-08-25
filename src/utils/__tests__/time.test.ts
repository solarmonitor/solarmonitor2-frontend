import { describe, expect, it } from 'vitest'

import {
  addDays,
  formatDateParam,
  fromInputValue,
  parseDateParam,
  roundHour,
  startOfUtcDay,
  toApiTime,
} from '@/utils/time'

const utc = (...args: [number, number, number, number?, number?, number?]) =>
  new Date(Date.UTC(args[0], args[1] - 1, args[2], args[3] ?? 0, args[4] ?? 0, args[5] ?? 0))

describe('parseDateParam', () => {
  it('parses yyyymmddhh', () => {
    expect(parseDateParam('2020010101')).toEqual(utc(2020, 1, 1, 1))
  })

  it('treats yyyymmdd as midday', () => {
    expect(parseDateParam('20200101')).toEqual(utc(2020, 1, 1, 12))
  })

  it.each([undefined, '', '2020', '2020011', 'abcdefgh', '2020133101', '2020010125', ['2020010101']])(
    'rejects %j',
    (value) => {
      expect(parseDateParam(value)).toBeNull()
    },
  )
})

describe('formatting', () => {
  it('round trips the date parameter', () => {
    expect(formatDateParam(utc(2024, 5, 1, 7))).toBe('2024050107')
  })

  it('formats naive UTC ISO for the API', () => {
    expect(toApiTime(utc(2024, 5, 1, 7, 30))).toBe('2024-05-01T07:30:00')
  })

  it('parses datetime-local values as UTC', () => {
    expect(fromInputValue('2024-05-01T07:00')).toEqual(utc(2024, 5, 1, 7))
    expect(fromInputValue('')).toBeNull()
  })
})

describe('roundHour', () => {
  it('rounds up by default', () => {
    expect(roundHour(utc(2020, 1, 1, 11, 1))).toEqual(utc(2020, 1, 1, 12))
  })

  it('rounds to nearest', () => {
    expect(roundHour(utc(2020, 1, 1, 11, 20), 'nearest')).toEqual(utc(2020, 1, 1, 11))
    expect(roundHour(utc(2020, 1, 1, 11, 40), 'nearest')).toEqual(utc(2020, 1, 1, 12))
  })

  it('leaves times on the hour unchanged', () => {
    expect(roundHour(utc(2020, 1, 1, 12))).toEqual(utc(2020, 1, 1, 12))
  })
})

describe('arithmetic', () => {
  it('adds days across month ends', () => {
    expect(addDays(utc(2020, 1, 31, 5), 1)).toEqual(utc(2020, 2, 1, 5))
  })

  it('truncates to the start of the UTC day', () => {
    expect(startOfUtcDay(utc(2020, 1, 31, 23, 59))).toEqual(utc(2020, 1, 31))
  })
})
