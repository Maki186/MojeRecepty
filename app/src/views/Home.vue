<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">Moje Recepty</h1>
    <p class="text-gray-600 mb-6">Přehled uložených receptů.</p>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <button
        v-for="c in allCategories"
        :key="c"
        @click="setCategory(c)"
        class="px-3 py-1 rounded-full border text-sm"
        :class="activeCategory === c ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'"
      >
        {{ c }}
      </button>
    </div>

    <div v-if="filteredRecipes.length === 0" class="text-gray-500">Zatím žádné recepty.</div>
    <ul v-else class="space-y-3">
      <li v-for="r in filteredRecipes" :key="r.id" class="p-4 border rounded-md">
        <div class="flex items-start justify-between gap-4">
          <div>
            <router-link :to="`/recipe/${r.id}`" class="font-semibold hover:underline">{{ r.title }}</router-link>
            <div class="text-sm text-gray-600 mt-1">
              <span v-if="r.minutes !== null">⏱️ {{ r.minutes }} min</span>
            </div>
          </div>
          <div class="flex gap-2 flex-wrap">
            <span v-for="c in r.categories" :key="c" class="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">{{ c }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
  
  <router-link
    to="/add"
    class="fixed bottom-6 right-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow"
  >
    + Přidat recept
  </router-link>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRecipesStore } from '../stores/recipes'
import { storeToRefs } from 'pinia'
import { CATEGORIES } from '../constants/categories'

const store = useRecipesStore()
const { filteredRecipes, activeCategory } = storeToRefs(store)

const allCategories = computed(() => ['Vše', ...CATEGORIES])
function setCategory(c) {
  store.setActiveCategory(c)
}

onMounted(() => {
  store.fetchRecipes().catch(() => {})
})
</script>



