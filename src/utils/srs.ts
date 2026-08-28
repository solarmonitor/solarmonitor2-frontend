import type { Flare, Srs } from '@/types'

export interface SrsRow extends Srs {
  prev: Srs | null
}

/** Hale class with Greek letters, e.g. `Beta-Gamma` -> `βγ`. */
export function haleClass(magType: string | null | undefined): string | null {
  if (!magType) return magType ?? null
  return magType
    .replace('Alpha', 'α')
    .replace('Beta', 'β')
    .replace('Gamma', 'γ')
    .replace('Delta', 'δ')
    .replace(/-/g, '')
}

/** Pair each of today's regions with yesterday's entry for the same NOAA number, if any. */
export function mergeWithPrevious(today: Srs[], previous: Srs[]): SrsRow[] {
  const byNoaa = new Map(previous.map((row) => [row.noaa_number, row]))
  return today.map((row) => ({ ...row, prev: byNoaa.get(row.noaa_number) ?? null }))
}

export function groupFlaresByNoaa(flares: Flare[]): Map<number, Flare[]> {
  const groups = new Map<number, Flare[]>()
  for (const flare of flares) {
    if (flare.noaa_number == null) continue
    const list = groups.get(flare.noaa_number) ?? []
    list.push(flare)
    groups.set(flare.noaa_number, list)
  }
  return groups
}

export function flareColour(goesCls: string): string {
  switch (goesCls[0]) {
    case 'C':
      return '#689F38'
    case 'M':
      return '#FFA000'
    default:
      return '#E64A19'
  }
}

/** The `date` parameter for a flare's page, taken from the flare id as the Flask app did. */
export function flareDateParam(flare: Flare): string {
  return flare.id.slice(8, -4)
}
