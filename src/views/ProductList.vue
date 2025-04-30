<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import navbar from "../components/navbar.vue";
import { getAllData } from "../libs/api.js";

const product = ref([])

onMounted(async () => {
    try {
        const data = await getAllData('http://localhost:8080/itb-mshop/v1/sale-items')
        product.value = data
        console.log(data)
        console.log(product.value)
    } catch (error) {
        console.log('โหลดข้อมูลสินค้าไม่สำเร็จ:', error.message);
    };

})
</script>
<template>
    <navbar />
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4 text-blue-700">รายการสินค้า</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

            <RouterLink v-for="(product, index) in product" :key="index" :to="`/detail/${product.id}`"
                class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7-4Kw3Lmj2fSe9KqTfNMyozK9ALqM8SIwAA&s"
                    alt="product image" class="w-full h-40 object-cover rounded mb-3" />
                <h2 class="text-lg font-semibold">{{ product.model }}</h2>
                <p class="text-gray-600 text-sm mb-2">{{ product.brandName }}</p>
                <p class="text-blue-600 font-bold text-right">{{ product.price }} บาท</p>
            </RouterLink>

        </div>
    </div>

</template>


<style scoped></style>