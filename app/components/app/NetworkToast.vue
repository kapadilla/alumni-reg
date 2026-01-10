<script setup lang="ts">
import { toast } from 'vue-sonner'
import { useNetworkStatus } from '~/composables/useNetworkStatus'

const { isOnline } = useNetworkStatus()

// Track previous state to detect changes
const wasOnline = ref(true)

// Watch for network status changes
watch(isOnline, (online) => {
  // Skip the initial mount
  if (wasOnline.value === online) {
    wasOnline.value = online
    return
  }
  
  if (!online) {
    toast.error('Connection lost', {
      description: 'Please check your internet connection',
      duration: 4000,
    })
  } else {
    toast.success('Connection restored', {
      description: 'You are back online',
      duration: 3000,
    })
  }
  
  wasOnline.value = online
})

// Initialize on mount
onMounted(() => {
  wasOnline.value = isOnline.value
})
</script>

<template>
  <!-- This component has no visual output, it only shows toasts -->
  <div />
</template>
