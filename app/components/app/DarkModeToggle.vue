<script setup>
const isDark = ref(false);

onMounted(() => {
  // Check for saved preference or system preference
  const savedMode = localStorage.getItem("darkMode");

  if (savedMode !== null) {
    isDark.value = savedMode === "true";
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // Apply or remove dark class based on preference
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

function toggleDarkMode() {
  // Use View Transition API if available
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      isDark.value = !isDark.value;

      if (isDark.value) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("darkMode", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("darkMode", "false");
      }
    });
  } else {
    isDark.value = !isDark.value;

    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }
}
</script>

<template>
  <button
    class="p-2 rounded corner-squircle bg-surface border border-border hover:bg-background transition-colors"
    aria-label="Toggle dark mode"
    title="Toggle light/dark mode"
    @click="toggleDarkMode"
  >
    <Transition name="icon" mode="out-in">
      <svg
        v-if="isDark"
        key="moon"
        class="size-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      <svg
        v-else
        key="sun"
        class="size-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </Transition>
  </button>
</template>

<style scoped>
.icon-enter-active,
.icon-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.icon-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.icon-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.icon-enter-to,
.icon-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
