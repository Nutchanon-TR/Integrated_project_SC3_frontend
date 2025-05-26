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
import { useAlertStore } from "../stores/alertStore.js"

const product = ref([]);
const brand = ref([]);
const urlSetting = ref("");
const productTotalPages = ref(0);
const savedSettings = ref(null); // เพิ่ม reactive variable
const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;
const alertStore = useAlertStore();

// Add this helper function for consistent brand sorting
const sortProductsByBrandOrder = (products, brandOrder) => {
  if (!brandOrder || brandOrder.length === 0) return products;
  
  return products.sort((a, b) => {
    const brandA = a.brandName?.trim() || a.brand?.name?.trim() || "";
    const brandB = b.brandName?.trim() || b.brand?.name?.trim() || "";
    
    const indexA = brandOrder.indexOf(brandA);
    const indexB = brandOrder.indexOf(brandB);
    
    // Both brands are in the selected order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // Only brand A is in selected order (comes first)
    if (indexA !== -1 && indexB === -1) return -1;
    // Only brand B is in selected order (comes first)
    if (indexA === -1 && indexB !== -1) return 1;
    // Neither brand is in selected order (alphabetical)
    return brandA.localeCompare(brandB);
  });
};


onBeforeMount(async () => {
  const loadedSettings = loadSettingsFromLocal();
  savedSettings.value = loadedSettings;

  if (loadedSettings) {
    const url = buildUrlFromSettings(loadedSettings);
    urlSetting.value = url;
    console.log("urlSetting: ", urlSetting.value);
    const productData = await getAllData(`${VITE_ROOT_API_URL}/itb-mshop/v2/sale-items${url}`);

    // แก้ไข: เช็คว่าข้อมูลมาแล้วและมี content
    if (productData && productData.content) {
      if (loadedSettings.filterBrands && loadedSettings.filterBrands.trim() !== "") {
        const brandOrder = loadedSettings.filterBrands.split(",").map(brand => brand.trim());
        console.log("Initial brand order:", brandOrder);
        
        productData.content.sort((a, b) => {
          const brandA = a.brandName?.trim() || a.brand?.name?.trim() || "";
          const brandB = b.brandName?.trim() || b.brand?.name?.trim() || "";
          
          const indexA = brandOrder.indexOf(brandA);
          const indexB = brandOrder.indexOf(brandB);
          
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          if (indexA !== -1 && indexB === -1) return -1;
          if (indexA === -1 && indexB !== -1) return 1;
          return brandA.localeCompare(brandB);
        });
        
        console.log("Initial sorted products:", productData.content.map(p => p.brandName || p.brand?.name));
      }
    }

    product.value = productData;
    productTotalPages.value = productData.totalPages;
  } else {
    await fetchProduct();
  }
  window.addEventListener("storage", onStorageChange);
});

// เพิ่มฟังก์ชันช่วยเหลือสำหรับการเรียงลำดับ


onBeforeUnmount(() => {
  window.removeEventListener("storage", onStorageChange);
});

function onStorageChange(event) {
  if (event.key === "product-updated") {
    console.log("Product data changed in another tab");
    fetchProduct();
  }
}

function buildUrlFromSettings(settings) {
  const params = new URLSearchParams();
  // แก้ไขให้ consistent - ใช้ filterBrands
  if (settings.filterBrands !== undefined && settings.filterBrands !== "") {
    params.append("filterBrands", settings.filterBrands);
  }
  if (settings.page !== undefined) {
    params.append("page", settings.page);
  }
  if (settings.size !== undefined) {
    params.append("size", settings.size);
  }
  if (settings.sortField !== undefined && settings.sortField !== "") {
    params.append("sortField", settings.sortField);
  }
  if (settings.sortDirection !== undefined && settings.sortDirection !== "") {
    params.append("sortDirection", settings.sortDirection);
  }

  return "?" + params.toString();
}

const saveSettingsToLocal = (settings) => {
  localStorage.setItem("product-page-settings", JSON.stringify(settings));
  savedSettings.value = settings; // update reactive variable
};

const loadSettingsFromLocal = () => {
  const raw = localStorage.getItem("product-page-settings");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error parsing saved settings:", e);
      return null;
    }
  }
  return null;
};

const fetchProduct = async () => {
  try {
    const productData = await getAllData(
      `${VITE_ROOT_API_URL}/itb-mshop/v2/sale-items?page=0`
    );
    product.value = productData;
    productTotalPages.value = productData.totalPages;

    const brandData = await getAllData(
      VITE_ROOT_API_URL + "/itb-mshop/v1/brands"
    );
    brand.value = brandData;
    console.log("product.value: ", product.value.content);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};



const handleUserInteraction = async (newSettings) => {
  console.log("newSettings:", newSettings);
  saveSettingsToLocal(newSettings);

  const url = buildUrlFromSettings(newSettings);
  urlSetting.value = url;
  console.log("urlSetting2: ", urlSetting.value);
  console.log("🌐 Fetching:", `${VITE_ROOT_API_URL}/itb-mshop/v2/sale-items${url}`);

  try {
    const productData = await getAllData(`${VITE_ROOT_API_URL}/itb-mshop/v2/sale-items${url}`);
    
    // แก้ไข: เช็คว่าข้อมูลมาแล้วและมี content
    if (productData && productData.content) {
      // *** แก้ไขการเรียงลำดับตาม brand ***
      if (newSettings.filterBrands && newSettings.filterBrands.trim() !== "") {
        const brandOrder = newSettings.filterBrands.split(",").map(brand => brand.trim());
        console.log("Brand order:", brandOrder); // เพิ่ม log เพื่อ debug
        
        productData.content.sort((a, b) => {
          const brandA = a.brandName?.trim() || a.brand?.name?.trim() || "";
          const brandB = b.brandName?.trim() || b.brand?.name?.trim() || "";
          
          console.log("Comparing:", brandA, "vs", brandB); // เพิ่ม log เพื่อ debug
          
          const indexA = brandOrder.indexOf(brandA);
          const indexB = brandOrder.indexOf(brandB);
          
          // ถ้าทั้งสองอยู่ใน brand ที่เลือก ให้เรียงตามลำดับที่เลือก
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          // ถ้ามี brand ที่เลือกกับไม่เลือก ให้ brand ที่เลือกมาก่อน
          if (indexA !== -1 && indexB === -1) return -1;
          if (indexA === -1 && indexB !== -1) return 1;
          // ถ้าทั้งสองไม่อยู่ใน brand ที่เลือก ให้เรียงตามชื่อ
          return brandA.localeCompare(brandB);
        });
        
        console.log("Sorted products:", productData.content.map(p => p.brandName || p.brand?.name));
      }
    }
    
    product.value = productData;
    productTotalPages.value = productData.totalPages;
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
};
</script>

<template>
  <div class="flex items-center justify-between gap-4 mx-[225px] mt-[50px]">
    <!-- Alert Message -->
    <div v-if="alertStore.message" :class="`itbms-message px-4 py-2 rounded mb-4 ${alertStore.type === 'error'
      ? 'bg-red-100 text-red-700'
      : 'bg-green-100 text-green-700'
      }`">
      {{ alertStore.message }}
    </div>
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

  <Pagination @urlSetting="handleUserInteraction" :productTotalPages="productTotalPages"
    :initialPage="savedSettings?.page !== undefined ? Number(savedSettings.page) + 1 : 1"
    :initialSize="savedSettings?.size !== undefined ? Number(savedSettings.size) : 10"
    :initialFilterBrands="savedSettings?.filterBrands || ''" :initialSortField="savedSettings?.sortField || ''"
    :initialSortDirection="savedSettings?.sortDirection || ''" :showFilter="true" :show-pagination="true" />

  <SelectAllSaleItemGallery v-if="product?.content" :product="product.content" />

  <!-- <Pagination @urlSetting="handleUserInteraction" :productTotalPages="productTotalPages"
    :initialPage="savedSettings?.page !== undefined ? Number(savedSettings.page) + 1 : 1"
    :initialSize="savedSettings?.size !== undefined ? Number(savedSettings.size) : 10"
    :initialFilterBrands="savedSettings?.filterBrands || ''" :initialSortField="savedSettings?.sortField || ''"
    :initialSortDirection="savedSettings?.sortDirection || ''" :showFilter="false" :show-pagination="true" /> -->

</template>