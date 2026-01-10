<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Dashboard - UP Cebu Alumni Association",
});


const { stats, activities, loadingStats, loadingActivity, fetchStats, fetchActivity } = useDashboard();
const { admins, fetchAdmins } = useAdmins();

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

// Helper to get admin name from email
const getAdminName = (email: string) => {
  const admin = admins.value.find(a => a.email === email);
  return admin ? `${admin.firstName} ${admin.lastName}` : "Unknown Admin";
};

// Helper function to get action chip styling (matching AdminDetailsModal)
const getActionStyle = (type: string) => {
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes("verify") || lowerType.includes("verified")) {
    return "bg-secondary/15 text-secondary ring-1 ring-secondary/20";
  }
  if (lowerType.includes("approve") || lowerType.includes("approved") || lowerType.includes("reactivate")) {
    return "bg-secondary/15 text-secondary ring-1 ring-secondary/20";
  }
  if (lowerType.includes("reject") || lowerType.includes("deactivate") || lowerType.includes("deactivated")) {
    return "bg-red-500/15 text-red-600 dark:text-red-400 ring-1 ring-red-500/20";
  }
  if (lowerType.includes("revoke") || lowerType.includes("revoked")) {
    return "bg-orange-500/15 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20";
  }
  if (lowerType.includes("reinstate") || lowerType.includes("reinstated")) {
    return "bg-purple-500/15 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20";
  }
  if (lowerType.includes("login")) {
    return "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20";
  }
  if (lowerType.includes("logout")) {
    return "bg-gray-500/15 text-gray-600 dark:text-gray-400 ring-1 ring-gray-500/20";
  }
  
  return "bg-primary/15 text-primary ring-1 ring-primary/20";
};

// Helper function to get action icon
const getActionIcon = (type: string) => {
  const lowerType = type.toLowerCase();
    if (lowerType.includes("verify") || lowerType.includes("verified")) return "material-symbols:verified-rounded";
    if (lowerType.includes("approve") || lowerType.includes("approved")) return "material-symbols:check-circle-rounded";
    if (lowerType.includes("reject")) return "material-symbols:cancel-rounded";
    if (lowerType.includes("revoke") || lowerType.includes("revoked")) return "material-symbols:person-remove-rounded";
    if (lowerType.includes("reinstate") || lowerType.includes("reinstated")) return "material-symbols:person-add-rounded";
    if (lowerType.includes("deactivate") || lowerType.includes("deactivated")) return "material-symbols:person-off-rounded";
    if (lowerType.includes("reactivate")) return "material-symbols:person-check-rounded";
    if (lowerType.includes("login")) return "material-symbols:login-rounded";
    if (lowerType.includes("logout")) return "material-symbols:logout-rounded";

    return "material-symbols:circle";
};

// Helper function to format action type display
const formatActionType = (type: string) => {
  if (!type) return "";
  const lower = type.toLowerCase();
  
  // Normalize variations
  if (lower.includes("membership") && lower.includes("revoked")) {
    return "Revoked Membership";
  }
  if (lower.includes("membership") && lower.includes("reinstated")) {
    return "Reinstated Membership";
  }
  
  return type;
};

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchStats(), fetchActivity(5), fetchAdmins()]);
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
                  Action Type
                </th>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Performed By
                </th>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Timestamp
                </th>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="activity in activities"
                :key="activity.id"
                class="group hover:bg-background transition-all duration-200 cursor-pointer active:scale-[0.99] [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
                title="View Activity"
              >
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text"
                >
                  <code class="px-2 py-1 text-xs font-mono bg-background rounded border border-border/50 text-subtle">
                    {{ activity.id }}
                  </code>
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full shadow-sm"
                    :class="getActionStyle(activity.type)"
                  >
                    <Icon :name="getActionIcon(activity.type)" class="size-3.5" />
                    {{ formatActionType(activity.type) }}
                  </span>
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-text"
                >
                  {{ activity.description }}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex flex-col">
                    <span class="text-text font-medium">{{ getAdminName(activity.performedBy) }}</span>
                    <span class="text-subtle text-xs">{{ activity.performedBy }}</span>
                  </div>
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle font-medium"
                >
                  {{ formatDate(activity.timestamp) }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 text-sm text-subtle max-w-xs truncate"
                >
                  {{ activity.notes || '-' }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Table footer / pagination -->
          <div
            v-if="activities.length > 0"
            class="px-4 md:px-6 py-4 border-t border-border flex items-center justify-between"
          >
            <p class="text-sm text-subtle">Showing {{ activities.length }} recent activities</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
