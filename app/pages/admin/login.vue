<script setup lang="ts">
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = () => {
  console.log("Login attempt:", {
    email: email.value,
    password: password.value,
  });
  // TODO: Implement login logic
};
</script>

<template>
  <div
    class="min-h-screen bg-background flex items-center justify-center py-8 px-4"
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
            class="w-full px-5 py-3 rounded-xl bg-primary text-white hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center gap-2 group"
          >
            Sign In
            <Icon
              name="material-symbols:arrow-forward"
              class="size-5 transition-transform group-hover:translate-x-1"
            />
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
