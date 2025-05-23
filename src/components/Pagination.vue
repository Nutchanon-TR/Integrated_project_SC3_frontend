<script setup>
import { ref, onMounted } from "vue";
import { getAllData } from "../libs/api.js";
import { useRoute } from "vue-router";
const page = ref(0);
const itbmPage = ref(0);
const size = ref(4);
const sortField = ref("createdAt");
const sortDirection = ref("desc");

const totalPage = ref(10);

const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;
const goToPage = (pageNumber) => {
  page.value = pageNumber;
  itbmPage.value = pageNumber - 1;
  console.log("page.value: ", page.value);
};
</script>

<template>
  <p>page: {{ page }}</p>
  <p>size: {{ size }}</p>
  <p>sortField(SortBy): {{ sortField }}</p>
  <p>sortDirection: {{ sortDirection }}</p>
  <p>itbme-page-: {{ itbmPage }}</p>
  <br />
  <br />
  <div class="flex space-x-2">
    <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
      First
    </button>
    <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
      Prev
    </button>
    <span v-for="page in totalPage">
      <button
        @click="goToPage(page)"
        class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
      >
        {{ page }}
      </button>
    </span>
    <!-- <button class="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded">1</button> -->
    <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
      Next
    </button>
    <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
      Last
    </button>
  </div>

  ิ<br />
  <div class="space-y-3">
    <span>Size: </span>
    <input
      type="number"
      placeholder="size"
      v-model="size"
      class="px-3 py-2 border border-gray-300 rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <div class="space-x-2">
      <button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
        Sort Default
      </button>
      <button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
        Sort BrandName
      </button>
    </div>
  </div>
</template>
