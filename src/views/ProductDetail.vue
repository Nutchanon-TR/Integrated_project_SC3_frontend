<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getDataById } from "../libs/api.js";
import {unitPrice,nullCatching} from "./../libs/utils.js"

const route = useRoute();
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
    } else {
      product.value = data;
      console.log(product.value);
      console.log(data);
      console.log("product.value: " + product.value.price);
      console.log("product.value: " + typeof(product.value.price));
    }
  } catch (error) {
    console.log("โหลดข้อมูลสินค้าไม่สำเร็จ:", error.message);
  }
});
</script>

<template>
  <!-- รายละเอียด 404 -->
  <div v-if="product == '404_not_found'" class="flex flex-col space-y-4">
    <h1 class="text-3xl font-bold text-gray-800">404 ไปใช้เว็ปอื่น</h1>
    <RouterLink to="/products">
      <button class="text-blue-600 hover:underline text-xl">
        กลับไปจุดเกิด
      </button>
    </RouterLink>
  </div>

  <div v-else class="p-6 max-w-5xl mx-auto">
    <!-- รูปภาพและรายละเอียดสินค้า -->
    <div class="grid md:grid-cols-2 gap-8 items-start">
      <!-- รูปภาพสินค้า -->
      <img
        src="https://app-area.riointernational.com.bd/productImages/1738403480BRk6I.png"
        alt="Smartphone Image"
        class="w-full h-60 object-contain rounded-xl shadow-lg bg-white"
      />

      <!-- รายละเอียดสินค้า -->
      <div class="flex flex-col space-y-4">
        <h1 class="text-3xl font-bold text-gray-800">{{ product.model }}</h1>
        <p class="text-lg text-gray-600">
          แบรนด์: <span class="font-semibold">{{ product.brandName }}</span>
        </p>

        <div class="flex flex-wrap gap-4 text-blue-600 text-lg font-semibold">
          <span class="bg-blue-50 px-3 py-1 rounded-full"
            >price {{unitPrice(product.price) }} บาท</span
          >
          <span class="bg-blue-50 px-3 py-1 rounded-full"
            >ramGb {{ nullCatching(product.ramGb) }} GB RAM</span
          >
          <span class="bg-blue-50 px-3 py-1 rounded-full"
            >storageGb {{ nullCatching(product.storageGb) }} GB</span
          >
          <span class="bg-blue-50 px-3 py-1 rounded-full"
            >color {{ nullCatching(product.color) }}</span
          >
          <span class="bg-blue-50 px-3 py-1 rounded-full"
            >screenSizeInch {{ nullCatching(product.screenSizeInch) }}</span
          >
          <span class="bg-blue-50 px-3 py-1 rounded-full"
            >quantity {{ product.quantity }}</span
          >
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
      <RouterLink to="/products">
        <button class="text-blue-600 hover:underline text-sm">
          ← กลับไปหน้ารายการสินค้า
        </button>
      </RouterLink>
    </div>
  </div>
</template>
