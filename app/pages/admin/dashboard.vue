<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

// Sample data - replace with actual API calls later
const stats = ref([
  { label: "Membership Applicants", count: 24, href: "/admin/applicants" },
  { label: "Approved Members", count: 156, href: "/admin/members" },
  { label: "Total Alumni", count: 432, href: "/admin/alumni" },
]);

const recentActivity = ref([
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    status: "Pending",
    type: "Application",
    date: "2025-11-25",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@example.com",
    status: "Approved",
    type: "Membership",
    date: "2025-11-24",
  },
  {
    id: 3,
    name: "Pedro Reyes",
    email: "pedro.reyes@example.com",
    status: "Pending",
    type: "Application",
    date: "2025-11-23",
  },
  {
    id: 4,
    name: "Ana Garcia",
    email: "ana.garcia@example.com",
    status: "Approved",
    type: "Membership",
    date: "2025-11-22",
  },
  {
    id: 5,
    name: "Carlos Mercado",
    email: "carlos.mercado@example.com",
    status: "Pending",
    type: "Application",
    date: "2025-11-21",
  },
]);
</script>

<template>
  <div class="py-4 md:py-8">
    <div class="w-full max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-6 md:mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
          Admin Dashboard
        </h1>
        <p class="text-subtle text-sm md:text-base">
          Manage alumni registration and membership
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
        <NuxtLink
          v-for="stat in stats"
          :key="stat.label"
          :to="stat.href"
          class="bg-surface rounded-xl border border-border p-4 md:p-6 hover:border-primary transition-all duration-200 group active:scale-[0.97] relative"
        >
          <p class="text-subtle text-sm font-medium mb-2">{{ stat.label }}</p>
          <p
            class="text-3xl md:text-4xl font-bold text-primary group-hover:text-opacity-80 transition-colors"
          >
            {{ stat.count }}
          </p>
          <!-- Arrow Icon -->
          <Icon
            name="material-symbols:arrow-forward"
            class="size-5 text-subtle absolute top-4 right-4 md:top-6 md:right-6 transition-transform duration-200 group-hover:translate-x-1"
          />
        </NuxtLink>
      </div>

      <!-- Recent Activity Table -->
      <div class="bg-surface rounded-xl border border-border overflow-hidden">
        <div class="p-4 md:p-6 border-b border-border">
          <h2 class="text-lg md:text-xl font-semibold text-text">
            Recent Activity
          </h2>
        </div>

        <!-- Table wrapper with horizontal scroll -->
        <div class="overflow-x-auto">
          <table class="w-full min-w-[640px]">
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
                  Type
                </th>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Date
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
                v-for="activity in recentActivity"
                :key="activity.id"
                class="hover:bg-background transition-colors"
              >
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text"
                >
                  {{ activity.id }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-text"
                >
                  {{ activity.name }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
                >
                  {{ activity.email }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text"
                >
                  {{ activity.type }}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="
                      activity.status === 'Approved'
                        ? 'bg-secondary bg-opacity-10 text-secondary'
                        : 'bg-accent bg-opacity-10 text-accent'
                    "
                  >
                    {{ activity.status }}
                  </span>
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
                >
                  {{ activity.date }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium"
                >
                  <button
                    class="text-primary hover:text-opacity-80 transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table footer / pagination placeholder -->
        <div
          class="px-4 md:px-6 py-4 border-t border-border flex items-center justify-between"
        >
          <p class="text-sm text-subtle">Showing 5 of 24 entries</p>
          <div class="flex gap-2">
            <button
              class="px-3 py-1 text-sm rounded-lg border border-border text-text hover:bg-background transition-colors disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button
              class="px-3 py-1 text-sm rounded-lg border border-border text-text hover:bg-background transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
