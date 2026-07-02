<template>
  <div class="max-w-3xl ml-3 mr-3 mt-3 p-6" v-if="recipe">
    <div class="mb-4">
      <v-btn variant="text" color="secondary" to="/">← Zpět</v-btn>
      <v-btn variant="flat" color="primary" class="text-black ml-2" :to="`/recipe/${recipe.id}/edit`">Upravit</v-btn>
      <v-btn variant="flat" color="red" class="text-black ml-2" @click="openDelete = true">Smazat</v-btn>
    </div>
    <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>
    <h1 class="text-3xl font-bold mb-2">{{ recipe.title }}</h1>
    <div class="text-gray-600 mb-4 flex items-center gap-4">
      <div class="flex gap-2 flex-wrap">
        <v-chip v-for="c in recipe.categories" :key="c" size="small" variant="outlined" :prepend-icon="iconForCategory(c)">{{ c }}</v-chip>
      </div>
    </div>
    <p class="text-gray-800 leading-relaxed whitespace-pre-line mb-6">{{ recipe.description }}</p>

    <div v-if="recipe.ingredients?.length" class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Ingredience</h2>
       <div class="text-gray-600 mb-4 flex items-center gap-4">
      <span v-if="recipe.minutes !== null">⏱️ {{ recipe.minutes }} min</span>
      <div class="flex items-center gap-2">
        <v-btn @click="decrement" size="small" variant="flat" color="primary" class="text-black" aria-label="Méně porcí">−</v-btn>
        <v-text-field v-model.number="currentServings" type="number" min="1" class="w-24" density="compact" hide-details />
        <v-btn @click="increment" size="small" variant="flat" color="primary" class="text-black" aria-label="Více porcí">+</v-btn>
        <span class="text-sm">porcí</span>
      </div>
       </div>
      <ul class="list-disc pl-6 space-y-1">
        <li v-for="(ing, i) in scaledIngredients" :key="i">
          <label class="inline-flex items-start gap-2">
            <v-checkbox-btn :model-value="isIngredientChecked(i)" @update:model-value="toggleIngredient(i)" />
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
            <v-checkbox-btn :model-value="isStepChecked(i)" @update:model-value="toggleStep(i)" />
            <span :class="{ 'line-through text-gray-400': isStepChecked(i) }">{{ st }}</span>
          </label>
        </li>
      </ol>
    </div>

    <div v-if="recipe.notes" class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Poznámky</h2>
      <p class="whitespace-pre-line text-gray-800">{{ recipe.notes }}</p>
    </div>
    <v-dialog v-model="openDelete" max-width="420">
      <v-card>
        <v-card-title>Opravdu si přejete recept smazat?</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="secondary" @click="openDelete = false">Zrušit</v-btn>
          <v-btn color="red" variant="flat" class="text-black" :loading="deleting" :disabled="deleting" @click="confirmDelete">Smazat</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else-if="store.loading" class="max-w-3xl mx-auto p-6 text-gray-600">Načítám recept...</div>
  <div v-else-if="store.error" class="max-w-3xl mx-auto p-6 text-red-600">{{ store.error }}</div>
  <div v-else class="max-w-3xl mx-auto p-6 text-gray-600">Recept nenalezen.</div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '../stores/recipes'
import { useRouter } from 'vue-router'

const route = useRoute()
const store = useRecipesStore()
const router = useRouter()
const recipeId = computed(() => String(route.params.id))
const recipe = computed(() => store.getRecipeById(recipeId.value))
const deleting = ref(false)
const error = ref('')

onMounted(() => {
  store.ensureRecipesLoaded().catch(() => {})
})

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

// Delete dialog state
const openDelete = ref(false)
async function confirmDelete() {
  if (!recipe.value) return
  error.value = ''
  deleting.value = true
  try {
    await store.deleteRecipe(recipe.value.id)
    router.push('/')
  } catch (e) {
    error.value = e?.message || 'Smazání receptu selhalo.'
  } finally {
    deleting.value = false
    openDelete.value = false
  }
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

function iconForCategory(c) {
  const key = String(c).toLowerCase()
  if (key.includes('polév')) return 'mdi-pot-steam-outline'
  if (key.includes('hlav') || key.includes('maso')) return 'mdi-food-steak'
  if (key.includes('dezert') || key.includes('slad')) return 'mdi-cupcake'
  if (key.includes('příloh')) return 'mdi-food-variant'
  if (key.includes('salát')) return 'mdi-food-outline'
  if (key.includes('snída') || key.includes('pala')) return 'mdi-food-croissant'
  return 'mdi-tag-outline'
}
</script>


