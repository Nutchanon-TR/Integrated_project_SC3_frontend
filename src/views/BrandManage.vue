<script setup>
import SelectAllBrandList from "@/components/SelectAllBrandList.vue";
import { ref, onMounted } from "vue";
import { getAllData } from "../libs/api.js";

const brand = ref([]);
const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;


const fetchBrands = async () => {
  try {
    const brandData = await getAllData(
      `${VITE_ROOT_API_URL}/itb-mshop/v1/brands`
    );
    brand.value = brandData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchBrands();
});
</script>

<template>
  <SelectAllBrandList :brand="brand" @brandDeleted="fetchBrands" />
</template>
