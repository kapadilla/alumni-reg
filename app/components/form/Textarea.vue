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
    rows?: number;
    maxlength?: string | number;
  }>(),
  {
    required: true,
    rows: 3,
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
    <textarea
      :id="id"
      :name="name"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      class="textarea-auto-resize px-4 py-2.5 border-2 border-border rounded-lg bg-surface text-text focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
      :class="{ 'border-red-500 focus:border-red-500': errorMessage }"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
      @blur="$emit('blur')"
    />
    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.textarea-auto-resize {
  field-sizing: content;
  min-height: calc(3 * 1.5em + 1.25rem); /* 3 rows minimum */
}
</style>
