import { defineStore } from 'pinia'

let nextId = 1

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    recipes: [],
  }),
  actions: {
    addRecipe(recipe) {
      const item = {
        id: nextId++,
        title: recipe.title?.trim() || 'Bez názvu',
        description: recipe.description?.trim() || '',
      }
      this.recipes.unshift(item)
    },
  },
})



