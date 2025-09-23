<template>
  <v-app>
    <v-app-bar elevation="1" color="primary">
      <v-app-bar-title class="font-semibold">Moje Recepty</v-app-bar-title>
      <v-spacer />
      <v-btn variant="flat" color="secondary" to="/">Domů</v-btn>
      <v-btn variant="flat" color="secondary" to="/add">Přidat</v-btn>
      <template v-if="isAuthenticated">
        <v-chip class="ml-2" color="secondary" text-color="white" prepend-icon="mdi-account-circle">{{ username }}</v-chip>
        <v-btn class="ml-2" variant="flat" color="secondary" @click="logout">Odhlásit</v-btn>
      </template>
      <template v-else>
        <v-btn class="ml-2" variant="flat" color="secondary" to="/login">Přihlásit</v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
  
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

