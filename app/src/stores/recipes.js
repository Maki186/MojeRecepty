import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

let nextId = 1

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    recipes: [],
    activeCategory: 'Vše',
  }),
  actions: {
    async fetchRecipes() {
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData?.user?.id
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      // Normalize
      this.recipes = (data || []).map(r => ({
        id: r.id,
        title: r.title || 'Bez názvu',
        description: r.description || '',
        categories: Array.isArray(r.categories) ? r.categories : [],
        minutes: Number.isFinite(+r.minutes) ? +r.minutes : null,
        servings: Number.isFinite(+r.servings) ? +r.servings : 1,
        notes: r.notes || '',
        ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
        steps: Array.isArray(r.steps) ? r.steps : [],
      }))
      // Keep nextId above max for local fallback
      const maxId = this.recipes.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0)
      nextId = Math.max(nextId, maxId + 1)
    },
    addRecipe(recipe) {
      function parseIngredient(line) {
        const trimmed = String(line).trim()
        if (!trimmed) return null
        // Capture leading quantity like: 1, 1.5, 1/2, 1,5
        const match = trimmed.match(/^([0-9]+(?:[\.,][0-9]+)?|[0-9]+\/[0-9]+)\s+(.*)$/)
        if (!match) {
          return { raw: trimmed, quantity: null, name: trimmed }
        }
        let qtyStr = match[1]
        const rest = match[2].trim()
        // Normalize quantity
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
      // Fire-and-forget persist; caller may await a new action if needed
      this.persistCreate(item).catch(() => {})
    },
    async persistCreate(item) {
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData?.user?.id
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
      // Replace temp id if needed
      const idx = this.recipes.findIndex(r => r.id === item.id)
      if (idx !== -1) this.recipes.splice(idx, 1, { ...item, id: data.id })
    },
    updateRecipe(id, updates) {
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
      const index = this.recipes.findIndex(r => r.id === id)
      if (index === -1) return
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
      this.persistUpdate(merged).catch(() => {})
    },
    async persistUpdate(item) {
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData?.user?.id
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
    setActiveCategory(category) {
      this.activeCategory = category
    },
  },
  getters: {
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



