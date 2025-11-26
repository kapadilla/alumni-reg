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
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-text">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      class="px-3 py-2 border border-border rounded-lg bg-surface text-text placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      @blur="$emit('blur')"
    />
    <span v-if="error" class="text-sm text-red-500">{{ error }}</span>
    <span v-if="hint" class="text-xs text-subtle">{{ hint }}</span>
  </div>
</template>
