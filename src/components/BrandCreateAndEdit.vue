<script setup>
import {computed,ref,reactive,onMounted,onBeforeMount} from 'vue';
import {addData,getDataById,updateData} from '@/libs/api';
import {useRoute,useRouter} from 'vue-router';

const VITE_ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;
const router = useRouter()
const route = useRoute()
const prop = defineProps({
    mode:{
        type:String
    },
     brandId: [String, Number],
})
// const isEdit = route.params.id !== undefined;
const isEdit = prop.brandId
const brand = reactive({
    id:null,
    name:'',
    websiteUrl:'',
    countryOfOrigin:'',
    isActive:false,

})
onBeforeMount(async ()=>{
    if(prop.mode === "edit" && isEdit){
       try{
      //       const data = await getDataById(VITE_ROOT_API_URL + `/itb-mshop/v1/brands`,isEdit)
            const data = await getDataById(VITE_ROOT_API_URL + `/Brands`,isEdit)
            brand.id = data.id
            brand.name = data.name
            brand.websiteUrl = data.websiteUrl
            brand.countryOfOrigin = data.countryOfOrigin
            brand.isActive = data.isActive
            Object.assign(originalBrand,JSON.parse(JSON.stringify(brand)))
            console.log(brand)
       }catch(err){
        console.log(err)
       }
    }
})
const trimField = (field) => {
  if (typeof brand[field] === "string") brand[field] = brand[field].trim();
};
// const allBrand = ref([])
const originalBrand = reactive({})
const handleCancel = () =>{
  router.push({name:'BrandManage'})
}

const compareProduct = (a, b) => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => compareProduct(a[key], b[key]));
};

const isBrandChanged = computed(()=>!compareProduct(brand,originalBrand))
const isSaving = ref(true);
const isFormValid = computed(() => {
  return (
    brand.id !== null &&
    brand.name !== null &&
    brand.name.trim() !== "" &&
    brand.websiteUrl.trim() !== "" &&
    brand.countryOfOrigin.trim() !== ""
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
const handleSave = async () =>{
    const newBrand = {
    name:brand.name,
    websiteUrl:brand.websiteUrl,
    isActive:brand.isActive,
    countryOfOrigin:brand.countryOfOrigin
    }
    isSaving.value = false;
    if(!isFormValid){
      isSaving.value = true
    }

    normalizeEmptyStringsToNull(brand);
    try{
        if(prop.mode === 'edit' && isEdit){
        await updateData(VITE_ROOT_API_URL + `/itb-mshop/v1/brands`,isEdit, newBrand)
        router.push({name:'BrandManage'})
        }else{
        await addData(VITE_ROOT_API_URL + `/itb-mshop/v1/brands`, newBrand)
        router.push({name:'BrandManage'})
        
        }
   
    
    }catch(err){
        console.log(err)
    }finally{
       isSaving.value = true;
    }


   
}

</script>

<template>
    <div class="p-6">
    <div class="mb-4 text-xl font-bold text-blue-700">ITB MShop</div>
    <div class="flex space-x-4 mb-6">
      <button id="itbms-item-list" class="border border-dashed border-red-500 px-2 py-1 text-sm rounded">Sale Item List</button>
      <button id="itbms-manage-brand" class="border border-dashed border-red-500 px-2 py-1 text-sm rounded">Brand List</button>
    </div>

    <div class="bg-blue-50 p-6 rounded-xl shadow-md max-w-xl">
      <h2 class="text-lg font-semibold mb-4">{{ isEdit ? 'Edit Brand' : 'New Brand' }}</h2>

        <div class="mb-4">
          <label for="name" class="block font-medium">Name <span class="text-red-500">*</span></label>
          <input id="itbms-name" v-model="brand.name" type="text" required @blur="trimField('name')"
          class="w-full border p-2 rounded" />
        </div>

        <div class="mb-4">
          <label for="websiteUrl" class="block font-medium">Website URL</label>
          <input id="itbms-websiteUrl" v-model="brand.websiteUrl" type="text" @blur="trimField('websiteUrl')"
           class="w-full border p-2 rounded" />
        </div>

        <div class="mb-4 flex items-center space-x-2">
          <label for="isActive" class="font-medium">Active</label>
          <input id="itbms-isActive" type="checkbox" v-model="brand.isActive" />
        </div>

        <div class="mb-4">
          <label for="countryOfOrigin" class="block font-medium">Country Of Origin</label>
          <input id="itbms-countryOfOrigin" v-model="brand.countryOfOrigin" type="text" @blur="trimField('countryOfOrigin')"
           class="w-full border p-2 rounded" />
        </div>

        <div class="flex space-x-4 mt-6">
          <button @click="handleSave" :disabled="!isSaving || !isFormValid || prop.mode === 'Edit' && !isBrandChanged" id="itbms-save-button" type="submit"
           class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {{ isSaving ? 'Save' : 'Saving...' }}
          </button>
          <button id="itbms-cancel-button" type="button" @click="handleCancel" class="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-100">
            Cancel
          </button>
        </div>
    </div>
  </div>
</template>