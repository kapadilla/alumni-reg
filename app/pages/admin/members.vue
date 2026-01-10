<script setup lang="ts">
import type { MemberDetails } from "~/types";
import { useNetworkStatus } from "~/composables/useNetworkStatus";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Members - UP Cebu Alumni Association",
});


const {
  members,
  pagination,
  loading,
  fetchMembers,
  exportMembersCSV,
  getMemberDetails,
  revokeMembership,
  reinstateMembership,
} = useMembers();

const { filterOptions, fetchFilterOptions } = useFilterOptions();
const { isOnline } = useNetworkStatus();

// Filter state
const search = ref("");
const ordering = ref("-member_since");
const dateRange = ref<{ from: string | null; to: string | null }>({ from: null, to: null });
const degreeProgram = ref("");
const yearGraduated = ref("");
const statusFilter = ref<"active" | "revoked" | "">(""); // "" = All, "active" = Active, "revoked" = Revoked

// View details state
const showViewModal = ref(false);
const viewingMember = ref<MemberDetails | null>(null);
const loadingDetails = ref(false);

// Revoke dialog state
const showRevokeDialog = ref(false);
const revokingMember = ref<{ id: number; name: string; email: string; memberSince: string } | null>(null);

// Reinstate dialog state
const showReinstateDialog = ref(false);
const reinstatingMember = ref<{ id: number; name: string; email: string; memberSince: string } | null>(null);

const handleView = async (id: number) => {
  showViewModal.value = true;
  loadingDetails.value = true;
  viewingMember.value = null;
  try {
    viewingMember.value = await getMemberDetails(id);
  } finally {
    loadingDetails.value = false;
  }
};

// Open revoke dialog
const openRevokeDialog = (member: { id: number; name: string; email: string; memberSince: string }) => {
  revokingMember.value = member;
  showRevokeDialog.value = true;
};

// Confirm revocation
const confirmRevoke = async (data: { reason: string; notes?: string }) => {
  if (!revokingMember.value) return;
  const success = await revokeMembership(revokingMember.value.id, data.reason, data.notes);
  if (success) {
    showRevokeDialog.value = false;
    showViewModal.value = false;
    revokingMember.value = null;
    refreshData();
  }
};

// Open reinstate dialog
const openReinstateDialog = (member: { id: number; name: string; email: string; memberSince: string }) => {
  reinstatingMember.value = member;
  showReinstateDialog.value = true;
};

// Confirm reinstatement
const confirmReinstate = async (notes?: string) => {
  if (!reinstatingMember.value) return;
  const success = await reinstateMembership(reinstatingMember.value.id, notes);
  if (success) {
    showReinstateDialog.value = false;
    showViewModal.value = false;
    reinstatingMember.value = null;
    refreshData();
  }
};

// Sort options for members table
const sortOptions = [
  { value: "-member_since", label: "Member Since (Newest)" },
  { value: "member_since", label: "Member Since (Oldest)" },
  { value: "full_name", label: "Name (A-Z)" },
  { value: "-full_name", label: "Name (Z-A)" },
  { value: "email", label: "Email (A-Z)" },
  { value: "-email", label: "Email (Z-A)" },
];

// Filter config
const filterConfig = {
  showDateRange: true,
  showDegreeProgram: true,
  showYearGraduated: true,
  sortOptions,
  dateRangeLabel: "Member Since",
};

// Fetch data
const refreshData = () => {
  fetchMembers({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    status: statusFilter.value || undefined,
    page: pagination.value.currentPage,
    limit: pagination.value.limit,
  });
};

// Handle sort from column header
const handleSort = (field: string, direction: "asc" | "desc") => {
  ordering.value = direction === "desc" ? `-${field}` : field;
  refreshData();
};

// Handle page change
const handlePageChange = (page: number) => {
  fetchMembers({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    status: statusFilter.value || undefined,
    page,
    limit: pagination.value.limit,
  });
};

// Handle limit change
const handleLimitChange = (limit: number) => {
  fetchMembers({
    search: search.value,
    ordering: ordering.value,
    date_from: dateRange.value.from || undefined,
    date_to: dateRange.value.to || undefined,
    degree_program: degreeProgram.value || undefined,
    year_graduated: yearGraduated.value || undefined,
    status: statusFilter.value || undefined,
    page: 1,
    limit,
  });
};

// Handle clear filters
const handleClearFilters = () => {
  search.value = "";
  ordering.value = "-member_since";
  dateRange.value = { from: null, to: null };
  degreeProgram.value = "";
  yearGraduated.value = "";
  statusFilter.value = "";
  fetchMembers({ ordering: "-member_since" });
};

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Get member full name for dialogs
const getMemberName = (member: MemberDetails | null) => {
  if (!member?.personalDetails) return "";
  return `${member.personalDetails.firstName} ${member.personalDetails.lastName}`;
};

onMounted(() => {
  fetchFilterOptions();
  fetchMembers({ ordering: ordering.value });
});
</script>

<template>
  <div class="p-4 md:p-8 w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
        Members
      </h1>
      <p class="text-subtle text-sm md:text-base">
        View and manage alumni association members
      </p>
    </div>

    <!-- Table Card -->
    <div
      class="bg-surface rounded-xl border border-border overflow-hidden max-w-full"
    >
      <!-- Table header with count and export -->
      <div
        class="p-4 md:p-6 border-b border-border flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <h2
          class="text-lg font-semibold text-text flex items-center gap-3 leading-none"
        >
          Total Members
          <span
            class="text-xs font-semibold size-6 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center -translate-y-px"
          >
            {{ pagination.totalItems }}
          </span>
        </h2>
        <div class="flex items-center gap-2">
          <button
            class="size-9 flex items-center justify-center rounded-lg border border-border text-subtle hover:bg-background hover:text-text transition-colors"
            title="Refresh data"
            @click="refreshData"
          >
            <Icon name="material-symbols:refresh" class="size-4" />
          </button>
          <button
            class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            @click="exportMembersCSV"
          >
            Export CSV
          </button>
        </div>
      </div>



      <!-- Filters -->
      <AdminTableFilters
        v-model:search="search"
        v-model:ordering="ordering"
        v-model:date-range="dateRange"
        v-model:degree-program="degreeProgram"
        v-model:year-graduated="yearGraduated"
        :filter-options="filterOptions"
        :config="filterConfig"
        @search="refreshData"
        @clear="handleClearFilters"
      >
        <template #prepend-filters>
          <div class="inline-flex items-center bg-background rounded-lg p-1 w-full md:w-auto">
            <button
              class="flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
              :class="statusFilter === '' ? 'bg-surface text-text shadow-sm' : 'text-subtle hover:text-text'"
              @click="statusFilter = ''; refreshData()"
            >
              All
            </button>
            <button
              class="flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
              :class="statusFilter === 'active' ? 'bg-surface text-text shadow-sm' : 'text-subtle hover:text-text'"
              @click="statusFilter = 'active'; refreshData()"
            >
              Active
            </button>
            <button
              class="flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
              :class="statusFilter === 'revoked' ? 'bg-surface text-text shadow-sm' : 'text-subtle hover:text-text'"
              @click="statusFilter = 'revoked'; refreshData()"
            >
              Revoked
            </button>
          </div>
        </template>
      </AdminTableFilters>

      <!-- Offline State (Highest Priority) -->
      <AdminOfflineTableState v-if="!isOnline" />

      <!-- Loading State -->
      <div v-else-if="loading" class="p-12 text-center">
        <Icon name="svg-spinners:ring-resize" class="size-8 text-primary mx-auto mb-4" />
        <p class="text-subtle text-sm">Loading members...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="members.length === 0" class="p-12 text-center">
        <Icon name="material-symbols:group" class="size-12 text-subtle/50 mx-auto mb-4" />
        <p class="text-text font-medium mb-1">No members found</p>
        <p class="text-subtle text-sm">Try adjusting your filters or search terms</p>
      </div>

      <!-- Table with horizontal scroll -->
      <AdminScrollContainer v-else>
        <table class="w-full min-w-[900px]">
            <thead class="bg-background sticky top-0 z-10">
              <tr>
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  ID
                </th>
                <AdminSortableHeader
                  label="Name"
                  field="full_name"
                  :current-sort="ordering"
                  @sort="handleSort"
                />
                <AdminSortableHeader
                  label="Email"
                  field="email"
                  :current-sort="ordering"
                  @sort="handleSort"
                />
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
                <AdminSortableHeader
                  label="Member Since"
                  field="member_since"
                  :current-sort="ordering"
                  @sort="handleSort"
                />
                <th
                  class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  Status
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
                class="group hover:bg-background transition-all duration-200 cursor-pointer active:scale-[0.99] [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
                @click="handleView(member.id)"
              >
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                  {{ member.id }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-text"
                >
                  {{ member.fullName }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
                >
                  {{ member.email }}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                  {{ member.degreeProgram }}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text">
                  {{ member.yearGraduated }}
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
                >
                  {{ formatDate(member.memberSince) }}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="member.isActive
                      ? 'bg-secondary/10 text-secondary'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'"
                  >
                    <span
                      class="size-1.5 rounded-full"
                      :class="member.isActive ? 'bg-secondary' : 'bg-red-500'"
                    />
                    {{ member.isActive ? 'Active' : 'Revoked' }}
                  </span>
                </td>
                <td
                  class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium"
                >
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-subtle hover:bg-background hover:text-text transition-all duration-200 active:scale-95"
                    @click.stop="handleView(member.id)"
                  >
                    <Icon name="material-symbols:visibility" class="size-3.5" />
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
      </AdminScrollContainer>

      <!-- Pagination -->
      <AdminTablePagination
        v-if="!loading && members.length > 0"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        :total-items="pagination.totalItems"
        :limit="pagination.limit"
        @page-change="handlePageChange"
        @limit-change="handleLimitChange"
      />
    </div>

    <!-- Scroll to Top -->
    <div
      v-if="!loading && members.length > 0"
      class="flex justify-center py-6"
    >
      <button
        class="inline-flex items-center gap-2 px-4 py-2 text-sm text-subtle hover:text-text rounded-lg hover:bg-surface transition-colors"
        @click="scrollToTop"
      >
        <Icon name="material-symbols:arrow-upward" class="size-4" />
        Scroll to Top
      </button>
    </div>

    <!-- View Modal -->
    <AdminModalAdminViewModal
      v-model="showViewModal"
      title="Member Details"
      :loading="loadingDetails"
    >
      <AdminViewMemberDetails :member="viewingMember" />
      
      <template #footer>
        <div class="flex items-center gap-2 w-full">
          <button
            class="px-4 py-2 text-sm text-subtle hover:text-text hover:bg-background rounded-lg transition-colors mr-auto"
            @click="showViewModal = false"
          >
            Close
          </button>
          
          <template v-if="viewingMember">
            <!-- Reinstate button (for revoked members) -->
            <button
              v-if="!viewingMember.isActive"
              class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
              @click="showViewModal = false; openReinstateDialog({ id: viewingMember.id, name: getMemberName(viewingMember), email: viewingMember.personalDetails.email, memberSince: viewingMember.memberSince })"
            >
              <Icon name="material-symbols:undo" class="size-4" />
              Reinstate Membership
            </button>
            
            <!-- Revoke button (for active members) -->
            <button
              v-else
              class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
              @click="showViewModal = false; openRevokeDialog({ id: viewingMember.id, name: getMemberName(viewingMember), email: viewingMember.personalDetails.email, memberSince: viewingMember.memberSince })"
            >
              <Icon name="material-symbols:cancel" class="size-4" />
              Revoke Membership
            </button>
          </template>
        </div>
      </template>
    </AdminModalAdminViewModal>

    <!-- Revoke Dialog -->
    <AdminMemberRevokeDialog
      v-model="showRevokeDialog"
      :member-name="revokingMember?.name"
      :member-email="revokingMember?.email"
      :member-since="revokingMember?.memberSince"
      @confirm="confirmRevoke"
    />

    <!-- Reinstate Dialog -->
    <AdminMemberReinstateDialog
      v-model="showReinstateDialog"
      :member-name="reinstatingMember?.name"
      :member-email="reinstatingMember?.email"
      :member-since="reinstatingMember?.memberSince"
      @confirm="confirmReinstate"
    />
  </div>
</template>
