<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id?: string;
    name?: string;
    label?: string;
    modelValue?: string[];
    required?: boolean;
    disabled?: boolean;
    error?: string | { message: string } | unknown;
    hint?: string;
    options: { value: string; label: string }[];
    columns?: 1 | 2 | 3;
  }>(),
  {
    required: true,
    columns: 2,
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

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  blur: [];
}>();

const handleChange = (optionValue: string, checked: boolean) => {
  const currentValue = props.modelValue || [];
  const newValue = checked
    ? [...currentValue, optionValue]
    : currentValue.filter((v) => v !== optionValue);
  emit('update:modelValue', newValue);
};

const isChecked = (optionValue: string) => {
  return props.modelValue?.includes(optionValue) ?? false;
};

const gridCols = computed(() => {
  switch (props.columns) {
    case 1:
      return 'grid-cols-1';
    case 3:
      return 'grid-cols-1 sm:grid-cols-3';
    default:
      return 'grid-cols-1 sm:grid-cols-2';
  }
});
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
    <div class="grid gap-2" :class="gridCols">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-center gap-2 cursor-pointer"
        :class="{ 'cursor-not-allowed opacity-50': disabled }"
      >
        <input
          type="checkbox"
          :name="name"
          :value="option.value"
          :checked="isChecked(option.value)"
          :disabled="disabled"
          class="w-4 h-4 border-2 border-border rounded focus:ring-primary focus:ring-2 accent-primary cursor-pointer disabled:cursor-not-allowed"
          @change="handleChange(option.value, ($event.target as HTMLInputElement).checked)"
          @blur="$emit('blur')"
        />
        <span class="text-sm text-text">{{ option.label }}</span>
      </label>
    </div>
    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>
