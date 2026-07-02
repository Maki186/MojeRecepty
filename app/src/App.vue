<template>
  <v-app>
    <v-app-bar color="surface-variant" elevation="0" border>
      <template #prepend>
        <v-btn icon="mdi-silverware-fork-knife" color="primary" variant="text" to="/" />
      </template>

      <v-app-bar-title class="font-weight-bold text-body-1 text-sm-h6">
        Moje Recepty
      </v-app-bar-title>

      <template #append>
        <v-btn icon="mdi-home-outline" color="secondary" variant="text" to="/" />
        <v-btn icon="mdi-plus" color="primary" variant="text" to="/add" />

        <template v-if="isAuthenticated">
          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-account-circle-outline" color="secondary" variant="text" />
            </template>
            <v-list density="compact" min-width="220">
              <v-list-item :title="username" subtitle="Přihlášený uživatel" prepend-icon="mdi-email-outline" />
              <v-divider class="my-1" />
              <v-list-item title="Odhlásit se" prepend-icon="mdi-logout" @click="logout" />
            </v-list>
          </v-menu>
        </template>
        <v-btn v-else variant="flat" color="primary" size="small" to="/login" class="ml-1">
          Přihlásit
        </v-btn>
      </template>
    </v-app-bar>

    <v-main class="bg-background">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const { isAuthenticated, username } = storeToRefs(auth)

onMounted(() => {
  auth.init().catch(() => {})
})

function logout() {
  auth.logout()
}
</script>
