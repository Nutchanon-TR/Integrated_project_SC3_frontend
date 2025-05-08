
import { createRouter, createWebHistory } from 'vue-router'
import ProductList from "../views/ProductList.vue"
import HomePage from '@/views/HomePage.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import BrandDropdown from '@/components/BrandDropdown.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage 
    },
    {
      path: '/sale-items',
      name: 'Products',
      component: ProductList
    },
    {
      path: '/sale-items/:id',
      name: 'Detail',
      component: ProductDetail
    },
    {
      path: '/brand',
      name: 'Brand',
      component: BrandDropdown
    }
  ],
})

export default router
