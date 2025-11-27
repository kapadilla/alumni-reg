<script setup lang="ts">
defineProps<{
  size?: string;
}>();
</script>

<template>
  <svg
    :class="size || 'size-5 lg:size-6'"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="checkmark-path"
    />
  </svg>
</template>

<style scoped>
.checkmark-path {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: draw-checkmark 0.3s ease-out forwards;
}

@keyframes draw-checkmark {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
