<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    modelValue?: string;
    required?: boolean;
    disabled?: boolean;
    loading?: boolean;
    error?: string | { message: string } | unknown;
    hint?: string;
    options: { value: string; label: string }[];
  }>(),
  {
    required: true,
    placeholder: 'Select an option',
  }
);

defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
}>();

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
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-base font-medium text-text">
      {{ label }}
      <span v-if="!required" class="text-subtle text-sm font-normal ml-1"
        >(Optional)</span
      >
    </label>
    <p v-if="hint" class="text-sm text-subtle">
      {{ hint }}
    </p>
    <select
      :id="id"
      :name="name"
      :value="modelValue"
      :required="required"
      :disabled="disabled || loading"
      class="select-arrow px-4 py-2.5 border-2 border-border rounded-lg bg-surface text-text focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
      :class="{ 'border-red-500 focus:border-red-500': errorMessage }"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
      @blur="$emit('blur')"
    >
      <option value="" disabled selected class="text-subtle">
        {{ loading ? 'Loading...' : placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.select-arrow {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-size: 1.25rem;
}
</style>
