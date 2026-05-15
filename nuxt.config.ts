// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // Global CSS
  css: ["~/styles/css/styles.css"],
  // configure vite to use tailwindcss
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["nuxt-auth-sanctum"],

  sanctum: {
    baseUrl: "http://172.22.64.11/52_feedbacksys/52_feedbacksys_api",
  },

  // sanctum: {
  //   baseUrl: "http://172.22.64.11/52_feedbacksys/52_feedbacksys_api",
  //   endpoints: {
  //     csrf: "/sanctum/csrf-cookie",
  //     login: "/login",
  //     logout: "/logout",
  //     user: "/api/user",
  //   },
  //   globalMiddleware: true,
  // },

  ssr: false,
  nitro: {
    preset: "static", // generate เป็น static file
  },
  app: {
    // head: {
    //   title: "51_amleadercall",
    //   meta: [
    //     { name: "viewport", content: "width=device-width, initial-scale=1" },
    //     {
    //       name: "description",
    //       content: "51_amleadercall",
    //     },
    //   ],
    //   link: [
    //     {
    //       rel: "icon",
    //       type: "image/svg+xml",
    //       href: "Leader Call AM.svg",
    //     },
    //   ],
    // },
    baseURL: "/52_feedbacksys/52_feedbacksys_F/",
    buildAssetsDir: "_nuxt/", // โฟลเดอร์เก็บ assets
    cdnURL: "",
  },
});
