<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id?: string;
    name?: string;
    label?: string;
    modelValue?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string | { message: string } | unknown;
    hint?: string;
    options: { value: string; label: string; description?: string }[];
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
  'update:modelValue': [value: string];
  blur: [];
}>();

const isSelected = (optionValue: string) => props.modelValue === optionValue;
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="id" class="text-base font-medium text-text">
      {{ label }}
      <span v-if="!required" class="text-subtle text-sm font-normal ml-1"
        >(Optional)</span
      >
    </label>
    <p v-if="hint" class="text-sm text-subtle">
      {{ hint }}
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <label
        v-for="option in options"
        :key="option.value"
        class="relative flex flex-col items-start p-4 border-2 rounded-xl cursor-pointer transition-all"
        :class="[
          isSelected(option.value)
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
      >
        <input
          type="radio"
          :name="name"
          :value="option.value"
          :checked="isSelected(option.value)"
          :disabled="disabled"
          class="sr-only"
          @change="$emit('update:modelValue', option.value)"
          @blur="$emit('blur')"
        />
        <!-- Radio indicator -->
        <span
          class="absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
          :class="
            isSelected(option.value)
              ? 'border-primary bg-primary'
              : 'border-border'
          "
        >
          <span
            v-if="isSelected(option.value)"
            class="w-2 h-2 rounded-full bg-white"
          ></span>
        </span>
        <!-- Content -->
        <span class="text-base font-medium text-text pr-8">{{
          option.label
        }}</span>
        <span v-if="option.description" class="text-sm text-subtle mt-1">{{
          option.description
        }}</span>
      </label>
    </div>
    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>
