<template>
  <div class="max-w-xl mx-auto p-6">
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
      <div class="flex gap-3">
        <router-link to="/" class="px-4 py-2 border rounded-md">Zpět</router-link>
        <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">Uložit</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipesStore } from '../stores/recipes'

const title = ref('')
const description = ref('')
const router = useRouter()
const store = useRecipesStore()

function submit() {
  store.addRecipe({ title: title.value, description: description.value })
  router.push('/')
}
</script>



