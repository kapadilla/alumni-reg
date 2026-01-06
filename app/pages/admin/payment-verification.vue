<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const {
  paymentApplicants,
  paymentPagination,
  loadingPayment,
  fetchPendingPayments,
  confirmPayment,
  rejectPayment,
  exportPaymentsCSV,
} = useVerification();

const searchQuery = ref("");

// Rejection dialog state
const showRejectDialog = ref(false);
const rejectingApplicant = ref<{ id: number; name: string } | null>(null);

onMounted(() => {
  fetchPendingPayments();
});

const refreshData = () => {
  fetchPendingPayments({ search: searchQuery.value });
};

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
        class="p-4 md:p-6 border-b border-border flex items-center justify-between"
      >
        <h2
          class="text-lg font-semibold text-text flex items-center gap-3 leading-none"
        >
          Pending Payment Verification
          <span
            class="text-xs font-semibold size-6 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center -translate-y-px"
          >
            {{ paymentApplicants.length }}
          </span>
        </h2>
        <button
          class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          @click="exportPaymentsCSV"
        >
          Export CSV
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loadingPayment" class="p-12 text-center">
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
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[900px]">
          <thead class="bg-background">
            <tr>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Email
              </th>
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
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Alumni Verified
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
              v-for="payment in paymentApplicants"
              :key="payment.id"
              class="hover:bg-background transition-colors"
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
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                {{ payment.paymentMethod }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text font-medium">
                {{ payment.amount }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ payment.alumniVerifiedDate }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <div class="flex items-center gap-2">
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all duration-200 active:scale-95"
                    @click="handleConfirm(payment.id)"
                    title="Confirm Payment"
                  >
                    <Icon name="material-symbols:check-circle" class="size-3.5" />
                    Confirm
                  </button>
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all duration-200 active:scale-95"
                    @click="openRejectDialog(payment.id, payment.name)"
                    title="Reject Payment"
                  >
                    <Icon name="material-symbols:cancel" class="size-3.5" />
                    Reject
                  </button>
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-subtle hover:bg-background hover:text-text transition-all duration-200 active:scale-95"
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
      </div>
    </div>

    <!-- Reject Dialog -->
    <AdminRejectDialog
      v-model="showRejectDialog"
      title="Reject Payment Verification"
      :applicant-name="rejectingApplicant?.name"
      @confirm="confirmReject"
    />
  </div>
</template>
