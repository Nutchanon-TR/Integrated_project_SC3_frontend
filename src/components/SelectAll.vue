<script setup>
import { unitPrice, nullCatching } from "./../libs/utils.js"
const props = defineProps({
  product: Array,
  default: () => []
})

</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div v-if="product === '404_not_found'" class="text-center text-red-500 text-xl">
      ไม่พบข้อมูลสินค้าที่ร้องขอ (404)
    </div>

    <!-- แสดงเมื่อ array ว่าง -->
    <div v-else-if="!product || product.length === 0" class="itbms-no text-center text-gray-500 text-xl">
      no sale item
    </div>

    <!-- แสดงรายการสินค้าเมื่อมีข้อมูล -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <RouterLink v-for="(item, index) in product" :key="index" :to="`/sale-items/${item.id}`"
        class="itbms-row bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
        <img src="https://app-area.riointernational.com.bd/productImages/1738403480BRk6I.png" alt="product image"
          class="w-[300px] h-auto rounded shadow" />
        <h2 class="itbms-brand text-md font-semibold text-gray-800 truncate">{{ item.brandName }}</h2>
        <p class="itbms-model text-gray-600 text-sm">{{ item.model }}</p>
        <p class="itbms-ramGb text-gray-500 text-sm mt-2">{{ nullCatching(item.ramGb) }}</p>
        <p class="itbms-storageGb text-gray-500 text-sm mt-2">{{ nullCatching(item.storageGb) }}</p>
        <p class="itbms-storageGb-unit text-gray-500 text-sm mt-2">GB</p>
        <p class="itbms-price text-blue-600 font-bold mt-auto text-right">{{ unitPrice(item.price) }}</p>
        <p class="itbms-price-unit text-blue-600 font-bold mt-auto text-right">Baht</p>
      </RouterLink>
    </div>

  </div>
</template>