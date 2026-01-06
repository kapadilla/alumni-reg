<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { isAuthenticated, verifyToken } = useAuth();
const authToken = useCookie("auth_token");

// Redirect based on auth status
onMounted(async () => {
  if (isAuthenticated.value || authToken.value) {
    // Try to verify if token exists
    if (authToken.value && !isAuthenticated.value) {
      await verifyToken();
    }
    if (isAuthenticated.value) {
      await navigateTo("/admin/dashboard", { replace: true });
      return;
    }
  }
  await navigateTo("/admin/login", { replace: true });
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Icon name="svg-spinners:ring-resize" class="size-8 text-primary" />
  </div>
</template>
