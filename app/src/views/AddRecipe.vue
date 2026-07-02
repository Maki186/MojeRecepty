<template>
  <PageContainer size="narrow">
    <v-card class="pa-2 pa-sm-6">
      <v-card-item class="pb-0">
        <v-card-title class="text-h5 font-weight-bold">Přidat recept</v-card-title>
        <v-card-subtitle>
          Vyplň údaje a ulož nový recept do sbírky
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <RecipeForm
          :saving="saving"
          :error="error"
          submit-label="Uložit recept"
          @submit="submit"
          @cancel="router.push('/')"
        />
      </v-card-text>
    </v-card>
  </PageContainer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageContainer from '../components/PageContainer.vue'
import RecipeForm from '../components/RecipeForm.vue'
import { useRecipesStore } from '../stores/recipes'

const router = useRouter()
const store = useRecipesStore()
const saving = ref(false)
const error = ref('')

async function submit(recipe) {
  error.value = ''
  saving.value = true
  try {
    await store.addRecipe(recipe)
    router.push('/')
  } catch (e) {
    error.value = e?.message || 'Uložení receptu selhalo.'
  } finally {
    saving.value = false
  }
}
</script>
