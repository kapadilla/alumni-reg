<script setup lang="ts">
defineEmits<{
  toggleMenu: [];
}>();
</script>

<template>
  <nav class="h-14 w-full bg-surface border-b border-border">
    <div class="h-full px-4 flex items-center justify-between">
      <!-- Left side: Menu button + Title -->
      <div class="flex items-center gap-3">
        <!-- Hamburger Menu Button (Mobile Only) -->
        <button
          class="lg:hidden p-2 -ml-2 text-text hover:bg-background rounded-lg transition-colors active:scale-95"
          aria-label="Toggle menu"
          @click="$emit('toggleMenu')"
        >
          <Icon name="material-symbols:menu" class="size-6" />
        </button>

        <span class="text-primary dark:text-text font-semibold font-serif">
          UP Alumni Association - Cebu Chapter
        </span>
      </div>

      <!-- Right side: Actions -->
      <div class="flex items-center gap-2">
        <AppDarkModeToggle />
      </div>
    </div>
  </nav>
</template>
