<script setup>
import {unitPrice,nullCatching} from "./../libs/utils.js"
const props = defineProps({
    product: Array
}) 

</script>

<template>
    <div class="p-6 max-w-7xl mx-auto">
  
      <!-- แสดงเมื่อ array ว่าง -->
      <div v-if="!product || product.length === 0" class="text-center text-gray-500 text-xl">
        No Sale item
      </div>
  
      <!-- แสดงรายการสินค้าเมื่อมีข้อมูล -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <RouterLink
          v-for="(item, index) in product"
          :key="index"
          :to="`/detail/${item.id}`"
          class="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
        >
          <img
            src="https://app-area.riointernational.com.bd/productImages/1738403480BRk6I.png"
            alt="product image"
            class="w-[300px] h-auto rounded shadow"
          />
          <h2 class="text-md font-semibold text-gray-800 truncate">{{ item.brandName }}</h2>
          <p class="text-gray-600 text-sm">{{ item.model }}</p>
          <p class="text-gray-500 text-sm mt-2">{{ nullCatching(item.ramGb) }}/{{ nullCatching(item.storageGb) }} GB</p>
          <p class="text-blue-600 font-bold mt-auto text-right">{{ unitPrice(item.price) }} บาท</p>
        </RouterLink>
      </div>
  
    </div>
  </template>
  