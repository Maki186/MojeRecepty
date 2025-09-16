<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">Moje Recepty</h1>
    <p class="text-gray-600 mb-6">Přehled uložených receptů.</p>
    <div v-if="recipes.length === 0" class="text-gray-500">Zatím žádné recepty.</div>
    <ul v-else class="space-y-3">
      <li v-for="r in recipes" :key="r.id" class="p-4 border rounded-md flex items-center justify-between">
        <div>
          <div class="font-semibold">{{ r.title }}</div>
          <div class="text-sm text-gray-500">{{ r.description }}</div>
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
import { useRecipesStore } from '../stores/recipes'
import { storeToRefs } from 'pinia'

const store = useRecipesStore()
const { recipes } = storeToRefs(store)
</script>



