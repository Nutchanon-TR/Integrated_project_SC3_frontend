<script setup>
import { onMounted } from "vue";
import { unitPrice, nullCatching } from "../libs/utils.js"
import { useAlertStore } from "../stores/alertStore.js"

const alertStore = useAlertStore()

const props = defineProps({
  product: Array,
  default: () => []
})

onMounted(() => {
  console.log('ProductGallery mounted')
  console.log(props.product)

  if (alertStore.message) {
    setTimeout(() => {
      alertStore.clearMessage()
    }, 3000)
  }
})

</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">

    <!-- Alert Message -->
    <div v-if="alertStore.message" :class="`itbms-message px-4 py-2 rounded mb-4 ${alertStore.type === 'error'
      ? 'bg-red-100 text-red-700'
      : 'bg-green-100 text-green-700'
      }`">
      {{ alertStore.message }}
    </div>

    <!-- Empty State -->
    <div v-if="!product || product.length === 0" class="itbms-no text-center text-gray-500 text-xl">
      no sale item
    </div>

    <!-- <RouterLink :to="{ name: 'ProuctCreate' }"
      class="itbms-sale-item-add inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      New
    </RouterLink> -->


    <!-- Product Grid -->
    <div v-if="product && product.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-3">

      <RouterLink v-for="(item, index) in product" :key="index" :to="`/sale-items/${item.id}`"
        class="itbms-row bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
        <img src="https://app-area.riointernational.com.bd/productImages/1738403480BRk6I.png" alt="product image"
          class="w-[300px] h-auto rounded shadow" />
        <h2 class="itbms-brand text-md font-semibold text-gray-800 truncate text-2xl mt-3">
          {{ item.brandName }}
        </h2>
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
