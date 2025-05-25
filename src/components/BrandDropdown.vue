<script setup>
import { ref, defineProps, watchEffect, onBeforeMount, watch, defineExpose, computed } from "vue";
import { getAllData } from "@/libs/api";
import { useRouter } from "vue-router";

// Props
const prop = defineProps({
  brandError: Boolean,
  brandName: {
    type: String,
    default: "All Brands",
  },
  reloadData: {
    type: Number
  },
  modelvalue: String,
});


const emit = defineEmits(["sendBrandId", "sendBrandName", "update:modelValue"]);

// States
const errorColor = ref("border-gray-300");
const selectedId = ref(prop.modelvalue || '');
const options = ref([]);
const brand = ref('');
const isOpen = ref(false); // สำหรับเปิด/ปิด dropdown
const URL = import.meta.env.VITE_ROOT_API_URL;
const router = useRouter();

// Computed
const selectedBrand = computed(() => {
  if (!selectedId.value) return 'เลือกแบรนด์';
  const found = options.value.find(b => b.id === selectedId.value);
  return found ? found.name : 'เลือกแบรนด์';
});

// Update border color on brandError
watchEffect(() => {
  errorColor.value = prop.brandError ? "border-red-300" : "border-gray-300";
});

async function fetchBrands() {
  try {
    const data = await getAllData(`${URL}/itb-mshop/v1/brands`);
    console.log("response from API", data);
    if (data?.error === "not_found") {
      brand.value = "404_not_found";
      setTimeout(() => router.push("/sale-items"), 2000);
      return;
    }

    data.sort((a, b) => a.name.localeCompare(b.name));
    options.value = data;

    // กำหนด selectedId จาก brandName ที่รับมา
    const found = data.find((b) => b.name === prop.brandName);
    if (found) {
      selectedId.value = found.id;
      emit("sendBrandId", found.id);
      emit("sendBrandName", found.name);
    }
  } catch (error) {
    console.error("โหลดข้อมูลแบรนด์ไม่สำเร็จ:", error.message);
    alert("เกิดข้อผิดพลาดในการโหลดแบรนด์");
  }
}

onBeforeMount(() => {
  fetchBrands();
});


watch(() => prop.reloadData, () => {
  fetchBrands();
});

// Toggle dropdown
function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

// Close dropdown when clicking outside
function closeDropdown() {
  isOpen.value = false;
}

// Select brand
function selectBrand(option) {
  selectedId.value = option.id;
  emit("sendBrandId", option.id);
  emit("sendBrandName", option.name);
  emit("update:modelValue", option.name);
  isOpen.value = false;
}

function resetSelection() {
  selectedId.value = "";
}

defineExpose({
  resetSelection,
});
</script>

<template>
  <!-- แจ้งเตือน 404 -->
  <div
    v-if="brand === '404_not_found'"
    class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-300 text-red-800 text-sm px-6 py-3 rounded-md shadow-lg z-50 flex items-center space-x-2"
  >
    <svg
      class="w-5 h-5 text-red-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01M12 5a7 7 0 11-7 7 7 7 0 017-7z"
      />
    </svg>
    <span>ไม่พบข้อมูลแบรนด์ที่คุณเลือก</span>
  </div>

  <!-- Custom Dropdown -->
  <div class="w-48 relative" v-click-outside="closeDropdown">
    <!-- Dropdown Button -->
    <div
      @click="toggleDropdown"
      :class="`itbms-brand cursor-pointer w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between ${errorColor}`"
      data-testid="brand-dropdown"
    >

      <span class="text-gray-700">{{ selectedBrand }}</span>
      <!-- Arrow Icon -->
      <svg 
        :class="`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Dropdown Options -->
    <div
      v-show="isOpen"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto transition-all duration-200"
      data-testid="brand-options"
    >
      <div
        v-for="option in options"
        :key="option.id"
        @click="selectBrand(option)"
        :class="`itbms-filter-item cursor-pointer px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${selectedId === option.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`"
        :data-testid="`brand-option-${option.id}`"
        :data-value="option.id"
      >
        {{ option.name }}
      </div>
    </div>

    <p class="mt-2 text-xs text-gray-500">จำนวน options: {{ options.length }}</p>
  </div>
</template>
