<script setup>
import SelectAllBrandList from "@/components/SelectAllBrandList.vue";
import { ref, onMounted } from "vue";
import { getAllData } from "../libs/api.js";

const brand = ref([]);
const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

onMounted(async () => {
  try {
    const brandDdta = await getAllData(
      VITE_ROOT_API_URL + "/itb-mshop/v1/brands"
    );

    brand.value = brandDdta;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  console.log(brand.value);
}

);

</script>
<template>
        <SelectAllBrandList :brand="brand"/>
</template>