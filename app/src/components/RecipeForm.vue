<template>
  <v-form @submit.prevent="handleSubmit">
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-4"
      :text="error"
    />

    <v-text-field
      v-model="title"
      label="Název receptu"
      placeholder="např. Babiččiny palačinky"
      :rules="[requiredRule]"
      prepend-inner-icon="mdi-silverware-fork-knife"
    />

    <v-textarea
      v-model="description"
      label="Popis"
      placeholder="Krátký popis nebo úvod k receptu"
      rows="3"
      auto-grow
    />

    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="minutes"
          label="Doba přípravy"
          type="number"
          min="0"
          suffix="min"
          prepend-inner-icon="mdi-clock-outline"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="servings"
          label="Počet porcí"
          type="number"
          min="1"
          prepend-inner-icon="mdi-account-group-outline"
        />
      </v-col>
    </v-row>

    <p class="text-subtitle-2 mb-2">Kategorie</p>
    <v-chip-group v-model="selectedCategories" column multiple filter class="mb-4">
      <v-chip
        v-for="category in categories"
        :key="category"
        :value="category"
        :prepend-icon="iconForCategory(category)"
        filter
        variant="outlined"
      >
        {{ category }}
      </v-chip>
    </v-chip-group>

    <v-textarea
      v-model="ingredientsText"
      label="Ingredience"
      hint="Každá ingredience na nový řádek"
      persistent-hint
      rows="4"
      placeholder="2 vejce&#10;200 g mouky&#10;špetka soli"
      prepend-inner-icon="mdi-basket-outline"
    />

    <v-textarea
      v-model="stepsText"
      label="Postup"
      hint="Každý krok na nový řádek"
      persistent-hint
      rows="5"
      placeholder="Předehřejte troubu na 180 °C&#10;Smíchejte suché ingredience"
      prepend-inner-icon="mdi-format-list-numbered"
    />

    <v-textarea
      v-model="notes"
      label="Poznámky"
      placeholder="Tipy, obměny, poznámky z kuchyně..."
      rows="3"
      auto-grow
      prepend-inner-icon="mdi-note-text-outline"
    />

    <div class="d-flex flex-wrap ga-3 mt-2">
      <v-btn variant="text" color="secondary" @click="emit('cancel')">
        Zpět
      </v-btn>
      <v-btn
        type="submit"
        color="primary"
        variant="flat"
        :loading="saving"
        :disabled="saving"
      >
        {{ submitLabel }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { CATEGORIES as categories } from '../constants/categories'
import { iconForCategory } from '../utils/categoryIcons'

const props = defineProps({
  initial: {
    type: Object,
    default: () => ({}),
  },
  saving: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  submitLabel: {
    type: String,
    default: 'Uložit',
  },
})

const emit = defineEmits(['submit', 'cancel'])

const title = ref('')
const description = ref('')
const minutes = ref(null)
const servings = ref(1)
const selectedCategories = ref([])
const ingredientsText = ref('')
const stepsText = ref('')
const notes = ref('')

const requiredRule = (value) => !!String(value || '').trim() || 'Název je povinný'

function applyInitial(value) {
  title.value = value.title ?? ''
  description.value = value.description ?? ''
  minutes.value = value.minutes ?? null
  servings.value = value.servings ?? 1
  selectedCategories.value = [...(value.categories || [])]
  ingredientsText.value = value.ingredientsText ?? ''
  stepsText.value = value.stepsText ?? ''
  notes.value = value.notes ?? ''
}

watch(() => props.initial, applyInitial, { immediate: true, deep: true })

function handleSubmit() {
  if (!String(title.value || '').trim()) return

  emit('submit', {
    title: title.value,
    description: description.value,
    minutes: minutes.value,
    servings: servings.value,
    categories: selectedCategories.value,
    ingredients: ingredientsText.value.split('\n').map(s => s.trim()).filter(Boolean),
    steps: stepsText.value.split('\n').map(s => s.trim()).filter(Boolean),
    notes: notes.value,
  })
}
</script>
