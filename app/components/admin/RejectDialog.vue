<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  title?: string;
  applicantName?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm", reason: string): void;
}>();

const reason = ref("");
const isSubmitting = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleConfirm = () => {
  if (!reason.value.trim()) return;
  emit("confirm", reason.value.trim());
  reason.value = "";
};

const handleClose = () => {
  isOpen.value = false;
  reason.value = "";
};

// Focus textarea when dialog opens
watch(isOpen, (open) => {
  if (open) {
    nextTick(() => {
      textareaRef.value?.focus();
    });
  }
});

// Close on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen.value) {
      handleClose();
    }
  };
  document.addEventListener("keydown", handleEscape);
  onUnmounted(() => document.removeEventListener("keydown", handleEscape));
});
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        />

        <!-- Dialog -->
        <div
          class="relative bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden"
        >
          <!-- Header -->
          <div class="p-6 pb-4">
            <div class="flex items-center gap-4">
              <div class="size-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <Icon name="material-symbols:cancel" class="size-7 text-red-500" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="text-lg font-semibold text-text">
                  {{ title || "Reject Application" }}
                </h2>
                <p v-if="applicantName" class="text-sm text-subtle mt-0.5">
                  {{ applicantName }}
                </p>
              </div>
              <button
                class="size-8 rounded-lg hover:bg-background flex items-center justify-center text-subtle hover:text-text transition-colors"
                @click="handleClose"
              >
                <Icon name="material-symbols:close" class="size-5" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 pb-6">
            <label class="block">
              <span class="text-sm font-medium text-text mb-2 block">
                Rejection Reason
              </span>
              <textarea
                ref="textareaRef"
                v-model="reason"
                class="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-text placeholder:text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                rows="4"
                placeholder="Please provide a reason for rejection..."
              />
            </label>
            <p class="text-xs text-subtle mt-2">
              This reason will be recorded in the application history.
            </p>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-background/50 border-t border-border flex items-center justify-end gap-3">
            <button
              class="px-4 py-2 text-sm font-medium rounded-xl border border-border text-text hover:bg-background transition-colors"
              @click="handleClose"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 text-sm font-medium rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              :disabled="!reason.trim()"
              @click="handleConfirm"
            >
              <Icon name="material-symbols:cancel" class="size-4" />
              Reject Application
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-active > div:last-child,
.dialog-leave-active > div:last-child {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}

.dialog-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>
