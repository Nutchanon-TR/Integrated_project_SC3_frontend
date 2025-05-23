<script setup>
import BrandDropdown from '@/components/BrandDropdown.vue';

import BrandFilter from '@/components/BrandFilter.vue';
import SortButton from '@/components/SortButton.vue';

import { getAllDataPage } from '@/libs/api';
import { onMounted, ref } from 'vue';


const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;
const product = ref([]);
const selectedBrands = ref([]);
const tempBrand = ref(null)
const sortDirection = ref('asc')
const sortField = ref('')
const pageSize = ref('10')

const sortAsc = () => {
    sortDirection.value = 'asc'
    sortField.value = 'brand.name'
    loadData()
}

const sortDesc = () => {
    sortDirection.value = 'desc'
    sortField.value = 'brand.name'
    loadData()
}

const resetSort = () => {
    sortDirection.value = 'desc'
    sortField.value = ''
    loadData()
}
const clearselectedBrands = () => {
    selectedBrands.value = [];
    loadData();
}

const loadData = async () => {
    const result = await getAllDataPage(`${VITE_ROOT_API_URL}/itb-mshop/v2/sale-items`, {
        filterBrands: selectedBrands.value,
        page: 0,
        size: pageSize.value,
        sortField: sortField.value,
        sortDirection: sortDirection.value
    });

    product.value = result.content;

};

onMounted(async () => {
    await loadData();
    console.log(product.value);
});
</script>

<template>
    <div class="p-6 max-w-screen-xl mx-auto">

        <div class="mt-6 flex items-center gap-4">
            <label for="pageSize" class="text-gray-700 font-medium">รายการต่อหน้า:</label>
            <select id="pageSize" v-model="pageSize" @change="loadData"
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="70">70</option>
                <option :value="100">100</option>
            </select>
        </div>

        <!-- Sort Panel -->
        <SortButton 
        :sortDirection="sortDirection" 
        @sort-asc="sortAsc" 
        @sort-desc="sortDesc" 
        @reset="resetSort" />

        <!-- Filter Panel -->
        <h2 class="text-2xl font-semibold text-gray-800 mb-2 mt-8">Filter Brands</h2>
        <BrandFilter 
        v-model="selectedBrands" 
        :tempBrand="tempBrand" 
        @update:tempBrand="tempBrand = $event"
        @search="loadData" 
        @clear="clearselectedBrands" />

        <!-- Product Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            <RouterLink v-for="item in product" :key="item.id" :to="`/sale-items/${item.id}`"
                class="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-blue-400">
                <img :src="item.image || 'https://app-area.riointernational.com.bd/productImages/1738403480BRk6I.png'"
                    alt="product image" class="w-full h-40 object-contain rounded-md mb-2" />
                <div class="p-4 space-y-1">
                    <div class="text-blue-700 font-semibold text-lg truncate">
                        {{ item.brandName }}
                    </div>
                    <div class="text-gray-700 text-sm truncate">{{ item.model }}</div>
                    <div class="text-gray-800 font-medium text-sm">
                        ฿{{ item.price.toLocaleString() }}
                    </div>
                </div>
            </RouterLink>
        </div>
    </div>
</template>
