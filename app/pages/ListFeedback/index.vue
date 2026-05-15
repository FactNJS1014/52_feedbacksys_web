<template>
  <div class="p-8">
    <div class="flex justify-between items-center">
      <div class="text-center sm:text-left">
        <h1
          class="text-3xl sm:text-4xl font-black text-white flex items-center gap-3 mb-2"
        >
          <List
            :size="42"
            class="text-white bg-linear-to-r from-sky-400 to-blue-500 rounded-lg p-2"
          />
          AOTH List Feedback
        </h1>
      </div>

      <div class="flex items-center gap-4 mb-2">
        <button
          @click="handleLogout"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <LogOut />
          Logout
        </button>
      </div>
    </div>

    <div class="table-container shadow-sm border">
      <div
        class="overflow-x-auto max-h-[calc(100vh-10rem)] overflow-y-auto w-full"
      >
        <table class="w-full" ref="tableRef">
          <thead class="sticky top-0 z-10">
            <tr>
              <th
                class="px-4 py-3 min-w-[150px] text-center text-sm font-bold text-slate-500 uppercase tracking-wider"
              ></th>
              <th
                class="px-4 py-3 text-left text-sm font-bold text-slate-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-4 py-3 min-w-[350px] text-left text-sm font-bold text-slate-500 uppercase tracking-wider"
              >
                Employee Name
              </th>
              <th
                class="px-4 py-3 min-w-[300px] text-left text-sm font-bold text-slate-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                class="px-4 py-3 min-w-[150px] text-left text-sm font-bold text-slate-500 uppercase tracking-wider"
              >
                Position
              </th>
              <th
                class="px-4 py-3 min-w-[200px] text-left text-sm font-bold text-slate-500 uppercase tracking-wider"
              >
                Category Purpose
              </th>
              <th
                class="px-4 py-3 min-w-[500px] text-left text-sm font-bold text-slate-500 uppercase tracking-wider"
              >
                Message
              </th>
              <th
                class="px-4 py-3 min-w-[150px] text-left text-sm font-bold text-slate-500 uppercase tracking-wider"
              >
                File
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filteredData"
              :key="index"
              class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
            >
              <td class="px-4 py-3 text-slate-900">
                <!-- อ่านแล้ว -->
                <div v-if="Number(item.SP_FEEDBACK_READ_STD) === 1">
                  <span
                    v-if="Number(item.SP_FEEDBACK_ACCEPT_STD) === 1"
                    class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    ACCEPTED
                  </span>

                  <span
                    v-else-if="Number(item.SP_FEEDBACK_DENY_STD) === 1"
                    class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    DECLINED
                  </span>
                </div>

                <!-- ยังไม่ได้อ่าน -->
                <div v-else class="flex items-center gap-2">
                  <button
                    class="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2 cursor-pointer transition"
                    @click="handleAccept(item.SP_FEEDBACK_ID)"
                  >
                    <CheckCircle :size="16" />
                    ACCEPT
                  </button>

                  <!-- <button
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center gap-2 cursor-pointer transition"
                    @click="handleDecline(item.SP_FEEDBACK_ID)"
                  >
                    <XCircle :size="16" />
                    DECLINE
                  </button> -->
                </div>
              </td>
              <td class="px-4 py-3 text-slate-900">
                {{ dayjs(item.SP_FEEDBACK_DATE).format("DD/MM/YYYY") }}
              </td>
              <td class="px-4 py-3 text-slate-900">
                {{ item.SP_FEEDBACK_FULLNAME }}
              </td>
              <td class="px-4 py-3 text-slate-900">
                {{ item.SP_FEEDBACK_DEPT }}
              </td>
              <td class="px-4 py-3 text-slate-900">
                {{ item.SP_FEEDBACK_POSITION }}
              </td>
              <td class="px-4 py-3 text-slate-900">
                {{ item.SP_FEEDBACK_PURPOSE }}
              </td>
              <td class="px-4 py-3 text-slate-900">
                {{ item.SP_FEEDBACK_MESSAGE }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <!-- IMAGE -->
                  <div
                    v-if="
                      item.SP_FEEDBACK_FILE && isImage(item.SP_FEEDBACK_FILE)
                    "
                  >
                    <img
                      :src="`http://127.0.0.1:8000/storage/${item.SP_FEEDBACK_FILE}`"
                      class="w-24 h-24 object-cover rounded border"
                      @click="
                        previewImage = `http://127.0.0.1:8000/storage/${item.SP_FEEDBACK_FILE}`
                      "
                    />
                  </div>

                  <!-- DOCUMENT -->
                  <a
                    v-else-if="item.SP_FEEDBACK_FILE"
                    :href="`http://localhost:8000/storage/${item.SP_FEEDBACK_FILE}`"
                    target="_blank"
                    class="bg-slate-500 text-white px-3 py-2 rounded flex items-center gap-2"
                  >
                    <Eye :size="16" />

                    {{ getFileName(item.SP_FEEDBACK_FILE) }}
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="filteredData.length === 0"
          class="p-8 text-center text-slate-500"
        >
          No comments found.
        </div>
      </div>
      <!-- PAGINATION -->

      <div class="p-4">
        <div class="flex gap-2 justify-end items-center">
          <button
            type="button"
            @click="prevPage"
            :disabled="currentPage == 1"
            :class="
              currentPage == 1
                ? 'px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed'
                : 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            "
          >
            Previous
          </button>

          <span class="text-blue-600 text-md font-medium flex items-center">
            {{ currentPage }} / {{ lastPage }}
          </span>

          <button
            type="button"
            @click="nextPage"
            :disabled="currentPage == lastPage"
            :class="
              currentPage == lastPage
                ? 'px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed'
                : 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="previewImage"
        class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        @click.self="previewImage = ''"
      >
        <div class="relative max-w-[90vw] max-h-[90vh]">
          <!-- Close Button -->
          <button
            @click="previewImage = ''"
            class="absolute -top-4 -right-4 w-9 h-9 flex items-center justify-center bg-white text-gray-700 rounded-full shadow-lg hover:bg-rose-500 hover:text-white transition z-10"
          >
            <X :size="18" />
          </button>
          <!-- Image -->
          <img
            :src="previewImage"
            class="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import { CheckCircle, LogOut, X, Eye, List } from "lucide-vue-next";
useHead({
  title: "AOTH Feedback System - List Feedback",
});

const { $api } = useNuxtApp();
const { user } = useSanctumAuth();

const filteredData = ref([]);
const previewImage = ref("");
const currentPage = ref(1);
const lastPage = ref(1);

const getListFeedback = async (page: number = 1) => {
  try {
    const response = await $api.get(`/api/get-list-comments?page=${page}`);

    filteredData.value = response.data.list_feedback;

    currentPage.value = response.data.current_page;

    lastPage.value = response.data.last_page;
    console.log("Current:", currentPage.value);
    console.log("Last:", lastPage.value);
  } catch (error) {
    console.error("Error fetching employee details:", error);
  }
};
const isImage = (file: string) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
};

const getFileName = (file: string) => {
  return file.split("/").pop();
};
const nextPage = async () => {
  console.log("NEXT CLICK");

  if (currentPage.value < lastPage.value) {
    await getListFeedback(currentPage.value + 1);
  }
};

const prevPage = async () => {
  console.log("PREV CLICK");

  if (currentPage.value > 1) {
    await getListFeedback(currentPage.value - 1);
  }
};

const handleAccept = async (id: number) => {
  console.log("ACCEPT", id);

  try {
    const response = await $api.put(`/api/put-status-accept`, {
      id: id,
    });
    if (response.data.message === "Success") {
      await getListFeedback(currentPage.value);
    }
  } catch (error) {
    console.error("Error updating status:", error);
  }
};
const handleDecline = async (id: number) => {
  console.log("DECLINE", id);

  try {
    const response = await $api.put(`/put-status-decline`, {
      id: id,
    });
    if (response.data.message === "Success") {
      await getListFeedback(currentPage.value);
    }
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

const handleLogout = async () => {
  try {
    await $api.post("/logout");

    user.value = null; // ถ้า library อนุญาต

    await navigateTo("/", { replace: true });
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

onMounted(() => {
  getListFeedback();
});
</script>
