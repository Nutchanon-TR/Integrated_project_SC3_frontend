
import { createRouter, createWebHistory } from 'vue-router'
import ProductList from "../views/ProductList.vue"
import HomePage from '@/views/HomePage.vue'
import ProductDetail from '@/views/ProductDetail.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage 
    },
    {
      path: '/products',
      name: 'Products',
      component: ProductList
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: ProductDetail
    }
  ],
})

export default router
