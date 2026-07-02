<template>
  <v-container :class="containerClass" class="page-container py-6 px-4">
    <slot />
  </v-container>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['narrow', 'default', 'wide'].includes(value),
  },
})

const containerClass = computed(() => ({
  'page-container--narrow': props.size === 'narrow',
  'page-container--wide': props.size === 'wide',
}))
</script>
