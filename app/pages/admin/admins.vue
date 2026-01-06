<script setup lang="ts">
import type { Admin, CreateAdminPayload, UpdateAdminPayload } from "~/types";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const {
  admins,
  loading,
  total,
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = useAdmins();

// Modal state
const showModal = ref(false);
const modalMode = ref<"create" | "edit">("create");
const editingAdmin = ref<Admin | null>(null);

// Form state
const form = reactive({
  email: "",
  password: "",
  first_name: "",
  last_name: "",
});

// Delete confirmation
const showDeleteConfirm = ref(false);
const deletingAdmin = ref<Admin | null>(null);

// Fetch data on mount
onMounted(() => {
  fetchAdmins();
});

// Open create modal
const openCreateModal = () => {
  modalMode.value = "create";
  editingAdmin.value = null;
  form.email = "";
  form.password = "";
  form.first_name = "";
  form.last_name = "";
  showModal.value = true;
};

// Open edit modal
const openEditModal = (admin: Admin) => {
  modalMode.value = "edit";
  editingAdmin.value = admin;
  form.email = admin.email;
  form.password = "";
  form.first_name = admin.first_name;
  form.last_name = admin.last_name;
  showModal.value = true;
};

// Handle form submit
const handleSubmit = async () => {
  if (modalMode.value === "create") {
    const payload: CreateAdminPayload = {
      email: form.email,
      password: form.password,
      first_name: form.first_name || undefined,
      last_name: form.last_name || undefined,
    };
    const result = await createAdmin(payload);
    if (result) {
      showModal.value = false;
      fetchAdmins();
    }
  } else if (editingAdmin.value) {
    const payload: UpdateAdminPayload = {
      email: form.email !== editingAdmin.value.email ? form.email : undefined,
      password: form.password || undefined,
      first_name: form.first_name || undefined,
      last_name: form.last_name || undefined,
    };
    const result = await updateAdmin(editingAdmin.value.id, payload);
    if (result) {
      showModal.value = false;
      fetchAdmins();
    }
  }
};

// Open delete confirmation
const openDeleteConfirm = (admin: Admin) => {
  deletingAdmin.value = admin;
  showDeleteConfirm.value = true;
};

// Handle delete
const handleDelete = async () => {
  if (!deletingAdmin.value) return;
  const success = await deleteAdmin(deletingAdmin.value.id);
  if (success) {
    showDeleteConfirm.value = false;
    deletingAdmin.value = null;
    fetchAdmins();
  }
};

// Format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <div class="p-4 md:p-8 w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text mb-2">
        Admin Management
      </h1>
      <p class="text-subtle">Manage admin users who can access this portal</p>
    </div>

    <!-- Main Content -->
    <div class="bg-surface rounded-xl border border-border overflow-hidden">
      <!-- Table Header -->
      <div
        class="p-4 md:p-6 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h2
          class="text-lg font-semibold text-text flex items-center gap-3 leading-none"
        >
          Admin Users
          <span
            class="text-xs font-semibold size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center -translate-y-px"
          >
            {{ total }}
          </span>
        </h2>
        <button
          class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
          @click="openCreateModal"
        >
          <Icon name="material-symbols:add" class="size-4" />
          Add Admin
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <Icon
          name="svg-spinners:ring-resize"
          class="size-8 text-primary mx-auto mb-4"
        />
        <p class="text-subtle text-sm">Loading admins...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="admins.length === 0" class="p-12 text-center">
        <Icon
          name="material-symbols:admin-panel-settings"
          class="size-12 text-subtle/50 mx-auto mb-4"
        />
        <p class="text-text font-medium mb-1">No admins found</p>
        <p class="text-subtle text-sm">
          Create your first admin user to get started
        </p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[700px]">
          <thead class="bg-background">
            <tr>
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
                Status
              </th>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Joined
              </th>
              <th
                class="px-4 md:px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider"
              >
                Last Login
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
              v-for="admin in admins"
              :key="admin.id"
              class="hover:bg-background transition-colors"
            >
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-text"
              >
                <div class="flex flex-col">
                  <span>
                    {{
                      admin.first_name || admin.last_name
                        ? `${admin.first_name} ${admin.last_name}`
                        : "(No Name)"
                    }}
                  </span>
                </div>
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ admin.email }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="
                    admin.is_active
                      ? 'bg-secondary/10 text-secondary'
                      : 'bg-red-500/10 text-red-500'
                  "
                >
                  {{ admin.is_active ? "Active" : "Inactive" }}
                </span>
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ formatDate(admin.date_joined) }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ admin.last_login ? formatDate(admin.last_login) : "Never" }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 active:scale-95"
                    @click="openEditModal(admin)"
                    title="Edit Admin"
                  >
                    <Icon name="material-symbols:edit" class="size-3.5" />
                    Edit
                  </button>
                  <button
                    v-if="admin.is_active"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all duration-200 active:scale-95"
                    @click="openDeleteConfirm(admin)"
                    title="Deactivate Admin"
                  >
                    <Icon name="material-symbols:person-off" class="size-3.5" />
                    Deactivate
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="dialog">
        <div
          v-if="showModal"
          class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="showModal = false"
          />
          <div
            class="relative bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden"
          >
            <!-- Header -->
            <div class="p-6 pb-4">
              <div class="flex items-center gap-4">
                <div
                  class="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                >
                  <Icon
                    :name="
                      modalMode === 'create'
                        ? 'material-symbols:person-add'
                        : 'material-symbols:edit'
                    "
                    class="size-7 text-primary"
                  />
                </div>
                <h2 class="text-lg font-semibold text-text">
                  {{ modalMode === "create" ? "Add New Admin" : "Edit Admin" }}
                </h2>
                <button
                  class="size-8 rounded-lg hover:bg-background flex items-center justify-center text-subtle hover:text-text transition-colors ml-auto"
                  @click="showModal = false"
                >
                  <Icon name="material-symbols:close" class="size-5" />
                </button>
              </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="px-6 pb-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <FormInput
                  v-model="form.first_name"
                  label="First Name"
                />
                <FormInput
                  v-model="form.last_name"
                  label="Last Name"
                />
              </div>

              <FormInput
                v-model="form.email"
                type="email"
                label="Email"
              />

              <FormInput
                v-model="form.password"
                type="password"
                label="Password"
                :required="modalMode === 'create'"
                :minlength="8"
                :hint="modalMode === 'edit' ? 'Leave blank to keep current' : undefined"
              />

              <!-- Footer -->
              <div class="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium rounded-xl border border-border text-text hover:bg-background transition-colors"
                  @click="showModal = false"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 text-sm font-medium rounded-xl bg-primary text-white hover:bg-opacity-90 transition-colors flex items-center gap-2"
                >
                  <Icon
                    :name="
                      modalMode === 'create'
                        ? 'material-symbols:add'
                        : 'material-symbols:check'
                    "
                    class="size-4"
                  />
                  {{ modalMode === "create" ? "Create Admin" : "Save Changes" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="dialog">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="showDeleteConfirm = false"
          />
          <div
            class="relative bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div class="p-6 text-center">
              <div
                class="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"
              >
                <Icon
                  name="material-symbols:warning"
                  class="size-8 text-red-500"
                />
              </div>
              <h3 class="text-lg font-semibold text-text mb-2">
                Deactivate Admin?
              </h3>
              <p class="text-subtle text-sm mb-6">
                This will prevent
                <strong>{{ deletingAdmin?.first_name }}</strong> from logging
                in. This action can be reversed.
              </p>
              <div class="flex items-center justify-center gap-3">
                <button
                  class="px-4 py-2 text-sm font-medium rounded-xl border border-border text-text hover:bg-background transition-colors"
                  @click="showDeleteConfirm = false"
                >
                  Cancel
                </button>
                <button
                  class="px-4 py-2 text-sm font-medium rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                  @click="handleDelete"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-active > div:last-child,
.dialog-leave-active > div:last-child {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}

.dialog-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>
