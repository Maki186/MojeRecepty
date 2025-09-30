<template>
  <div class="max-w-sm ml-3 mr-3 mt-3 p-6">
    <h1 class="text-2xl font-semibold mb-4">Přihlášení</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm mb-1">E-mail</label>
        <input v-model.trim="email" type="email" class="w-full border rounded px-3 py-2" autocomplete="username" />
      </div>
      <div>
        <label class="block text-sm mb-1">Heslo</label>
        <input v-model="password" type="password" class="w-full border rounded px-3 py-2 mb-4" autocomplete="current-password" />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <div class="flex items-center gap-2">
        <v-btn type="submit" color="primary" variant="flat" class="text-black">Přihlásit se</v-btn>
        <v-btn to="/" variant="text" color="secondary">Zpět</v-btn>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
auth.init()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')

async function onSubmit() {
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    const redirect = (route.query.redirect && String(route.query.redirect)) || '/'
    router.replace(redirect)
  } catch (e) {
    error.value = e?.message || 'Přihlášení selhalo'
  }
}
</script>


