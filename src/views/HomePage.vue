<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-800">

    <!-- Hero Banner -->
    <section
      class="py-20 px-6 text-center bg-cover bg-center bg-no-repeat text-white"
      style="
        background-image: url('https://images.samsung.com/th/smartphones/galaxy-s25-ultra/images/galaxy-s25-ultra-features-kv.jpg?imbypass=true');
      "
    >
      <div class="bg-black/50 backdrop-blur-sm p-8 rounded-lg inline-block">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4">
          Upgrade to the Latest Smartphones
        </h1>
        <p class="text-lg sm:text-xl mb-6">
          Discover amazing deals on top brands and new arrivals.
        </p>
        <RouterLink to="/sale-items">
          <button
            class="itbms-shopnow bg-blue-600 text-white text-lg px-6 py-3 rounded hover:bg-blue-700 transition mr-[10px]"
          >
            Shop Now
          </button>
        </RouterLink>
        <RouterLink to="/sale-items/list">
        <button
        class="itbms-seller bg-blue-600 text-white text-lg px-6 py-3 rounded hover:bg-blue-700 transition ml-[10px]"
        >
        Seller
      </button>
    </RouterLink>
      </div>
    </section>
 

    <!-- Recommended Phones -->
    <section class="py-12 px-6 bg-gray-50">
      <h2 class="text-2xl font-semibold mb-6">Best Sellers</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="n in 4"
          :key="n"
          class="border rounded hover:shadow-lg transition p-4 text-center bg-white"
        >
          <img
            :src="'https://images.samsung.com/sa_en/smartphones/galaxy-s25-ultra/buy/product_color_black_MO.png'"
            alt="Smartphone"
            class="mx-auto mb-4 w-full h-40 object-contain rounded"
          />
          <h3 class="text-lg font-semibold truncate">Galaxy S25 Ultra</h3>
          <p class="text-sm text-gray-500">Top brand, great features</p>
          <button
            class="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            aria-label="View product details"
          >
            View
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
