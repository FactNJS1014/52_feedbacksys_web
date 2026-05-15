<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Calendar,
  Hash,
  User,
  Building2,
  MessageSquare,
  Paperclip,
  Send,
  ChevronDown,
  Briefcase,
  Tag,
  LogOut,
} from "lucide-vue-next";

useHead({
  title: "AOTH Feedback System - Comment Form",
});

const { $api } = useNuxtApp();
const { user, refreshIdentity } = useSanctumAuth();

const formData = ref({
  date: new Date().toISOString().substr(0, 10),
  employeeCode: "",
  fullName: "",
  department: "",
  position: "",
  categoryPurpose: "",
  message: "",
  files: null,
});

const fetchEmployeeDetails = async () => {
  try {
    const response = await $api.get("/api/get-details-users");
    const details_user = response.data.details;

    const filteredEmployees = details_user.filter(
      (employee) => employee.EmpID === formData.value.employeeCode,
    );
    console.log(filteredEmployees);
    if (filteredEmployees.length > 0) {
      formData.value.fullName =
        filteredEmployees[0].FNameEng + " " + filteredEmployees[0].LNameEng;
      formData.value.department = filteredEmployees[0].Section;
      formData.value.position = filteredEmployees[0].Position;
    } else {
      formData.value.fullName = "";
      formData.value.department = "";
      formData.value.position = "";
    }
  } catch (error) {
    console.error("Error fetching employee details:", error);
  }
};

const categoryPurposes = [
  "General",
  "สวัสดิการ",
  "ความปลอดภัย",
  "ข้อเสนอแนะ",
  "การบริหาร",
];

const handleFileChange = (event) => {
  const target = event.target;

  if (target.files && target.files.length > 0) {
    formData.value.files = target.files[0];
  }
};

const resizeImage = (file, maxWidth = 900, quality = 0.8) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // resize ตามสัดส่วน
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          const resizedFile = new File([blob], file.name, { type: file.type });

          resolve(resizedFile);
        },
        file.type,
        quality,
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

const handleSubmit = async () => {
  try {
    const data = new FormData();

    data.append("date", formData.value.date);
    data.append("employeeCode", formData.value.employeeCode);
    data.append("fullName", formData.value.fullName);
    data.append("department", formData.value.department);
    data.append("position", formData.value.position);
    data.append("categoryPurpose", formData.value.categoryPurpose);
    data.append("message", formData.value.message);

    // file
    if (formData.value.files) {
      const file = formData.value.files;

      // ถ้าเป็น image
      if (file.type.startsWith("image/")) {
        const resizedImage = await resizeImage(file);

        data.append("file", resizedImage);
      }
      // ถ้าเป็น pdf
      else if (file.type === "application/pdf") {
        data.append("file", file);
      }
    }

    const response = await $api.post("/api/post-comments", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.message == "Success") {
      Swal.fire({
        title: "Success!",
        text: "Your comment has been added.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 1000,
        didClose: () => {
          formData.value = {
            date: new Date().toISOString().substr(0, 10),
            employeeCode: "",
            fullName: "",
            department: "",
            position: "",
            categoryPurpose: "",
            message: "",
            files: null,
          };
        },
      });

      formData.value = {
        date: new Date().toISOString().substr(0, 10),
        employeeCode: "",
        fullName: "",
        department: "",
        position: "",
        categoryPurpose: "",
        message: "",
        files: null,
      };

      await $api.post("/logout");

      user.value = null; // ถ้า library อนุญาต

      await navigateTo("/", { replace: true });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Your comment has not been added.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const handleLogout = async () => {
  await $api.post("/logout");

  user.value = null; // ถ้า library อนุญาต

  await navigateTo("/", { replace: true });
};

if (user.value.username === "1250002") {
  navigateTo("/ListFeedback");
}

onMounted(async () => {
  await refreshIdentity();
  formData.value.employeeCode = user.value.username;

  await fetchEmployeeDetails();
});
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
    <!-- Main Card -->
    <div
      class="w-full max-w-6xl bg-white border border-blue-100 rounded-[40px] shadow-2xl shadow-blue-900/40 p-8 sm:p-12 transition-all duration-500 hover:shadow-blue-900/50"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-10">
        <div class="text-center sm:text-left">
          <h1 class="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            AOTH Feedback System
          </h1>
          <p class="text-lg text-slate-600 font-medium">
            We'd love to hear your thoughts and feedback.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="handleLogout"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Row 1: Date & Employee Code -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="group">
            <label
              class="flex items-center gap-2 text-base font-semibold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600"
            >
              <Calendar :size="18" class="text-blue-500" />
              Date
            </label>
            <div class="relative">
              <input
                v-model="formData.date"
                type="date"
                class="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-4 text-blue-900 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300 appearance-none"
              />
            </div>
          </div>
          <div class="group">
            <label
              class="flex items-center gap-2 text-base font-semibold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600"
            >
              <Hash :size="18" class="text-blue-500" />
              Employee Code
            </label>
            <input
              v-model="formData.employeeCode"
              type="text"
              placeholder="EMP-888"
              class="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300"
            />
          </div>
        </div>

        <!-- Row: Full Name & Category Purpose -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="group">
            <label
              class="flex items-center gap-2 text-base font-semibold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600"
            >
              <User :size="18" class="text-blue-500" />
              Full Name
            </label>
            <input
              v-model="formData.fullName"
              type="text"
              placeholder="Sarah Connor"
              class="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300"
            />
          </div>
          <!-- Department -->
          <div class="group">
            <label
              class="flex items-center gap-2 text-base font-semibold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600"
            >
              <Building2 :size="18" class="text-blue-500" />
              Department
            </label>
            <input
              v-model="formData.department"
              type="text"
              class="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300"
            />
          </div>
        </div>

        <!-- Row 2: Department & Position -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Position -->
          <div class="group">
            <label
              class="flex items-center gap-2 text-base font-semibold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600"
            >
              <Briefcase :size="18" class="text-blue-500" />
              Position
            </label>
            <input
              v-model="formData.position"
              type="text"
              class="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300"
            />
          </div>
          <!-- Category Purpose -->
          <div class="group">
            <label
              class="flex items-center gap-2 text-base font-semibold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600"
            >
              <Tag :size="18" class="text-blue-500" />
              Purpose (วัตถุประสงค์)
            </label>
            <div class="relative">
              <select
                v-model="formData.categoryPurpose"
                class="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-4 text-slate-900 appearance-none focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300"
              >
                <option value="" disabled class="bg-white text-slate-400">
                  Select Purpose
                </option>
                <option
                  v-for="cat in categoryPurposes"
                  :key="cat"
                  :value="cat"
                  class="bg-white text-slate-900"
                >
                  {{ cat }}
                </option>
              </select>
              <div
                class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400"
              >
                <ChevronDown :size="20" />
              </div>
            </div>
          </div>
        </div>

        <!-- Message -->
        <div class="group">
          <label
            class="flex items-center gap-2 text-base font-semibold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600"
          >
            <MessageSquare :size="18" class="text-blue-500" />
            Your Message
          </label>
          <textarea
            v-model="formData.message"
            rows="5"
            placeholder="Tell us what's on your mind..."
            class="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300 resize-none"
          ></textarea>
        </div>

        <!-- File Upload -->
        <div class="group">
          <label
            class="flex items-center gap-2 text-base font-semibold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-blue-600"
          >
            <Paperclip :size="18" class="text-blue-500" />
            Attach Files
          </label>
          <div class="relative group/file">
            <input
              @change="handleFileChange"
              type="file"
              class="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-4 text-slate-900 file:mr-6 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-all cursor-pointer focus:outline-none focus:border-blue-400 transition-all duration-300"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-6">
          <button
            type="submit"
            class="flex items-center justify-center gap-3 w-full bg-linear-to-br from-blue-600 to-blue-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/30 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-900/50 active:translate-y-0 active:scale-[0.98] transition-all duration-300 text-xl tracking-wide uppercase"
          >
            <Send :size="24" />
            Send Feedback
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
/* Custom styles for the date picker and select arrow */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: none;
  cursor: pointer;
}

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23cbd5e1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
