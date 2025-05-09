<script setup>
import { ref, reactive, onMounted, watchEffect, defineProps } from "vue";
import { addData, updateData, getDataById } from "./../libs/api.js";
import BlogProductCreateAndEdit from "./../components/BlogProductCreateAndEdit.vue";
import BrandDropdown from "./BrandDropdown.vue";
import { useRoute, useRouter } from "vue-router";

const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;


const boxTextTailwind =
  "w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50";

const boxTextTailwindError =
  "w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50";
let brandError = ref(false);

let boxTextTailwindModel = ref(boxTextTailwind);
let boxTextTailwindPrice = ref(boxTextTailwind);
let boxTextTailwindQuantity = ref(boxTextTailwind);
let boxTextTailwindDesc = ref(boxTextTailwind);
const route = useRoute();
const router = useRouter();
const prop = defineProps({
  mode: {
    type: String
  },

  productId: {
    type: [String, Number]
  }
})

const trimField = (field) => {
  if (typeof product[field] === 'string') {
    product[field] = product[field].trim();
  }
  console.log(product[field])
};

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

const isSaving = ref(false)


// const saveProduct = async () => {
//   if (isSaving.value) return;
//   isSaving.value = true;

//   try {
//     if (prop.mode === "Edit") {
//       await updateData(`${VITE_ROOT_API_URL}/itb-mshop/v1/sale-items`, prop.productId, product);
//     } else {
//       console.log("Product saved:", product);
//       await addData(`${VITE_ROOT_API_URL}/itb-mshop/v1/sale-items`, product);
//     }

//     router.push(`/sale-items`);
//   } catch (error) {
//     console.error("Error saving product:", error);

//   } finally {
//     isSaving.value = false;
//   }}

  const saveProduct = async () => {
    if (isSaving.value) return;
  isSaving.value = true;
  boxTextTailwindModel.value= boxTextTailwind;
  boxTextTailwindPrice.value= boxTextTailwind;
  boxTextTailwindQuantity.value= boxTextTailwind;
  boxTextTailwindDesc.value= boxTextTailwind;
  brandError.value = false;
  if (product.brand.id == null || product.brand.name == "") {
    console.log("Brand is not selected");
    console.log(product.brand.id);
    console.log(product.brand.name);
    console.log(brandError.value);
    brandError.value = true;
  }
  if (product.model == "") {
    boxTextTailwindModel.value = boxTextTailwindError;
    console.log(boxTextTailwindModel);
  }
  if (product.price == null || product.price <= 0) {
    boxTextTailwindPrice.value = boxTextTailwindError;
  }
  if (product.quantity == null || product.quantity < 0) {
    boxTextTailwindQuantity.value = boxTextTailwindError;
  }
  if (product.description == "") {
    boxTextTailwindDesc.value = boxTextTailwindError;
  } else if (
    product.brand.id == null ||
    product.brand.name == "" ||
    product.model == "" ||
    product.price == null ||
    product.price <= 0 ||
    product.quantity == null ||
    product.quantity < 0 ||
    product.description == ""
  ) {
    return;
  } else if (product.id) {
    console.log("Product updated:", product);
    await updateData(
      VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`,
      product.id,
      product
    );
  } else {
    if(prop.mode === "Edit"){
    await updateData(VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items` ,prop.productId,product)
  }
  console.log("Product saved:", product);
  await addData(VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`, product);
  router.push(`/sale-items`)
  }

};



onMounted(async () => {
  if (prop.mode === "Edit") {
    try {
      const data = await getDataById(VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`, route.params.id)
      if (data == undefined) {
        product.value = "404_not_found";
        console.log("product.value: " + product.value);
        setTimeout(() => {
          router.push('/sale-items');
        }, 2000);
      }
      product.model = data.model;
      product.brand.name = data.brandName;
      product.description = data.description;
      product.price = data.price;
      product.ramGb = data.ramGb;
      product.screenSizeInch = data.screenSizeInch;
      product.quantity = data.quantity;
      product.storageGb = data.storageGb;
      product.color = data.color;

    } catch (error) {
      console.log(error)
    }
  }
  console.log("ProductCreateAndEdit mounted");
  console.log(product.value);
  console.log(product.screenSizeInch);

});

// watchEffect(() => {
//   if (product.brand.name == "Apple") {
//     product.brand.id = 1;
//   } else if (product.brand.name == "Samsung") {
//     product.brand.id = 2;
//   } else if (product.brand.name == "Xiaomi") {
//     product.brand.id = 3;
//   } else if (product.brand.name == "Google") {
//     product.brand.id = 4;
//   } else if (product.brand.name == "Huawei") {
//     product.brand.id = 5;
//   } else {
//     product.brand.id = null;
//   }
// });

// watchEffect(() => {
//   if (!Number(product.quantity)) return (product.quantity = 1);
// });
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
        <div class="w-full sm:w-auto">
          <BrandDropdown :brandError="brandError" />
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
          <input type="number" v-model="product.quantity" :class="`itbms-quantity ${boxTextTailwindQuantity}`" />
        </template>
      </BlogProductCreateAndEdit>
    </div>

    <!-- Submit Button -->
    <div class="mt-8 flex justify-end">
       <button type="submit"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isSaving" @click="saveProduct">
        {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
    </div>
  </div>
</template>
