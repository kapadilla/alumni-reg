<script setup lang="ts">
import { format } from "date-fns";

interface Props {
  modelValue: boolean;
  memberName?: string;
  memberEmail?: string;
  memberSince?: string;
}

const props = defineProps<Props>();

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  try {
    return format(new Date(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
};

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [data: { reason: string; notes?: string }];
}>();

const reason = ref("");
const notes = ref("");

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleSubmit = () => {
  if (!reason.value.trim()) return;
  emit("confirm", { reason: reason.value.trim(), notes: notes.value.trim() || undefined });
};

const handleClose = () => {
  reason.value = "";
  notes.value = "";
  isOpen.value = false;
};

watch(isOpen, (open) => {
  if (!open) {
    reason.value = "";
    notes.value = "";
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <Transition name="scale">
          <div
            v-if="isOpen"
            class="bg-surface rounded-xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
          >
            <!-- Header -->
            <div class="p-6 border-b border-border">
              <div class="flex items-center gap-3 mb-4">
                <div class="size-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <Icon name="material-symbols:cancel" class="size-5" />
                </div>
                <h3 class="text-lg font-semibold text-text">Revoke Membership</h3>
              </div>
              <div class="bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3">
                <p class="font-semibold text-text">{{ memberName }}</p>
                <p class="text-sm text-subtle mt-0.5">{{ memberEmail }}</p>
                <p class="text-xs text-subtle mt-1">Member since {{ formatDate(memberSince) }}</p>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4 overflow-y-auto flex-1">
              <p class="text-sm text-subtle">
                This will revoke the member's access and mark their membership as inactive.
                An audit entry will be recorded in their membership history.
              </p>

              <div>
                <label class="block text-sm font-medium text-text mb-2">
                  Reason for revocation
                </label>
                <input
                  v-model="reason"
                  type="text"
                  class="w-full px-4 py-2 text-sm bg-background border-2 border-border rounded-lg text-text placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-text mb-2">
                  Additional notes <span class="text-subtle">(Optional)</span>
                </label>
                <textarea
                  v-model="notes"
                  class="w-full px-4 py-2 text-sm bg-background border-2 border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors resize-none min-h-[80px]"
                  style="field-sizing: content;"
                />
              </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                class="px-4 py-2 text-sm text-subtle hover:text-text hover:bg-background rounded-lg transition-colors"
                @click="handleClose"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!reason.trim()"
                @click="handleSubmit"
              >
                Revoke Membership
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
