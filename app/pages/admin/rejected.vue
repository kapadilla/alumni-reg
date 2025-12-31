<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

// Sample rejected applicants data
const rejectedApplicants = ref([
  {
    id: 1,
    name: "Roberto Cruz",
    email: "roberto.cruz@example.com",
    rejectedAt: "2025-11-24",
    rejectionStage: "Alumni Verification",
    reason: "Name not found in alumni records",
  },
  {
    id: 2,
    name: "Linda Gomez",
    email: "linda.gomez@example.com",
    rejectedAt: "2025-11-23",
    rejectionStage: "Payment Verification",
    reason: "Payment not received after 30 days",
  },
  {
    id: 3,
    name: "Marco Tan",
    email: "marco.tan@example.com",
    rejectedAt: "2025-11-20",
    rejectionStage: "Alumni Verification",
    reason: "Graduation year does not match records",
  },
]);
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
            {{ rejectedApplicants.length }}
          </span>
        </h2>
        <button
          class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Export CSV
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="rejectedApplicants.length === 0"
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
                Rejected At
              </th>
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
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ applicant.rejectedAt }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="
                    applicant.rejectionStage === 'Alumni Verification'
                      ? 'bg-accent bg-opacity-10 text-accent'
                      : 'bg-primary bg-opacity-10 text-primary'
                  "
                >
                  {{ applicant.rejectionStage }}
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
                >
                  <Icon name="material-symbols:visibility" class="size-3.5" />
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
