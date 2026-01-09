<script setup lang="ts">
import { useScroll } from "@vueuse/core";

const scrollContainer = ref<HTMLElement | null>(null);

const { x, arrivedState } = useScroll(scrollContainer, {
  behavior: "smooth",
});

const showLeftFade = computed(() => !arrivedState.left);
const showRightFade = computed(() => !arrivedState.right);
</script>

<template>
  <div class="relative">
    <!-- Left fade indicator -->
    <div
      class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface to-transparent pointer-events-none z-10 transition-opacity duration-200"
      :class="showLeftFade ? 'opacity-100' : 'opacity-0'"
    />

    <!-- Right fade indicator -->
    <div
      class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface to-transparent pointer-events-none z-10 transition-opacity duration-200"
      :class="showRightFade ? 'opacity-100' : 'opacity-0'"
    />

    <!-- Scrollable content -->
    <div
      ref="scrollContainer"
      class="overflow-x-auto"
    >
      <slot />
    </div>
  </div>
</template>
