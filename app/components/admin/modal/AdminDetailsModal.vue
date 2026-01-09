<script setup lang="ts">
import type { Admin, AdminActivityResponse } from "~/types";
import AdminViewModal from "~/components/admin/modal/AdminViewModal.vue";
import DateRangePicker from "~/components/admin/DateRangePicker.vue";
import SortableHeader from "~/components/admin/SortableHeader.vue";
import TablePagination from "~/components/admin/TablePagination.vue";

interface Props {
  modelValue: boolean;
  admin: Admin | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  edit: [admin: Admin];
}>();

const { fetchAdminActivity } = useAdmins();

// Activity log state
const activities = ref<AdminActivityResponse | null>(null);
const loadingActivity = ref(false);

// Filter state
const filters = ref({
  dateFrom: null as string | null,
  dateTo: null as string | null,
  action: "",
  targetType: "",
  ordering: "-timestamp",
  page: 1,
  limit: 20,
});

const dateRange = computed({
  get: () => ({ from: filters.value.dateFrom, to: filters.value.dateTo }),
  set: (value: { from: string | null; to: string | null }) => {
    filters.value.dateFrom = value.from;
    filters.value.dateTo = value.to;
    filters.value.page = 1; // Reset to page 1 when filtering
  },
});

// Action type options
const actionOptions = [
  { value: "", label: "All Actions" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "verify_alumni", label: "Verify Alumni" },
  { value: "reject_alumni", label: "Reject Alumni" },
  { value: "approve_member", label: "Approve Member" },
  { value: "reject_payment", label: "Reject Payment" },
  { value: "revoke_member", label: "Revoke Member" },
  { value: "reinstate_member", label: "Reinstate Member" },
  { value: "deactivate_admin", label: "Deactivate Admin" },
  { value: "reactivate_admin", label: "Reactivate Admin" },
];

// Target type options
const targetTypeOptions = [
  { value: "", label: "All Targets" },
  { value: "application", label: "Applicant" },
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
];

// Activity error state
const activityError = ref(false);

// Load activity logs
const loadActivity = async () => {
  if (!props.admin || !props.modelValue) return;
  loadingActivity.value = true;
  activityError.value = false;
  try {
    const result = await fetchAdminActivity(props.admin.id, {
      dateFrom: filters.value.dateFrom || undefined,
      dateTo: filters.value.dateTo || undefined,
      action: filters.value.action || undefined,
      targetType: filters.value.targetType || undefined,
      ordering: filters.value.ordering,
      page: filters.value.page,
      limit: filters.value.limit,
    });
    activities.value = result;
  } catch (error) {
    console.error('Failed to load admin activity:', error);
    activityError.value = true;
    activities.value = null;
  } finally {
    loadingActivity.value = false;
  }
};

// Watch for filter changes (but not on initial load)
watch(
  () => [
    filters.value.dateFrom,
    filters.value.dateTo,
    filters.value.action,
    filters.value.targetType,
    filters.value.ordering,
    filters.value.page,
    filters.value.limit,
  ],
  () => {
    if (props.modelValue) {
      loadActivity();
    }
  }
);

// Load activity when modal opens
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && props.admin) {
      // Reset filters without triggering watch
      activityError.value = false;
      filters.value = {
        dateFrom: null,
        dateTo: null,
        action: "",
        targetType: "",
        ordering: "-timestamp",
        page: 1,
        limit: 20,
      };
      // Wait a tick for filters to be set, then load
      await nextTick();
      loadActivity();
    }
  }
);

const handleSort = (field: string, direction: "asc" | "desc") => {
  filters.value.ordering = direction === "desc" ? `-${field}` : field;
  filters.value.page = 1;
};

const handleEdit = () => {
  if (props.admin) {
    emit("edit", props.admin);
  }
};

const close = () => {
  emit("update:modelValue", false);
};

// Helper function to get action chip styling
const getActionChipClass = (action: string) => {
  const actionMap: Record<string, string> = {
    login: "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20",
    logout: "bg-gray-500/15 text-gray-600 dark:text-gray-400 ring-1 ring-gray-500/20",
    verify_alumni: "bg-secondary/15 text-secondary ring-1 ring-secondary/20",
    reject_alumni: "bg-red-500/15 text-red-600 dark:text-red-400 ring-1 ring-red-500/20",
    approve_member: "bg-secondary/15 text-secondary ring-1 ring-secondary/20",
    reject_payment: "bg-red-500/15 text-red-600 dark:text-red-400 ring-1 ring-red-500/20",
    revoke_member: "bg-orange-500/15 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20",
    reinstate_member: "bg-purple-500/15 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20",
    deactivate_admin: "bg-red-500/15 text-red-600 dark:text-red-400 ring-1 ring-red-500/20",
    reactivate_admin: "bg-secondary/15 text-secondary ring-1 ring-secondary/20",
  };
  return actionMap[action] || "bg-primary/15 text-primary ring-1 ring-primary/20";
};

// Helper function to get action icon
const getActionIcon = (action: string) => {
  const iconMap: Record<string, string> = {
    login: "material-symbols:login-rounded",
    logout: "material-symbols:logout-rounded",
    verify_alumni: "material-symbols:verified-rounded",
    reject_alumni: "material-symbols:cancel-rounded",
    approve_member: "material-symbols:check-circle-rounded",
    reject_payment: "material-symbols:cancel-rounded",
    revoke_member: "material-symbols:person-remove-rounded",
    reinstate_member: "material-symbols:person-add-rounded",
    deactivate_admin: "material-symbols:person-off-rounded",
    reactivate_admin: "material-symbols:person-check-rounded",
  };
  return iconMap[action] || "material-symbols:circle";
};

// Helper function to format target type display
const formatTargetType = (targetType: string) => {
  const typeMap: Record<string, string> = {
    application: "Applicant",
    member: "Member",
    admin: "Admin",
  };
  return typeMap[targetType] || targetType;
};

</script>

<template>
  <AdminViewModal
    v-if="admin"
    :model-value="modelValue"
    :title="`${admin.firstName || ''} ${admin.lastName || '(No Name)'}`.trim()"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <!-- Admin Information Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-5">
        <h4 class="text-xl font-bold text-text">Account Information</h4>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
          @click="handleEdit"
        >
          <Icon name="material-symbols:edit-rounded" class="size-4" />
          Edit
        </button>
      </div>

      <!-- Info Grid with Enhanced Card Design -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Full Name Card -->
        <div class="bg-gradient-to-br from-background to-background/50 rounded-xl p-5 border border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group">
          <div class="flex items-start gap-3">
            <div class="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
              <Icon name="material-symbols:person-rounded" class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
              <dt class="text-xs font-semibold text-subtle uppercase tracking-wide mb-1.5">Full Name</dt>
              <dd class="text-base text-text font-semibold truncate">
                <span v-if="admin.firstName || admin.lastName">
                  {{ `${admin.firstName} ${admin.lastName}` }}
                </span>
                <span v-else class="italic text-subtle font-normal">
                  No name
                </span>
              </dd>
            </div>
          </div>
        </div>

        <!-- Email Card -->
        <div class="bg-gradient-to-br from-background to-background/50 rounded-xl p-5 border border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group">
          <div class="flex items-start gap-3">
            <div class="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/15 transition-colors">
              <Icon name="material-symbols:mail-rounded" class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
              <dt class="text-xs font-semibold text-subtle uppercase tracking-wide mb-1.5">Email</dt>
              <dd class="text-base text-text font-medium truncate">{{ admin.email }}</dd>
            </div>
          </div>
        </div>

        <!-- Status Card -->
        <div class="bg-gradient-to-br from-background to-background/50 rounded-xl p-5 border border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group">
          <div class="flex items-start gap-3">
            <div 
              class="p-2.5 rounded-lg transition-colors"
              :class="admin.isActive ? 'bg-secondary/10 text-secondary group-hover:bg-secondary/15' : 'bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-500/15'"
            >
              <Icon 
                :name="admin.isActive ? 'material-symbols:check-circle-rounded' : 'material-symbols:cancel-rounded'" 
                class="size-5" 
              />
            </div>
            <div class="flex-1">
              <dt class="text-xs font-semibold text-subtle uppercase tracking-wide mb-1.5">Status</dt>
              <dd>
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full"
                  :class="
                    admin.isActive
                      ? 'bg-secondary/15 text-secondary ring-1 ring-secondary/20'
                      : 'bg-red-500/15 text-red-600 dark:text-red-400 ring-1 ring-red-500/20'
                  "
                >
                  <span 
                    class="size-1.5 rounded-full animate-pulse"
                    :class="admin.isActive ? 'bg-secondary' : 'bg-red-500'"
                  />
                  {{ admin.isActive ? "Active" : "Inactive" }}
                </span>
              </dd>
            </div>
          </div>
        </div>

        <!-- Date Joined Card -->
        <div class="bg-gradient-to-br from-background to-background/50 rounded-xl p-5 border border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group">
          <div class="flex items-start gap-3">
            <div class="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/15 transition-colors">
              <Icon name="material-symbols:calendar-today-rounded" class="size-5" />
            </div>
            <div class="flex-1">
              <dt class="text-xs font-semibold text-subtle uppercase tracking-wide mb-1.5">Date Joined</dt>
              <dd class="text-base text-text font-medium">{{ formatDate(admin.dateJoined) }}</dd>
            </div>
          </div>
        </div>

        <!-- Last Login Card -->
        <div class="md:col-span-2 bg-gradient-to-br from-background to-background/50 rounded-xl p-5 border border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group">
          <div class="flex items-start gap-3">
            <div class="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/15 transition-colors">
              <Icon name="material-symbols:login-rounded" class="size-5" />
            </div>
            <div class="flex-1">
              <dt class="text-xs font-semibold text-subtle uppercase tracking-wide mb-1.5">Last Login</dt>
              <dd class="text-base text-text font-medium">
                {{
                  admin.lastLogin || admin.last_login
                    ? formatDate(admin.lastLogin || admin.last_login)
                    : "Never"
                }}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Log Section -->
    <div>
      <h4 class="text-xl font-bold text-text mb-5">Activity Log</h4>

      <!-- Filters with Enhanced Design -->
      <div class="mb-5 p-5 bg-gradient-to-br from-background to-background/50 rounded-xl border border-border/50 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <div class="p-1.5 rounded-lg bg-primary/10">
            <Icon name="material-symbols:filter-list-rounded" class="size-4 text-primary" />
          </div>
          <h5 class="text-sm font-semibold text-text">Filters</h5>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Date Range -->
          <div class="lg:col-span-2">
            <DateRangePicker v-model="dateRange" label-from="From" label-to="To" />
          </div>

          <!-- Action Filter -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="material-symbols:bolt-rounded" class="size-3.5" />
              Action Type
            </label>
            <select
              v-model="filters.action"
              class="px-3.5 py-2.5 text-sm bg-surface border-2 border-border rounded-xl text-text focus:outline-none focus:border-primary hover:border-subtle transition-all duration-200 font-medium shadow-sm hover:shadow cursor-pointer"
              @change="filters.page = 1"
            >
              <option v-for="opt in actionOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- Target Type Filter -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="material-symbols:target" class="size-3.5" />
              Target Type
            </label>
            <select
              v-model="filters.targetType"
              class="px-3.5 py-2.5 text-sm bg-surface border-2 border-border rounded-xl text-text focus:outline-none focus:border-primary hover:border-subtle transition-all duration-200 font-medium shadow-sm hover:shadow cursor-pointer"
              @change="filters.page = 1"
            >
              <option v-for="opt in targetTypeOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Activity Table -->
      <div class="border-2 border-border/50 rounded-xl overflow-hidden shadow-sm">
        <!-- Loading State -->
        <div v-if="loadingActivity" class="p-12 text-center bg-gradient-to-br from-background to-background/50">
          <Icon name="svg-spinners:ring-resize" class="size-8 text-primary mx-auto mb-4" />
          <p class="text-subtle text-sm font-medium">Loading activities...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="activityError" class="p-12 text-center bg-gradient-to-br from-background to-background/50">
          <div class="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="material-symbols:error-outline-rounded" class="size-8 text-red-500" />
          </div>
          <p class="text-text font-semibold mb-2">Unable to load activity logs</p>
          <p class="text-subtle text-sm mb-5">
            The activity tracking feature is not available yet
          </p>
          <button
            class="px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            @click="loadActivity"
          >
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!activities || activities.activities.length === 0"
          class="p-12 text-center bg-gradient-to-br from-background to-background/50"
        >
          <div class="size-16 rounded-full bg-subtle/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="material-symbols:history" class="size-8 text-subtle/50" />
          </div>
          <p class="text-text font-semibold mb-2">No activities found</p>
          <p class="text-subtle text-sm">
            {{
              filters.dateFrom || filters.dateTo || filters.action || filters.targetType
                ? "Try adjusting your filters"
                : "No activity recorded for this admin"
            }}
          </p>
        </div>



        <!-- Table with horizontal scroll -->
        <AdminScrollContainer v-else>
          <table class="w-full min-w-[800px]">
            <thead class="bg-gradient-to-r from-background to-background/50">
              <tr>
                <SortableHeader
                  label="Action"
                  field="action"
                  :current-sort="filters.ordering"
                  @sort="handleSort"
                />
                <th
                  class="px-4 md:px-6 py-4 text-left text-xs font-bold text-subtle uppercase tracking-wider"
                >
                  Target
                </th>
                <SortableHeader
                  label="Timestamp"
                  field="timestamp"
                  :current-sort="filters.ordering"
                  @sort="handleSort"
                />
                <th
                  class="px-4 md:px-6 py-4 text-left text-xs font-bold text-subtle uppercase tracking-wider"
                >
                  IP Address
                </th>
                <th
                  class="px-4 md:px-6 py-4 text-left text-xs font-bold text-subtle uppercase tracking-wider"
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody class="bg-surface divide-y divide-border/50">
              <tr
                v-for="activity in activities.activities"
                :key="activity.id"
                class="hover:bg-gradient-to-r hover:from-background hover:to-background/50 transition-all duration-200"
              >
                <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full shadow-sm"
                    :class="getActionChipClass(activity.action)"
                  >
                    <Icon :name="getActionIcon(activity.action)" class="size-3.5" />
                    {{ activity.actionDisplay }}
                  </span>
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex flex-col">
                    <span class="text-text font-semibold">
                      {{ activity.targetName || "-" }}
                    </span>
                    <span v-if="activity.targetType" class="text-subtle text-xs font-medium mt-0.5">
                      {{ formatTargetType(activity.targetType) }}
                    </span>
                  </div>
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text font-medium">
                  {{ formatDate(activity.timestamp) }}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                  <code class="px-2 py-1 text-xs font-mono bg-background rounded border border-border/50 text-subtle">
                    {{ activity.ipAddress || "-" }}
                  </code>
                </td>
                <td class="px-4 md:px-6 py-4 text-sm text-subtle font-medium max-w-xs truncate">
                  {{ activity.notes || "-" }}
                </td>
              </tr>
            </tbody>
          </table>
        </AdminScrollContainer>

        <!-- Pagination -->
        <TablePagination
          v-if="activities && activities.activities.length > 0"
          :current-page="filters.page"
          :total-pages="activities.pagination.totalPages"
          :total-items="activities.pagination.totalItems"
          :limit="filters.limit"
          @page-change="filters.page = $event"
          @limit-change="
            filters.limit = $event;
            filters.page = 1;
          "
        />
      </div>
    </div>
  </AdminViewModal>
</template>
