<script setup lang="ts">
import type { Admin, CreateAdminPayload, UpdateAdminPayload } from "~/types";
import AdminDetailsModal from "~/components/admin/modal/AdminDetailsModal.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Admin Users - UP Cebu Alumni Association",
});


const {
  admins,
  loading,
  total,
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  reactivateAdmin,
} = useAdmins();

// View modal state
const showViewModal = ref(false);
const viewingAdmin = ref<Admin | null>(null);

// Modal state
const showModal = ref(false);
const modalMode = ref<"create" | "edit">("create");
const editingAdmin = ref<Admin | null>(null);

// Form state
const form = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
});

// Delete confirmation
const showDeleteConfirm = ref(false);
const deletingAdmin = ref<Admin | null>(null);

// Reactivate confirmation
const showReactivateConfirm = ref(false);
const reactivatingAdmin = ref<Admin | null>(null);

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
  form.firstName = "";
  form.lastName = "";
  showModal.value = true;
};

// Open edit modal
const openEditModal = (admin: Admin) => {
  modalMode.value = "edit";
  editingAdmin.value = admin;
  form.email = admin.email;
  form.password = "";
  form.firstName = admin.firstName;
  form.lastName = admin.lastName;
  showModal.value = true;
};

// Open view modal
const openViewModal = (admin: Admin) => {
  viewingAdmin.value = admin;
  showViewModal.value = true;
};

// Handle edit from view modal
const handleEditFromView = (admin: Admin) => {
  showViewModal.value = false;
  openEditModal(admin);
};

// Handle form submit
const handleSubmit = async () => {
  if (modalMode.value === "create") {
    const payload: CreateAdminPayload = {
      email: form.email,
      password: form.password,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
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
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
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

// Open reactivate confirmation
const openReactivateConfirm = (admin: Admin) => {
  reactivatingAdmin.value = admin;
  showReactivateConfirm.value = true;
};

// Handle reactivate
const handleReactivate = async () => {
  if (!reactivatingAdmin.value) return;
  const success = await reactivateAdmin(reactivatingAdmin.value.id);
  if (success) {
    showReactivateConfirm.value = false;
    reactivatingAdmin.value = null;
    fetchAdmins();
  }
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


      <!-- Table with horizontal scroll -->
      <AdminScrollContainer v-else>
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
              class="group hover:bg-background transition-all duration-200 cursor-pointer active:scale-[0.99] [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
              @click="openViewModal(admin)"
            >
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-text"
              >
                <div class="flex flex-col">
                  <span v-if="admin.firstName || admin.lastName">
                    {{ `${admin.firstName} ${admin.lastName}` }}
                  </span>
                  <span v-else class="italic text-subtle font-normal">
                    No name
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
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    admin.isActive
                      ? 'bg-secondary/10 text-secondary'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  "
                >
                  <span
                    class="size-1.5 rounded-full"
                    :class="admin.isActive ? 'bg-secondary' : 'bg-red-500'"
                  />
                  {{ admin.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{ formatDate(admin.dateJoined) }}
              </td>
              <td
                class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-subtle"
              >
                {{
                  admin.lastLogin || admin.last_login
                    ? formatDate(admin.lastLogin || admin.last_login)
                    : "Never"
                }}
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm" @click.stop>
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
                    v-if="admin.isActive"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all duration-200 active:scale-95"
                    @click="openDeleteConfirm(admin)"
                    title="Deactivate Admin"
                  >
                    <Icon name="material-symbols:person-off" class="size-3.5" />
                     Deactivate
                  </button>
                  <button
                    v-else
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-all duration-200 active:scale-95"
                    @click="openReactivateConfirm(admin)"
                    title="Reactivate Admin"
                  >
                    <Icon name="material-symbols:person-check" class="size-3.5" />
                    Reactivate
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </AdminScrollContainer>
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
                  v-model="form.firstName"
                  label="First Name"
                />
                <FormInput
                  v-model="form.lastName"
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
                <strong>{{ deletingAdmin?.firstName }}</strong> from logging
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

    <!-- Reactivate Confirmation Modal -->
    <Teleport to="body">
      <Transition name="dialog">
        <div
          v-if="showReactivateConfirm"
          class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="showReactivateConfirm = false"
          />
          <div
            class="relative bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div class="p-6 text-center">
              <div
                class="size-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"
              >
                <Icon
                  name="material-symbols:person-check"
                  class="size-8 text-green-500"
                />
              </div>
              <h3 class="text-lg font-semibold text-text mb-2">
                Reactivate Admin?
              </h3>
              <p class="text-subtle text-sm mb-6">
                This will allow
                <strong>{{ reactivatingAdmin?.firstName }}</strong> to log in
                again.
              </p>
              <div class="flex items-center justify-center gap-3">
                <button
                  class="px-4 py-2 text-sm font-medium rounded-xl border border-border text-text hover:bg-background transition-colors"
                  @click="showReactivateConfirm = false"
                >
                  Cancel
                </button>
                <button
                  class="px-4 py-2 text-sm font-medium rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
                  @click="handleReactivate"
                >
                  Reactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Admin Details Modal -->
    <AdminDetailsModal
      v-model="showViewModal"
      :admin="viewingAdmin"
      @edit="handleEditFromView"
    />
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
