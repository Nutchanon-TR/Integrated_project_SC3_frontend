<script setup>
import {
  ref,
  onMounted,
  watchEffect,
  defineEmits,
  computed,
  defineProps,
  onBeforeMount,
} from "vue";
import { getAllData } from "../libs/api.js";
import { useRoute } from "vue-router";

const props = defineProps({
  productTotalPages: Number,
});

onMounted(() => {
  console.log("Pagination mounted");
  console.log(props.productTotalPages);
});

const totalPage = computed(() => props.productTotalPages);
const emit = defineEmits(["urlSetting"]);
const filterBrands = ref([]);
const page = ref(1);
const itbmPage = ref(0);
const size = ref(10);
const sortField = ref("");
const sortDirection = ref("");
const urlSetting = computed(() => {
  return `?filterBrands=&page=${itbmPage.value}&size=${size.value}&sortField=${sortField.value}&sortDirection=${sortDirection.value}`;
// return {
//         filterBrands: selectedBrands.value,
//         page: itbmPage.value,
//         size: size.value,
//         sortField: sortField.value,
//         sortDirection: sortDirection.value
//     }
});

const goToPage = async (pageNumber) => {
  page.value = pageNumber;
  itbmPage.value = pageNumber - 1;
  console.log("page.value: ", page.value);
  console.log("urlSetting.value page: ", urlSetting.value);
  emit("urlSetting", urlSetting.value);
};
</script>

<template>
  <p>{{ urlSetting }}</p>
  <p>page: {{ page }}</p>
  <p>size: {{ size }}</p>
  <p>sortField(SortBy): {{ sortField }}</p>
  <p>sortDirection: {{ sortDirection }}</p>
  <p>itbme-page-: {{ itbmPage }}</p>
  <br />
  <div class="flex space-x-2">
    <button
      @click="goToPage(1)"
      class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
    >
      First
    </button>
    <button
      @click="goToPage(Math.max(1, page - 1))"
      :disabled="page <= 1"
      class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
    >
      Prev
    </button>

    <!-- page number buttons -->
    <span v-for="p in totalPage" :key="p">
      <button
        @click="goToPage(p)"
        :class="[
          'px-3 py-1 rounded',
          page === p
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 hover:bg-gray-300',
        ]"
      >
        {{ p }}
      </button>
    </span>

    <button
      @click="goToPage(Math.min(totalPage, page + 1))"
      :disabled="page >= totalPage"
      class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
    >
      Next
    </button>

    <button
      @click="goToPage(totalPage)"
      class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
    >
      Last
    </button>
  </div>

  <br />
  <div class="space-y-3">
    <span>Size: </span>
    <input
      type="number"
      placeholder="size"
      v-model="size"
      class="px-3 py-2 border border-gray-300 rounded w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
</template>