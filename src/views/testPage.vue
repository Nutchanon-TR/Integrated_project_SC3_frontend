<script setup>
import BrandDropdown from '@/components/BrandDropdown.vue';
import { getAllDataPage } from '@/libs/api';
import { onMounted, ref } from 'vue';

const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;
const product = ref([]);
const allBrand = ['Apple', 'Samsung', 'Xiaomi', 'Oppo'];
const selectedBrands = ref([]);
const tempBrand = ref(null)

const addbrand = () => {
    if (tempBrand.value && !selectedBrands.value.includes(tempBrand.value)) {
        selectedBrands.value.push(tempBrand.value)
    }
    tempBrand.value = null
}

const removebrand = (brandToRemove) => {
    selectedBrands.value = selectedBrands.value.filter(b => b != brandToRemove)
}

const loadData = async () => {
    const result = await getAllDataPage(`${VITE_ROOT_API_URL}/itb-mshop/v2/sale-items`, {
        filterBrands: selectedBrands.value,
        page: 0,
        size: 20,
        sortField: 'brandName',
        sortDirection: 'asc'
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
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">เลือกแบรนด์เพื่อกรองสินค้า</h2>

        <!-- Brand dropdown -->
        <div class="flex items-center gap-4">
            <BrandDropdown v-model="tempBrand" class="flex-1" />

            <!-- ปุ่มเพิ่มแบรนด์ -->
            <button @click="addbrand"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-200">
                ➕ เพิ่มแบรนด์
            </button>
        </div>

        <!-- รายการแบรนด์ที่เลือก -->
        <div class="flex flex-wrap gap-2 mt-4">
            <span v-for="brand in selectedBrands" :key="brand"
                class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                {{ brand }}
                <button @click="removebrand(brand)" class="text-red-500 hover:text-red-700 font-bold text-sm">
                    ×
                </button>
            </span>
        </div>

        <!-- ปุ่มยืนยัน filter -->
        <button @click="loadData"
            class="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all duration-200">
            🔍 ค้นหาสินค้า
        </button>

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
