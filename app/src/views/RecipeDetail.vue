<template>
  <div class="max-w-3xl mx-auto p-6" v-if="recipe">
    <div class="mb-4">
      <router-link to="/" class="text-sm text-blue-600 hover:underline">← Zpět</router-link>
    </div>
    <h1 class="text-3xl font-bold mb-2">{{ recipe.title }}</h1>
    <div class="text-gray-600 mb-4 flex items-center gap-4">
      <span v-if="recipe.minutes !== null">⏱️ {{ recipe.minutes }} min</span>
      <div class="flex gap-2 flex-wrap">
        <span v-for="c in recipe.categories" :key="c" class="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">{{ c }}</span>
      </div>
    </div>
    <p class="text-gray-800 leading-relaxed whitespace-pre-line mb-6">{{ recipe.description }}</p>

    <div v-if="recipe.ingredients?.length" class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Ingredience</h2>
      <ul class="list-disc pl-6 space-y-1">
        <li v-for="(ing, i) in recipe.ingredients" :key="i">{{ ing }}</li>
      </ul>
    </div>

    <div v-if="recipe.steps?.length" class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Postup</h2>
      <ol class="list-decimal pl-6 space-y-1">
        <li v-for="(st, i) in recipe.steps" :key="i">{{ st }}</li>
      </ol>
    </div>

    <div v-if="recipe.notes" class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Poznámky</h2>
      <p class="whitespace-pre-line text-gray-800">{{ recipe.notes }}</p>
    </div>
  </div>
  <div v-else class="max-w-3xl mx-auto p-6 text-gray-600">Recept nenalezen.</div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '../stores/recipes'

const route = useRoute()
const store = useRecipesStore()
const recipeId = Number(route.params.id)
const recipe = computed(() => store.recipes.find(r => r.id === recipeId))
</script>


