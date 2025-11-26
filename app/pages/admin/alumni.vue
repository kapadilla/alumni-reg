<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

// Sample alumni data
const alumni = ref([
  {
    id: 1,
    name: "Elena Rodriguez",
    email: "elena.rodriguez@example.com",
    degree: "BS Mathematics",
    yearGraduated: "2015",
    currentEmployer: "Tech Corp",
    industry: "Technology",
    isMember: true,
  },
  {
    id: 2,
    name: "Miguel Torres",
    email: "miguel.torres@example.com",
    degree: "BS Chemistry",
    yearGraduated: "2016",
    currentEmployer: "PharmaCo",
    industry: "Healthcare",
    isMember: false,
  },
  {
    id: 3,
    name: "Sofia Reyes",
    email: "sofia.reyes@example.com",
    degree: "BS Economics",
    yearGraduated: "2014",
    currentEmployer: "Bank Inc",
    industry: "Finance",
    isMember: true,
  },
  {
    id: 4,
    name: "Diego Santos",
    email: "diego.santos@example.com",
    degree: "BS Architecture",
    yearGraduated: "2017",
    currentEmployer: "Design Studio",
    industry: "Architecture",
    isMember: false,
  },
]);
</script>

<template>
  <div class="p-4 md:p-8 w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
        Alumni Directory
      </h1>
      <p class="text-subtle text-sm md:text-base">
        Complete list of UP Cebu alumni
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
          Total Alumni ({{ alumni.length }})
        </h2>
        <button
          class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Export CSV
        </button>
      </div>

      <!-- Table with horizontal scroll -->
      <div class="overflow-x-auto">
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
                Current Employer
              </th>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Industry
              </th>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Member Status
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
              v-for="alumnus in alumni"
              :key="alumnus.id"
              class="hover:bg-background transition-colors"
            >
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                {{ alumnus.id }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-text"
              >
                {{ alumnus.name }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ alumnus.email }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                {{ alumnus.degree }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                {{ alumnus.yearGraduated }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                {{ alumnus.currentEmployer }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ alumnus.industry }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="
                    alumnus.isMember
                      ? 'bg-secondary bg-opacity-10 text-secondary'
                      : 'bg-border text-subtle'
                  "
                >
                  {{ alumnus.isMember ? "Member" : "Non-member" }}
                </span>
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <button
                  class="text-primary hover:text-opacity-80 transition-colors"
                >
                  View Profile
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
