<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDataById } from "../libs/api.js";

const route = useRoute()
const product = ref({})

onMounted(async () => {
  try {
    const data = await getDataById(`http://ip24sc3.sit.kmutt.ac.th:8080/itb-mshop/v1/sale-items`, route.params.id)
    // const data = await getDataById(`http://localhost:8080/itb-mshop/v1/sale-items`, route.params.id)
    product.value = data
    console.log(product.value)
  } catch (error) {
    console.log('โหลดข้อมูลสินค้าไม่สำเร็จ:', error.message)
  }
})
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- รูปภาพและรายละเอียดสินค้า -->
    <div class="grid md:grid-cols-2 gap-8 items-start">
      <!-- รูปภาพสินค้า -->
      <img src="https://app-area.riointernational.com.bd/productImages/1738403480BRk6I.png" alt="Smartphone Image"
        class="w-full h-60 object-contain rounded-xl shadow-lg bg-white" />



      <!-- รายละเอียด -->
      <div class="flex flex-col space-y-4">
        <h1 class="text-3xl font-bold text-gray-800">{{ product.model }}</h1>
        <p class="text-lg text-gray-600">แบรนด์: <span class="font-semibold">{{ product.brandName }}</span></p>

        <div class="flex flex-wrap gap-4 text-blue-600 text-lg font-semibold">
          <span class="bg-blue-50 px-3 py-1 rounded-full">💸 {{ product.price }} บาท</span>
          <span class="bg-blue-50 px-3 py-1 rounded-full">🧠 {{ product.ramGb }} GB RAM</span>
          <span class="bg-blue-50 px-3 py-1 rounded-full">💾 {{ product.storageGb }} GB</span>
          <span class="bg-blue-50 px-3 py-1 rounded-full">🎨 {{ product.color }}</span>
        </div>

        <p class="text-gray-700 leading-relaxed mt-4">
          {{ product.description || 'ไม่มีรายละเอียดเพิ่มเติมของสินค้าในขณะนี้' }}
        </p>
      </div>
    </div>

    <!-- ปุ่มกลับไปหน้ารายการ -->
    <div class="mt-10">
      <RouterLink to="/products">
        <button class="text-blue-600 hover:underline text-sm">← กลับไปหน้ารายการสินค้า</button>
      </RouterLink>
    </div>
  </div>
</template>