<template>
  <PageContainer size="wide">
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-1">Moje recepty</h1>
        <p class="text-body-1 text-medium-emphasis mb-0">
          Rodinné recepty na jednom místě
        </p>
      </div>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" to="/add" class="d-none d-sm-flex">
        Přidat recept
      </v-btn>
    </div>

    <v-chip-group class="mb-6">
      <v-chip
        v-for="category in allCategories"
        :key="category"
        :color="activeCategory === category ? 'primary' : undefined"
        :variant="activeCategory === category ? 'flat' : 'outlined'"
        :prepend-icon="iconForCategory(category)"
        @click="setCategory(category)"
      >
        {{ category }}
      </v-chip>
    </v-chip-group>

    <v-progress-linear v-if="store.loading" indeterminate color="primary" class="mb-6 rounded-lg" />

    <v-alert
      v-else-if="store.error"
      type="error"
      variant="tonal"
      class="mb-6"
      :text="store.error"
    />

    <v-card v-else-if="filteredRecipes.length === 0" class="pa-8 text-center">
      <v-icon icon="mdi-book-open-page-variant-outline" size="56" color="accent" class="mb-4" />
      <p class="text-h6 font-weight-medium mb-2">Zatím žádné recepty</p>
      <p class="text-body-2 text-medium-emphasis mb-6">
        Přidej první recept a začni budovat svou rodinnou kuchařku.
      </p>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" to="/add">
        Přidat první recept
      </v-btn>
    </v-card>

    <v-row v-else>
      <v-col v-for="recipe in filteredRecipes" :key="recipe.id" cols="12" sm="6" lg="4">
        <v-card class="recipe-card h-100 d-flex flex-column">
          <v-card-item>
            <v-card-title class="text-wrap">{{ recipe.title }}</v-card-title>
            <v-card-subtitle v-if="recipe.minutes !== null" class="d-flex align-center ga-1">
              <v-icon icon="mdi-clock-outline" size="small" />
              {{ recipe.minutes }} min
              <span v-if="recipe.servings">· {{ recipe.servings }} porcí</span>
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="flex-grow-1">
            <p v-if="recipe.description" class="text-body-2 text-medium-emphasis mb-3 text-truncate-2">
              {{ recipe.description }}
            </p>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="category in recipe.categories"
                :key="category"
                size="small"
                variant="tonal"
                color="secondary"
                :prepend-icon="iconForCategory(category)"
              >
                {{ category }}
              </v-chip>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" variant="flat" block :to="`/recipe/${recipe.id}`">
              Otevřít recept
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-fab
      app
      icon="mdi-plus"
      color="primary"
      location="bottom end"
      size="large"
      to="/add"
      class="d-sm-none"
    />
  </PageContainer>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import PageContainer from '../components/PageContainer.vue'
import { CATEGORIES } from '../constants/categories'
import { useRecipesStore } from '../stores/recipes'
import { iconForCategory } from '../utils/categoryIcons'

const store = useRecipesStore()
const { filteredRecipes, activeCategory } = storeToRefs(store)

const allCategories = computed(() => ['Vše', ...CATEGORIES])

function setCategory(category) {
  store.setActiveCategory(category)
}

onMounted(() => {
  store.fetchRecipes().catch(() => {})
})
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
