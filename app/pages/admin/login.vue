<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: ["guest"],
});

const { login, isLoading, error } = useAuth();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!email.value || !password.value) return;
  await login(email.value, password.value);
};
</script>

<template>
  <div
    class="min-h-[calc(100vh-56px)] bg-background flex items-center justify-center py-8 px-4"
  >
    <div class="w-full max-w-md">
      <div class="bg-surface rounded-2xl border border-border p-8 md:p-10">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
            Admin Login
          </h1>
          <p class="text-subtle text-sm">
            Sign in to access the admin dashboard
          </p>
        </div>

        <!-- Login Form -->
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Error Alert -->
          <div
            v-if="error"
            class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3"
          >
            <Icon
              name="material-symbols:error-outline"
              class="size-5 shrink-0"
            />
            <p class="font-medium">{{ error }}</p>
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-text">
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="admin@example.com"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-text">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Enter your password"
                class="w-full px-4 py-2.5 pr-12 rounded-lg border border-border bg-background text-text placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-primary transition-all duration-300 ease-out"
                title="Toggle password visibility"
                @click="togglePasswordVisibility"
              >
                <Transition name="eye-fade" mode="out-in">
                  <FormEyeIcon
                    :key="showPassword ? 'visible' : 'hidden'"
                    :is-visible="showPassword"
                  />
                </Transition>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-5 py-3 rounded-xl bg-primary text-white hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <template v-if="isLoading">
              <Icon
                name="svg-spinners:ring-resize"
                class="size-5"
              />
              Signing In...
            </template>
            <template v-else>
              Sign In
              <Icon
                name="material-symbols:arrow-forward"
                class="size-5 transition-transform group-hover:translate-x-1"
              />
            </template>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.eye-fade-enter-active,
.eye-fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.eye-fade-enter-from,
.eye-fade-leave-to {
  opacity: 0;
}
</style>
