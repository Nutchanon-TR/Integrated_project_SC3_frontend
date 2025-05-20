<script setup>
import { ref, onMounted,onBeforeUnmount } from "vue";
import { getAllData } from "../libs/api.js";
import SelectAllSaleItemList from "@/components/SelectAllSaleItemList.vue";
import SelectAllSaleItemGallery from "@/components/SelectAllSaleItemGallery.vue";

// alertStore.setMessage('The brand has been deleted.');

const product = ref([]);
const brand = ref([]);
const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

const fetchselect = async () => {
    try {
    const productData = await getAllData(
      VITE_ROOT_API_URL + "/itb-mshop/v1/sale-items"
    );
    product.value = productData;

    const brandDdta = await getAllData(
      VITE_ROOT_API_URL + "/itb-mshop/v1/brands"
    );
    brand.value = brandDdta;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('storage', onStorageChange);
});

function onStorageChange(event) {
  if (event.key === 'product-updated') {
    console.log('Product data changed in another tab');
    fetchselect(); // โหลดข้อมูลใหม่
  }
}


onMounted(async () => {
  await fetchselect();
  window.addEventListener('storage', onStorageChange);


});

</script>
<template>
       <div class="flex items-center justify-between gap-4 mx-[225px] mt-[50px]">
  <RouterLink
    :to="{ name: 'ProuctCreate' }"
    class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-m font-medium px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    <span class="itbms-sale-item-add tracking-wide">New Product</span>
  </RouterLink>

  <RouterLink
    :to="{ name: 'BrandManage' }"
    class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-m font-medium px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    <span class="itbms-manage-brand tracking-wide">Brand Manage</span>
  </RouterLink>
  
  </div>
        
        <SelectAllSaleItemList :product="product" @selestDeleted="fetchselect"/>



</template>