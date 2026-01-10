<script setup lang="ts">
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

interface Props {
  modelValue: { from: string | null; to: string | null };
  labelFrom?: string;
  labelTo?: string;
}

const props = withDefaults(defineProps<Props>(), {
  labelFrom: "From",
  labelTo: "To",
});

const emit = defineEmits<{
  "update:modelValue": [value: { from: string | null; to: string | null }];
}>();

const fromDate = computed({
  get: () => props.modelValue?.from ? new Date(props.modelValue.from) : null,
  set: (val: Date | null) => {
    const toValue: string | null = props.modelValue?.to ?? null;
    emit("update:modelValue", {
      from: val ? val.toISOString().split("T")[0]! : null,
      to: toValue,
    });
  },
});

const toDate = computed({
  get: () => props.modelValue?.to ? new Date(props.modelValue.to) : null,
  set: (val: Date | null) => {
    const fromValue: string | null = props.modelValue?.from ?? null;
    emit("update:modelValue", {
      from: fromValue,
      to: val ? val.toISOString().split("T")[0]! : null,
    });
  },
});

const clearDates = () => {
  emit("update:modelValue", { from: null, to: null });
};

const hasValue = computed(() => props.modelValue?.from || props.modelValue?.to);

// Check for dark mode
const isDark = computed(() => {
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark");
  }
  return false;
});
</script>

<template>
  <div class="flex flex-wrap items-end gap-3">
    <div class="flex flex-col gap-1">
      <label class="text-xs font-medium text-subtle">{{ labelFrom }}</label>
      <VueDatePicker
        v-model="fromDate"
        :dark="isDark"
        :enable-time-picker="false"
        auto-apply
        placeholder="Select date"
        class="date-picker-input"
        :max-date="toDate || undefined"
        teleport="body"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-xs font-medium text-subtle">{{ labelTo }}</label>
      <VueDatePicker
        v-model="toDate"
        :dark="isDark"
        :enable-time-picker="false"
        auto-apply
        placeholder="Select date"
        class="date-picker-input"
        :min-date="fromDate || undefined"
        teleport="body"
      />
    </div>
    <button
      v-if="hasValue"
      class="p-2 text-subtle hover:text-text hover:bg-background rounded-lg transition-colors"
      title="Clear dates"
      @click="clearDates"
    >
      <Icon name="material-symbols:close" class="size-4" />
    </button>
  </div>
</template>

<style>
/* Custom styling for VueDatePicker to match project theme */
.date-picker-input {
  --dp-font-family: var(--font-sans);
  --dp-border-radius: 0.5rem;
  --dp-cell-border-radius: 0.375rem;
  --dp-font-size: 0.875rem;
  --dp-preview-font-size: 0.75rem;
  --dp-time-font-size: 0.75rem;
}

.date-picker-input .dp__input {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem; /* Increased left padding for icon */
  border-radius: 0.5rem;
  border-width: 2px;
  border-color: var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.15s ease;
}

.date-picker-input .dp__input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.date-picker-input .dp__input:hover:not(:focus) {
  border-color: var(--color-subtle);
}

.date-picker-input .dp__input::placeholder {
  color: var(--color-subtle);
}

/* Calendar popup styling */
.dp__theme_light,
.dp__theme_dark {
  --dp-font-family: "Inter", sans-serif;
  --dp-primary-color: var(--color-primary);
  --dp-primary-text-color: #ffffff;
}

/* Ensure calendar popup has high z-index to avoid overlap */
.dp__menu {
  z-index: 50 !important;
}
</style>
