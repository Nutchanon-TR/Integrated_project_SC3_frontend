<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { getDataById } from "../libs/api.js";
import { unitPrice, nullCatching } from "./../libs/utils.js"

const route = useRoute();
const router = useRouter();
const product = ref({});
const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

onMounted(async () => {
  try {
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
  }
});
</script>

<template>
  <!-- รายละเอียด 404 -->
  <div v-if="product == '404_not_found'" class="flex flex-col items-center justify-center text-center py-20 space-y-6">
    <!-- ไอคอนหรือรูปภาพ 404 -->
    <img src="https://static.thenounproject.com/png/4019366-200.png" alt="404 Icon" class="w-32 h-32 opacity-80" />

    <!-- ข้อความหลัก -->
    
      <h1 class="itbms-message text-4xl font-bold text-gray-800">The requested sale item does not exist.</h1>
    

    <!-- ปุ่มกลับ -->
    <!-- <RouterLink to="/sale-items">
      <button class="itbms-button mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        ⬅ กลับไปหน้าสินค้า
      </button>
    </RouterLink> -->
  </div>


  <div v-else class="itbms-row p-6 max-w-5xl mx-auto">
    <!-- รูปภาพและรายละเอียดสินค้า -->
    <div class="grid md:grid-cols-2 gap-8 items-start">
      <!-- รูปภาพสินค้า -->
      <img src="https://app-area.riointernational.com.bd/productImages/1738403480BRk6I.png" alt="Smartphone Image"
        class="w-full h-60 object-contain rounded-xl shadow-lg bg-white" />

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
            nullCatching(product.screenSizeInch)}}</span>
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


    <RouterLink :to="{ name: 'Edit', params: { id: 1 }   }">
        <button class="itbms-button text-blue-600 hover:underline text-sm">
          Update sale item
        </button>
      </RouterLink>
    

    <!-- ปุ่มกลับไปหน้ารายการ -->
    <div class="mt-10">
      <RouterLink to="/sale-items">
        <button class="itbms-button text-blue-600 hover:underline text-sm">
          ← กลับไปหน้ารายการสินค้า
        </button>
      </RouterLink>
    </div>
  </div>
</template>
