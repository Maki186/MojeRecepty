<template>
  <div>
    <nav class="border-b">
      <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <router-link to="/" class="font-semibold">Moje Recepty</router-link>
        <div class="flex items-center gap-4">
          <router-link to="/" class="text-sm text-gray-700">Domů</router-link>
          <router-link to="/add" class="text-sm text-gray-700">Přidat</router-link>
          <template v-if="isAuthenticated">
            <span class="text-sm text-gray-600">Přihlášen: {{ username }}</span>
            <button @click="logout" class="text-sm text-blue-600">Odhlásit</button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-sm text-blue-600">Přihlásit</router-link>
          </template>
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
  
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
auth.init()
const { isAuthenticated, username } = storeToRefs(auth)

function logout() {
  auth.logout()
}
</script>

