<script setup lang="ts">
defineProps<{
  id?: string;
  label?: string;
  placeholder?: string;
  modelValue?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
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
    <select
      :id="id"
      :value="modelValue"
      :required="required"
      class="px-3 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
      @blur="$emit('blur')"
    >
      <option value="" disabled selected>
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" class="text-sm text-red-500">{{ error }}</span>
    <span v-if="hint" class="text-xs text-subtle">{{ hint }}</span>
  </div>
</template>
