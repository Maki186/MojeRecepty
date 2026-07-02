<template>
  <PageContainer size="narrow">
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="pa-2 pa-sm-6">
          <v-card-item class="pb-0">
            <v-card-title class="text-h5 font-weight-bold">Přihlášení</v-card-title>
            <v-card-subtitle>
              Přihlas se pro správu svých receptů
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model.trim="email"
                label="E-mail"
                type="email"
                autocomplete="username"
                prepend-inner-icon="mdi-email-outline"
              />

              <v-text-field
                v-model="password"
                label="Heslo"
                type="password"
                autocomplete="current-password"
                prepend-inner-icon="mdi-lock-outline"
              />

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
                :text="error"
              />

              <v-btn
                type="submit"
                color="primary"
                variant="flat"
                block
                size="large"
                :loading="auth.loading"
              >
                Přihlásit se
              </v-btn>

              <v-btn to="/" variant="text" color="secondary" block class="mt-2">
                Zpět na přehled
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </PageContainer>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageContainer from '../components/PageContainer.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
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
