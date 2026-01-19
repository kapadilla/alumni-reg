<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

interface FilterConfig {
  showDateRange?: boolean;
  showDegreeProgram?: boolean;
  showYearGraduated?: boolean;
  showCampus?: boolean;
  showProvince?: boolean;
  showMentorship?: boolean;
  showPaymentMethod?: boolean;
  showRejectionStage?: boolean;
  showRejectedDateRange?: boolean;
  sortOptions?: { value: string; label: string }[];
  dateRangeLabel?: string;
}

interface Props {
  search: string;
  ordering: string;
  dateRange: { from: string | null; to: string | null };
  degreeProgram: string;
  yearGraduated: string;
  campus?: string;
  province?: string;
  mentorship?: boolean | null;
  paymentMethod?: string;
  rejectionStage?: string;
  rejectedDateRange?: { from: string | null; to: string | null };
  filterOptions: {
    degreePrograms: string[];
    years: string[];
    campuses?: { value: string; label: string }[];
    provinces?: { value: string; label: string }[];
    paymentMethods?: { value: string; label: string }[];
    rejectionStages?: { value: string; label: string }[];
  };
  config: FilterConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:search": [value: string];
  "update:ordering": [value: string];
  "update:dateRange": [value: { from: string | null; to: string | null }];
  "update:degreeProgram": [value: string];
  "update:yearGraduated": [value: string];
  "update:campus": [value: string];
  "update:province": [value: string];
  "update:mentorship": [value: boolean | null];
  "update:paymentMethod": [value: string];
  "update:rejectionStage": [value: string];
  "update:rejectedDateRange": [
    value: { from: string | null; to: string | null },
  ];
  search: [];
  clear: [];
}>();

// Collapsible state
const isExpanded = ref(false);

// Local search for debouncing
const localSearch = ref(props.search);

// Local degree program for debouncing (now a text input)
const localDegreeProgram = ref(props.degreeProgram);

// Debounced search emit
const debouncedSearch = useDebounceFn(() => {
  emit("update:search", localSearch.value);
  emit("search");
}, 300);

// Debounced degree program emit
const debouncedDegreeProgram = useDebounceFn(() => {
  emit("update:degreeProgram", localDegreeProgram.value);
  emit("search");
}, 300);

watch(localSearch, () => {
  debouncedSearch();
});

watch(localDegreeProgram, () => {
  debouncedDegreeProgram();
});

// Sync local search when prop changes externally
watch(
  () => props.search,
  (newVal) => {
    if (newVal !== localSearch.value) {
      localSearch.value = newVal;
    }
  },
);

// Sync local degree program when prop changes externally
watch(
  () => props.degreeProgram,
  (newVal) => {
    if (newVal !== localDegreeProgram.value) {
      localDegreeProgram.value = newVal;
    }
  },
);

// Check if any advanced filters are active
const hasActiveFilters = computed(() => {
  return (
    props.dateRange.from ||
    props.dateRange.to ||
    props.degreeProgram ||
    props.yearGraduated ||
    props.campus ||
    props.province ||
    (props.mentorship !== null && props.mentorship !== undefined) ||
    props.paymentMethod ||
    props.rejectionStage ||
    props.rejectedDateRange?.from ||
    props.rejectedDateRange?.to
  );
});

// Handle ordering change
const handleOrderingChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:ordering", target.value);
  emit("search");
};

const handleYearChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:yearGraduated", target.value);
  emit("search");
};

const handleCampusChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:campus", target.value);
  emit("search");
};

const handleProvinceChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:province", target.value);
  emit("search");
};

const handleMentorshipChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  if (value === "") {
    emit("update:mentorship", null);
  } else {
    emit("update:mentorship", value === "true");
  }
  emit("search");
};

const handlePaymentMethodChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:paymentMethod", target.value);
  emit("search");
};

const handleRejectionStageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:rejectionStage", target.value);
  emit("search");
};

const handleDateRangeUpdate = (value: {
  from: string | null;
  to: string | null;
}) => {
  emit("update:dateRange", value);
  emit("search");
};

const handleRejectedDateRangeUpdate = (value: {
  from: string | null;
  to: string | null;
}) => {
  emit("update:rejectedDateRange", value);
  emit("search");
};

// Clear all filters
const clearFilters = () => {
  localSearch.value = "";
  localDegreeProgram.value = "";
  emit("update:search", "");
  emit("update:dateRange", { from: null, to: null });
  emit("update:degreeProgram", "");
  emit("update:yearGraduated", "");
  emit("update:campus", "");
  emit("update:province", "");
  emit("update:mentorship", null);
  emit("update:paymentMethod", "");
  emit("update:rejectionStage", "");
  emit("update:rejectedDateRange", { from: null, to: null });
  emit("clear");
};

// Get current sort direction for display
const currentSortField = computed(() => props.ordering.replace(/^-/, ""));
const currentSortDirection = computed(() =>
  props.ordering.startsWith("-") ? "desc" : "asc",
);
</script>

<template>
  <div class="p-4 md:p-6 border-b border-border space-y-4">
    <!-- Main row: Search + Filters toggle -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Prepend slot (e.g. status tabs) -->
      <slot name="prepend-filters" />

      <!-- Search input -->
      <div class="relative flex-1 min-w-[200px] max-w-md">
        <Icon
          name="material-symbols:search"
          class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-subtle"
        />
        <input
          v-model="localSearch"
          type="text"
          placeholder="Search by name or email..."
          class="w-full pl-9 pr-4 py-2 text-sm bg-background border-2 border-border rounded-lg text-text placeholder:text-subtle focus:outline-none focus:border-primary hover:border-subtle transition-colors"
        />
      </div>

      <!-- Filters toggle button -->
      <button
        class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors"
        :class="
          hasActiveFilters
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-background border-border text-subtle hover:text-text hover:bg-background'
        "
        @click="isExpanded = !isExpanded"
      >
        <Icon name="material-symbols:tune" class="size-4" />
        <span>Filters</span>
        <span v-if="hasActiveFilters" class="size-2 rounded-full bg-primary" />
        <Icon
          name="material-symbols:expand-more"
          class="size-4 transition-transform"
          :class="isExpanded ? 'rotate-180' : ''"
        />
      </button>

      <!-- Clear filters (when active) -->
      <button
        v-if="hasActiveFilters || localSearch"
        class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-subtle hover:text-text rounded-lg hover:bg-background transition-colors"
        @click="clearFilters"
      >
        <Icon name="material-symbols:close" class="size-4" />
        Clear all
      </button>
    </div>

    <!-- Collapsible advanced filters -->
    <div
      class="grid transition-all duration-300 ease-in-out"
      :class="
        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      "
    >
      <div class="overflow-hidden">
        <div class="pt-4 border-t border-border/50">
          <div class="flex flex-wrap items-end gap-4">
            <!-- Sort dropdown -->
            <div v-if="config.sortOptions?.length" class="flex flex-col gap-1">
              <label class="text-xs font-medium text-subtle">Sort by</label>
              <select
                :value="ordering"
                class="px-3 py-2 text-sm bg-background border-2 border-border rounded-lg text-text focus:outline-none focus:border-primary hover:border-subtle transition-colors"
                @change="handleOrderingChange"
              >
                <option
                  v-for="opt in config.sortOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Date range -->
            <div v-if="config.showDateRange">
              <AdminDateRangePicker
                :model-value="dateRange"
                :label-from="(config.dateRangeLabel || 'Date') + ' From'"
                :label-to="(config.dateRangeLabel || 'Date') + ' To'"
                @update:model-value="handleDateRangeUpdate"
              />
            </div>

            <!-- Degree program (text input with debounce) -->
            <div v-if="config.showDegreeProgram" class="flex flex-col gap-1">
              <label class="text-xs font-medium text-subtle"
                >Degree Program</label
              >
              <input
                v-model="localDegreeProgram"
                type="text"
                placeholder="Search program..."
                class="px-3 py-2 text-sm bg-background border-2 border-border rounded-lg text-text placeholder:text-subtle focus:outline-none focus:border-primary hover:border-subtle transition-colors min-w-[180px]"
              />
            </div>

            <!-- Year graduated -->
            <div v-if="config.showYearGraduated" class="flex flex-col gap-1">
              <label class="text-xs font-medium text-subtle"
                >Year Graduated</label
              >
              <select
                :value="yearGraduated"
                class="px-3 py-2 text-sm bg-background border-2 border-border rounded-lg text-text focus:outline-none focus:border-primary hover:border-subtle transition-colors"
                @change="handleYearChange"
              >
                <option value="">All Years</option>
                <option
                  v-for="year in filterOptions.years"
                  :key="year"
                  :value="year"
                >
                  {{ year }}
                </option>
              </select>
            </div>

            <!-- Campus -->
            <div v-if="config.showCampus" class="flex flex-col gap-1">
              <label class="text-xs font-medium text-subtle">Campus</label>
              <select
                :value="campus"
                class="px-3 py-2 text-sm bg-background border-2 border-border rounded-lg text-text focus:outline-none focus:border-primary hover:border-subtle transition-colors"
                @change="handleCampusChange"
              >
                <option value="">All Campuses</option>
                <option
                  v-for="opt in filterOptions.campuses"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Province -->
            <div v-if="config.showProvince" class="flex flex-col gap-1">
              <label class="text-xs font-medium text-subtle">Province</label>
              <select
                :value="province"
                class="px-3 py-2 text-sm bg-background border-2 border-border rounded-lg text-text focus:outline-none focus:border-primary hover:border-subtle transition-colors min-w-[180px]"
                @change="handleProvinceChange"
              >
                <option value="">All Provinces</option>
                <option
                  v-for="opt in filterOptions.provinces"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Mentorship toggle -->
            <div v-if="config.showMentorship" class="flex flex-col gap-1">
              <label class="text-xs font-medium text-subtle">Mentorship</label>
              <select
                :value="
                  mentorship === null || mentorship === undefined
                    ? ''
                    : String(mentorship)
                "
                class="px-3 py-2 text-sm bg-background border-2 border-border rounded-lg text-text focus:outline-none focus:border-primary hover:border-subtle transition-colors"
                @change="handleMentorshipChange"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <!-- Payment method -->
            <div v-if="config.showPaymentMethod" class="flex flex-col gap-1">
              <label class="text-xs font-medium text-subtle"
                >Payment Method</label
              >
              <select
                :value="paymentMethod"
                class="px-3 py-2 text-sm bg-background border-2 border-border rounded-lg text-text focus:outline-none focus:border-primary hover:border-subtle transition-colors"
                @change="handlePaymentMethodChange"
              >
                <option value="">All Methods</option>
                <option
                  v-for="opt in filterOptions.paymentMethods"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Rejection stage (rejected page only) -->
            <div v-if="config.showRejectionStage" class="flex flex-col gap-1">
              <label class="text-xs font-medium text-subtle"
                >Rejection Stage</label
              >
              <select
                :value="rejectionStage"
                class="px-3 py-2 text-sm bg-background border-2 border-border rounded-lg text-text focus:outline-none focus:border-primary hover:border-subtle transition-colors"
                @change="handleRejectionStageChange"
              >
                <option value="">All Stages</option>
                <option
                  v-for="stage in filterOptions.rejectionStages"
                  :key="stage.value"
                  :value="stage.value"
                >
                  {{ stage.label }}
                </option>
              </select>
            </div>

            <!-- Rejected date range (rejected page only) -->
            <div v-if="config.showRejectedDateRange">
              <AdminDateRangePicker
                :model-value="rejectedDateRange || { from: null, to: null }"
                label-from="Rejected From"
                label-to="Rejected To"
                @update:model-value="handleRejectedDateRangeUpdate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
