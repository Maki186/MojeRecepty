<template>
  <PageContainer>
    <v-progress-linear v-if="store.loading" indeterminate color="primary" class="mb-6 rounded-lg" />

    <v-alert
      v-else-if="store.error"
      type="error"
      variant="tonal"
      :text="store.error"
    />

    <template v-else-if="recipe">
      <div class="d-flex flex-wrap ga-2 mb-4">
        <v-btn variant="text" color="secondary" prepend-icon="mdi-arrow-left" to="/">
          Zpět
        </v-btn>
        <v-spacer class="d-none d-sm-block" />
        <v-btn
          color="accent"
          variant="tonal"
          prepend-icon="mdi-pencil-outline"
          :to="`/recipe/${recipe.id}/edit`"
        >
          Upravit
        </v-btn>
        <v-btn
          color="error"
          variant="tonal"
          prepend-icon="mdi-delete-outline"
          @click="openDelete = true"
        >
          Smazat
        </v-btn>
      </div>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
        :text="error"
      />

      <v-card class="mb-4">
        <v-card-item>
          <v-card-title class="text-h4 text-wrap">{{ recipe.title }}</v-card-title>
          <v-card-subtitle class="d-flex flex-wrap align-center ga-3 mt-2">
            <span v-if="recipe.minutes !== null" class="d-inline-flex align-center ga-1">
              <v-icon icon="mdi-clock-outline" size="small" />
              {{ recipe.minutes }} min
            </span>
            <span class="d-inline-flex align-center ga-1">
              <v-icon icon="mdi-account-group-outline" size="small" />
              {{ recipe.servings }} porcí
            </span>
          </v-card-subtitle>
        </v-card-item>

        <v-card-text v-if="recipe.categories?.length" class="pt-0">
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

        <v-card-text v-if="recipe.description" class="text-body-1">
          {{ recipe.description }}
        </v-card-text>
      </v-card>

      <v-card v-if="recipe.ingredients?.length" class="mb-4">
        <v-card-title class="text-h6">Ingredience</v-card-title>
        <v-card-text>
          <div class="d-flex align-center flex-wrap ga-3 mb-4">
            <span class="text-body-2 text-medium-emphasis">Přepočítat na</span>
            <v-btn-group density="comfortable" divided>
              <v-btn icon="mdi-minus" variant="outlined" @click="decrement" />
              <v-text-field
                v-model.number="currentServings"
                type="number"
                min="1"
                density="compact"
                hide-details
                style="max-width: 72px"
                class="servings-input"
              />
              <v-btn icon="mdi-plus" variant="outlined" @click="increment" />
            </v-btn-group>
            <span class="text-body-2">porcí</span>
          </div>

          <v-list lines="two" density="comfortable" class="pa-0">
            <v-list-item
              v-for="(ingredient, index) in scaledIngredients"
              :key="index"
              :class="{ 'line-through': isIngredientChecked(index) }"
              @click="toggleIngredient(index)"
            >
              <template #prepend>
                <v-checkbox-btn
                  :model-value="isIngredientChecked(index)"
                  @click.stop
                  @update:model-value="toggleIngredient(index)"
                />
              </template>
              <v-list-item-title>
                <template v-if="ingredient.quantity !== null">
                  {{ formatQuantity(ingredient.quantity) }} {{ ingredient.name }}
                </template>
                <template v-else>
                  {{ ingredient.name }}
                </template>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <v-card v-if="recipe.steps?.length" class="mb-4">
        <v-card-title class="text-h6">Postup</v-card-title>
        <v-card-text class="pt-0">
          <v-timeline side="end" density="compact" truncate-line="both">
            <v-timeline-item
              v-for="(step, index) in recipe.steps"
              :key="index"
              dot-color="accent"
              size="small"
            >
              <div
                class="d-flex align-start ga-2"
                :class="{ 'line-through': isStepChecked(index) }"
                @click="toggleStep(index)"
              >
                <v-checkbox-btn
                  :model-value="isStepChecked(index)"
                  @click.stop
                  @update:model-value="toggleStep(index)"
                />
                <span class="text-body-1">{{ step }}</span>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>

      <v-card v-if="recipe.notes">
        <v-card-title class="text-h6">Poznámky</v-card-title>
        <v-card-text class="text-body-1" style="white-space: pre-line">
          {{ recipe.notes }}
        </v-card-text>
      </v-card>

      <v-dialog v-model="openDelete" max-width="420">
        <v-card>
          <v-card-title>Smazat recept?</v-card-title>
          <v-card-text>
            Tato akce je nevratná. Recept „{{ recipe.title }}“ bude trvale odstraněn.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" color="secondary" @click="openDelete = false">Zrušit</v-btn>
            <v-btn
              color="error"
              variant="flat"
              :loading="deleting"
              :disabled="deleting"
              @click="confirmDelete"
            >
              Smazat
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <v-card v-else class="pa-8 text-center">
      <v-icon icon="mdi-alert-circle-outline" size="48" color="accent" class="mb-4" />
      <p class="text-h6 font-weight-medium mb-2">Recept nenalezen</p>
      <v-btn to="/" variant="text" color="secondary">Zpět na přehled</v-btn>
    </v-card>
  </PageContainer>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageContainer from '../components/PageContainer.vue'
import { useRecipesStore } from '../stores/recipes'
import { iconForCategory } from '../utils/categoryIcons'

const route = useRoute()
const router = useRouter()
const store = useRecipesStore()
const recipeId = computed(() => String(route.params.id))
const recipe = computed(() => store.getRecipeById(recipeId.value))
const deleting = ref(false)
const error = ref('')
const openDelete = ref(false)

const checkedIngredients = ref(new Set())
const checkedSteps = ref(new Set())
const currentServings = ref(1)

onMounted(() => {
  store.ensureRecipesLoaded().catch(() => {})
})

watch(recipe, (value) => {
  currentServings.value = value?.servings || 1
  checkedIngredients.value = new Set()
  checkedSteps.value = new Set()
}, { immediate: true })

function increment() {
  currentServings.value = Math.max(1, (currentServings.value || 1) + 1)
}

function decrement() {
  currentServings.value = Math.max(1, (currentServings.value || 1) - 1)
}

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
  const current = currentServings.value || 1
  return current / base
})

const scaledIngredients = computed(() => {
  const list = recipe.value?.ingredients || []
  const factor = scale.value
  return list.map(ingredient => {
    if (ingredient && typeof ingredient === 'object' && ingredient.quantity != null) {
      return { ...ingredient, quantity: +(ingredient.quantity * factor).toFixed(2) }
    }
    return ingredient?.name ? ingredient : { name: String(ingredient ?? '') }
  })
})

function formatQuantity(quantity) {
  const whole = Math.round(quantity)
  if (Math.abs(whole - quantity) < 1e-9) return String(whole)
  return quantity.toFixed(2)
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

<style scoped>
.servings-input :deep(.v-field) {
  border-radius: 0;
}
</style>
