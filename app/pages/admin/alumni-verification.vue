<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const {
  alumniApplicants,
  alumniPagination,
  loadingAlumni,
  fetchPendingAlumni,
  verifyAlumni,
  rejectAlumni,
  exportAlumniCSV,
} = useVerification();

// Search state
const searchQuery = ref("");

// Rejection dialog state
const showRejectDialog = ref(false);
const rejectingApplicant = ref<{ id: number; name: string } | null>(null);

// Fetch data on mount
onMounted(() => {
  fetchPendingAlumni();
});

// Refresh data
const refreshData = () => {
  fetchPendingAlumni({ search: searchQuery.value });
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

// Search handler
const handleSearch = () => {
  fetchPendingAlumni({ search: searchQuery.value });
};
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
        class="p-4 md:p-6 border-b border-border flex items-center justify-between"
      >
        <h2
          class="text-lg font-semibold text-text flex items-center gap-3 leading-none"
        >
          Pending Alumni Verification
          <span
            class="text-xs font-semibold size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center -translate-y-px"
          >
            {{ alumniApplicants.length }}
          </span>
        </h2>
        <button
          class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          @click="exportAlumniCSV"
        >
          Export CSV
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loadingAlumni" class="p-12 text-center">
        <Icon name="svg-spinners:ring-resize" class="size-8 text-primary mx-auto mb-4" />
        <p class="text-subtle text-sm">Loading pending verifications...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="alumniApplicants.length === 0"
        class="p-12 text-center"
      >
        <Icon
          name="material-symbols:check-circle"
          class="size-12 text-secondary mx-auto mb-4"
        />
        <p class="text-text font-medium mb-1">All caught up!</p>
        <p class="text-subtle text-sm">No pending alumni verifications</p>
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
                Degree Program
              </th>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Year Graduated
              </th>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Student Number
              </th>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Date Applied
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
              v-for="applicant in alumniApplicants"
              :key="applicant.id"
              class="hover:bg-background transition-colors"
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
                {{ applicant.degree }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                {{ applicant.yearGraduated }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ applicant.studentNumber || "—" }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ applicant.dateApplied }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <div class="flex items-center gap-2">
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all duration-200 active:scale-95"
                    @click="handleVerify(applicant.id)"
                    title="Verify as Alumni"
                  >
                    <Icon name="material-symbols:check-circle" class="size-3.5" />
                    Verify
                  </button>
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all duration-200 active:scale-95"
                    @click="openRejectDialog(applicant.id, applicant.name)"
                    title="Reject Application"
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
      title="Reject Alumni Verification"
      :applicant-name="rejectingApplicant?.name"
      @confirm="confirmReject"
    />
  </div>
</template>
