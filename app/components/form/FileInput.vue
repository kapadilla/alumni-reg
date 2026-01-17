<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id?: string;
    name?: string;
    label?: string;
    modelValue?: File | null;
    required?: boolean;
    disabled?: boolean;
    error?: string | { message: string } | unknown;
    hint?: string;
    accept?: string;
  }>(),
  {
    required: true,
    accept: 'image/*',
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
  'update:modelValue': [value: File | null];
  blur: [];
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;
  emit('update:modelValue', file);
};

const fileName = computed(() => props.modelValue?.name ?? '');
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
    <input
      :id="id"
      :name="name"
      type="file"
      :accept="accept"
      :required="required"
      :disabled="disabled"
      class="px-4 py-2.5 border-2 border-border rounded-lg bg-surface text-text focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
      :class="{ 'border-red-500 focus:border-red-500': errorMessage }"
      @change="handleChange"
      @blur="$emit('blur')"
    />
    <p v-if="fileName" class="text-sm text-subtle">
      Selected: {{ fileName }}
    </p>
    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>
