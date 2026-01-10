<script setup lang="ts">
interface Props {
  label: string;
  field: string;
  currentSort: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  sort: [field: string, direction: "asc" | "desc"];
}>();

const isActive = computed(() => {
  const sortField = props.currentSort.replace(/^-/, "");
  return sortField === props.field;
});

const isDescending = computed(() => props.currentSort.startsWith("-"));

const handleClick = () => {
  let newDirection: "asc" | "desc" = "asc";
  if (isActive.value) {
    // Toggle direction if already sorting by this field
    newDirection = isDescending.value ? "asc" : "desc";
  }
  emit("sort", props.field, newDirection);
};

const tooltipText = computed(() => {
  if (isActive.value) {
    return isDescending.value ? "Click to sort ascending" : "Click to sort descending";
  }
  return `Click to sort by ${props.label}`;
});
</script>

<template>
  <th
    class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider cursor-pointer hover:bg-surface-hover transition-colors select-none group"
    :title="tooltipText"
    @click="handleClick"
  >
    <div class="flex items-center gap-2">
      <span>{{ label }}</span>
      <!-- Active Sort Icon -->
      <span v-if="isActive" class="text-primary transition-transform duration-200" :class="{ 'rotate-180': isDescending }">
        <Icon name="material-symbols:arrow-upward" class="size-4" />
      </span>
      <!-- Inactive Sort Placeholder (visible on hover) -->
      <span v-else class="text-subtle/30 group-hover:text-subtle transition-colors">
        <Icon name="material-symbols:unfold-more" class="size-4" />
      </span>
    </div>
  </th>
</template>
