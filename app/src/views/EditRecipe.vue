<template>
  <PageContainer size="narrow">
    <v-progress-linear v-if="store.loading" indeterminate color="primary" class="mb-6 rounded-lg" />

    <v-alert
      v-else-if="store.error"
      type="error"
      variant="tonal"
      :text="store.error"
    />

    <v-card v-else-if="recipe" class="pa-2 pa-sm-6">
      <v-card-item class="pb-0">
        <v-card-title class="text-h5 font-weight-bold">Upravit recept</v-card-title>
        <v-card-subtitle>{{ recipe.title }}</v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <RecipeForm
          :initial="formInitial"
          :saving="saving"
          :error="error"
          submit-label="Uložit změny"
          @submit="submit"
          @cancel="router.push(`/recipe/${recipeId}`)"
        />
      </v-card-text>
    </v-card>

    <v-card v-else class="pa-8 text-center">
      <v-icon icon="mdi-alert-circle-outline" size="48" color="accent" class="mb-4" />
      <p class="text-h6 font-weight-medium mb-2">Recept nenalezen</p>
      <v-btn to="/" variant="text" color="secondary">Zpět na přehled</v-btn>
    </v-card>
  </PageContainer>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageContainer from '../components/PageContainer.vue'
import RecipeForm from '../components/RecipeForm.vue'
import { useRecipesStore } from '../stores/recipes'

const route = useRoute()
const router = useRouter()
const store = useRecipesStore()
const recipeId = computed(() => String(route.params.id))
const recipe = computed(() => store.getRecipeById(recipeId.value))
const saving = ref(false)
const error = ref('')

const formInitial = computed(() => {
  if (!recipe.value) return {}
  return {
    title: recipe.value.title,
    description: recipe.value.description,
    minutes: recipe.value.minutes,
    servings: recipe.value.servings,
    categories: recipe.value.categories,
    ingredientsText: (recipe.value.ingredients || [])
      .map(i => (i.quantity != null ? `${i.quantity} ${i.name}` : i.name))
      .join('\n'),
    stepsText: (recipe.value.steps || []).join('\n'),
    notes: recipe.value.notes || '',
  }
})

onMounted(() => {
  store.ensureRecipesLoaded().catch(() => {})
})

async function submit(updates) {
  error.value = ''
  saving.value = true
  try {
    await store.updateRecipe(recipeId.value, updates)
    router.push(`/recipe/${recipeId.value}`)
  } catch (e) {
    error.value = e?.message || 'Uložení změn selhalo.'
  } finally {
    saving.value = false
  }
}
</script>
