<script setup>
import { ref, onMounted,defineProps, watchEffect } from "vue";
import { getAllData } from "@/libs/api";

const prop = defineProps({
  brandError: {
    type: Boolean,
  },
  brandName: {
    type: String,
    default: 'All Brands'
  },
});

const errorColor = ref("border-gray-300");

watchEffect(() => {
  if(prop.brandError) {
    errorColor.value = "border-red-300";
  } else {
    errorColor.value = "border-gray-300";
  }
});

const isOpen = ref(false)
const selected = ref(prop.brandName || 'All Brands');
const options = ref([])
const emit = defineEmits(["sendBranId","sendBranName"])
const URL = import.meta.env.VITE_ROOT_API_URL

const sendBrand = (name,id) =>{
  selected.value = name
  isOpen.value = false
  prop.brandError = false
  errorColor.value = "border-gray-300"
  emit("sendBrandId",id)
  emit("sendBrandName",name)
  console.log("sendBrandId: ",name)
  console.log("sendBrandId: ",id)
}
onMounted(async () => {
  try {
    const data = await getAllData(`${URL}/itb-mshop/v1/brands`);
    data.sort((a, b) => a.name.localeCompare(b.name));
    options.value = data
    console.log("Brands loaded:", options.value);
    console.log("load brand input: ",prop.brandError);
    console.log("load brandName input: ",prop.brandName);
    if (prop.brandName) {
      selected.value = prop.brandName;
    }
  } catch (error) {
    console.error("โหลดข้อมูลแบรนด์ไม่สำเร็จ:", error.message);
  }
});
</script>

<template>
  <div class="relative inline-block text-left">
    <!-- ปุ่มหลัก -->
    <button
      @click="isOpen = !isOpen"
      type="button"
      :class="[
        'inline-flex justify-between items-center w-48 px-4 py-2 bg-white border rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50',
        errorColor,
      ]"
    >
      {{ selected }}
      <svg
        class="-mr-1 ml-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- ตัวเลือก dropdown -->
    <div
      v-if="isOpen"
      class="origin-top-right absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
    >
      <div class="py-1 max-h-60 overflow-y-auto">
        <button
          v-for="option in options"
          :key="option"
          @click="
            selected = option;
            isOpen = false;
            sendBrand(option.name,option.id)
          "
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700"
        >
          {{ option.name }}
        </button>
      </div>
    </div>
  </div>
</template>
