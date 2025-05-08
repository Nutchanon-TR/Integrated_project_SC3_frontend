<script setup>
import { ref, reactive, onMounted, watchEffect } from "vue";
import { addData, updateData ,getDataById} from "./../libs/api.js";
import BlogProductCreateAndEdit from "./../components/BlogProductCreateAndEdit.vue";
import BrandDropdown from "./BrandDropdown.vue";
import { useRoute,useRouter} from "vue-router";
const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

const boxTextTailwind =
  "w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50";
  const route = useRoute();
  const router = useRouter();
const prop = defineProps({
    mode:{
      type:String
    },

    productId :{
      type:[String, Number]
    }
    // productId:{
    //   type:Number
    // },
    // price:{
    //   type:Number
    // },
    // model:{
    //   type:String
    // },
    // brand:{
    //   type:String
    // },
    // description:{
    //   type:String
    // },
    // ramGb:{
    //   type:Number
    // },
    // screenSizeInch:{
    //   type:Number
    // },
    // quantity:{
    //   type:Number
    // },
    // storageGb:{
    //   type:Number
    // },
    // color:{
    //   type:String
    // }

})

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
  if(prop.mode === "Edit"){
    await updateData(VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items` ,prop.productId,product)
  }
  product.brand.id = 1
  console.log("Product saved:", product);
  await addData(VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`, product);
  router.push(`/sale-items`)

};


onMounted(async () => {
  if(prop.mode === "Edit"){
    try{
      const data = await getDataById(VITE_ROOT_API_URL + `/itb-mshop/v1/sale-items`,route.params.id)
      if (data == undefined) {
      product.value = "404_not_found";
      console.log("product.value: " + product.value);
      setTimeout(() => {
        router.push('/sale-items');
      }, 2000);
    }
      product.model = data.model ;
      product.brand.name = data.brandName;
      product.description = data.description ;
      product.price = data.price ;
      product.ramGb = data.ramGb;
      product.screenSizeInch = data.screenSizeInch;
      product.quantity = data.quantity;
      product.storageGb = data.storageGb;
      product.color = data.color;
    
    }catch(error){
      console.log(error)
    }
  }
  console.log("ProductCreateAndEdit mounted");
  console.log(product.value);
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
          <BrandDropdown />
        </div>
      </div>


      <BlogProductCreateAndEdit>
        <template #text> Model </template>
        <template #inputText>
          <input type="text" v-model="product.model" :class="`itbms-model ${boxTextTailwind}`" />
        </template>
      </BlogProductCreateAndEdit>

      <BlogProductCreateAndEdit>
        <template #text> Price (Baht) </template>
        <template #inputText>
          <input type="number" v-model="product.price" :class="`itbms-price ${boxTextTailwind}`" /></template>
      </BlogProductCreateAndEdit>

      <BlogProductCreateAndEdit>
        <template #text> Description </template>
        <template #inputText>
          <textarea v-model="product.description" rows="4" :class="`itbms-description ${boxTextTailwind}`"></textarea>
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
          <input type="text" v-model="product.color" :class="`itbms-color ${boxTextTailwind}`" />
        </template>
      </BlogProductCreateAndEdit>

      <BlogProductCreateAndEdit>
        <template #text> Quantity </template>
        <template #inputText>
          <input type="number" v-model="product.quantity" :class="`itbms-quantity ${boxTextTailwind}`" />
        </template>
      </BlogProductCreateAndEdit>
    </div>

    <!-- Submit Button -->
    <div class="mt-8 flex justify-end">
      <button type="submit"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        @click="saveProduct">
        Save
      </button>
    </div>
  </div>
</template>