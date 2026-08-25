import { ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Run `loader` now and again whenever the route path or query changes (but not the hash,
 * which only selects tabs). Responses from superseded loads are discarded.
 */
export function useAsyncData<T>(loader: () => Promise<T>, initial: T) {
  const route = useRoute()
  const data = shallowRef<T>(initial)
  const loading = ref(true)
  let latest = 0

  watch(
    () => [route.path, JSON.stringify(route.query)],
    async () => {
      const id = ++latest
      loading.value = true
      let result = initial
      try {
        result = await loader()
      } catch (error) {
        console.warn('Failed to load page data', error)
      }
      if (id === latest) {
        data.value = result
        loading.value = false
      }
    },
    { immediate: true },
  )

  return { data, loading }
}
