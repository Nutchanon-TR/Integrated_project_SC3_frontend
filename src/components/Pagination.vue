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
  onBeforeUnmount,
} from "vue";
import { getAllData } from "../libs/api.js";
import { useRoute } from "vue-router";
import BrandDropdown from "./BrandDropdown.vue";

const props = defineProps({
  productTotalPages: Number,
  initialPage: Number,
  initialSize: Number,
  initialFilterBrands: String,
  initialSortField: String,
  initialSortDirection: String,
  showFilter: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true },
});

const emit = defineEmits(["urlSetting"]);
const URL = import.meta.env.VITE_ROOT_API_URL;

// Initialize reactive variables with props
const filterBrands = ref(props.initialFilterBrands || "");
const page = ref(props.initialPage || 1);
const itbmPage = ref((props.initialPage || 1) - 1);
const size = ref(props.initialSize || 10);
const sortField = ref(props.initialSortField || "");
const sortDirection = ref(props.initialSortDirection || "");
const selectedBrandList = ref([]);
const brandDropdown = ref(null);
const options = ref([]);
const selected = ref(null);
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

// Initialize selectedBrandList from filterBrands
onMounted(() => {
  //console.log("Pagination mounted");
  //console.log("Props:", props);

  // Initialize selectedBrandList from filterBrands
  if (filterBrands.value) {
    selectedBrandList.value = filterBrands.value
      .split(",")
      .filter((brand) => brand.trim() !== "");
  }

  // Load saved pagination size
  const savedSize = localStorage.getItem("pagination-size");
  if (savedSize && !props.initialSize) {
    size.value = parseInt(savedSize, 10);
  }

  // Add click outside listener
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleClickOutside = (event) => {
  if (!dropdownRef.value || !(dropdownRef.value instanceof HTMLElement)) return;
  if (!dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

const totalPage = computed(() => props.productTotalPages);

// Watch for prop changes
watch(
  () => props.initialFilterBrands,
  (newVal) => {
    filterBrands.value = newVal || "";
    if (newVal) {
      selectedBrandList.value = newVal
        .split(",")
        .filter((brand) => brand.trim() !== "");
    } else {
      selectedBrandList.value = [];
    }
  }
);

watch(
  () => props.initialPage,
  (newVal) => {
    if (newVal) {
      page.value = newVal;
      itbmPage.value = newVal - 1;
    }
  }
);

watch(
  () => props.initialSize,
  (newVal) => {
    if (newVal) {
      size.value = newVal;
    }
  }
);

const settings = computed(() => ({
  filterBrands: selectedBrandList.value.join(","),
  page: itbmPage.value , // Convert back to 1-based index for display
  size: size.value,
  sortField: sortField.value,
  sortDirection: sortDirection.value,
}));

const emitUrlSetting = () =>  {
  //  settings = {
  //   filterBrands: selectedBrandList.value.join(","),
  //   page: itbmPage.value,
  //   size: size.value,
  //   sortField: sortField.value,
  //   sortDirection: sortDirection.value,
  // };
  //console.log("Emitting settings:", settings);
   console.log("page.value: ", page.value);
  console.log("sortField.value: ", sortField.value);
  console.log("sortDirection.value: ", sortDirection.value);
  emit("urlSetting", settings.value);
}

const goToPage = async (pageNumber) => {
  page.value = pageNumber;
  itbmPage.value = pageNumber - 1;

  const localStorageRaw = localStorage.getItem("product-page-settings");
  let localStorageValue = {};
  try {
    if (localStorageRaw) {
      localStorageValue = JSON.parse(localStorageRaw);
    }
  } catch (error) {
    console.error("Error parsing localStorage:", error);
  }

  sortDirection.value = localStorageValue.sortDirection || "desc";
  sortField.value = localStorageValue.sortField || "createdOn";


  emitUrlSetting();
};


const setSize = (newsize) => {
  size.value = newsize;
  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
};

const sortAsc = () => {
  sortDirection.value = "asc";
  sortField.value = "brand.name";
  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
};

const sortDesc = () => {
  sortDirection.value = "desc";
  sortField.value = "brand.name";
  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
};

const resetSort = () => {
  sortDirection.value = "desc";
  sortField.value = "createdOn";
  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
};

function onBrandSelected(brandName) {
  const brandObj = options.value.find((b) => b.name === brandName);
  selected.value = brandObj;
  if (brandObj && !selectedBrandList.value.includes(brandObj.name)) {
    selectedBrandList.value.push(brandObj.name);
  }
  filterBrands.value = selectedBrandList.value.join(",");
  emitUrlSetting();
  // dropdownOpen.value = false; // ปิด dropdown หลังเลือก
}

function removeBrand(index) {
  selectedBrandList.value.splice(index, 1);
  filterBrands.value = selectedBrandList.value.join(",");
  if (brandDropdown.value && brandDropdown.value.resetSelection) {
    brandDropdown.value.resetSelection();
  }

  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
}

function clearBrand() {
  selectedBrandList.value = [];
  filterBrands.value = "";
  if (brandDropdown.value && brandDropdown.value.resetSelection) {
    brandDropdown.value.resetSelection();
  }
  page.value = 1;
  itbmPage.value = 0;
  emitUrlSetting();
}

// Toggle dropdown function
const toggleDropdown = (event) => {
  event.stopPropagation();
  dropdownOpen.value = !dropdownOpen.value;
};

onMounted(async () => {
  try {
    const data = await getAllData(`${URL}/itb-mshop/v1/brands`);
    //console.log(data);
    options.value = data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("โหลดแบรนด์ล้มเหลว:", error.message);
  }
});
</script>

<template>
  <div class="p-4 space-y-6 text-sm text-gray-800 max-w-4xl mx-auto">
    <div v-if="showFilter" class="filter flex gap-8 flex-wrap">
      <!-- 🔽 Brand Filter -->
      <section class="space-y-3 w-80">
        <h2 class="font-semibold text-lg">กรองตามแบรนด์</h2>
        <div ref="dropdownRef" class="relative w-full">
          <button
            class="itbms-brand-filter px-4 py-2 border rounded cursor-pointer bg-white w-full text-left"
            @click="toggleDropdown"
            data-cy="brand-dropdown-toggle"
          >
            {{ selected?.name || "-- เลือกแบรนด์ --" }}
          </button>

          <div
            class="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto"
            v-show="dropdownOpen"
            data-cy="brand-options"
            :data-dropdown-open="dropdownOpen"
          >
            <div
              v-for="opt in options"
              :key="opt.id"
              class="itbms-filter-item px-4 py-2 hover:bg-blue-100 cursor-pointer"
              @click="onBrandSelected(opt.name)"
              @mousedown.prevent
              data-cy="brand-option"
              :data-brand-name="opt.name"
            >
              {{ opt.name }}
            </div>
          </div>
        </div>

        <!-- แบรนด์ที่เลือก -->
        <ul class="itbms-selected-brands flex flex-wrap gap-2">
          <li
            v-if="selectedBrandList.length === 0"
            class="text-gray-400 italic"
          >
            No brand selected.
          </li>
          <li
            v-for="(brand, i) in selectedBrandList"
            :key="i"
            class="flex items-center bg-gray-100 border border-gray-300 rounded px-3 py-1"
          >
            <span class="itbms-filter-item">{{ brand }}</span>
            <button
              @click="removeBrand(i)"
              class="itbms-filter-item-clear ml-2 text-red-500 hover:text-red-700"
              aria-label="ลบแบรนด์"
            >
              ×
            </button>
          </li>
        </ul>

        <!-- ปุ่มยืนยัน/ล้าง -->
        <div class="flex gap-2">
          <button
            @click="clearBrand"
            class="itbms-brand-filter-clear flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            ❌ ล้างแบรนด์
          </button>
        </div>
      </section>

      <!-- 🔁 Sorting -->
      <section class="space-y-2 w-64">
        <h2 class="font-semibold text-lg">จัดเรียงสินค้า</h2>
        <div class="flex gap-3 flex-wrap">
          <button
            @click="sortAsc"
            class="itbms-brand-asc flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-blue-100 transition"
          >
            ⬆️ น้อย → มาก
          </button>
          <button
            @click="sortDesc"
            class="itbms-brand-desc flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-blue-100 transition"
          >
            ⬇️ มาก → น้อย
          </button>
          <button
            @click="resetSort"
            class="itbms-brand-none flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-red-100 transition"
          >
            ♻️ ล้างการจัดเรียง
          </button>
        </div>
      </section>

      <!-- 📄 Page Size -->
      <section class="space-y-2 w-48">
        <label for="size" class="font-medium mr-2">จำนวนรายการต่อหน้า:</label>
        <select
          id="size"
          v-model="size"
          @change="setSize(size)"
          class="itbms-page-size border border-gray-300 rounded px-3 py-1 focus:ring-blue-400 focus:ring-2"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </section>
    </div>

    <div v-if="showPagination" class="Pagination">
      <!-- ⏩ Pagination -->
      <section>
        <div class="flex flex-wrap gap-2 items-center">
          <button
            @click="goToPage(1)"
            :disabled="page === 1"
            class="itbms-page-first px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ⏮ First
          </button>
          <button
            @click="goToPage(Math.max(1, page - 1))"
            :disabled="page === 1"
            class="itbms-page-prev px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ◀ Prev
          </button>

          <template v-for="(p, index) in totalPage" :key="p">
            <button
              @click="goToPage(p)"
              :class="[
                `itbms-page-${index}`,
                'px-3 py-1 rounded transition',
                page === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200',
              ]"
            >
              {{ p }}
            </button>
          </template>

          <button
            @click="goToPage(Math.min(totalPage, page + 1))"
            :disabled="page === totalPage"
            class="itbms-page-next px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next ▶
          </button>
          <button
            @click="goToPage(totalPage)"
            :disabled="page === totalPage"
            class="itbms-page-last px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Last ⏭
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
