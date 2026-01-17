<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { CheckIcon } from '@heroicons/vue/20/solid';

const props = withDefaults(
  defineProps<{
    id?: string;
    name?: string;
    label?: string;
    modelValue?: string[];
    options: { value: string; label: string }[];
    required?: boolean;
    disabled?: boolean;
    error?: string | { message: string } | unknown;
    hint?: string;
    hasOther?: boolean;
    otherValue?: string;
  }>(),
  {
    required: true,
    modelValue: () => [],
    hasOther: false,
    otherValue: '',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  'update:otherValue': [value: string];
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

// Track if "other" is selected
const isOtherSelected = computed(() => props.modelValue?.includes('other') ?? false);

// Local state for the other input
const localOtherValue = ref(props.otherValue || '');

// Sync with prop
watch(() => props.otherValue, (newVal) => {
  localOtherValue.value = newVal || '';
});

// Toggle chip selection
const toggleChip = (value: string) => {
  if (props.disabled) return;
  
  const current = props.modelValue || [];
  const newValue = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  
  emit('update:modelValue', newValue);
};

// Check if chip is selected
const isSelected = (value: string) => props.modelValue?.includes(value) ?? false;

// Handle other input change
const handleOtherInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  localOtherValue.value = value;
  emit('update:otherValue', value);
};

// Handle blur on other input
const handleOtherBlur = () => {
  emit('update:otherValue', localOtherValue.value);
  emit('blur');
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :id="`${id}-label`" class="text-base font-medium text-text">
      {{ label }}
      <span v-if="!required" class="text-subtle text-sm font-normal ml-1">(Optional)</span>
    </label>
    <p v-if="hint" class="text-sm text-subtle">{{ hint }}</p>
    
    <!-- Chips Container -->
    <div class="flex flex-wrap gap-2" role="group" :aria-labelledby="`${id}-label`">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        :disabled="disabled"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
        :class="[
          isSelected(option.value)
            ? 'bg-primary text-white border-primary'
            : 'bg-surface text-text border-border hover:border-primary/50',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ]"
        @click="toggleChip(option.value)"
      >
        <CheckIcon 
          class="w-4 h-4 transition-all duration-150"
          :class="isSelected(option.value) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 w-0'"
        />
        {{ option.label }}
      </button>
      
      <!-- Other Chip -->
      <button
        v-if="hasOther"
        type="button"
        :disabled="disabled"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
        :class="[
          isOtherSelected
            ? 'bg-primary text-white border-primary'
            : 'bg-surface text-text border-border hover:border-primary/50',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ]"
        @click="toggleChip('other')"
      >
        <CheckIcon 
          class="w-4 h-4 transition-all duration-150"
          :class="isOtherSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 w-0'"
        />
        Other
      </button>
    </div>
    
    <!-- Other Input (with animation) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-24"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 max-h-24"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="hasOther && isOtherSelected" class="overflow-hidden">
        <div class="pt-2">
          <input
            :id="`${id}-other`"
            type="text"
            :value="localOtherValue"
            :disabled="disabled"
            placeholder="Please specify"
            class="w-full px-4 py-2 border-2 border-border rounded-lg text-text bg-surface focus:border-primary focus:outline-none transition-colors"
            @input="handleOtherInput"
            @blur="handleOtherBlur"
          />
          <p class="text-xs text-subtle mt-1">Separate multiple values with commas</p>
        </div>
      </div>
    </Transition>
    
    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>
