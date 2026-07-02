import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

/**
 * Paleta „Teplá kuchyně“ – laděná pro recepty:
 * - terakota: teplo, vaření, hlavní akce
 * - šalvějová zelená: čerstvé ingredience, kategorie
 * - medová zlatá: jemné zvýraznění, detaily
 * - krémové neutrální: čisté pozadí jako recept na papíře
 */
export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      class: 'text-none',
    },
    VCard: {
      rounded: 'lg',
      elevation: 0,
      border: true,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      color: 'primary',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      color: 'primary',
    },
    VChip: {
      rounded: 'lg',
    },
    VAlert: {
      rounded: 'lg',
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#C4654A',
          'primary-darken-1': '#A85540',
          'primary-lighten-1': '#D4846E',
          'on-primary': '#FFFFFF',

          secondary: '#5A7D6A',
          'secondary-darken-1': '#476558',
          'secondary-lighten-1': '#729585',
          'on-secondary': '#FFFFFF',

          accent: '#D4A96A',
          'accent-darken-1': '#B89255',
          'on-accent': '#FFFFFF',

          background: '#FAF6F0',
          surface: '#FFFFFF',
          'surface-variant': '#F3EBE0',
          'on-surface-variant': '#5C534A',
          error: '#B84A4A',
        },
      },
    },
  },
})
