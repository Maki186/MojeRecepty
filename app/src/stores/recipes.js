import { defineStore } from 'pinia'

let nextId = 1

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    recipes: [],
    activeCategory: 'Vše',
  }),
  actions: {
    addRecipe(recipe) {
      const item = {
        id: nextId++,
        title: recipe.title?.trim() || 'Bez názvu',
        description: recipe.description?.trim() || '',
        categories: Array.isArray(recipe.categories) ? [...new Set(recipe.categories)] : [],
        minutes: Number.isFinite(+recipe.minutes) && +recipe.minutes >= 0 ? Math.floor(+recipe.minutes) : null,
        notes: recipe.notes?.trim() || '',
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients.map(s => String(s).trim()).filter(Boolean)
          : [],
        steps: Array.isArray(recipe.steps)
          ? recipe.steps.map(s => String(s).trim()).filter(Boolean)
          : [],
      }
      this.recipes.unshift(item)
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



