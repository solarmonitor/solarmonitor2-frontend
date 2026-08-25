<script setup lang="ts">
import feather from 'feather-icons'
import { computed } from 'vue'

const props = defineProps<{ name: string }>()
const icons: Partial<Record<string, feather.FeatherIcon>> = feather.icons
const svg = computed(() => icons[props.name]?.toSvg({ class: 'feather align-text-bottom' }) ?? '')
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- static SVG markup from feather-icons -->
  <span class="feather-icon" aria-hidden="true" v-html="svg" />
</template>
