<script setup lang="ts">
import type { ApplicantDetails } from "~/types";
import { useScrollLock } from "@vueuse/core";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Rejected Applications - UP Cebu Alumni Association",
});


const {
  rejectedApplicants,
  pagination,
  loading,
  fetchRejected,
  getRejectedDetails,
  exportRejectedCSV,
} = useRejected();

// View details state
const showDetailsModal = ref(false);
const selectedApplicant = ref<ApplicantDetails | null>(null);
const detailsLoading = ref(false);

const isLocked = useScrollLock(typeof document !== 'undefined' ? document.body : null);

const handleView = async (id: number) => {
  detailsLoading.value = true;
  try {
    const details = await getRejectedDetails(id);
    if (details) {
      selectedApplicant.value = details;
      showDetailsModal.value = true;
      isLocked.value = true;
    }
  } finally {
    detailsLoading.value = false;
  }
};

// Unlock scroll when modal closes
watch(showDetailsModal, (val) => {
  isLocked.value = val;
});

const { filterOptions, fetchFilterOptions } = useFilterOptions();

// Filter state
const search = ref("");
const ordering = ref("-rejected_at");
const dateRange = ref<{ from: string | null; to: string | null }>({ from: null, to: null });
const rejectedDateRange = ref<{ from: string | null; to: string | null }>({ from: null, to: null });
const rejectionStage = ref("");
const degreeProgram = ref("");
const yearGraduated = ref("");

// Sort options
const sortOptions = [
  { value: "-rejected_at", label: "Rejected At (Newest)" },
  { value: "rejected_at", label: "Rejected At (Oldest)" },
  { value: "first_name", label: "Name (A-Z)" },
  { value: "-first_name", label: "Name (Z-A)" },
  { value: "email", label: "Email (A-Z)" },
  { value: "-email", label: "Email (Z-A)" },
];

// Filter config - rejected page has additional filters
const filterConfig = {
  showDateRange: true,
  showDegreeProgram: true,
  showYearGraduated: true,
  showRejectionStage: true,
  showRejectedDateRange: true,
  sortOptions,
  dateRangeLabel: "Date Applied",
};

// Fetch data
const refreshData = () => {
  fetchRejected({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    rejected_from: rejectedDateRange.value.from || undefined,
    rejected_to: rejectedDateRange.value.to || undefined,
    rejection_stage: rejectionStage.value as "alumni_verification" | "payment_verification" | undefined || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    page: pagination.value.currentPage,
    limit: pagination.value.limit,
  });
};

// Handle sort from column header
const handleSort = (field: string, direction: "asc" | "desc") => {
  ordering.value = direction === "desc" ? `-${field}` : field;
  refreshData();
};

// Handle page change
const handlePageChange = (page: number) => {
  fetchRejected({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    rejected_from: rejectedDateRange.value.from || undefined,
    rejected_to: rejectedDateRange.value.to || undefined,
    rejection_stage: rejectionStage.value as "alumni_verification" | "payment_verification" | undefined || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    page,
    limit: pagination.value.limit,
  });
};

// Handle limit change
const handleLimitChange = (limit: number) => {
  fetchRejected({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    rejected_from: rejectedDateRange.value.from || undefined,
    rejected_to: rejectedDateRange.value.to || undefined,
    rejection_stage: rejectionStage.value as "alumni_verification" | "payment_verification" | undefined || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    page: 1,
    limit,
  });
};

// Handle clear filters
const handleClearFilters = () => {
  search.value = "";
  ordering.value = "-rejected_at";
  dateRange.value = { from: null, to: null };
  rejectedDateRange.value = { from: null, to: null };
  rejectionStage.value = "";
  degreeProgram.value = "";
  yearGraduated.value = "";
  fetchRejected({ ordering: "-rejected_at" });
};

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Helper to format date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// Helper for rejection stage text
const formatRejectionStage = (stage?: string) => {
    if (!stage) return 'Rejected';
    return stage
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// Helper for rejection stage color
const getStageColor = (stage?: string) => {
    if (!stage) return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
    
    const lowerStage = stage.toLowerCase().replace(/_/g, " ");
    if (lowerStage.includes("alumni verification")) {
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200";
    }
    return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
};

onMounted(() => {
  fetchFilterOptions();
  fetchRejected({ ordering: ordering.value });
});
</script>

<template>
  <div class="p-4 md:p-8 w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
        Rejected Applicants
      </h1>
      <p class="text-subtle text-sm md:text-base">
        View applicants who were rejected during the verification process
      </p>
    </div>

    <!-- Table Card -->
    <div
      class="bg-surface rounded-xl border border-border overflow-hidden max-w-full"
    >
      <!-- Table header -->
      <div
        class="p-4 md:p-6 border-b border-border flex items-center justify-between"
      >
        <h2
          class="text-lg font-semibold text-text flex items-center gap-3 leading-none"
        >
          Rejected Applications
          <span
            class="text-xs font-semibold size-6 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center -translate-y-px"
          >
            {{ pagination.totalItems }}
          </span>
        </h2>
        <button
          class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          @click="exportRejectedCSV"
        >
          Export CSV
        </button>
      </div>

      <!-- Filters -->
      <AdminTableFilters
        v-model:search="search"
        v-model:ordering="ordering"
        v-model:date-range="dateRange"
        v-model:degree-program="degreeProgram"
        v-model:year-graduated="yearGraduated"
        v-model:rejection-stage="rejectionStage"
        v-model:rejected-date-range="rejectedDateRange"
        :filter-options="filterOptions"
        :config="filterConfig"
        @search="refreshData"
        @clear="handleClearFilters"
      />

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <Icon name="svg-spinners:ring-resize" class="size-8 text-primary mx-auto mb-4" />
        <p class="text-subtle text-sm">Loading rejected applicants...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="rejectedApplicants.length === 0"
        class="p-12 text-center"
      >
        <Icon
          name="material-symbols:thumb-up"
          class="size-12 text-secondary mx-auto mb-4"
        />
        <p class="text-text font-medium mb-1">No rejections</p>
        <p class="text-subtle text-sm">All applicants have been verified successfully</p>
      </div>

      <!-- Table with horizontal scroll -->
      <AdminScrollContainer v-else>
        <table class="w-full min-w-[1000px]">
            <thead class="bg-background sticky top-0 z-10">
              <tr>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  ID
                </th>
                <AdminSortableHeader
                  label="Name"
                  field="first_name"
                  :current-sort="ordering"
                  @sort="handleSort"
                />
                <AdminSortableHeader
                  label="Email"
                  field="email"
                  :current-sort="ordering"
                  @sort="handleSort"
                />
                <AdminSortableHeader
                  label="Rejected At"
                  field="rejected_at"
                  :current-sort="ordering"
                  @sort="handleSort"
                />
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Rejection Stage
                </th>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Reason
                </th>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="applicant in rejectedApplicants"
                :key="applicant.id"
                class="group hover:bg-background transition-all duration-200 cursor-pointer active:scale-[0.99] [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
                @click="handleView(applicant.id)"
              >
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                  {{ applicant.id }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-text"
                >
                  {{ applicant.name }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
                >
                  {{ applicant.email }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
                >
                  {{ formatDate(applicant.rejectedAt) }}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStageColor(applicant.rejectionStage)"
                  >
                    {{ formatRejectionStage(applicant.rejectionStage) }}
                  </span>
                </td>
                <td class="px-4 md:px-6 py-4 text-sm text-text max-w-xs truncate" :title="applicant.reason">
                  {{ applicant.reason }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium"
                >
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-subtle hover:bg-background hover:text-text transition-all duration-200 active:scale-95"
                    title="View Details"
                    @click.stop="handleView(applicant.id)"
                  >
                    <Icon name="material-symbols:visibility" class="size-3.5" />
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
      </AdminScrollContainer>

      <!-- Pagination -->
      <AdminTablePagination
        v-if="!loading && rejectedApplicants.length > 0"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        :total-items="pagination.totalItems"
        :limit="pagination.limit"
        @page-change="handlePageChange"
        @limit-change="handleLimitChange"
      />
    </div>

    <!-- Scroll to Top -->
    <div
      v-if="!loading && rejectedApplicants.length > 0"
      class="flex justify-center py-6"
    >
      <button
        class="inline-flex items-center gap-2 px-4 py-2 text-sm text-subtle hover:text-text rounded-lg hover:bg-surface transition-colors"
        @click="scrollToTop"
      >
        <Icon name="material-symbols:arrow-upward" class="size-4" />
        Scroll to Top
      </button>
    </div>
  </div>


  <!-- Details Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showDetailsModal"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showDetailsModal = false"
      >
        <Transition name="scale">
          <div
            v-if="showDetailsModal"
            class="bg-surface rounded-xl border border-border shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
          >
            <!-- Modal Header with Close -->
            <div class="absolute top-4 right-4 z-10">
              <button
                class="size-8 rounded-lg bg-surface/50 hover:bg-surface border border-border/50 hover:border-border flex items-center justify-center text-subtle hover:text-text transition-colors backdrop-blur-sm"
                @click="showDetailsModal = false"
              >
                <Icon name="material-symbols:close" class="size-5" />
              </button>
            </div>

            <AdminViewRejectedApplicantDetails 
              class="flex-1 min-h-0"
              :applicant="selectedApplicant" 
              @close="showDetailsModal = false"
            />
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
