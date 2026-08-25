<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useRequestDate } from '@/composables/useRequestDate'
import { formatDateParam, fromInputValue, roundHour, toInputValue } from '@/utils/time'

const route = useRoute()
const router = useRouter()
const requestDate = useRequestDate()

const input = ref<HTMLInputElement>()
const value = computed(() => toInputValue(requestDate.value))
const max = computed(() => toInputValue(roundHour(new Date())))
// Picking from the browser's calendar applies straight away; typing applies on Enter or blur.
let typing = false

function apply() {
  typing = false
  const date = fromInputValue(input.value?.value ?? '')
  if (!date) return
  const param = formatDateParam(date)
  if (param !== formatDateParam(requestDate.value)) {
    router.push({ path: route.path, query: { ...route.query, date: param }, hash: route.hash })
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') apply()
  else typing = true
}

function onChange() {
  if (!typing) apply()
}

function openPicker() {
  input.value?.showPicker?.()
}
</script>

<template>
  <div class="input-group input-group-sm date-picker">
    <input
      ref="input"
      type="datetime-local"
      class="form-control rounded-0"
      aria-label="Date and time (UTC)"
      min="2020-01-01T00:00"
      :max="max"
      step="3600"
      :value="value"
      @keydown="onKeydown"
      @change="onChange"
      @blur="apply"
    />
    <button class="input-group-text rounded-0" type="button" aria-label="Open calendar" @click="openPicker">
      <i class="bi bi-calendar" />
    </button>
    <span class="input-group-text rounded-0">UTC</span>
  </div>
</template>

<style scoped>
.date-picker {
  width: auto;
  flex-wrap: nowrap;
}
</style>
