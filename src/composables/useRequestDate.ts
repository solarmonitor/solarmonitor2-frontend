import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { parseDateParam, roundHour } from '@/utils/time'

/**
 * The date the page is showing: the `date` query parameter, or now rounded to the hour
 * (up by default, nearest for routes with `meta.rounding = 'nearest'`).
 */
export function useRequestDate() {
  const route = useRoute()
  return computed(
    () => parseDateParam(route.query.date) ?? roundHour(new Date(), route.meta.rounding ?? 'up'),
  )
}

/** Read an integer query parameter. */
export function useIntQuery(name: string) {
  const route = useRoute()
  return computed(() => {
    const value = Number.parseInt(String(route.query[name] ?? ''), 10)
    return Number.isNaN(value) ? undefined : value
  })
}

/** Read a string query parameter. */
export function useStringQuery(name: string) {
  const route = useRoute()
  return computed(() => {
    const value = route.query[name]
    return typeof value === 'string' && value !== '' ? value : undefined
  })
}
