<template>
  <div class="max-w-3xl mx-auto p-6" v-if="recipe">
    <div class="mb-4">
      <router-link to="/" class="text-sm text-blue-600 hover:underline">← Zpět</router-link>
      <router-link :to="`/recipe/${recipe.id}/edit`" class="ml-4 text-sm text-blue-600 hover:underline">Upravit</router-link>
    </div>
    <h1 class="text-3xl font-bold mb-2">{{ recipe.title }}</h1>
    <div class="text-gray-600 mb-4 flex items-center gap-4">
      <div class="flex gap-2 flex-wrap">
        <span v-for="c in recipe.categories" :key="c" class="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">{{ c }}</span>
      </div>
    </div>
    <p class="text-gray-800 leading-relaxed whitespace-pre-line mb-6">{{ recipe.description }}</p>

    <div v-if="recipe.ingredients?.length" class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Ingredience</h2>
       <div class="text-gray-600 mb-4 flex items-center gap-4">
      <span v-if="recipe.minutes !== null">⏱️ {{ recipe.minutes }} min</span>
      <div class="flex items-center gap-2">
        <button @click="decrement" class="w-8 h-8 leading-8 text-center border rounded" aria-label="Méně porcí">−</button>
        <input v-model.number="currentServings" type="number" min="1" class="w-16 text-center border rounded" />
        <button @click="increment" class="w-8 h-8 leading-8 text-center border rounded" aria-label="Více porcí">+</button>
        <span class="text-sm">porcí</span>
      </div>
       </div>
      <ul class="list-disc pl-6 space-y-1">
        <li v-for="(ing, i) in scaledIngredients" :key="i">
          <label class="inline-flex items-start gap-2">
            <input type="checkbox" class="mt-1" :checked="isIngredientChecked(i)" @change="toggleIngredient(i)" />
            <span :class="{ 'line-through text-gray-400': isIngredientChecked(i) }">
              <template v-if="ing.quantity !== null">
                {{ formatQuantity(ing.quantity) }}
                <span class="ml-1">{{ ing.name }}</span>
              </template>
              <template v-else>
                {{ ing.name }}
              </template>
            </span>
          </label>
        </li>
      </ul>
    </div>

    <div v-if="recipe.steps?.length" class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Postup</h2>
      <ol class="list-decimal pl-6 space-y-1">
        <li v-for="(st, i) in recipe.steps" :key="i">
          <label class="inline-flex items-start gap-2">
            <input type="checkbox" class="mt-1" :checked="isStepChecked(i)" @change="toggleStep(i)" />
            <span :class="{ 'line-through text-gray-400': isStepChecked(i) }">{{ st }}</span>
          </label>
        </li>
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
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '../stores/recipes'

const route = useRoute()
const store = useRecipesStore()
const recipeId = Number(route.params.id)
const recipe = computed(() => store.recipes.find(r => r.id === recipeId))

// Checked state for ingredients and steps (must be defined before watch with immediate)
const checkedIngredients = ref(new Set())
const checkedSteps = ref(new Set())

const currentServings = ref(1)
watch(recipe, (r) => {
  currentServings.value = r?.servings || 1
  // Reset checked states when recipe changes
  checkedIngredients.value = new Set()
  checkedSteps.value = new Set()
}, { immediate: true })

function increment() {
  currentServings.value = Math.max(1, (currentServings.value || 1) + 1)
}
function decrement() {
  currentServings.value = Math.max(1, (currentServings.value || 1) - 1)
}

const scale = computed(() => {
  const base = recipe.value?.servings || 1
  const cur = currentServings.value || 1
  return cur / base
})

const scaledIngredients = computed(() => {
  const list = recipe.value?.ingredients || []
  const factor = scale.value
  return list.map(ing => {
    if (ing && typeof ing === 'object' && ing.quantity != null) {
      return { ...ing, quantity: +(ing.quantity * factor).toFixed(2) }
    }
    return ing?.name ? ing : { name: String(ing ?? '') }
  })
})

function formatQuantity(q) {
  // Format: integer if whole, otherwise max 2 decimals
  const whole = Math.round(q)
  if (Math.abs(whole - q) < 1e-9) return String(whole)
  return q.toFixed(2)
}

function toggleIngredient(index) {
  const next = new Set(checkedIngredients.value)
  if (next.has(index)) next.delete(index)
  else next.add(index)
  checkedIngredients.value = next
}

function isIngredientChecked(index) {
  return checkedIngredients.value.has(index)
}

function toggleStep(index) {
  const next = new Set(checkedSteps.value)
  if (next.has(index)) next.delete(index)
  else next.add(index)
  checkedSteps.value = next
}

function isStepChecked(index) {
  return checkedSteps.value.has(index)
}
</script>


