<script setup>
import { onMounted } from "vue";
import { unitPrice, nullCatching } from "./../libs/utils.js"
const props = defineProps({
  product: Array,
  default: () => []
})

onMounted(() => {
  console.log('ProductList mounted')
  console.log(props.product)
})

</script>

<template>

  <div class="p-6 max-w-7xl mx-auto">
    <!-- แสดงเมื่อ array ว่าง -->
    <div v-if="!product || product.length === 0" class="itbms-no text-center text-gray-500 text-xl">
      no sale item
    </div>

    <!-- แสดงรายการสินค้าเมื่อมีข้อมูล -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <RouterLink v-for="(item, index) in product" :key="index" :to="`/sale-items/${item.id}`"
        class="itbms-row bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
        <img src="https://app-area.riointernational.com.bd/productImages/1738403480BRk6I.png" alt="product image"
          class="w-[300px] h-auto rounded shadow" />
        <h2 class="itbms-brand text-md font-semibold text-gray-800 truncate text-2xl mt-3">{{ item.brandName }}</h2>
        <p class="itbms-model text-gray-600 text-sm">{{ item.model }}</p>
        <div class="flex flex-row items-center space-x-1 mt-2 text-sm text-gray-500">
          <p class="itbms-ramGb">{{ nullCatching(item.ramGb) }}</p>
          <span>/</span>
          <p class="itbms-storageGb">{{ nullCatching(item.storageGb) }}</p>
          <p class="itbms-storageGb-unit">GB</p>
        </div>
        <div class="flex flex-row justify-end space-x-1 w-full">
          <p class="itbms-price text-blue-600 font-bold text-right">{{ unitPrice(item.price) }}</p>
          <p class="itbms-price-unit text-blue-600 font-bold text-right">Baht</p>
        </div>
      </RouterLink>
    </div>

  </div>
</template>