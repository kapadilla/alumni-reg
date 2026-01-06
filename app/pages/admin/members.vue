<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const {
  members,
  pagination,
  loading,
  fetchMembers,
  exportMembersCSV,
} = useMembers();

const searchQuery = ref("");

onMounted(() => {
  fetchMembers();
});

const handleSearch = () => {
  fetchMembers({ search: searchQuery.value });
};
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
        <h2
          class="text-lg font-semibold text-text flex items-center gap-3 leading-none"
        >
          Total Members
          <span
            class="text-xs font-semibold size-6 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center -translate-y-px"
          >
            {{ members.length }}
          </span>
        </h2>
        <button
          class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          @click="exportMembersCSV"
        >
          Export CSV
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <Icon name="svg-spinners:ring-resize" class="size-8 text-primary mx-auto mb-4" />
        <p class="text-subtle text-sm">Loading members...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="members.length === 0" class="p-12 text-center">
        <Icon name="material-symbols:group" class="size-12 text-subtle/50 mx-auto mb-4" />
        <p class="text-text font-medium mb-1">No members yet</p>
        <p class="text-subtle text-sm">Approved members will appear here</p>
      </div>

      <!-- Table with horizontal scroll -->
      <div v-else class="overflow-x-auto">
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
                {{ member.memberSince }}
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
