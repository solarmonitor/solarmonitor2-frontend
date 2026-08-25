<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <span v-tooltip="text" class="info-tip"><sup>?</sup></span>
</template>

<style scoped>
.info-tip {
  cursor: help;
}
</style>
