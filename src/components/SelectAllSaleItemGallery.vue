<script setup>
import { onMounted } from "vue";
import { unitPrice, nullCatching } from "../libs/utils.js"
import { useAlertStore } from "../stores/alertStore.js"
// import BrandFilter from "./BrandFilter.vue";
// import SortButton from "./SortButton.vue";
// import Pagination from "./Pagination.vue";

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

    <div v-if="product.length === 0" class="text-center text-gray-500 text-xl">
      no sale item
    </div>

    <!-- <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <BrandFilter v-model="selectedBrands" />
      <SortButton v-model:sort="sortBy" v-model:order="sortOrder" />
    </div> -->

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <RouterLink v-for="(item, index) in product" :key="index" :to="`/sale-items/${item.id}`"
        class="bg-white p-4 rounded shadow hover:shadow-lg transition">
        <img src="https://app-area.riointernational.com.bd/productImages/1738403480BRk6I.png" alt="product image">
        <h2 class="text-xl font-bold mt-2">{{ item.brandName }}</h2>
        <p class="text-gray-600">{{ item.model }}</p>
        <p class="text-blue-600 font-semibold">{{ item.price }} Baht</p>
      </RouterLink>
    </div>

    <!-- <Pagination :current-page="page" :total-pages="totalPages" @change="page = $event" v-if="totalPages > 1" /> -->
  </div>
</template>