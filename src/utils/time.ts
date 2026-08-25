// All SolarMonitor times are UTC. Dates are handled as JS Dates and formatted with UTC accessors.

const HOUR_MS = 3600 * 1000
const DAY_MS = 24 * HOUR_MS

const pad = (n: number, width = 2) => String(n).padStart(width, '0')

/**
 * Parse the `date` query parameter, `yyyymmdd` (taken as 12:00) or `yyyymmddhh`.
 * Returns null if missing or invalid so callers can fall back to the current time.
 */
export function parseDateParam(value: unknown): Date | null {
  if (typeof value !== 'string' || !/^\d{8}(\d{2})?$/.test(value)) return null
  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(4, 6))
  const day = Number(value.slice(6, 8))
  const hour = value.length === 10 ? Number(value.slice(8, 10)) : 12
  const date = new Date(Date.UTC(year, month - 1, day, hour))
  // reject roll-overs such as month 13 or hour 25
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day || date.getUTCHours() !== hour) return null
  return date
}

/** Format a date as the `yyyymmddhh` query parameter. */
export function formatDateParam(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}`
}

/** Format as the naive ISO string the backend API expects, e.g. `2024-05-01T12:00:00`. */
export function toApiTime(date: Date): string {
  return date.toISOString().slice(0, 19)
}

/** Format for `<input type="datetime-local">`, e.g. `2024-05-01T12:00`. */
export function toInputValue(date: Date): string {
  return date.toISOString().slice(0, 16)
}

/** Parse an `<input type="datetime-local">` value as UTC. */
export function fromInputValue(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return null
  const date = new Date(`${value.slice(0, 16)}:00Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Round to the hour; times already on the hour are unchanged.
 * Mirrors `common.utils.round_datetime(delta=1h)`.
 */
export function roundHour(date: Date, mode: 'up' | 'nearest' = 'up'): Date {
  const ms = date.getTime()
  if (ms % HOUR_MS === 0) return new Date(ms)
  const rounded = mode === 'up' ? Math.ceil(ms / HOUR_MS) : Math.round(ms / HOUR_MS)
  return new Date(rounded * HOUR_MS)
}

export const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * HOUR_MS)
export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS)

export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}
