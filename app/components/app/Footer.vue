<template>
  <footer class="w-full bg-surface border-t border-border py-8 md:py-12">
    <div class="w-full max-w-7xl mx-auto px-6 md:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <!-- Left side: Logo and contact info -->
        <div class="flex flex-col gap-4">
          <!-- Logo and title -->
          <div class="flex items-center gap-3">
            <div
              class="w-16 h-16 bg-primary rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-2xl">UP</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-text leading-tight">
                University of the Philippines
              </h3>
              <p class="text-sm text-text">Alumni Association - Cebu Chapter</p>
            </div>
          </div>

          <!-- Contact info -->
          <div class="flex flex-col gap-2 text-sm text-subtle">
            <div class="flex items-start gap-2">
              <Icon
                name="material-symbols:location-on"
                class="w-5 h-5 text-primary shrink-0 mt-0.5"
              />
              <span class="select-all"
                >Gorordo Ave., Lahug, Cebu City, Cebu 6000</span
              >
            </div>
            <div class="flex items-center gap-2">
              <Icon
                name="material-symbols:mail"
                class="w-5 h-5 text-primary shrink-0"
              />
              <a
                href="mailto:oar.upcebu@up.edu.ph"
                class="hover:text-primary transition-colors select-all"
              >
                oar.upcebu@up.edu.ph
              </a>
            </div>
          </div>
        </div>

        <!-- Right side: Sections menu -->
        <div class="flex flex-col gap-4 md:items-end">
          <h3 class="text-primary font-bold text-xl uppercase tracking-wide">
            Sections
          </h3>
          <nav class="flex flex-col gap-2 text-sm md:text-right">
            <a
              href="#"
              class="text-subtle hover:text-primary transition-colors font-medium"
            >
              HOME
            </a>
            <a
              href="#"
              class="text-subtle hover:text-primary transition-colors font-medium"
            >
              FEATURES
            </a>
            <a
              href="#"
              class="text-subtle hover:text-primary transition-colors font-medium"
            >
              BIOGRAPHICAL TRIBUTES
            </a>
            <a
              href="#"
              class="text-subtle hover:text-primary transition-colors font-medium"
            >
              ALUMNI ENGAGEMENT
            </a>
            <a
              href="#"
              class="text-subtle hover:text-primary transition-colors font-medium"
            >
              REGISTRATION
            </a>
          </nav>
        </div>
      </div>
    </div>
  </footer>
</template>
