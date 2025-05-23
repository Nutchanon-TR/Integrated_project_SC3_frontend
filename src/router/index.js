
import { createRouter, createWebHistory } from 'vue-router'
import ProductList from "../views/ProductList.vue"
import HomePage from '@/views/HomePage.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import ProuctEdit from '@/views/ProuctEdit.vue'
import ProuctCreate from '@/views/ProuctCreate.vue'
import BrandCreate from '@/views/BrandCreate.vue'
import ProductManage from '@/views/ProductManage.vue'
import BrandManage from '@/views/BrandManage.vue'
import BrandEdit from '@/views/BrandEdit.vue'



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
      component: ProuctEdit,
      props:true
    },
    {
      path: '/sale-items/create',
      name: 'ProuctCreate',
      component: ProuctCreate

    },
    {
      path: '/sale-items/list',
      name: 'ProductManage',
      component: ProductManage
    },
    {
      path: '/brands/add',
      name: 'BrandCreate',
      component: BrandCreate
    },
    {
      path: '/brands',
      name: 'BrandManage',
      component: BrandManage

    },
    {
      path: '/brands/:id/edit',
      name: 'BrandEdit',
      component: BrandEdit
    }

  ],
})

export default router
