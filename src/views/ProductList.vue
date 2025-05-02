<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import navbar from "../components/navbar.vue";
import { getAllData } from "../libs/api.js";
import SelectAll from '@/components/SelectAll.vue';

const product = ref([])
const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

onMounted(async () => {
    try {
        const data = await getAllData(VITE_ROOT_API_URL + '/itb-mshop/v1/sale-items')
        // const data = await getAllData('http://localhost:8080/itb-mshop/v1/sale-items')
        product.value = data
        console.log(data)
        console.log(product.value)
    } catch (error) {
        console.log('โหลดข้อมูลสินค้าไม่สำเร็จ:', error.message);
        console.log('Error Bro eiei');
        console.log('Error noob: '+ROOT_API_URL + '/itb-mshop/v1/sale-items');
    };

})
</script>
<template>
    <navbar />
  
    <SelectAll 
    :product="product"
    />
  </template>


<style scoped></style>