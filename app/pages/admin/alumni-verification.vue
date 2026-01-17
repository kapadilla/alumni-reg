<script setup lang="ts">
import type { ApplicantDetails } from "~/types";
import { useNetworkStatus } from "~/composables/useNetworkStatus";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Alumni Verification - UP Alumni Association - Cebu Chapter",
});


const {
  alumniApplicants,
  alumniPagination,
  loadingAlumni,
  fetchPendingAlumni,
  verifyAlumni,
  rejectAlumni,
  exportAlumniCSV,
  getAlumniDetails,
} = useVerification();

const { filterOptions, fetchFilterOptions } = useFilterOptions();
const { isOnline } = useNetworkStatus();

// Filter state
const search = ref("");
const ordering = ref("-date_applied");
const dateRange = ref<{ from: string | null; to: string | null }>({ from: null, to: null });
const degreeProgram = ref("");
const yearGraduated = ref("");

// Rejection dialog state
const showRejectDialog = ref(false);
const rejectingApplicant = ref<{ id: number; name: string } | null>(null);

// View details state
const showViewModal = ref(false);
const viewingApplicant = ref<ApplicantDetails | null>(null);
const loadingDetails = ref(false);

const handleView = async (id: number) => {
  showViewModal.value = true;
  loadingDetails.value = true;
  viewingApplicant.value = null; // Reset previous view
  try {
    viewingApplicant.value = await getAlumniDetails(id);
  } finally {
    loadingDetails.value = false;
  }
};

// Sort options
const sortOptions = [
  { value: "-date_applied", label: "Date Applied (Newest)" },
  { value: "date_applied", label: "Date Applied (Oldest)" },
  { value: "first_name", label: "Name (A-Z)" },
  { value: "-first_name", label: "Name (Z-A)" },
  { value: "email", label: "Email (A-Z)" },
  { value: "-email", label: "Email (Z-A)" },
];

// Filter config
const filterConfig = {
  showDateRange: true,
  showDegreeProgram: true,
  showYearGraduated: true,
  sortOptions,
  dateRangeLabel: "Date Applied",
};

// Fetch data
const refreshData = () => {
  fetchPendingAlumni({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    page: alumniPagination.value.currentPage,
    limit: alumniPagination.value.limit,
  });
};

// Handle sort from column header
const handleSort = (field: string, direction: "asc" | "desc") => {
  ordering.value = direction === "desc" ? `-${field}` : field;
  refreshData();
};

// Handle page change
const handlePageChange = (page: number) => {
  fetchPendingAlumni({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    page,
    limit: alumniPagination.value.limit,
  });
};

// Handle limit change
const handleLimitChange = (limit: number) => {
  fetchPendingAlumni({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    page: 1,
    limit,
  });
};

// Handle clear filters
const handleClearFilters = () => {
  search.value = "";
  ordering.value = "-date_applied";
  dateRange.value = { from: null, to: null };
  degreeProgram.value = "";
  yearGraduated.value = "";
  fetchPendingAlumni({ ordering: "-date_applied" });
};

// Verify alumni handler
const handleVerify = async (id: number) => {
  const success = await verifyAlumni(id);
  if (success) {
    refreshData();
  }
};

// Open reject dialog
const openRejectDialog = (id: number, name: string) => {
  rejectingApplicant.value = { id, name };
  showRejectDialog.value = true;
};

// Confirm rejection
const confirmReject = async (reason: string) => {
  if (!rejectingApplicant.value) return;
  const success = await rejectAlumni(rejectingApplicant.value.id, reason);
  if (success) {
    showRejectDialog.value = false;
    rejectingApplicant.value = null;
    refreshData();
  }
};

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  fetchFilterOptions();
  fetchPendingAlumni({ ordering: ordering.value });
});
</script>

<template>
  <div class="p-4 md:p-8 w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
        Alumni Verification
      </h1>
      <p class="text-subtle text-sm md:text-base">
        Verify that applicants are UP Cebu alumni before processing their membership
      </p>
    </div>

    <!-- Table Card -->
    <div
      class="bg-surface rounded-xl border border-border overflow-hidden max-w-full"
    >
      <!-- Table header -->
      <div
        class="p-4 md:p-6 border-b border-border flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <h2
          class="text-lg font-semibold text-text flex items-center gap-3 leading-none"
        >
          Pending Alumni Verification
          <span
            class="text-xs font-semibold size-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center -translate-y-px"
          >
            {{ alumniPagination.totalItems }}
          </span>
        </h2>
        <div class="flex items-center gap-2">
          <button
            class="size-9 flex items-center justify-center rounded-lg border border-border text-subtle hover:bg-background hover:text-text transition-colors"
            title="Refresh data"
            @click="refreshData"
          >
            <Icon name="material-symbols:refresh" class="size-4" />
          </button>
          <button
            class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            @click="exportAlumniCSV"
          >
            Export CSV
          </button>
        </div>
      </div>

      <!-- Filters -->
      <AdminTableFilters
        v-model:search="search"
        v-model:ordering="ordering"
        v-model:date-range="dateRange"
        v-model:degree-program="degreeProgram"
        v-model:year-graduated="yearGraduated"
        :filter-options="filterOptions"
        :config="filterConfig"
        @search="refreshData"
        @clear="handleClearFilters"
      />

      <!-- Offline State (Highest Priority) -->
      <AdminOfflineTableState v-if="!isOnline" />

      <!-- Loading State -->
      <div v-else-if="loadingAlumni" class="p-12 text-center">
        <Icon name="svg-spinners:ring-resize" class="size-8 text-primary mx-auto mb-4" />
        <p class="text-subtle text-sm">Loading pending verifications...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="alumniApplicants.length === 0" class="p-12 text-center">
        <Icon
          name="material-symbols:check-circle"
          class="size-12 text-secondary mx-auto mb-4"
        />
        <p class="text-text font-medium mb-1">All caught up!</p>
        <p class="text-subtle text-sm">No pending alumni verifications</p>
      </div>

      <!-- Table with horizontal scroll -->
      <AdminScrollContainer v-else>
        <table class="w-full min-w-[900px]">
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
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Degree Program
                </th>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Year Graduated
                </th>
                <AdminSortableHeader
                  label="Date Applied"
                  field="date_applied"
                  :current-sort="ordering"
                  @sort="handleSort"
                />
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="applicant in alumniApplicants"
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
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                  {{ applicant.degreeProgram }}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                  {{ applicant.yearGraduated }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
                >
                  {{ formatDate(applicant.dateApplied) }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium"
                >
                  <div class="flex items-center gap-2">
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all duration-200 active:scale-95"
                      @click.stop="handleVerify(applicant.id)"
                      title="Verify as Alumni"
                    >
                      <Icon name="material-symbols:check-circle" class="size-3.5" />
                      Verify
                    </button>
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all duration-200 active:scale-95"
                      @click.stop="openRejectDialog(applicant.id, applicant.name)"
                      title="Reject Application"
                    >
                      <Icon name="material-symbols:cancel" class="size-3.5" />
                      Reject
                    </button>
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-subtle hover:bg-background hover:text-text transition-all duration-200 active:scale-95"
                      @click.stop="handleView(applicant.id)"
                      title="View Details"
                    >
                      <Icon name="material-symbols:visibility" class="size-3.5" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
      </AdminScrollContainer>

      <!-- Pagination -->
      <AdminTablePagination
        v-if="!loadingAlumni && alumniApplicants.length > 0"
        :current-page="alumniPagination.currentPage"
        :total-pages="alumniPagination.totalPages"
        :total-items="alumniPagination.totalItems"
        :limit="alumniPagination.limit"
        @page-change="handlePageChange"
        @limit-change="handleLimitChange"
      />
    </div>

    <!-- Scroll to Top -->
    <div
      v-if="!loadingAlumni && alumniApplicants.length > 0"
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

    <!-- Reject Dialog -->
    <AdminRejectDialog
      v-model="showRejectDialog"
      title="Reject Alumni Verification"
      :applicant-name="rejectingApplicant?.name"
      @confirm="confirmReject"
    />

    <!-- View Modal -->
    <AdminModalAdminViewModal
      v-model="showViewModal"
      title="Verification Details"
      :loading="loadingDetails"
    >
      <AdminViewAlumniDetails :applicant="viewingApplicant" />
      
      <template #footer>
        <div class="flex items-center gap-2 w-full">
           <template v-if="viewingApplicant">
             <button
               class="px-4 py-2 text-sm text-subtle hover:text-text hover:bg-background rounded-lg transition-colors mr-auto"
               @click="showViewModal = false"
             >
               Close
             </button>
             
             <button
               class="px-4 py-2 text-sm text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
               @click="openRejectDialog(viewingApplicant.id, `${viewingApplicant.personalDetails.firstName} ${viewingApplicant.personalDetails.lastName}`); showViewModal = false;"
             >
               Reject
             </button>
             
             <button
               class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
               @click="handleVerify(viewingApplicant.id); showViewModal = false;"
             >
               Verify Application
             </button>
           </template>
           <button
             v-else
             class="px-4 py-2 text-sm text-subtle hover:text-text hover:bg-background rounded-lg transition-colors ml-auto"
             @click="showViewModal = false"
           >
             Close
           </button>
        </div>
      </template>
    </AdminModalAdminViewModal>
  </div>
</template>
