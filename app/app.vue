<script setup lang="ts">
import { Toaster } from "vue-sonner";
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster
    position="top-right"
    :toast-options="{
      unstyled: true,
      classes: {
        toast:
          'flex items-center gap-3 w-full px-4 py-3 rounded-lg corner-smooth shadow-lg bg-surface border border-border font-sans',
        title: 'text-sm font-semibold text-text',
        description: 'text-sm text-subtle',
      },
    }"
  />
  <AppCookieConsent />
</template>
