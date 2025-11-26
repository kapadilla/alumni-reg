<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

// Sample applicants data
const applicants = ref([
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    degree: "BS Computer Science",
    yearGraduated: "2020",
    dateApplied: "2025-11-25",
    status: "Pending",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@example.com",
    degree: "BS Biology",
    yearGraduated: "2019",
    dateApplied: "2025-11-24",
    status: "Pending",
  },
  {
    id: 3,
    name: "Pedro Reyes",
    email: "pedro.reyes@example.com",
    degree: "BS Engineering",
    yearGraduated: "2021",
    dateApplied: "2025-11-23",
    status: "Pending",
  },
]);
</script>

<template>
  <div class="p-4 md:p-8 w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
        Membership Applicants
      </h1>
      <p class="text-subtle text-sm md:text-base">
        Review and approve membership applications
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
        <h2 class="text-lg font-semibold text-text">
          Pending Applications ({{ applicants.length }})
        </h2>
        <button
          class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Export CSV
        </button>
      </div>

      <!-- Table with horizontal scroll -->
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
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
              v-for="applicant in applicants"
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
                {{ applicant.dateApplied }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <div class="flex gap-2">
                  <button
                    class="px-3 py-1 text-xs rounded bg-secondary text-white hover:bg-opacity-90 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    class="px-3 py-1 text-xs rounded border border-border text-text hover:bg-background transition-colors"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
