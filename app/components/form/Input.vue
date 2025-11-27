<script setup lang="ts">
defineProps<{
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  modelValue?: string;
  required?: boolean;
  error?: string;
  hint?: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
  blur: [];
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-base font-medium text-text">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <p v-if="hint" class="text-sm text-subtle">
      {{ hint }}
    </p>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      class="px-4 py-2.5 border-2 border-border rounded-lg bg-surface text-text placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
      :class="{ 'border-red-500 focus:border-red-500': error }"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      @blur="$emit('blur')"
    />
    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>
