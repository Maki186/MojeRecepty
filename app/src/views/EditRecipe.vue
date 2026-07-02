<template>
  <div class="max-w-xl ml-3 mr-3 mt-3 p-6" v-if="recipe">
    <h1 class="text-2xl font-bold mb-4">Upravit recept</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <div>
        <label class="block text-sm font-medium mb-1">Název</label>
        <input v-model="title" class="w-full border rounded-md px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Popis</label>
        <textarea v-model="description" class="w-full border rounded-md px-3 py-2" rows="4"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Doba přípravy (minuty)</label>
        <input v-model.number="minutes" type="number" min="0" step="1" class="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Počet porcí</label>
        <input v-model.number="servings" type="number" min="1" step="1" class="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Kategorie</label>
        <div class="grid grid-cols-2 gap-2">
          <label v-for="c in categories" :key="c" class="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" :value="c" v-model="selectedCategories" />
            <span>{{ c }}</span>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Ingredience (každá na nový řádek)</label>
        <textarea v-model="ingredientsText" class="w-full border rounded-md px-3 py-2" rows="4"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Postup (každý krok na nový řádek)</label>
        <textarea v-model="stepsText" class="w-full border rounded-md px-3 py-2" rows="5"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Poznámky</label>
        <textarea v-model="notes" class="w-full border rounded-md px-3 py-2" rows="3"></textarea>
      </div>
      <div class="flex gap-3">
        <v-btn :to="`/recipe/${recipe.id}`" variant="text" color="secondary">Zpět</v-btn>
        <v-btn type="submit" color="primary" variant="flat" class="text-black" :loading="saving" :disabled="saving">Uložit změny</v-btn>
      </div>
    </form>
  </div>
  <div v-else-if="store.loading" class="max-w-xl mx-auto p-6 text-gray-600">Načítám recept...</div>
  <div v-else-if="store.error" class="max-w-xl mx-auto p-6 text-red-600">{{ store.error }}</div>
  <div v-else class="max-w-xl mx-auto p-6 text-gray-600">Recept nenalezen.</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipesStore } from '../stores/recipes'
import { CATEGORIES as categories } from '../constants/categories'

const route = useRoute()
const router = useRouter()
const store = useRecipesStore()
const recipeId = computed(() => String(route.params.id))
const recipe = computed(() => store.getRecipeById(recipeId.value))

const title = ref('')
const description = ref('')
const minutes = ref(null)
const servings = ref(1)
const selectedCategories = ref([])
const ingredientsText = ref('')
const stepsText = ref('')
const notes = ref('')
const saving = ref(false)
const error = ref('')

watch(recipe, (value) => {
  if (!value) return
  title.value = value.title
  description.value = value.description
  minutes.value = value.minutes
  servings.value = value.servings
  selectedCategories.value = [...(value.categories || [])]
  ingredientsText.value = (value.ingredients || []).map(i => (i.quantity != null ? `${i.quantity} ${i.name}` : i.name)).join('\n')
  stepsText.value = (value.steps || []).join('\n')
  notes.value = value.notes || ''
}, { immediate: true })

onMounted(() => {
  store.ensureRecipesLoaded().catch(() => {})
})

async function submit() {
  error.value = ''
  saving.value = true
  try {
    await store.updateRecipe(recipeId.value, {
      title: title.value,
      description: description.value,
      minutes: minutes.value,
      servings: servings.value,
      categories: selectedCategories.value,
      ingredients: ingredientsText.value.split('\n').map(s => s.trim()).filter(Boolean),
      steps: stepsText.value.split('\n').map(s => s.trim()).filter(Boolean),
      notes: notes.value,
    })
    router.push(`/recipe/${recipeId.value}`)
  } catch (e) {
    error.value = e?.message || 'Uložení změn selhalo.'
  } finally {
    saving.value = false
  }
}
</script>


