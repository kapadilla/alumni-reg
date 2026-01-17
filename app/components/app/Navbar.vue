<script setup lang="ts">
defineProps<{
  showMenuButton?: boolean;
}>();

defineEmits<{
  toggleMenu: [];
}>();
</script>

<template>
  <nav class="h-14 w-full bg-surface/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
    <div
      class="w-full max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between"
    >
      <!-- Hamburger Menu Button (Mobile Only) -->
      <button
        v-if="showMenuButton"
        class="lg:hidden p-2 -ml-2 text-text hover:bg-background rounded-lg transition-colors"
        aria-label="Toggle menu"
        @click="$emit('toggleMenu')"
      >
        <Icon name="material-symbols:menu" class="size-6" />
      </button>

      <span class="text-primary dark:text-text font-semibold font-serif">
        UP Alumni Association - Cebu Chapter
      </span>
      <AppDarkModeToggle />
    </div>
  </nav>
</template>
