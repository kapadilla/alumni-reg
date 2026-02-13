<script setup lang="ts">
const showBanner = ref(false);
const route = useRoute();
const cookieConsent = useCookie("cookie_consent", {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: "lax",
});

onMounted(() => {
  // Only show banner on admin routes (where auth cookies are used)
  const isAdminRoute = route.path.startsWith("/admin");
  if (isAdminRoute && !cookieConsent.value) {
    showBanner.value = true;
  }
});

const acceptCookies = () => {
  cookieConsent.value = "accepted";
  showBanner.value = false;
};

const declineCookies = () => {
  cookieConsent.value = "declined";
  showBanner.value = false;
};
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div
        class="mx-auto max-w-4xl bg-surface border border-border rounded-2xl shadow-xl p-6"
      >
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <!-- Cookie Icon & Text -->
          <div class="flex-1">
            <div class="flex items-start gap-3">
              <div
                class="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Icon
                  name="material-symbols:cookie-outline"
                  class="w-5 h-5 text-primary"
                />
              </div>
              <div>
                <h3 class="font-semibold text-text mb-1">
                  We use cookies
                </h3>
                <p class="text-sm text-subtle leading-relaxed">
                  This website uses cookies to store your authentication session
                  and preferences. By continuing to use this site, you agree to
                  our use of cookies in accordance with the
                  <span class="font-medium text-text">Philippine Data Privacy Act of 2012</span>
                  and
                  <span class="font-medium text-text">GDPR</span>.
                </p>
                <a
                  href="#"
                  class="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  Learn more about our Privacy Policy
                </a>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 md:shrink-0">
            <button
              class="px-5 py-2.5 text-sm font-medium text-subtle hover:text-text border border-border rounded-xl hover:bg-background transition-colors"
              @click="declineCookies"
            >
              Decline
            </button>
            <button
              class="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-opacity-90 transition-colors"
              @click="acceptCookies"
            >
              Accept Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
