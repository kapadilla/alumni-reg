<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id?: string;
    name?: string;
    label?: string;
    modelValue?: boolean;
    required?: boolean;
    disabled?: boolean;
    error?: string | { message: string } | unknown;
    hint?: string;
  }>(),
  {
    required: true,
  }
);

// Extract error message from various error formats
const errorMessage = computed(() => {
  if (!props.error) return undefined;
  if (typeof props.error === 'string') return props.error;
  if (
    typeof props.error === 'object' &&
    props.error !== null &&
    'message' in props.error
  ) {
    return (props.error as { message: string }).message;
  }
  return String(props.error);
});

defineEmits<{
  'update:modelValue': [value: boolean];
  blur: [];
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      class="flex items-center gap-3 cursor-pointer select-none"
      :class="{ 'cursor-not-allowed opacity-50': disabled }"
    >
      <!-- Custom Checkbox -->
      <div class="relative shrink-0">
        <input
          :id="id"
          :name="name"
          type="checkbox"
          :checked="modelValue"
          :required="required"
          :disabled="disabled"
          class="peer sr-only"
          @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
          @blur="$emit('blur')"
        />
        <!-- Checkbox box -->
        <div
          class="w-5 h-5 border-2 rounded transition-colors duration-150 peer-disabled:cursor-not-allowed"
          :class="[
            modelValue
              ? 'bg-primary border-primary'
              : 'bg-surface border-border peer-hover:border-primary/50',
            errorMessage ? 'border-red-500' : ''
          ]"
        >
          <!-- Animated checkmark -->
          <svg
            class="w-full h-full text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M5 13l4 4L19 7"
              class="checkmark-path"
              :class="modelValue ? 'animate-check' : 'opacity-0'"
            />
          </svg>
        </div>
      </div>
      <span class="text-sm text-text leading-tight">
        <slot>{{ label }}</slot>
        <span v-if="!required" class="text-subtle text-sm font-normal ml-1">(Optional)</span>
      </span>
    </label>
    <p v-if="hint" class="text-sm text-subtle ml-8">
      {{ hint }}
    </p>
    <p v-if="errorMessage" class="text-sm text-red-500 ml-8">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.checkmark-path {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset 0.2s ease-out, opacity 0.1s ease-out;
}

.animate-check {
  stroke-dashoffset: 0;
  opacity: 1;
}
</style>
