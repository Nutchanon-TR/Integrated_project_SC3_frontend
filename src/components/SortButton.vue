<!-- src/components/SortPanel.vue -->
<script setup>
const props = defineProps({
  sortDirection: String
});
const emit = defineEmits(['sort-asc', 'sort-desc', 'reset']);

</script>

<template>
  <div class="mt-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
    <div class="flex gap-2">
      <button @click="$emit('sort-asc')" :class="[
        'btn',
        props.sortDirection === 'asc' ? 'btn-active' : 'btn-default'
      ]">
        ⬆️ เรียงจากน้อยไปมาก
      </button>

      <button @click="$emit('sort-desc')" :class="[
        'btn',
        props.sortDirection === 'desc' ? 'btn-active' : 'btn-default'
      ]">
        ⬇️ เรียงจากมากไปน้อย
      </button>
    </div>

    <button @click="$emit('reset')" class="text-gray-500 hover:text-gray-800 text-xl" title="Reset">
      🔄
    </button>
  </div>
</template>

<style scoped>

</style>
