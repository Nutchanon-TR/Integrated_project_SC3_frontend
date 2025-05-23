<script setup>
import { ref, watch } from 'vue';
import BrandDropdown from './BrandDropdown.vue';

const props = defineProps({
  modelValue: Array,
  tempBrand: String,
});
const emit = defineEmits(['update:tempBrand', 'search', 'clear']);

const selectedBrands = ref([...props.modelValue]);

// สร้าง tempBrandLocal แทนการใช้ props โดยตรง
const tempBrandLocal = ref(props.tempBrand);

// Sync modelValue
watch(() => props.modelValue, (val) => {
  selectedBrands.value = [...val];
});

// Sync tempBrand → tempBrandLocal
watch(() => props.tempBrand, (val) => {
  tempBrandLocal.value = val;
});

// ส่งค่ากลับเมื่อเปลี่ยน tempBrandLocal
watch(tempBrandLocal, (val) => {
  emit('update:tempBrand', val);
});

const addBrand = () => {
  if (tempBrandLocal.value && !selectedBrands.value.includes(tempBrandLocal.value)) {
    selectedBrands.value.push(tempBrandLocal.value);
    emit('update:modelValue', selectedBrands.value);
  }
  tempBrandLocal.value = '';
  emit('update:tempBrand', '');
};

const removeBrand = (brand) => {
  selectedBrands.value = selectedBrands.value.filter(b => b !== brand);
  emit('update:modelValue', selectedBrands.value);
};
</script>

<template>
  <div class="mt-6 space-y-4">
    <div class="flex items-center gap-4">
      <BrandDropdown v-model="tempBrandLocal" class="flex-1" />
      <button @click="addBrand" class="btn-primary">➕ เพิ่มแบรนด์</button>
      <button @click="$emit('clear')" class="btn-danger">❌ ลบแบรนด์</button>
    </div>

    <div class="flex flex-wrap gap-2">
      <span v-for="brand in props.modelValue" :key="brand" class="tag">
        {{ brand }}
        <button @click="removeBrand(brand)" class="text-red-500 font-bold">×</button>
      </span>
    </div>

    <button @click="$emit('search')" class="btn-success">
      🔍 ค้นหาสินค้า
    </button>
  </div>
</template>
