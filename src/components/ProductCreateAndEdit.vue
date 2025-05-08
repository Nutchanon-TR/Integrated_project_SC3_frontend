<script setup>
import { ref, reactive, onMounted, watchEffect } from "vue";
import { addData, updateData } from "./../libs/api.js";
const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

let product = reactive({
  model: "",
  brand: {
    id: null,
    name: "",
  },
  description: "",
  price: null,
  ramGb: null,
  screenSizeInch: null,
  quantity: 1,
  storageGb: null,
  color: "",
});

const saveProduct = async () => {
  console.log("Product saved:", product);
  await addData(VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`, product);
};

onMounted(() => {
  console.log("ProductCreateAndEdit mounted");
  console.log(product);
  console.log(product.screenSizeInch);
});

watchEffect(() => {
  if (product.brand.name == "Apple") {
    product.brand.id = 1;
  } else if (product.brand.name == "Samsung") {
    product.brand.id = 2;
  } else if (product.brand.name == "Xiaomi") {
    product.brand.id = 3;
  } else if (product.brand.name == "Google") {
    product.brand.id = 4;
  } else if (product.brand.name == "Huawei") {
    product.brand.id = 5;
  } else {
    product.brand.id = null;
  }
});

watchEffect(() => {
  if (!Number(product.quantity)) return (product.quantity = 1);
});
</script>
<template>
  <div
    class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-blue-200"
  >
    <h2 class="text-2xl font-bold text-blue-700 mb-6 text-center">
      Phone Details
    </h2>

    <div class="space-y-4">
      <!-- Brand -->
      <div class="flex flex-col sm:flex-row sm:items-center">
        <label
          for="brand"
          class="font-medium text-gray-700 sm:w-48 mb-1 sm:mb-0"
          >Brand</label>
        <div class="w-full">
          <select
            id="brand"
            v-model="product.brand.name"
            class="itbms-brand w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50"
          >
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Google">Google</option>
            <option value="Huawei">Huawei</option>
          </select>
        </div>
      </div>

      <!-- Model -->
      <div class="flex flex-col sm:flex-row sm:items-center">
        <label
          for="model"
          class="font-medium text-gray-700 sm:w-48 mb-1 sm:mb-0"
          >Model</label
        >
        <div class="w-full">
          <input
            type="text"
            id="model"
            v-model="product.model"
            class="itbms-model w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50"
          />
        </div>
      </div>

      <!-- Price -->
      <div class="flex flex-col sm:flex-row sm:items-center">
        <label
          for="price"
          class="font-medium text-gray-700 sm:w-48 mb-1 sm:mb-0"
          >Price (Baht)</label
        >
        <div class="w-full">
          <input
            type="number"
            id="price"
            v-model="product.price"
            class="itbms-price w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50"
          />
        </div>
      </div>

      <!-- Description -->
      <div class="flex flex-col sm:flex-row sm:items-start">
        <label
          for="description"
          class="font-medium text-gray-700 sm:w-48 mb-1 sm:mb-0 pt-2"
          >Description</label
        >
        <div class="w-full">
          <textarea
            id="description"
            v-model="product.description"
            rows="4"
            class="itbms-description w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50"
          ></textarea>
        </div>
      </div>

      <!-- RAM -->
      <div class="flex flex-col sm:flex-row sm:items-center">
        <label for="ram" class="font-medium text-gray-700 sm:w-48 mb-1 sm:mb-0"
          >RAM (GB)</label
        >
        <div class="w-full">
          <input
            type="number"
            id="ram"
            v-model="product.ramGb"
            class="itbms-ramGb w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50"
          />
        </div>
      </div>

      <!-- Screen Size -->
      <div class="flex flex-col sm:flex-row sm:items-center">
        <label
          for="screenSize"
          class="font-medium text-gray-700 sm:w-48 mb-1 sm:mb-0"
          >Screen Size (Inches)</label
        >
        <div class="w-full">
          <input
            type="number"
            id="screenSize"
            v-model="product.screenSizeInch"
            step="0.1"
            class="itbms-screenSizeInch w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50"
          />
        </div>
      </div>

      <!-- Storage -->
      <div class="flex flex-col sm:flex-row sm:items-center">
        <label
          for="storage"
          class="font-medium text-gray-700 sm:w-48 mb-1 sm:mb-0"
          >Storage (GB)</label
        >
        <div class="w-full">
          <input
            type="number"
            id="storage"
            v-model="product.storageGb"
            class="itbms-storageGb w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50"
          />
        </div>
      </div>

      <!-- Color -->
      <div class="flex flex-col sm:flex-row sm:items-center">
        <label
          for="color"
          class="font-medium text-gray-700 sm:w-48 mb-1 sm:mb-0"
          >Color</label
        >
        <div class="w-full">
          <input
            type="text"
            id="color"
            v-model="product.color"
            class="itbms-color w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50"
          />
        </div>
      </div>

      <!-- Quantity -->
      <div class="flex flex-col sm:flex-row sm:items-center">
        <label
          for="quantity"
          class="font-medium text-gray-700 sm:w-48 mb-1 sm:mb-0"
          >Quantity</label
        >
        <div class="w-full">
          <input
            type="number"
            id="quantity"
            v-model="product.quantity"
            class="itbms-quantity w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50"
          />
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-8 flex justify-end">
      <button
        type="submit"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        @click="saveProduct"
      >
        Save
      </button>
    </div>
  </div>
</template>
