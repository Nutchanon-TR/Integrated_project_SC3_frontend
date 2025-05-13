<script setup>
import { ref, reactive, onMounted, watchEffect, defineProps, onBeforeMount, computed } from "vue";
import { addData, updateData, getDataById, getAllData } from "./../libs/api.js";
import BlogProductCreateAndEdit from "./../components/BlogProductCreateAndEdit.vue";
import BrandDropdown from "./BrandDropdown.vue";
import { useRoute, useRouter } from "vue-router";
import { useAlertStore } from "../stores/alertStore.js";

const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

const boxTextTailwind = "w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50";
const boxTextTailwindError = "w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50";

const brandError = ref(false);
const boxTextTailwindModel = ref(boxTextTailwind);
const boxTextTailwindPrice = ref(boxTextTailwind);
const boxTextTailwindQuantity = ref(boxTextTailwind);
const boxTextTailwindDesc = ref(boxTextTailwind);

const isSaving = ref(true);
const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();

const prop = defineProps({
  mode: String,
  productId: [String, Number],
});

const product = reactive({
  id: null,
  model: "",
  brand: { id: null, name: "" },
  description: "",
  price: null,
  ramGb: null,
  screenSizeInch: null,
  quantity: 1,
  storageGb: null,
  color: "",
});

const originalProduct = reactive({});

onBeforeMount(async () => {
  if (prop.mode === "Edit") {
    try {
      const data = await getDataById(`${VITE_ROOT_API_URL}/itb-mshop/v1/sale-items`, route.params.id);
      if (!data) {
        product.model = "404_not_found";
        setTimeout(() => router.push("/sale-items"), 2000);
        return;
      }
      product.id = data.id;
      product.model = data.model;
      product.brand.name = data.brandName;
      product.description = data.description;
      product.price = data.price;
      product.ramGb = data.ramGb;
      product.screenSizeInch = data.screenSizeInch;
      product.quantity = data.quantity;
      product.storageGb = data.storageGb;
      product.color = data.color;

      await getBrandIdByName(data.brandName);
      Object.assign(originalProduct, JSON.parse(JSON.stringify(product)));
    } catch (error) {
      console.error("Error loading product:", error);
    }
  }
});

const getBrandIdByName = async (brandName) => {
  const data = await getAllData(`${VITE_ROOT_API_URL}/itb-mshop/v1/brands`);
  const brand = data.find((b) => b.name === brandName);
  if (brand) {
    product.brand.id = brand.id;
  } else {
    console.error("Brand not found");
  }
};

const handleBrandId = (id) => (product.brand.id = id);
const handleBrandName = (name) => (product.brand.name = name);

const trimField = (field) => {
  if (typeof product[field] === "string") product[field] = product[field].trim();
};

const defaultQuantity = () => {
  if (!Number(product.quantity) || product.quantity <= 0) product.quantity = 1;
};

// ตรวจสอบว่า product ถูกเปลี่ยนแปลงหรือไม่ (ใช้สำหรับ Edit mode)
const compareProduct = (a, b) => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => compareProduct(a[key], b[key]));
};

const isProductChanged = computed(() => !compareProduct(product, originalProduct));

const isFormValid = computed(() => {
  return (
    product.brand.id !== null &&
    product.brand.name.trim() !== "" &&
    product.model.trim() !== "" &&
    product.price !== null &&
    product.price > 0 &&
    product.quantity !== null &&
    product.quantity > 0 &&
    product.description.trim() !== ""
  );
});

const normalizeEmptyStringsToNull = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === "string" && obj[key].trim() === "") {
      obj[key] = null;
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      normalizeEmptyStringsToNull(obj[key]);
    }
  }
};


const saveProduct = async () => {
  isSaving.value = false;

  // reset styles
  boxTextTailwindModel.value = boxTextTailwind;
  boxTextTailwindPrice.value = boxTextTailwind;
  boxTextTailwindQuantity.value = boxTextTailwind;
  boxTextTailwindDesc.value = boxTextTailwind;
  brandError.value = false;

  // Validate fields
  if (!product.brand.id || !product.brand.name) brandError.value = true;
  if (!product.model) boxTextTailwindModel.value = boxTextTailwindError;
  if (!product.price || product.price <= 0) boxTextTailwindPrice.value = boxTextTailwindError;
  if (!product.quantity || product.quantity <= 0) boxTextTailwindQuantity.value = boxTextTailwindError;
  if (!product.description) boxTextTailwindDesc.value = boxTextTailwindError;

  if (!isFormValid.value) {
    isSaving.value = true;
    return;
  }

  normalizeEmptyStringsToNull(product);

  try {
    if (product.id) {
      await updateData(`${VITE_ROOT_API_URL}/itb-mshop/v1/sale-items`, product.id, product);
      alertStore.setMessage("The sale item has been updated.");
      router.push(`/sale-items/${product.id}`); 
    } else if (prop.mode === "Edit") {
      await updateData(`${VITE_ROOT_API_URL}/itb-mshop/v1/sale-items`, prop.productId, product);
      alertStore.setMessage("The sale item has been updated.");
      router.push(`/sale-items/${prop.productId}`); 
    } else {
      await addData(`${VITE_ROOT_API_URL}/itb-mshop/v1/sale-items`, product);
      alertStore.setMessage("The sale item has been successfully added.");
      router.push(`/sale-items`);
    }
  }
  catch (err) {
    console.error("เกิดข้อผิดพลาดระหว่างบันทึก:", err.message);
  } finally {
    isSaving.value = true;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-blue-200">
    <h2 class="text-2xl font-bold text-blue-700 mb-6 text-center">
      Phone Details
    </h2>
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
        <label for="brand" class="font-medium text-gray-700 sm:w-32 mb-1 sm:mb-0">
          Brand
        </label>

        <!-- เปลี่ยนจาก <select> ครอบ <BrandDropdown> เป็นใช้ component โดยตรง -->
        <div class="w-full sm:w-auto">
          <BrandDropdown :brandError="brandError" :brandName="product.brand.name" @sendBrandId="handleBrandId"
            @sendBrandName="handleBrandName" />
        </div>
      </div>


      <BlogProductCreateAndEdit>
        <template #text> Model </template>
        <template #inputText>
          <input type="text" v-model="product.model" @blur="trimField('model')"
            :class="`itbms-model ${boxTextTailwindModel}`" />
        </template>
      </BlogProductCreateAndEdit>

      <BlogProductCreateAndEdit>
        <template #text> Price (Baht) </template>
        <template #inputText>
          <input type="number" v-model="product.price" :class="`itbms-price ${boxTextTailwindPrice}`" /></template>
      </BlogProductCreateAndEdit>

      <BlogProductCreateAndEdit>
        <template #text> Description </template>
        <template #inputText>
          <textarea v-model="product.description" rows="4" @blur="trimField('description')"
            :class="`itbms-description ${boxTextTailwindDesc}`"></textarea>
        </template>
      </BlogProductCreateAndEdit>

      <BlogProductCreateAndEdit>
        <template #text> RAM (GB) </template>
        <template #inputText>
          <input type="number" v-model="product.ramGb" :class="`itbms-ramGb ${boxTextTailwind}`" /></template>
      </BlogProductCreateAndEdit>

      <BlogProductCreateAndEdit>
        <template #text> Screen Size (Inches) </template>
        <template #inputText>
          <input type="number" v-model="product.screenSizeInch" step="0.1"
            :class="`itbms-screenSizeInch ${boxTextTailwind}`" />
        </template>
      </BlogProductCreateAndEdit>

      <BlogProductCreateAndEdit>
        <template #text> Storage (GB) </template>
        <template #inputText>
          <input type="number" v-model="product.storageGb" :class="`itbms-storageGb ${boxTextTailwind}`" />
        </template>
      </BlogProductCreateAndEdit>

      <BlogProductCreateAndEdit>
        <template #text> Color </template>
        <template #inputText>
          <input type="text" v-model="product.color" @blur="trimField('color')"
            :class="`itbms-color ${boxTextTailwind}`" />
        </template>
      </BlogProductCreateAndEdit>

      <BlogProductCreateAndEdit>
        <template #text> Quantity </template>
        <template #inputText>
          <input type="number" v-model="product.quantity" @focus="product.quantity = null" @blur="defaultQuantity()"
            :class="`itbms-quantity ${boxTextTailwindQuantity}`" />
        </template>
      </BlogProductCreateAndEdit>
    </div>

    <!-- Submit Button -->
    <div class="mt-8 flex justify-end space-x-4">
      <!-- Save Button -->
      <button type="submit"
        class="itbms-save-button px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isSaving || !isFormValid || (prop.mode === 'Edit' && !isProductChanged)" @click="saveProduct">
        {{ isSaving ? 'Save' : 'Saving...' }}
      </button>

      <!-- Cancel Button -->
      <button type="button"
        class="itbms-cancel-button px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        @click="router.push('/sale-items')">
        Cancel
      </button>
    </div>

  </div>
</template>