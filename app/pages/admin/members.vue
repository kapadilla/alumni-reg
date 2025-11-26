<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

// Sample members data
const members = ref([
  {
    id: 1,
    name: "Ana Garcia",
    email: "ana.garcia@example.com",
    degree: "BS Nursing",
    yearGraduated: "2018",
    memberSince: "2020-05-15",
    membershipType: "Regular",
  },
  {
    id: 2,
    name: "Carlos Mercado",
    email: "carlos.mercado@example.com",
    degree: "BS Accountancy",
    yearGraduated: "2017",
    memberSince: "2019-08-20",
    membershipType: "Lifetime",
  },
  {
    id: 3,
    name: "Rosa Fernandez",
    email: "rosa.fernandez@example.com",
    degree: "BS Psychology",
    yearGraduated: "2019",
    memberSince: "2021-02-10",
    membershipType: "Regular",
  },
]);
</script>

<template>
  <div class="p-4 md:p-8 w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
        Approved Members
      </h1>
      <p class="text-subtle text-sm md:text-base">
        Manage active alumni association members
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
          Total Members ({{ members.length }})
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
                Member Since
              </th>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Membership Type
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
              v-for="member in members"
              :key="member.id"
              class="hover:bg-background transition-colors"
            >
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                {{ member.id }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-text"
              >
                {{ member.name }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ member.email }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                {{ member.degree }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                {{ member.yearGraduated }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ member.memberSince }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="
                    member.membershipType === 'Lifetime'
                      ? 'bg-accent bg-opacity-10 text-accent'
                      : 'bg-primary bg-opacity-10 text-primary'
                  "
                >
                  {{ member.membershipType }}
                </span>
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <button
                  class="text-primary hover:text-opacity-80 transition-colors"
                >
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
