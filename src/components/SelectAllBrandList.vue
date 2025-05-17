<script setup>
import { onMounted } from "vue";
import { unitPrice, nullCatching } from "../libs/utils.js"
import { useAlertStore } from "../stores/alertStore.js"

const alertStore = useAlertStore();

const props = defineProps({
  brand: {
    type: Array,
    default: () => []
  }
});

onMounted(() => {
  console.log('brandList mounted');
  console.log(props.brand);

  if (alertStore.message) {
    setTimeout(() => {
      alertStore.clearMessage();
    }, 3000);
  }
});
</script>

<template>
  <div class="max-w-7xl mx-auto mt-[40px]">
    <!-- Navigation Links -->
    <div class="flex mb-4">
      <RouterLink :to="{name: 'ProductManage'}" class="text-blue-500 mr-6">Sale Item List</RouterLink>
      <a href="#" class="text-blue-500">Add Brand</a>
    </div>
    
    <!-- Alert Message -->
    <div v-if="alertStore.message" 
         :class="`px-4 py-2 rounded mb-4 ${alertStore.type === 'error' 
           ? 'bg-red-100 text-red-700' 
           : 'bg-blue-100 text-blue-700'}`">
      {{ alertStore.message }}
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse mb-[80px]">
        <thead>
          <tr>
            <th class="bg-blue-700 text-white py-3 px-4 text-center w-1/12">Id</th>
            <th class="bg-blue-700 text-white py-3 px-4 text-center">Name</th>
            <th class="bg-blue-700 text-white py-3 px-4 text-center w-2/12">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in props.brand" :key="item.id" :class="index % 2 === 0 ? 'bg-blue-50' : 'bg-white'" class="border border-gray-200">
            <td class="py-2 px-4 text-center border-r border-gray-200">{{ item.id }}</td>
            <td class="py-2 px-4 text-center border-r border-gray-200">{{ item.name }}</td>
            <td class="py-2 px-4 text-center">
              <div class="flex justify-center space-x-2">
                 <button class="bg-blue-700 hover:bg-blue-800 text-white w-8 h-8 flex items-center justify-center rounded transition duration-150 hover:cursor-pointer">
                  🖋️
                </button>
                <button class="bg-white hover:bg-red-500 border border-gray-300 text-gray-700 w-8 h-8 flex items-center justify-center rounded transition duration-150 hover:cursor-pointer">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
          
          <!-- Empty state -->
          <tr v-if="!props.brand || props.brand.length === 0">
            <td colspan="3" class="px-6 py-4 text-center text-gray-500 itbms-no">
              No sale items available
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>