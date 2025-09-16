import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddRecipe from '../views/AddRecipe.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/add', name: 'add', component: AddRecipe },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router



