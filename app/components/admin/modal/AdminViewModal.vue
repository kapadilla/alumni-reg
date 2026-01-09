<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title: string;
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

// Close on Escape key
// Close on Escape key
onMounted(() => {
  document.addEventListener("keydown", onKeydown);
  if (props.modelValue) {
    document.body.style.overflow = "hidden";
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.modelValue) {
    close();
  }
};

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm"
          @click="close"
        ></div>

        <!-- Modal Panel -->
        <div
          class="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-surface rounded-xl border border-border shadow-2xl overflow-hidden"
        >
          <!-- Loading Overlay -->
          <div
            v-if="loading"
            class="absolute inset-0 z-10 bg-surface/50 backdrop-blur-[1px] flex items-center justify-center"
          >
            <Icon
              name="svg-spinners:ring-resize"
              class="size-10 text-primary"
            />
          </div>

          <!-- Header -->
          <div
            class="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-surface"
          >
            <h3 class="text-lg font-semibold text-text">{{ title }}</h3>
            <button
              @click="close"
              class="p-2 -mr-2 text-subtle hover:text-text hover:bg-background rounded-lg transition-colors"
            >
              <Icon name="material-symbols:close" class="size-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-border bg-background/50 shrink-0 flex items-center justify-end gap-3"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
