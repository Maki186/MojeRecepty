<template>
  <div class="max-w-xl ml-3 mr-3 mt-3 p-6">
    <h1 class="text-2xl font-bold mb-4">Přidat recept</h1>
    <form @submit.prevent="submit" class="space-y-4">
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
        <label class="block text-sm font-medium mb-1">Ingredience (každá na nový řádek)</label>
        <textarea v-model="ingredientsText" class="w-full border rounded-md px-3 py-2" rows="4" placeholder="např.\n2 vejce\n200 g mouky\nšpetka soli"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Postup (každý krok na nový řádek)</label>
        <textarea v-model="stepsText" class="w-full border rounded-md px-3 py-2" rows="5" placeholder="např.\nPředehřejte troubu na 180 °C\nSmíchejte suché ingredience\nVmíchejte vejce a mléko"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Poznámky</label>
        <textarea v-model="notes" class="w-full border rounded-md px-3 py-2" rows="3" placeholder="Tipy, obměny apod."></textarea>
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
      <div class="flex gap-3">
        <v-btn to="/" variant="text" color="secondary">Zpět</v-btn>
        <v-btn type="submit" color="primary" variant="flat" class="text-black">Uložit</v-btn>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipesStore } from '../stores/recipes'
import { CATEGORIES as categories } from '../constants/categories'

const title = ref('')
const description = ref('')
const selectedCategories = ref([])
const minutes = ref(null)
const servings = ref(1)
const ingredientsText = ref('')
const stepsText = ref('')
const notes = ref('')
const router = useRouter()
const store = useRecipesStore()

function submit() {
  store.addRecipe({
    title: title.value,
    description: description.value,
    categories: selectedCategories.value,
    minutes: minutes.value,
    servings: servings.value,
    ingredients: ingredientsText.value.split('\n').map(s => s.trim()).filter(Boolean),
    steps: stepsText.value.split('\n').map(s => s.trim()).filter(Boolean),
    notes: notes.value,
  })
  router.push('/')
}
</script>



