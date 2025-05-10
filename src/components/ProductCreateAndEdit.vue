<script setup>
import { ref, reactive, onMounted, watchEffect, defineProps, onBeforeMount, computed } from "vue";
import { addData, updateData, getDataById, getAllData } from "./../libs/api.js";
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

const isSaving = ref(false)

const route = useRoute();
const router = useRouter();
const prop = defineProps({
  mode: {
    type: String,
  },

  productId: {
    type: [String, Number],
  },
});


// onMounted(async () => {
//   console.log(prop.mode);

//   if (prop.mode === "Edit") {
//     try {
//       const data = await getDataById(
//         VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`,
//         route.params.id
//       );
//       if (data == undefined) {
//         product.value = "404_not_found";
//         console.log("product.value: " + product.value);
//         setTimeout(() => {
//           router.push("/sale-items");
//         }, 2000);
//       }
//       product.model = data.model;
//       product.brand.name = data.brandName;
//       product.description = data.description;
//       product.price = data.price;
//       product.ramGb = data.ramGb;
//       product.screenSizeInch = data.screenSizeInch;
//       product.quantity = data.quantity;
//       product.storageGb = data.storageGb;
//       product.color = data.color;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// });


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

let originalProduct = reactive({})


onBeforeMount(async () => {
  if (prop.mode === "Edit") {
    try {
      const data = await getDataById(
        VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`,
        route.params.id
      );
      if (data == undefined) {
        product = "404_not_found";
        console.log("product: " + product);
        setTimeout(() => {
          router.push("/sale-items");
        }, 2000);
      }
      console.log("Product loaded:", data);
      console.log("Product loaded:", data.brandName);
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
      console.log(originalProduct)
      console.log("product.brand eeee:", product);
    } catch (error) {
      console.log(error);
    }
  }
});

const compareProduct = (product1, product2) => {
  if (product1 === product2) {
    return true
  }
  if (
    typeof product1 !== "object" ||
    typeof product2 !== "object" ||
    product1 === null ||
    product2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(product1);
  const keys2 = Object.keys(product2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!compareProduct(product1[key], product2[key])) return false;
  }
  return true;
}

const isProductChanged = computed(() => {
  return !compareProduct(product, originalProduct)
})
const getBrandIdByName = async (brandName) => {
  const data = await getAllData(`${VITE_ROOT_API_URL}/itb-mshop/v1/brands`);
  const brand = await data.find((brand) => brand.name === brandName);
  if (brand) {
    console.log("Brand ID:", brand.id);
    product.brand.id = await brand.id;
  } else {
    console.error("Brand not found 123456");
    return null;
  }
};

const handleBrandId = (id) => {
  product.brand.id = id;
  console.log("Received brand ID:", id);
};

const handleBrandName = (name) => {
  product.brand.name = name;
  console.log("Received brand name:", name);
};

const trimField = (field) => {
  if (typeof product[field] === "string") {
    product[field] = product[field].trim();
  }
  console.log(product[field]);
};

const defaultQuantity = () => {
  if (!Number(product.quantity) || product.quantity <= 0)
    return (product.quantity = 1);
  console.log(product.quantity);
};

const saveProduct = async () => {

  isSaving.value = true

  boxTextTailwindModel.value = boxTextTailwind;
  boxTextTailwindPrice.value = boxTextTailwind;
  boxTextTailwindQuantity.value = boxTextTailwind;
  boxTextTailwindDesc.value = boxTextTailwind;
  brandError.value = false;

  if (product.brand.id == null || product.brand.name == "") {
    console.log("Brand is not selected");
    brandError.value = true;
  }

  if (product.model == "") {
    boxTextTailwindModel.value = boxTextTailwindError;
  }

  if (product.price == null || product.price <= 0) {
    boxTextTailwindPrice.value = boxTextTailwindError;
  }

  if (product.quantity == null || product.quantity <= 0) {
    boxTextTailwindQuantity.value = boxTextTailwindError;
  }

  if (product.description == "") {
    boxTextTailwindDesc.value = boxTextTailwindError;
  }


  if (
    product.brand.id == null ||
    product.brand.name == "" ||
    product.model == "" ||
    product.price == null ||
    product.price <= 0 ||
    product.quantity == null ||
    product.quantity < 0 ||
    product.description == ""
  ) {
    isSaving.value = false
    return
  }
  try {
    console.log(product.id);

    if (product.id) {
      console.log("Product updated:", product);
      await updateData(
        VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`,
        product.id,
        product
      );
    } else if (prop.mode === "Edit") {

      await updateData(
        VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`,
        prop.productId,
        product
      );
    } else {
      await addData(VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`, product);
    }
    router.push(`/sale-items`);
  }
  catch (err) {
    console.error('เกิดข้อผิดพลาดระหว่างบันทึก:', err.message)
  } finally {
    isSaving.value = false
  }
};

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
          <input @blur="defaultQuantity()" type="number" v-model="product.quantity"
            :class="`itbms-quantity ${boxTextTailwindQuantity}`" />
        </template>
      </BlogProductCreateAndEdit>
    </div>

    <!-- Submit Button -->
    <div class="mt-8 flex justify-end">

      <button type="submit"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isSaving || (prop.mode === 'Edit' && !isProductChanged)" @click="saveProduct">
        {{ isSaving ? 'Saving...' : 'Save' }}
      </button>

    </div>
  </div>
</template>