<script setup lang="ts">
const route = useRoute();
const { logout } = useAuth();

const isSidebarExpanded = ref(false);
const isMobileMenuOpen = ref(false);

const navigationItems = [
  {
    name: "Dashboard",
    icon: "material-symbols:dashboard",
    href: "/admin/dashboard",
  },
  {
    name: "Alumni Verification",
    icon: "material-symbols:person-check",
    href: "/admin/alumni-verification",
  },
  {
    name: "Payment Verification",
    icon: "material-symbols:payments",
    href: "/admin/payment-verification",
  },
  {
    name: "Rejected",
    icon: "material-symbols:cancel",
    href: "/admin/rejected",
  },
  {
    name: "Members",
    icon: "material-symbols:verified",
    href: "/admin/members",
  },
  {
    name: "Admins",
    icon: "material-symbols:admin-panel-settings",
    href: "/admin/admins",
  },
  {
    name: "Form Settings",
    icon: "material-symbols:settings",
    href: "/admin/form-settings",
  },
];

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = async () => {
  closeMobileMenu();
  await logout();
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background">
    <!-- Network Status Toast -->
    <AppNetworkToast />

    <!-- Header - Full Width -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <AdminNavbar @toggle-menu="isMobileMenuOpen = !isMobileMenuOpen" />
    </div>

    <!-- Container for Sidebar and Main Content -->
    <div class="flex pt-14 min-h-[calc(100vh-56px)]">
      <!-- Desktop Sidebar wrapper -->
      <div class="hidden lg:block w-16 shrink-0 h-[calc(100vh-56px)]">
        <aside
          class="fixed left-0 top-14 h-[calc(100vh-56px)] border-r border-border flex flex-col overflow-y-auto overflow-x-hidden transition-all duration-200 bg-surface z-999"
          :class="[isSidebarExpanded ? 'shadow-2xl w-64' : 'w-16']"
          @mouseenter="isSidebarExpanded = true"
          @mouseleave="isSidebarExpanded = false"
        >
          <!-- Navigation -->
          <nav class="flex-1 px-2 pt-2 space-y-1">
            <NuxtLink
              v-for="item in navigationItems"
              :key="item.href"
              :to="item.href"
              class="h-10 transition-all duration-200 ease-in-out flex items-center rounded-lg text-sm font-medium overflow-hidden active:scale-[0.97] corner-squircle"
              :class="[
                route.path === item.href
                  ? 'bg-primary text-white'
                  : 'text-text hover:bg-background',
                isSidebarExpanded ? 'w-full' : 'w-10 justify-center',
              ]"
            >
              <div class="flex items-center justify-center w-10 shrink-0">
                <Icon :name="item.icon" class="size-5" />
              </div>
              <span
                v-if="isSidebarExpanded"
                class="text-sm whitespace-nowrap pl-2 transition-opacity duration-200"
              >
                {{ item.name }}
              </span>
            </NuxtLink>
          </nav>

          <!-- Logout -->
          <div class="px-2 pb-2 border-t border-border pt-2">
            <button
              class="h-10 transition-all duration-200 ease-in-out flex items-center rounded-lg text-sm font-medium text-text hover:bg-background overflow-hidden active:scale-[0.97] corner-squircle"
              :class="isSidebarExpanded ? 'w-full' : 'w-10 justify-center'"
              @click="handleLogout"
            >
              <div class="flex items-center justify-center w-10 shrink-0">
                <Icon name="material-symbols:logout" class="size-5" />
              </div>
              <span
                v-if="isSidebarExpanded"
                class="text-sm whitespace-nowrap pl-2 transition-opacity duration-200"
              >
                Logout
              </span>
            </button>
          </div>
        </aside>
      </div>

      <!-- Main content -->
      <main class="flex-1 relative overflow-x-hidden">
        <slot />
      </main>
    </div>

    <!-- Mobile Bottom Sheet Menu -->
    <Transition name="mobile-menu">
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden fixed inset-0 z-100 bg-black/50 top-14"
        @click="closeMobileMenu"
      >
        <div
          class="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl max-h-[80vh] overflow-y-auto"
          @click.stop
        >
          <!-- Mobile Navigation -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-text">Menu</h2>
              <button
                class="p-2 text-text hover:bg-background rounded-lg transition-colors"
                aria-label="Close menu"
                @click="closeMobileMenu"
              >
                <Icon name="material-symbols:close" class="size-5" />
              </button>
            </div>

            <nav class="space-y-2">
              <NuxtLink
                v-for="item in navigationItems"
                :key="item.href"
                :to="item.href"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out active:scale-[0.97] corner-squircle"
                :class="
                  route.path === item.href
                    ? 'bg-primary text-white'
                    : 'text-text hover:bg-background'
                "
                @click="closeMobileMenu"
              >
                <Icon :name="item.icon" class="size-5" />
                <span>{{ item.name }}</span>
              </NuxtLink>

              <!-- Logout -->
              <button
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text hover:bg-background transition-all duration-200 ease-in-out active:scale-[0.97] border-t border-border mt-2 pt-4 corner-squircle w-full"
                @click="handleLogout"
              >
                <Icon name="material-symbols:logout" class="size-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease-out;
}

.mobile-menu-enter-active > div,
.mobile-menu-leave-active > div {
  transition: transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from > div {
  transform: translateY(100%);
}

.mobile-menu-leave-to > div {
  transform: translateY(100%);
}
</style>
