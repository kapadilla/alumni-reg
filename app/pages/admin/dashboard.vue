<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { stats, activities, loadingStats, loadingActivity, fetchStats, fetchActivity } = useDashboard();

// Map stats to include href for navigation
const statCards = computed(() => {
  const hrefMap: Record<string, string> = {
    "Pending Alumni Verification": "/admin/alumni-verification",
    "Pending Payment Verification": "/admin/payment-verification",
    "Approved Members": "/admin/members",
  };
  return stats.value.map(stat => ({
    ...stat,
    href: hrefMap[stat.label] || "#",
  }));
});

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchStats(), fetchActivity(5)]);
});
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
      <div v-if="loadingStats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
        <div v-for="i in 3" :key="i" class="bg-surface rounded-xl border border-border p-4 md:p-6 animate-pulse">
          <div class="h-4 bg-background rounded w-1/2 mb-2" />
          <div class="h-10 bg-background rounded w-1/3" />
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
        <NuxtLink
          v-for="stat in statCards"
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

        <!-- Loading State -->
        <div v-if="loadingActivity" class="p-12 text-center">
          <Icon name="svg-spinners:ring-resize" class="size-8 text-primary mx-auto mb-4" />
          <p class="text-subtle text-sm">Loading recent activity...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="activities.length === 0" class="p-12 text-center">
          <Icon name="material-symbols:history" class="size-12 text-subtle/50 mx-auto mb-4" />
          <p class="text-text font-medium mb-1">No recent activity</p>
          <p class="text-subtle text-sm">Activity will appear here as applications are processed</p>
        </div>

        <!-- Table wrapper with horizontal scroll -->
        <div v-else class="overflow-x-auto">
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
                v-for="activity in activities"
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

          <!-- Table footer / pagination -->
          <div
            v-if="activities.length > 0"
            class="px-4 md:px-6 py-4 border-t border-border flex items-center justify-between"
          >
            <p class="text-sm text-subtle">Showing {{ activities.length }} entries</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
