<script setup>
import ProductCreateAndEdit from "./../components/ProductCreateAndEdit.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getDataById } from "../libs/api.js";

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
        router.push("/sale-items");
      }, 2000);
    } else {
      product.value = data;
      console.log(product.value);
      console.log(data);
      console.log("product.value: " + product.value.id);
      console.log("product.value: " + typeof product.value.id);
    }
  } catch (error) {
    console.log("โหลดข้อมูลสินค้าไม่สำเร็จ:", error.message);
  }
});
</script>
<template>
  <ProductCreateAndEdit
    mode="Edit"
    :product-id="route.params.id"
  />
</template>
