import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

let nextId = 1

function normalizeId(value) {
  return String(value)
}

function normalizeRecipe(record) {
  return {
    id: record.id,
    title: record.title || 'Bez názvu',
    description: record.description || '',
    categories: Array.isArray(record.categories) ? record.categories : [],
    minutes: Number.isFinite(+record.minutes) ? +record.minutes : null,
    servings: Number.isFinite(+record.servings) ? +record.servings : 1,
    notes: record.notes || '',
    ingredients: Array.isArray(record.ingredients) ? record.ingredients : [],
    steps: Array.isArray(record.steps) ? record.steps : [],
  }
}

function parseIngredient(line) {
  const trimmed = String(line).trim()
  if (!trimmed) return null
  const match = trimmed.match(/^([0-9]+(?:[\.,][0-9]+)?|[0-9]+\/[0-9]+)\s+(.*)$/)
  if (!match) {
    return { raw: trimmed, quantity: null, name: trimmed }
  }

  let qtyStr = match[1]
  const rest = match[2].trim()
  let quantity = null

  if (qtyStr.includes('/')) {
    const [a, b] = qtyStr.split('/')
    const num = Number(a)
    const den = Number(b)
    if (Number.isFinite(num) && Number.isFinite(den) && den !== 0) {
      quantity = num / den
    }
  } else {
    qtyStr = qtyStr.replace(',', '.')
    const num = Number(qtyStr)
    if (Number.isFinite(num)) quantity = num
  }

  return { raw: trimmed, quantity, name: rest || trimmed }
}

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    recipes: [],
    activeCategory: 'Vše',
    loading: false,
    loaded: false,
    error: '',
  }),
  actions: {
    async fetchRecipes() {
      this.loading = true
      this.error = ''
      try {
        const { data: authData } = await supabase.auth.getUser()
        const userId = authData?.user?.id

        if (!userId) {
          this.recipes = []
          this.loaded = true
          return
        }

        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        if (error) throw error

        this.recipes = (data || []).map(normalizeRecipe)

        const maxId = this.recipes.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0)
        nextId = Math.max(nextId, maxId + 1)
        this.loaded = true
      } catch (error) {
        this.error = error?.message || 'Nepodařilo se načíst recepty.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async ensureRecipesLoaded() {
      if (this.loaded || this.loading) return
      await this.fetchRecipes()
    },
    async addRecipe(recipe) {
      const item = {
        id: nextId++,
        title: recipe.title?.trim() || 'Bez názvu',
        description: recipe.description?.trim() || '',
        categories: Array.isArray(recipe.categories) ? [...new Set(recipe.categories)] : [],
        minutes: Number.isFinite(+recipe.minutes) && +recipe.minutes >= 0 ? Math.floor(+recipe.minutes) : null,
        servings: Number.isFinite(+recipe.servings) && +recipe.servings > 0 ? Math.floor(+recipe.servings) : 1,
        notes: recipe.notes?.trim() || '',
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients
              .map(parseIngredient)
              .filter(Boolean)
          : [],
        steps: Array.isArray(recipe.steps)
          ? recipe.steps.map(s => String(s).trim()).filter(Boolean)
          : [],
      }

      this.recipes.unshift(item)
      this.error = ''

      try {
        return await this.persistCreate(item)
      } catch (error) {
        this.recipes = this.recipes.filter(r => normalizeId(r.id) !== normalizeId(item.id))
        this.error = error?.message || 'Nepodařilo se uložit recept.'
        throw error
      }
    },
    async persistCreate(item) {
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData?.user?.id
      if (!userId) throw new Error('Pro uložení receptu je potřeba být přihlášený.')
      const { data, error } = await supabase.from('recipes').insert({
        title: item.title,
        description: item.description,
        categories: item.categories,
        minutes: item.minutes,
        servings: item.servings,
        notes: item.notes,
        ingredients: item.ingredients,
        steps: item.steps,
        user_id: userId,
      }).select('*').single()
      if (error) throw error
      const normalized = normalizeRecipe(data)
      const idx = this.recipes.findIndex(r => normalizeId(r.id) === normalizeId(item.id))
      if (idx !== -1) this.recipes.splice(idx, 1, normalized)
      return normalized
    },
    async updateRecipe(id, updates) {
      const index = this.recipes.findIndex(r => normalizeId(r.id) === normalizeId(id))
      if (index === -1) throw new Error('Recept se nepodařilo najít.')
      const original = this.recipes[index]
      const merged = {
        ...original,
        title: updates.title?.trim() ?? original.title,
        description: updates.description?.trim() ?? original.description,
        minutes: Number.isFinite(+updates.minutes) && +updates.minutes >= 0 ? Math.floor(+updates.minutes) : original.minutes,
        servings: Number.isFinite(+updates.servings) && +updates.servings > 0 ? Math.floor(+updates.servings) : original.servings,
        categories: Array.isArray(updates.categories) ? [...new Set(updates.categories)] : original.categories,
        notes: updates.notes?.trim() ?? original.notes,
        ingredients: Array.isArray(updates.ingredients)
          ? updates.ingredients.map(parseIngredient).filter(Boolean)
          : original.ingredients,
        steps: Array.isArray(updates.steps)
          ? updates.steps.map(s => String(s).trim()).filter(Boolean)
          : original.steps,
      }
      this.recipes.splice(index, 1, merged)
      this.error = ''

      try {
        await this.persistUpdate(merged)
        return merged
      } catch (error) {
        this.recipes.splice(index, 1, original)
        this.error = error?.message || 'Nepodařilo se uložit změny.'
        throw error
      }
    },
    async deleteRecipe(id) {
      const index = this.recipes.findIndex(r => normalizeId(r.id) === normalizeId(id))
      if (index === -1) throw new Error('Recept se nepodařilo najít.')
      const removed = this.recipes.splice(index, 1)[0]
      this.error = ''

      try {
        await this.persistDelete(removed)
      } catch (error) {
        this.recipes.splice(index, 0, removed)
        this.error = error?.message || 'Nepodařilo se smazat recept.'
        throw error
      }
    },
    async persistUpdate(item) {
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData?.user?.id
      if (!userId) throw new Error('Pro úpravu receptu je potřeba být přihlášený.')
      const { error } = await supabase.from('recipes').update({
        title: item.title,
        description: item.description,
        categories: item.categories,
        minutes: item.minutes,
        servings: item.servings,
        notes: item.notes,
        ingredients: item.ingredients,
        steps: item.steps,
      }).eq('id', item.id).eq('user_id', userId)
      if (error) throw error
    },
    async persistDelete(item) {
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData?.user?.id
      if (!userId) throw new Error('Pro smazání receptu je potřeba být přihlášený.')
      const { error } = await supabase.from('recipes').delete().eq('id', item.id).eq('user_id', userId)
      if (error) throw error
    },
    setActiveCategory(category) {
      this.activeCategory = category
    },
  },
  getters: {
    getRecipeById(state) {
      return (id) => state.recipes.find(r => normalizeId(r.id) === normalizeId(id))
    },
    categoriesSet(state) {
      const set = new Set()
      state.recipes.forEach(r => (r.categories || []).forEach(c => set.add(c)))
      return set
    },
    filteredRecipes(state) {
      if (!state.activeCategory || state.activeCategory === 'Vše') return state.recipes
      return state.recipes.filter(r => (r.categories || []).includes(state.activeCategory))
    },
  },
})



