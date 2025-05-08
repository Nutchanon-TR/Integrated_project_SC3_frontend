
import { createRouter, createWebHistory } from 'vue-router'
import ProductList from "../views/ProductList.vue"
import HomePage from '@/views/HomePage.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import ProuctEdit from '@/views/ProuctEdit.vue'
import ProuctCreate from '@/views/ProuctCreate.vue'



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
      path: '/sale-items/:id/edit',
      name: 'Edit',
      component: ProuctEdit
    },
    {
      path: '/sale-items/create',
      name: 'ProuctCreate',
      component: ProuctCreate
    }
  ],
})

export default router
