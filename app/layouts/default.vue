<template>
  <div>
    <nav
      class="h-14 w-full flex items-center border-b border-border justify-between px-6"
    >
      <h3 class="font-serif text-primary dark:text-text">
        UP Cebu Alumni Registration Form
      </h3>
      <DarkModeToggle />
    </nav>
    <main class="w-7xl">
      <slot />
    </main>
  </div>
</template>
