<script setup lang="ts">
useHead({
  title: "Registration Successful - UP Alumni Association - Cebu Chapter",
});

// Fetch public form settings for success message
const { fetchPublicFormSettings, getSuccessMessage } = usePublicFormSettings();

// Fetch settings on mount
onMounted(async () => {
  await fetchPublicFormSettings();
});

// Get the custom success message
const customMessage = computed(() => getSuccessMessage());
</script>

<template>
  <div
    class="h-[calc(100vh-3.5rem)] bg-background flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full text-center">
      <div class="bg-surface rounded-2xl border border-border p-8 space-y-6">
        <!-- Success Icon -->
        <div class="flex justify-center">
          <div
            class="size-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center"
          >
            <Icon
              name="material-symbols:check-circle"
              style="width: 64px; height: 64px"
              class="text-green-600 dark:text-green-400"
            />
          </div>
        </div>

        <!-- Success Message -->
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-text">Registration Successful!</h1>
          <p class="text-subtle">
            Thank you for submitting your registration. We'll review your
            application and get back to you soon.
          </p>
        </div>

        <!-- Custom Message from Admin -->
        <div
          v-if="customMessage"
          class="bg-primary/5 border border-primary/20 rounded-lg p-4"
        >
          <p class="text-sm text-text whitespace-pre-wrap">
            {{ customMessage }}
          </p>
        </div>

        <!-- Additional Info -->
        <div
          class="bg-background rounded-lg p-4 text-sm text-subtle text-left space-y-2"
        >
          <p class="flex items-start gap-2">
            <Icon
              name="material-symbols:mail-outline"
              class="size-6 shrink-0 mt-0.5"
            />
            <span
              >You'll receive a confirmation email with further
              instructions.</span
            >
          </p>
          <p class="flex items-start gap-2">
            <Icon
              name="material-symbols:schedule"
              class="size-6 shrink-0 mt-0.5"
            />
            <span>Processing typically takes 2-3 business days.</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
