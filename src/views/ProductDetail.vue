<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { getDataById } from "../libs/api.js";
import { unitPrice, nullCatching } from "./../libs/utils.js"

const route = useRoute();
const router = useRouter();
const product = ref({});
const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;
const loading = ref(true);
const activeTab = ref('specifications');
const quantity = ref(1);

onMounted(async () => {
  try {
    loading.value = true;
    const data = await getDataById(
      VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`,
      route.params.id
    );
    // const data = await getDataById(`http://localhost:8080/itb-mshop/v1/sale-items`, route.params.id)
    if (data == undefined) {
      product.value = "404_not_found";
      console.log("product.value: " + product.value);
      setTimeout(() => {
        router.push('/sale-items');
      }, 2000);
    } else {
      product.value = data;
      console.log(product.value);
      console.log(data);
      console.log("product.value: " + product.value.price);
      console.log("product.value: " + typeof (product.value.price));
    }
  } catch (error) {
    console.log("โหลดข้อมูลสินค้าไม่สำเร็จ:", error.message);
  } finally {
    loading.value = false;
  }
});

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const incrementQuantity = () => {
  if (quantity.value < product.value.quantity) {
    quantity.value++;
  }
};

const addToCart = () => {
  alert(`Added ${quantity.value} item(s) to cart`);
};
</script>

<template>
  <!-- Loading Spinner -->
  <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
    <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
  </div>

  <!-- 404 Error Page -->
  <div v-else-if="product == '404_not_found'"
    class="flex flex-col items-center justify-center text-center py-20 space-y-8 min-h-[60vh] bg-gray-50">
    <div class="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
      <!-- 404 Icon -->
      <img src="https://static.thenounproject.com/png/4019366-200.png" alt="404 Icon"
        class="w-24 h-24 mx-auto opacity-80" />

      <!-- Error Message -->
      <!-- <h1 class="itbms-message text-2xl font-bold text-gray-800 mt-6">ไม่พบสินค้าที่ค้นหา</h1> -->
      <p class="itbms-message text-gray-600 mt-2">The requested sale item does not exist.</p>


      <!-- รายละเอียดสินค้า -->
      <div class="flex flex-col space-y-4">
        <h1 class="itbms-brand text-3xl font-bold text-gray-800">{{ product.brandName }}</h1>
        <p class="itbms-model text-lg text-gray-600">
          แบรนด์: <span class="font-semibold">{{ product.model }}</span>
        </p>

        <div class="flex flex-wrap gap-4 text-blue-600 text-lg font-semibold">
          <span class="itbms-price bg-blue-50 px-3 py-1 rounded-full">price {{ unitPrice(product.price) }}</span>
          <span class="itbms-price-unit bg-blue-50 px-3 py-1 rounded-full">Baht</span>
          <span class="itbms-description bg-blue-50 px-3 py-1 rounded-full">description: {{ product.description
          }}</span>
          <span class="itbms-ramGb bg-blue-50 px-3 py-1 rounded-full">ramGb {{ nullCatching(product.ramGb) }} GB
            RAM</span>
          <span class="itbms-ramGb-unit bg-blue-50 px-3 py-1 rounded-full">GB</span>
          <span class="itbms-screenSizeInch bg-blue-50 px-3 py-1 rounded-full">screenSizeInch {{
            nullCatching(product.screenSizeInch) }}</span>
          <span class="itbms-screenSizeInch-unit bg-blue-50 px-3 py-1 rounded-full">Inches</span>
          <span class="itbms-storageGb bg-blue-50 px-3 py-1 rounded-full">storageGb {{ nullCatching(product.storageGb)
          }}</span>
          <span class="itbms-storageGb-unit bg-blue-50 px-3 py-1 rounded-full">GB</span>
          <span class="itbms-color bg-blue-50 px-3 py-1 rounded-full">color {{ nullCatching(product.color) }}</span>
          <span class="itbms-quantity bg-blue-50 px-3 py-1 rounded-full">quantity {{ product.quantity }}</span>
          <span class="itbms-quantity-unit bg-blue-50 px-3 py-1 rounded-full">units</span>
        </div>

        <p class="text-gray-700 leading-relaxed mt-4">
          {{
            product.description || "ไม่มีรายละเอียดเพิ่มเติมของสินค้าในขณะนี้"
          }}
        </p>
      </div>
    </div>



    <!-- ปุ่มกลับไปหน้ารายการ -->
    <div class="mt-10">
      <RouterLink to="/sale-items">
        <button class="itbms-button text-blue-600 hover:underline text-sm">
          ← กลับไปหน้ารายการสินค้า

        </button>
      </RouterLink>
    </div>
  </div>

  <!-- Product Detail Page -->
  <div v-else class="itbms-row bg-gray-50 min-h-screen pb-12">
    <!-- Breadcrumb -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <RouterLink to="/" class="hover:text-blue-600 transition">หน้าหลัก</RouterLink>
          <span class="text-gray-400">/</span>
          <RouterLink to="/sale-items" class="hover:text-blue-600 transition">รายการสินค้า</RouterLink>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900 font-medium">{{ product.brandName }} {{ product.model }}</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <!-- Product Overview Section -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="md:flex">
          <!-- Product Image Section -->
          <div class="md:w-1/2 p-6 flex items-center justify-center bg-white">
            <div class="relative group">
              <img src="https://app-area.riointernational.com.bd/productImages/1738403480BRk6I.png"
                alt="Smartphone Image"
                class="w-full h-80 sm:h-96 object-contain transition duration-300 group-hover:scale-105" />
              <div
                class="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition duration-300 rounded-xl">
              </div>
            </div>
          </div>

          <!-- Product Info Section -->
          <div class="md:w-1/2 p-6 md:p-8 bg-white flex flex-col">
            <!-- Brand & Model -->
            <div class="border-b pb-4">
              <h1 class="itbms-brand text-3xl font-bold text-gray-800">{{ product.brandName }}</h1>
              <p class="itbms-model text-xl text-gray-700 mt-1">{{ product.model }}</p>
              <div class="mt-2 flex items-center">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
                    </path>
                  </svg>
                  <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
                    </path>
                  </svg>
                  <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
                    </path>
                  </svg>
                  <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
                    </path>
                  </svg>
                  <svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
                    </path>
                  </svg>
                  <span class="text-gray-600 ml-2 text-sm">(29 รีวิว)</span>
                </div>
              </div>
            </div>

            <!-- Price and Stock -->
            <div class="py-4 border-b">
              <div class="flex items-baseline">
                <span class="itbms-price text-3xl font-bold text-blue-600">฿{{ unitPrice(product.price) }}</span>
                <span class="itbms-price-unit ml-1 text-lg text-gray-500">บาท</span>
              </div>

              <div class="mt-2 flex items-center space-x-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ product.quantity > 0 ? 'พร้อมจัดส่ง' : 'สินค้าหมด' }}
                </span>
                <span class="text-sm text-gray-500">
                  สินค้าคงเหลือ: <span class="itbms-quantity font-medium">{{ product.quantity }}</span> ชิ้น
                </span>
              </div>
            </div>

            <!-- Color -->
            <div class="py-4 border-b">
              <h3 class="text-sm font-medium text-gray-700">สี: <span class="itbms-color font-semibold">{{
                nullCatching(product.color) }}</span></h3>
              <div class="mt-2 flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full border-2 border-white shadow-sm ring-2 ring-blue-600"
                  :style="`background-color: ${product.color?.toLowerCase() || 'gray'}`"></div>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="py-4 border-b">
              <h3 class="text-sm font-medium text-gray-700">จำนวน</h3>
              <div class="mt-2 flex items-center space-x-2">
                <button @click="decrementQuantity"
                  class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                  :disabled="quantity <= 1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <span class="w-12 text-center font-medium">{{ quantity }}</span>
                <button @click="incrementQuantity"
                  class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                  :disabled="quantity >= product.quantity">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="py-4 mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <RouterLink :to="{ name: 'Edit', params: { id: product.id } }"
                class="w-full sm:w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-center">
                Edit
              </RouterLink>

              <RouterLink :to="{ name: 'Edit', params: { id: product.id } }"
                class="w-full sm:w-1/2 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition flex items-center justify-center">
                Delete
              </RouterLink>


            </div>
          </div>
        </div>
      </div>

      <!-- Product Details Tabs -->
      <div class="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Tabs -->
        <div class="border-b">
          <div class="flex">
            <button @click="activeTab = 'specifications'"
              class="py-4 px-6 font-medium text-sm transition focus:outline-none"
              :class="activeTab === 'specifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'">
              ข้อมูลจำเพาะ
            </button>
            <button @click="activeTab = 'description'"
              class="py-4 px-6 font-medium text-sm transition focus:outline-none"
              :class="activeTab === 'description' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'">
              รายละเอียด
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Specifications Tab -->
          <div v-if="activeTab === 'specifications'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-medium text-gray-700 mb-2">หน่วยความจำ</h3>
                  <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-1 text-sm text-gray-500">RAM:</div>
                    <div class="col-span-2 text-sm font-medium itbms-ramGb">{{ nullCatching(product.ramGb) }} GB</div>

                    <div class="col-span-1 text-sm text-gray-500">Storage:</div>
                    <div class="col-span-2 text-sm font-medium itbms-storageGb">{{ nullCatching(product.storageGb) }} GB
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-medium text-gray-700 mb-2">จอแสดงผล</h3>
                  <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-1 text-sm text-gray-500">ขนาดจอ:</div>
                    <div class="col-span-2 text-sm font-medium itbms-screenSizeInch">{{
                      nullCatching(product.screenSizeInch) }} นิ้ว</div>
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-medium text-gray-700 mb-2">ข้อมูลทั่วไป</h3>
                  <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-1 text-sm text-gray-500">แบรนด์:</div>
                    <div class="col-span-2 text-sm font-medium">{{ product.brandName }}</div>

                    <div class="col-span-1 text-sm text-gray-500">รุ่น:</div>
                    <div class="col-span-2 text-sm font-medium">{{ product.model }}</div>

                    <div class="col-span-1 text-sm text-gray-500">สี:</div>
                    <div class="col-span-2 text-sm font-medium">{{ nullCatching(product.color) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="prose max-w-none">
            <p class="itbms-description text-gray-700">{{ product.description || 'ไม่มีข้อมูลรายละเอียดสินค้า' }}</p>

            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 class="text-base font-medium text-blue-800">คุณสมบัติเด่น</h3>
              <ul class="mt-2 space-y-1">
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>หน่วยความจำ {{ nullCatching(product.ramGb) }} GB RAM / {{ nullCatching(product.storageGb) }} GB
                    ROM</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>หน้าจอขนาด {{ nullCatching(product.screenSizeInch) }} นิ้ว</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>รองรับการใช้งาน 4G/5G</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-8 flex justify-between items-center">
        <RouterLink to="/sale-items">
          <button class="flex items-center text-blue-600 hover:text-blue-800 transition font-medium">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18">
              </path>
            </svg>
            กลับไปหน้ารายการสินค้า
          </button>
        </RouterLink>


      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles can be added here */
</style>