import { defineStore } from 'pinia'

let nextId = 1

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    recipes: [],
    activeCategory: 'Vše',
  }),
  actions: {
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



