<template>
    <div class="min-h-screen flex flex-col bg-white text-gray-800">
        <navbar />

        <!-- Hero Banner -->
        <section class="bg-blue-50 py-16 px-6 text-center">
            <h1 class="text-4xl font-bold text-blue-700 mb-4">Upgrade to the Latest Smartphones</h1>
            <p class="text-gray-600 text-lg mb-6">Discover amazing deals on top brands and new arrivals.</p>
            <RouterLink to="/products">
                <button class="bg-blue-600 text-white text-lg px-6 py-3 rounded hover:bg-blue-700">Shop Now</button>
            </RouterLink>
        </section>

        <!-- Recommended Phones -->
        <section class="py-12 px-6">
            <h2 class="text-2xl font-semibold mb-6">Best Sellers</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="n in 4" :key="n" class="border rounded hover:shadow-lg transition p-4 text-center">
                    <svg class="mx-auto mb-4 text-blue-500 w-12 h-12" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 4h10M7 20h10M9 4v16m6-16v16"></path>
                    </svg>
                    <h3 class="text-lg font-semibold">Phone Model {{ n }}</h3>
                    <p class="text-sm text-gray-500">Top brand, great features</p>
                    <button class="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">View</button>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-8 px-6">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                    <h4 class="font-semibold mb-2">Contact Us</h4>
                    <p>Email: support@smartstore.com</p>
                    <p>Phone: +1 (800) 123-4567</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-2">Policies</h4>
                    <ul class="space-y-1">
                        <li><a href="#" class="hover:underline">Privacy Policy</a></li>
                        <li><a href="#" class="hover:underline">Return Policy</a></li>
                        <li><a href="#" class="hover:underline">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-2">Follow Us</h4>
                    <div class="flex space-x-4">
                        <a href="#" class="hover:text-blue-400">Facebook</a>
                        <a href="#" class="hover:text-blue-400">Twitter</a>
                        <a href="#" class="hover:text-blue-400">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import navbar from '../components/navbar.vue'
</script>

<style scoped></style>