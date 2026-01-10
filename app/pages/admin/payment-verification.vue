<script setup lang="ts">
import type { ApplicantDetails } from "~/types";
import { useNetworkStatus } from "~/composables/useNetworkStatus";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Payment Verification - UP Cebu Alumni Association",
});


const {
  paymentApplicants,
  paymentPagination,
  loadingPayment,
  fetchPendingPayments,
  confirmPayment,
  rejectPayment,
  exportPaymentsCSV,
  getPaymentDetails,
} = useVerification();

const { filterOptions, fetchFilterOptions } = useFilterOptions();
const { isOnline } = useNetworkStatus();

// Filter state
const search = ref("");
const ordering = ref("-alumni_verified_at");
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
  viewingApplicant.value = null;
  try {
    viewingApplicant.value = await getPaymentDetails(id);
  } finally {
    loadingDetails.value = false;
  }
};

// Sort options
const sortOptions = [
  { value: "-alumni_verified_at", label: "Alumni Verified (Newest)" },
  { value: "alumni_verified_at", label: "Alumni Verified (Oldest)" },
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
  fetchPendingPayments({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    page: paymentPagination.value.currentPage,
    limit: paymentPagination.value.limit,
  });
};

// Handle sort from column header
const handleSort = (field: string, direction: "asc" | "desc") => {
  ordering.value = direction === "desc" ? `-${field}` : field;
  refreshData();
};

// Handle page change
const handlePageChange = (page: number) => {
  fetchPendingPayments({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    page,
    limit: paymentPagination.value.limit,
  });
};

// Handle limit change
const handleLimitChange = (limit: number) => {
  fetchPendingPayments({
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
  ordering.value = "-alumni_verified_at";
  dateRange.value = { from: null, to: null };
  degreeProgram.value = "";
  yearGraduated.value = "";
  fetchPendingPayments({ ordering: "-alumni_verified_at" });
};

// Confirm payment handler
const handleConfirm = async (id: number) => {
  const success = await confirmPayment(id);
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
  const success = await rejectPayment(rejectingApplicant.value.id, reason);
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

// Payment method chip styling
const getPaymentMethodChip = (method: string | undefined) => {
  const lower = (method || "").toLowerCase();
  if (lower === "gcash") {
    return {
      label: "GCash",
      class: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
  }
  if (lower === "bank") {
    return {
      label: "Bank",
      class: "bg-green-500/10 text-green-600 dark:text-green-400",
    };
  }
  // Default/cash
  return {
    label: method ? method.charAt(0).toUpperCase() + method.slice(1) : "—",
    class: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  };
};

onMounted(() => {
  fetchFilterOptions();
  fetchPendingPayments({ ordering: ordering.value });
});
</script>

<template>
  <div class="p-4 md:p-8 w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
        Payment Verification
      </h1>
      <p class="text-subtle text-sm md:text-base">
        Verify membership payments for alumni-verified applicants
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
          Pending Payment Verification
          <span
            class="text-xs font-semibold size-6 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center -translate-y-px"
          >
            {{ paymentPagination.totalItems }}
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
            @click="exportPaymentsCSV"
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
      <div v-else-if="loadingPayment" class="p-12 text-center">
        <Icon name="svg-spinners:ring-resize" class="size-8 text-primary mx-auto mb-4" />
        <p class="text-subtle text-sm">Loading pending payments...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="paymentApplicants.length === 0"
        class="p-12 text-center"
      >
        <Icon
          name="material-symbols:check-circle"
          class="size-12 text-secondary mx-auto mb-4"
        />
        <p class="text-text font-medium mb-1">All caught up!</p>
        <p class="text-subtle text-sm">No pending payment verifications</p>
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
                  Payment Method
                </th>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Amount
                </th>
                <AdminSortableHeader
                  label="Alumni Verified"
                  field="alumni_verified_at"
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
                v-for="payment in paymentApplicants"
                :key="payment.id"
                class="group hover:bg-background transition-all duration-200 cursor-pointer active:scale-[0.99] [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
                @click="handleView(payment.id)"
              >
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                  {{ payment.id }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-text"
                >
                  {{ payment.name }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
                >
                  {{ payment.email }}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getPaymentMethodChip(payment.paymentMethod).class"
                  >
                    {{ getPaymentMethodChip(payment.paymentMethod).label }}
                  </span>
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text font-medium">
                  {{ payment.amount }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
                >
                  {{ formatDate(payment.alumniVerifiedDate) }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium"
                >
                  <div class="flex items-center gap-2">
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all duration-200 active:scale-95"
                      @click.stop="handleConfirm(payment.id)"
                      title="Confirm Payment"
                    >
                      <Icon name="material-symbols:check-circle" class="size-3.5" />
                      Confirm
                    </button>
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all duration-200 active:scale-95"
                      @click.stop="openRejectDialog(payment.id, payment.name)"
                      title="Reject Payment"
                    >
                      <Icon name="material-symbols:cancel" class="size-3.5" />
                      Reject
                    </button>
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-subtle hover:bg-background hover:text-text transition-all duration-200 active:scale-95"
                      @click.stop="handleView(payment.id)"
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
        v-if="!loadingPayment && paymentApplicants.length > 0"
        :current-page="paymentPagination.currentPage"
        :total-pages="paymentPagination.totalPages"
        :total-items="paymentPagination.totalItems"
        :limit="paymentPagination.limit"
        @page-change="handlePageChange"
        @limit-change="handleLimitChange"
      />
    </div>

    <!-- Scroll to Top -->
    <div
      v-if="!loadingPayment && paymentApplicants.length > 0"
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
      title="Reject Payment Verification"
      :applicant-name="rejectingApplicant?.name"
      @confirm="confirmReject"
    />

    <!-- View Modal -->
    <AdminModalAdminViewModal
      v-model="showViewModal"
      title="Payment Verification Details"
      :loading="loadingDetails"
    >
      <AdminViewPaymentDetails :applicant="viewingApplicant" />
      
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
               @click="handleConfirm(viewingApplicant.id); showViewModal = false;"
             >
               Confirm Payment
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
