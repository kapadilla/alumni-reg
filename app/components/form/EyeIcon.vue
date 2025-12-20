<script setup lang="ts">
defineProps<{
  isVisible: boolean;
}>();
</script>

<template>
  <svg
    class="size-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Eye shape -->
    <path
      d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="transition-all duration-300"
    />
    <!-- Pupil -->
    <circle
      cx="12"
      cy="12.5"
      r="3"
      stroke="currentColor"
      stroke-width="1.5"
      class="transition-all duration-300"
    />
    <!-- Animated slash line -->
    <line
      v-if="!isVisible"
      x1="4"
      y1="4"
      x2="20"
      y2="20"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      class="slash-line"
    />
  </svg>
</template>

<style scoped>
.slash-line {
  stroke-dasharray: 28;
  stroke-dashoffset: 28;
  animation: draw-slash 0.3s ease-out forwards;
}

@keyframes draw-slash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
