<script setup lang="ts">
const route = useRoute();
const isSidebarExpanded = ref(false);
const isMobileMenuOpen = ref(false);

const navigationItems = [
  {
    name: "Dashboard",
    icon: "material-symbols:dashboard",
    href: "/admin/dashboard",
  },
  {
    name: "Applicants",
    icon: "material-symbols:pending-actions",
    href: "/admin/applicants",
  },
  {
    name: "Members",
    icon: "material-symbols:verified",
    href: "/admin/members",
  },
  {
    name: "Alumni",
    icon: "material-symbols:group",
    href: "/admin/alumni",
  },
];

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background">
    <!-- Header - Full Width -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <AppNavbar
        :show-menu-button="true"
        @toggle-menu="isMobileMenuOpen = !isMobileMenuOpen"
      />
    </div>

    <!-- Container for Sidebar and Main Content -->
    <div class="flex pt-14" style="min-height: calc(100vh - 56px)">
      <!-- Desktop Sidebar wrapper -->
      <div
        class="hidden lg:block w-16 shrink-0"
        style="height: calc(100vh - 56px)"
      >
        <aside
          class="fixed left-0 border-r border-border flex flex-col overflow-y-auto overflow-x-hidden transition-all duration-200 bg-surface"
          :class="isSidebarExpanded ? 'shadow-2xl' : ''"
          :style="{
            top: '56px',
            height: 'calc(100vh - 56px)',
            width: isSidebarExpanded ? '256px' : '64px',
            backgroundColor: 'var(--color-surface)',
            zIndex: 999,
          }"
          @mouseenter="isSidebarExpanded = true"
          @mouseleave="isSidebarExpanded = false"
        >
          <!-- Navigation -->
          <nav class="flex-1 px-2 pt-2 space-y-1">
            <NuxtLink
              v-for="item in navigationItems"
              :key="item.href"
              :to="item.href"
              class="h-10 transition-all duration-200 ease-in-out flex items-center rounded-lg text-sm font-medium overflow-hidden active:scale-[0.97]"
              :class="[
                route.path === item.href
                  ? 'bg-primary text-white'
                  : 'text-text hover:bg-background',
                isSidebarExpanded ? 'w-full' : 'w-10 justify-center',
              ]"
            >
              <div class="flex items-center justify-center w-10 shrink-0">
                <Icon :name="item.icon" class="w-5 h-5" />
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
            <NuxtLink
              to="/admin/login"
              class="h-10 transition-all duration-200 ease-in-out flex items-center rounded-lg text-sm font-medium text-text hover:bg-background overflow-hidden active:scale-[0.97]"
              :class="isSidebarExpanded ? 'w-full' : 'w-10 justify-center'"
            >
              <div class="flex items-center justify-center w-10 shrink-0">
                <Icon name="material-symbols:logout" class="w-5 h-5" />
              </div>
              <span
                v-if="isSidebarExpanded"
                class="text-sm whitespace-nowrap pl-2 transition-opacity duration-200"
              >
                Logout
              </span>
            </NuxtLink>
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
        class="lg:hidden fixed inset-0 z-[100] bg-black/50"
        style="top: 56px"
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
                <Icon name="material-symbols:close" class="w-5 h-5" />
              </button>
            </div>

            <nav class="space-y-2">
              <NuxtLink
                v-for="item in navigationItems"
                :key="item.href"
                :to="item.href"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out active:scale-[0.97]"
                :class="
                  route.path === item.href
                    ? 'bg-primary text-white'
                    : 'text-text hover:bg-background'
                "
                @click="closeMobileMenu"
              >
                <Icon :name="item.icon" class="w-5 h-5" />
                <span>{{ item.name }}</span>
              </NuxtLink>

              <!-- Logout -->
              <NuxtLink
                to="/admin/login"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text hover:bg-background transition-all duration-200 ease-in-out active:scale-[0.97] border-t border-border mt-2 pt-4"
                @click="closeMobileMenu"
              >
                <Icon name="material-symbols:logout" class="w-5 h-5" />
                <span>Logout</span>
              </NuxtLink>
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
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-active > div,
.mobile-menu-leave-active > div {
  transition: transform 0.3s ease;
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
