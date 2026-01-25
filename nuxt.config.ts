import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/fonts", "@nuxt/eslint", "@nuxt/icon", "@nuxt/image"],
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css", "vue-sonner/style.css"],
  compatibilityDate: "2025-07-15",
  runtimeConfig: {
    public: {
      apiBaseUrl: "http://127.0.0.1:8000/api/v1",
      mediaBaseUrl: "http://127.0.0.1:8000",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
        quotes: "double",
        commaDangle: "always-multiline",
        indent: "tab",
      },
    },
  },
});
