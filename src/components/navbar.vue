<script setup>
import { RouterLink } from 'vue-router'

</script>

<template>
    <!-- Navigation Bar -->
    <header class="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
        <RouterLink to="/">
            <div class="text-2xl font-bold text-blue-600">SmartStore</div>
        </RouterLink>
        <div class="flex-1 mx-6 max-w-xl">
            <div class="relative">
                <input type="text" placeholder="Search smartphones..." class="pl-10 pr-4 py-2 border rounded w-full" />
                <svg class="absolute left-3 top-2.5 text-gray-400 w-5 h-5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"></path>
                </svg>
            </div>
        </div>
        <nav class="flex items-center space-x-4">
            <button class="text-gray-700 hover:text-blue-600">Brands</button>
            <button class="text-gray-700 hover:text-blue-600">Models</button>
            <svg class="w-6 h-6 text-gray-600 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l1.4-7H6.6M7 13L5.2 6H3m4 7l1.5 6h9l1.5-6M10 17a2 2 0 100 4 2 2 0 000-4zm7 0a2 2 0 100 4 2 2 0 000-4z">
                </path>
            </svg>
            <button class="border px-3 py-1 rounded hover:bg-gray-100">Login</button>
            <button class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Sign Up</button>
        </nav>
    </header>

</template>

<style scoped></style>