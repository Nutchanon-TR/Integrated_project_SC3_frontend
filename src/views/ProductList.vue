<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  defineProps,
  watch,
  watchEffect,
  computed,
  onBeforeMount,
} from "vue";
import { getAllData, getAllDataPage } from "../libs/api.js";
import SelectAllSaleItemList from "@/components/SelectAllSaleItemList.vue";
import SelectAllSaleItemGallery from "@/components/SelectAllSaleItemGallery.vue";
import Pagination from "./../components/Pagination.vue";

const product = ref([]);
const brand = ref([]);
const urlSetting = ref("");
// const urlSetting = ref({});
const productTotalPages = ref(0);
const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

onBeforeMount(async () => {
  await fetchProduct();
  window.addEventListener("storage", onStorageChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("storage", onStorageChange);
});

function onStorageChange(event) {
  if (event.key === "product-updated") {
    console.log("Product data changed in another tab");
    fetchProduct(); // โหลดข้อมูลใหม่
  }
}

const fetchProduct = async () => {
  try {
    //product
    const productData = await getAllData(
      `${VITE_ROOT_API_URL}/itb-mshop/v2/sale-items?page=0`
    );
    product.value = productData;
    productTotalPages.value = productData.totalPages;
    //brand
    const brandDdta = await getAllData(
      VITE_ROOT_API_URL + "/itb-mshop/v1/brands"
    );
    brand.value = brandDdta;
    console.log("product.value: ", product.value.content);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const handleUrlSetting = async (newUrl) => {
  urlSetting.value = newUrl;
  const productData = await getAllData(
    `${VITE_ROOT_API_URL}/itb-mshop/v2/sale-items${urlSetting.value}`
  );
  // const productData = await getAllDataPage(`${VITE_ROOT_API_URL}/itb-mshop/v2/sale-items`, urlSetting.value);
  product.value = productData;
  productTotalPages.value = productData.totalPages;
  console.log(
    "urlSetting: ",
    `${VITE_ROOT_API_URL}/itb-mshop/v2/sale-items${urlSetting.value}`
  );
};
</script>
<template>
  <div class="flex items-center justify-between gap-4 mx-[225px] mt-[50px]">
    <RouterLink :to="{ name: 'ProuctCreate' }"
      class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-m font-medium px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span class="itbms-sale-item-add tracking-wide">New Product</span>
    </RouterLink>

    <RouterLink :to="{ name: 'ProductManage' }"
      class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-m font-medium px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span class="itbms-manage-brand tracking-wide">Manage Sale Items</span>
    </RouterLink>
  </div>
  <Pagination @urlSetting="handleUrlSetting" :productTotalPages="productTotalPages" />
  <SelectAllSaleItemGallery :product="product.content" />
</template>
