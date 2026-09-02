<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface Tab {
  key: string
  label: string
}

const props = defineProps<{ tabs: Tab[] }>()
defineSlots<{ default(props: { active: string }): unknown }>()

const route = useRoute()
const router = useRouter()

// The selected tab lives in the URL hash so it survives date navigation and can be linked to.
const active = computed(() => {
  const fromHash = route.hash.slice(1)
  return props.tabs.some((tab) => tab.key === fromHash) ? fromHash : (props.tabs[0]?.key ?? '')
})

function select(key: string) {
  if (key !== active.value) router.push({ query: route.query, hash: `#${key}` })
}
</script>

<template>
  <ul class="nav nav-tabs" role="tablist">
    <li v-for="tab in tabs" :key="tab.key" class="nav-item" role="presentation">
      <button
        class="nav-link"
        :class="{ active: tab.key === active }"
        type="button"
        role="tab"
        :aria-selected="tab.key === active"
        @click="select(tab.key)"
      >
        &nbsp;{{ tab.label }}&nbsp;
      </button>
    </li>
  </ul>
  <div class="tab-content pb-3 pt-3" role="tabpanel">
    <slot :active="active" />
  </div>
</template>
