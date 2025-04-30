<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDataById } from "../libs/api.js";

const route = useRoute()
const product = ref({})

onMounted(async () => {
    try {
        const data = await getDataById(`http://localhost:8080/itb-mshop/v1/sale-items`, route.params.id)
        product.value = data
        console.log(product.value)
    } catch (error) {
        console.log('โหลดข้อมูลสินค้าไม่สำเร็จ:', error.message)
    }
})
</script>

<template>
    <div class="p-6 max-w-4xl mx-auto">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7-4Kw3Lmj2fSe9KqTfNMyozK9ALqM8SIwAA&s"
        class="w-full h-80 object-cover rounded-lg shadow mb-6" />
        <h1 class="text-3xl font-bold mb-2">{{ product.model }}</h1>
        <p class="text-gray-700 mb-4">{{ product.brandName }}</p>
        <p class="text-blue-600 font-bold text-xl mb-4">{{ product.price }} บาท</p>
        <RouterLink to="/products" class="text-blue-500 hover:underline">← กลับไปหน้ารายการสินค้า</RouterLink>
    </div>
</template>
