<script setup lang="ts">
defineProps<{
  stepLabel: string;
  title: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}>();
</script>

<template>
  <div class="flex flex-col lg:flex-none shrink-0 items-center lg:items-start">
    <div
      class="flex flex-col lg:flex-row items-center gap-0 lg:gap-3 w-full lg:w-auto"
    >
      <div
        class="size-10 lg:size-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-in-out shrink-0"
        :class="
          isActive
            ? 'bg-primary border-primary text-white'
            : isCompleted
            ? 'bg-secondary border-secondary text-white'
            : 'bg-surface border-border text-subtle'
        "
      >
        <Transition name="icon-swap" mode="out-in">
          <FormCheckmarkIcon
            v-if="isCompleted"
            key="check"
            size="size-5 lg:size-6"
          />
          <Icon v-else :key="icon" :name="icon" class="size-5 lg:size-6" />
        </Transition>
      </div>
      <!-- Mobile label -->
      <div class="flex lg:hidden flex-col items-center text-center mt-2">
        <span
          class="text-[10px] uppercase tracking-wide font-medium transition-colors duration-500"
          :class="
            isActive
              ? 'text-primary'
              : isCompleted
              ? 'text-secondary'
              : 'text-subtle'
          "
        >
          {{ stepLabel }}
        </span>
        <span
          class="text-[10px] font-semibold whitespace-nowrap transition-colors duration-500"
          :class="
            isActive
              ? 'text-primary font-bold'
              : isCompleted
              ? 'text-secondary'
              : 'text-subtle'
          "
        >
          {{ title }}
        </span>
      </div>
      <!-- Desktop label -->
      <div class="hidden lg:flex flex-col">
        <span
          class="text-xs uppercase tracking-wide font-medium transition-colors duration-500"
          :class="
            isActive
              ? 'text-primary'
              : isCompleted
              ? 'text-secondary'
              : 'text-subtle'
          "
        >
          {{ stepLabel }}
        </span>
        <span
          class="text-sm font-semibold transition-colors duration-500"
          :class="
            isActive
              ? 'text-primary font-bold'
              : isCompleted
              ? 'text-secondary'
              : 'text-subtle'
          "
        >
          {{ title }}
        </span>
      </div>
    </div>
    <!-- Vertical connector line for desktop -->
    <div
      v-if="!isLast"
      class="hidden lg:block w-1 h-12 ml-6 my-1 transition-colors duration-500"
      :class="isCompleted ? 'bg-secondary' : 'bg-border'"
    />
  </div>
</template>

<style scoped>
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.2s ease;
}

.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
}

.icon-swap-enter-to,
.icon-swap-leave-from {
  opacity: 1;
}
</style>
