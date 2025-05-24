<script setup>
import {
  ref,
  onMounted,
  watchEffect,
  defineEmits,
  computed,
  defineProps,
  onBeforeMount,
  watch,
} from "vue";
import { getAllData } from "../libs/api.js";
import { useRoute } from "vue-router";
import BrandDropdown from "./BrandDropdown.vue"

const props = defineProps({
  productTotalPages: Number,
  initialPage: Number,
  initialSize: Number,
  initialFilterBrands: String,
  initialSortField: String,
  initialSortDirection: String,
});

const emit = defineEmits(["urlSetting"]);

// Initialize reactive variables with props
const filterBrands = ref(props.initialFilterBrands || "");
const page = ref(props.initialPage || 1);
const itbmPage = ref((props.initialPage || 1) - 1);
const size = ref(props.initialSize || 10);
const sortField = ref(props.initialSortField || "");
const sortDirection = ref(props.initialSortDirection || "");
const selectedBrandList = ref([]);
const brandDropdown = ref(null);

// Initialize selectedBrandList from filterBrands
onMounted(() => {
  console.log("Pagination mounted");
  console.log("Props:", props);
  
  // Initialize selectedBrandList from filterBrands
  if (filterBrands.value) {
    selectedBrandList.value = filterBrands.value.split(",").filter(brand => brand.trim() !== "");
  }
  
  // Load saved pagination size
  const savedSize = localStorage.getItem("pagination-size");
  if (savedSize && !props.initialSize) {
    size.value = parseInt(savedSize, 10);
  }
});

const totalPage = computed(() => props.productTotalPages);

// Watch for prop changes
watch(() => props.initialFilterBrands, (newVal) => {
  filterBrands.value = newVal || "";
  if (newVal) {
    selectedBrandList.value = newVal.split(",").filter(brand => brand.trim() !== "");
  } else {
    selectedBrandList.value = [];
  }
});

watch(() => props.initialPage, (newVal) => {
  if (newVal) {
    page.value = newVal;
    itbmPage.value = newVal - 1;
  }
});

watch(() => props.initialSize, (newVal) => {
  if (newVal) {
    size.value = newVal;
  }
});

function emitUrlSetting() {
  const settings = {
    filterBrands: selectedBrandList.value.join(","),
    page: itbmPage.value,
    size: size.value,
    sortField: sortField.value,
    sortDirection: sortDirection.value,
  };
  
  console.log("Emitting settings:", settings);
  emit("urlSetting", settings);
}

const goToPage = async (pageNumber) => {
  page.value = pageNumber;
  itbmPage.value = pageNumber - 1;
  console.log("page.value: ", page.value);
  emitUrlSetting();
};

const setSize = (newsize) => {
  size.value = newsize;
  page.value = 1;
  itbmPage.value = 0;
  localStorage.setItem("pagination-size", newsize);
  emitUrlSetting();
}

const sortAsc = () => {
  sortDirection.value = 'asc';
  sortField.value = 'brand.name';
  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
}

const sortDesc = () => {
  sortDirection.value = 'desc';
  sortField.value = 'brand.name';
  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
}

const resetSort = () => {
  sortDirection.value = '';
  sortField.value = '';
  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
}

function onBrandSelected(brandName) {
  if (brandName && !selectedBrandList.value.includes(brandName)) {
    selectedBrandList.value.push(brandName);
  }
}

function removeBrand(index) {
  selectedBrandList.value.splice(index, 1);
  if (brandDropdown.value && brandDropdown.value.resetSelection) {
    brandDropdown.value.resetSelection();
  }
}

function clearBrand() {
  selectedBrandList.value = [];
  filterBrands.value = '';
  if (brandDropdown.value && brandDropdown.value.resetSelection) {
    brandDropdown.value.resetSelection();
  }
  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
}

function confirmFilter() {
  filterBrands.value = selectedBrandList.value.join(",");
  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
}
</script>

<template>
  <div class="p-4 space-y-6 text-sm text-gray-800 max-w-4xl mx-auto">

    <!-- 🔽 Brand Filter -->
    <section class="space-y-3">
      <h2 class="font-semibold text-lg">กรองตามแบรนด์</h2>
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <BrandDropdown ref="brandDropdown" @sendBrandName="onBrandSelected" class="flex-1" />
      </div>

      <!-- แบรนด์ที่เลือก -->
      <ul class="flex flex-wrap gap-2">
        <li v-for="(brand, i) in selectedBrandList" :key="i"
          class="flex items-center bg-gray-100 border border-gray-300 rounded px-3 py-1">
          <span>{{ brand }}</span>
          <button @click="removeBrand(i)" class="ml-2 text-red-500 hover:text-red-700" aria-label="ลบแบรนด์">×</button>
        </li>
      </ul>

      <!-- ปุ่มยืนยัน/ล้าง -->
      <div class="flex gap-2">
        <button @click="confirmFilter"
          class="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          ✅ ยืนยันกรอง
        </button>
        <button @click="clearBrand"
          class="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">
          ❌ ล้างแบรนด์
        </button>
      </div>
    </section>

    <!-- 🔁 Sorting -->
    <section class="space-y-2">
      <h2 class="font-semibold text-lg">จัดเรียงสินค้า</h2>
      <div class="flex gap-3 flex-wrap">
        <button @click="sortAsc"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-blue-100 transition">
          ⬆️ น้อย → มาก
        </button>
        <button @click="sortDesc"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-blue-100 transition">
          ⬇️ มาก → น้อย
        </button>
        <button @click="resetSort"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-red-100 transition">
          ♻️ ล้างการจัดเรียง
        </button>
      </div>
    </section>

    <!-- 📄 Page Size -->
    <section>
      <label for="size" class="font-medium mr-2">จำนวนรายการต่อหน้า:</label>
      <select id="size" v-model="size" @change="setSize(size)"
        class="border border-gray-300 rounded px-3 py-1 focus:ring-blue-400 focus:ring-2">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </section>

    <!-- ⏩ Pagination -->
    <section>
      <div class="flex flex-wrap gap-2 items-center">
        <button @click="goToPage(1)" :disabled="page === 1"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">⏮ First</button>
        <button @click="goToPage(Math.max(1, page - 1))" :disabled="page === 1"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">◀ Prev</button>

        <template v-for="p in totalPage" :key="p">
          <button @click="goToPage(p)" :class="[
            'px-3 py-1 rounded transition',
            page === p ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          ]">
            {{ p }}
          </button>
        </template>

        <button @click="goToPage(Math.min(totalPage, page + 1))" :disabled="page === totalPage"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Next ▶</button>
        <button @click="goToPage(totalPage)" :disabled="page === totalPage"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Last ⏭</button>
      </div>
    </section>
  </div>
</template>