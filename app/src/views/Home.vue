<template>
  <div class="max-w-5xl ml-3 mr-3 mt-3 p-4 p-sm-6 ">
    <h1 class="text-3xl font-bold mb-4">Moje Recepty</h1>
    <p class="text-gray-600 mb-6">Přehled uložených receptů.</p>

    <div class="mb-4">
      <v-chip-group row v-model="categoryModel" @update:model-value="onCategoryChange">
        <v-chip
          v-for="c in allCategories"
          :key="c"
          class="ma-1"
          variant="elevated"
          :color="activeCategory === c ? 'primary' : ''"
          :text-color="activeCategory === c ? 'black' : ''"
          @click="setCategory(c)"
          :prepend-icon="iconForCategory(c)"
        >
          {{ c }}
        </v-chip>
      </v-chip-group>
    </div>

    <div v-if="store.loading" class="text-gray-500">Načítám recepty...</div>
    <div v-else-if="store.error" class="text-red-600 mb-4">{{ store.error }}</div>
    <div v-else-if="filteredRecipes.length === 0" class="text-gray-500">Zatím žádné recepty.</div>
    <v-container fluid class="pa-0">
      <v-row dense>
        <v-col v-for="r in filteredRecipes" :key="r.id" cols="12" sm="6" md="4">
          <v-card elevation="1">
            <v-card-title class="text-wrap">{{ r.title }}</v-card-title>
            <v-card-subtitle>
              <v-icon icon="mdi-timer-outline" size="small" class="mr-1" v-if="r.minutes !== null" />
              <span v-if="r.minutes !== null">{{ r.minutes }} min</span>
            </v-card-subtitle>
            <v-card-text>
              <div class="flex gap-2 flex-wrap">
                <v-chip v-for="c in r.categories" :key="c" size="small" variant="outlined" :prepend-icon="iconForCategory(c)">{{ c }}</v-chip>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" variant="flat" :to="`/recipe/${r.id}`" class="text-black">Otevřít</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
  
  <v-btn to="/add" class="position-fixed" style="right:24px; bottom:24px;" color="primary" variant="flat">
    + Přidat recept
  </v-btn>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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

const categoryModel = ref(null)
function onCategoryChange() {}

function iconForCategory(c) {
  const key = String(c).toLowerCase()
  if (key === 'vše') return 'mdi-view-list'
  if (key.includes('polév')) return 'mdi-pot-steam-outline'
  if (key.includes('hlav') || key.includes('maso')) return 'mdi-food-steak'
  if (key.includes('dezert') || key.includes('slad')) return 'mdi-cupcake'
  if (key.includes('příloh')) return 'mdi-food-variant'
  if (key.includes('salát')) return 'mdi-food-outline'
  if (key.includes('snída') || key.includes('pala')) return 'mdi-food-croissant'
  return 'mdi-tag-outline'
}
</script>



