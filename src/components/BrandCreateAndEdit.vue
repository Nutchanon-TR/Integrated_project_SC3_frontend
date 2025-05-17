<script setup>
import {ref,reactive,onMounted} from 'vue';
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
onMounted(async ()=>{
    if(prop.mode === "edit" && isEdit){
       try{
            const data = await getDataById(VITE_ROOT_API_URL + `/itb-mshop/v1/brands`,isEdit)
            brand.id = data.id
            brand.name = data.name
            brand.websiteUrl = data.websiteUrl
            brand.countryOfOrigin = data.countryOfOrigin
            brand.isActive = data.isActive
            console.log(brand.value)
       }catch(err){
        console.log(err)
       }
    }
})
const allBrand = ref([])
const handleSave = async () =>{
    const newBrand = {
    name:brand.name,
    websiteUrl:brand.websiteUrl,
    isActive:brand.isActive,
    countryOfOrigin:brand.countryOfOrigin
    }
    try{
        if(prop.mode === 'edit' && isEdit){
            const data = await updateData(VITE_ROOT_API_URL + `/itb-mshop/v1/brands`,isEdit, newBrand)
        }else{
        // const data = await addData(VITE_ROOT_API_URL + `/itb-mshop/v1/brands`, newBrand)
        const data = await addData(VITE_ROOT_API_URL + `/Brands`, newBrand)
        allBrand.value.push(data.value)
        console.log(allBrand.value)
        }
   
    
    
    
    }catch(err){
        console.log(err)
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

      <form @submit.prevent="handleSave">
        <div class="mb-4">
          <label for="name" class="block font-medium">Name <span class="text-red-500">*</span></label>
          <input id="itbms-name" v-model="brand.name" type="text" required class="w-full border p-2 rounded" />
        </div>

        <div class="mb-4">
          <label for="websiteUrl" class="block font-medium">Website URL</label>
          <input id="itbms-websiteUrl" v-model="brand.websiteUrl" type="text" class="w-full border p-2 rounded" />
        </div>

        <div class="mb-4 flex items-center space-x-2">
          <label for="isActive" class="font-medium">Active</label>
          <input id="itbms-isActive" type="checkbox" v-model="brand.isActive" />
        </div>

        <div class="mb-4">
          <label for="countryOfOrigin" class="block font-medium">Country Of Origin</label>
          <input id="itbms-countryOfOrigin" v-model="brand.countryOfOrigin" type="text" class="w-full border p-2 rounded" />
        </div>

        <div class="flex space-x-4 mt-6">
          <button id="itbms-save-button" type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save
          </button>
          <button id="itbms-cancel-button" type="button" @click="handleCancel" class="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>