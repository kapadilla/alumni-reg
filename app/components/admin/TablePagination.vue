<script setup lang="ts">
interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  pageChange: [page: number];
  limitChange: [limit: number];
}>();

const limitOptions = [10, 20, 50, 100];

const startItem = computed(() => {
  if (props.totalItems === 0) return 0;
  return (props.currentPage - 1) * props.limit + 1;
});

const endItem = computed(() => {
  return Math.min(props.currentPage * props.limit, props.totalItems);
});

const canGoPrev = computed(() => props.currentPage > 1);
const canGoNext = computed(() => props.currentPage < props.totalPages);

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("pageChange", page);
  }
};

const handleLimitChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("limitChange", Number(target.value));
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-between gap-3 sm:gap-4 px-4 md:px-6 py-3 sm:py-4 border-t border-border bg-surface"
  >
    <!-- Items info - Full width on mobile, centered -->
    <div
      class="text-sm text-subtle text-center sm:text-left w-full sm:w-auto order-1"
    >
      <span v-if="totalItems > 0">
        Showing <span class="font-medium text-text">{{ startItem }}</span> to
        <span class="font-medium text-text">{{ endItem }}</span> of
        <span class="font-medium text-text">{{ totalItems }}</span> results
      </span>
      <span v-else>No results</span>
    </div>

    <!-- Controls container - Full width on mobile -->
    <div
      class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto order-2"
    >
      <!-- Items per page - Centered on mobile -->
      <div class="flex items-center gap-2 text-sm">
        <label for="limit-select" class="text-subtle whitespace-nowrap"
          >Per page:</label
        >
        <select
          id="limit-select"
          :value="limit"
          class="px-3 py-2 text-sm bg-background border-2 border-border rounded-lg text-text focus:outline-none focus:border-primary hover:border-subtle transition-colors min-w-[70px]"
          @change="handleLimitChange"
        >
          <option v-for="opt in limitOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>

      <!-- Page navigation - Centered on mobile with larger touch targets -->
      <div class="flex items-center gap-1">
        <button
          :disabled="!canGoPrev"
          class="p-2 sm:p-1.5 rounded-lg border border-border text-subtle hover:bg-background hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
          title="First page"
          @click="goToPage(1)"
        >
          <Icon name="material-symbols:first-page" class="size-5 sm:size-4" />
        </button>
        <button
          :disabled="!canGoPrev"
          class="p-2 sm:p-1.5 rounded-lg border border-border text-subtle hover:bg-background hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
          title="Previous page"
          @click="goToPage(currentPage - 1)"
        >
          <Icon name="material-symbols:chevron-left" class="size-5 sm:size-4" />
        </button>

        <span
          class="px-4 sm:px-3 py-1 text-sm font-medium text-text min-w-20 sm:min-w-0 text-center"
        >
          {{ currentPage }} / {{ totalPages || 1 }}
        </span>

        <button
          :disabled="!canGoNext"
          class="p-2 sm:p-1.5 rounded-lg border border-border text-subtle hover:bg-background hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
          title="Next page"
          @click="goToPage(currentPage + 1)"
        >
          <Icon
            name="material-symbols:chevron-right"
            class="size-5 sm:size-4"
          />
        </button>
        <button
          :disabled="!canGoNext"
          class="p-2 sm:p-1.5 rounded-lg border border-border text-subtle hover:bg-background hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
          title="Last page"
          @click="goToPage(totalPages)"
        >
          <Icon name="material-symbols:last-page" class="size-5 sm:size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
