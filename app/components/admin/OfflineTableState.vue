<script setup lang="ts">
const handleRetry = () => {
  // Force a page reload to retry fetching data
  window.location.reload()
}
</script>

<template>
  <div class="py-16 px-6 text-center">
    <!-- Icon with gradient background -->
    <div class="relative mx-auto mb-6 size-20">
      <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-xl" />
      <div class="relative size-20 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 flex items-center justify-center">
        <!-- Inline SVG - works offline -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          class="size-10 text-red-500/80"
        >
          <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6-2.9a8.9 8.9 0 0 0-6-2.1c-2.18 0-4.25.78-5.96 2.1l1.42 1.42A6.9 6.9 0 0 1 12 15c1.76 0 3.4.64 4.57 1.55L18 15.1zM2.81 2.81 1.39 4.22l3.32 3.32A13.8 13.8 0 0 0 .69 12l1.41 1.41a11.8 11.8 0 0 1 4.48-4.18l2.03 2.03A10.9 10.9 0 0 0 4.26 14.4L5.69 15.82a8.89 8.89 0 0 1 4.53-2.8l7.96 7.96 1.41-1.41L2.81 2.81zM12 3c3.75 0 7.2 1.39 9.88 3.69l1.41-1.41C20.3 2.59 16.34 1 12 1c-3.27 0-6.32.96-8.9 2.6l1.46 1.46A13.9 13.9 0 0 1 12 3zm7.74 8.73 1.41-1.41A11.8 11.8 0 0 0 12 7c-.61 0-1.21.05-1.8.13l1.77 1.77c.01 0 .02 0 .03 0 2.68 0 5.19.95 7.13 2.53l.61.3z"/>
        </svg>
      </div>
    </div>
    
    <!-- Title -->
    <h3 class="text-lg font-semibold text-text mb-2">
      No Internet Connection
    </h3>
    
    <!-- Description -->
    <p class="text-subtle text-sm max-w-xs mx-auto mb-6">
      We couldn't load the data. Please check your internet connection and try again.
    </p>
    
    <!-- Retry Button -->
    <button
      class="px-5 py-2.5 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/25"
      @click="handleRetry"
    >
      Try Again
    </button>
    
    <!-- Helper text -->
    <p class="text-subtle/60 text-xs mt-4">
      Your data will appear once you're back online
    </p>
  </div>
</template>
