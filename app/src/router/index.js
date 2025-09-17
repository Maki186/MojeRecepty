import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddRecipe from '../views/AddRecipe.vue'
import RecipeDetail from '../views/RecipeDetail.vue'
import EditRecipe from '../views/EditRecipe.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/add', name: 'add', component: AddRecipe },
  { path: '/recipe/:id', name: 'recipe', component: RecipeDetail },
  { path: '/recipe/:id/edit', name: 'recipe-edit', component: EditRecipe },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router



