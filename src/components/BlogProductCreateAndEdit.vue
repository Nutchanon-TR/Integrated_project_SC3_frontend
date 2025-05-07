<template>
      <div class="flex flex-col sm:flex-row sm:items-center">
        <label class="font-medium text-gray-700 sm:w-48 mb-1 sm:mb-0">
          <slot name="text" />
        </label>
        <div class="w-full">
          <slot name="inputText" />
        </div>
      </div>
</template>
