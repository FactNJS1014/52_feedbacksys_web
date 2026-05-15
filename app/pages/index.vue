<template>
  <!-- Login Page -->
  <div class="flex flex-col items-center p-6 w-full h-screen space-y-5">
    <div>
      <img src="/logo/user.png" alt="logo_user" width="150" />
    </div>
    <div>
      <h3 class="text-white font-bold text-[24px]">กรุณาเข้าสู่ระบบ</h3>
    </div>
    <div class="bg-white p-3 rounded-2xl w-full lg:w-[500px] h-auto">
      <form class="space-y-2" @submit.prevent="validateLogin">
        <div class="flex flex-col space-y-2">
          <label for="" class="text-blue-600 font-medium text-[16px]"
            >Username (กรอกรหัสพนักงาน)
            <span class="text-rose-500 ms-2">*</span></label
          >
          <input
            type="text"
            class="border border-gray-300 rounded-lg px-3 py-2 text-black font-medium focus:outline-none placeholder:text-gray-300"
            v-model="login.username"
            placeholder="Employee Code..."
          />
        </div>
        <div class="flex flex-col space-y-2">
          <label for="" class="text-blue-600 font-medium text-[16px]"
            >Password (กรอกรหัสพนักงาน)
            <span class="text-rose-500 ms-2">*</span></label
          >
          <input
            type="password"
            class="border border-gray-300 rounded-lg px-3 py-2 text-black font-medium focus:outline-none placeholder:text-gray-300"
            v-model="login.password"
            placeholder="Employee Code..."
          />
        </div>
        <div class="flex items-center justify-center mt-8">
          <button
            class="flex items-center px-3 py-2 bg-blue-600 rounded-lg hover:bg-white hover:text-blue-600"
          >
            <LogIn class="mr-2" />
            Sign In
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LogIn } from "lucide-vue-next";
useHead({
  title: "AOTH Feedback System - Login",
});
const { $api } = useNuxtApp();
const { refreshIdentity } = useSanctumAuth();

const login = ref({
  username: "",
  password: "",
});

const validateLogin = async () => {
  try {
    // 1. get csrf cookie
    await $api.get("/sanctum/csrf-cookie");

    // 2. read XSRF cookie
    const token = useCookie("XSRF-TOKEN");

    console.log("token :", token.value);

    // 2. login
    const res = await $api.post("/login", {
      username: login.value.username,
      password: login.value.password,
    });

    await $api.get("/api/user");
    await refreshIdentity();
    // 3. redirect
    await navigateTo(res.data.redirect);
  } catch (error) {
    console.log(error);
  }
};
</script>
