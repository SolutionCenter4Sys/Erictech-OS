// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: [
    '@pinia/nuxt',
    'nuxt-quasar-ui',
  ],
  imports: {
    dirs: ['stores'],
  },
  quasar: {
    extras: ['mdi-v7'],
    plugins: ['Notify', 'Dialog'],
    config: {
      // Foursys Design System (design-toolkit-17-12.md)
      // Primary: #000000 (preto) | Accent: #18C964 (verde)
      brand: {
        // Foursys DS — apenas 2 cores ativas:
        // Gradiente → #9A1BFF > #7B1CE5 > #4F46E5 | Accent → #18C964
        primary:   '#4F46E5',  // Indigo-600 (fim do gradiente brand — cor sólida)
        secondary: '#18C964',  // Accent verde Foursys
        accent:    '#18C964',  // Accent verde Foursys
        dark:      '#1E1B4B',  // Indigo-950 (dark mode surfaces)
        positive:  '#16A34A',  // Success
        negative:  '#DC2626',  // Error
        info:      '#2563EB',  // Info
        warning:   '#F59E0B',  // Warning
      },
    },
  },
  css: ['~/assets/css/erictech.scss'],
  app: {
    head: {
      title: 'Erictech — Gestão de OS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Erictech OS Management - Sistema de Gestão de Ordens de Serviço' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
  ssr: true,
  devServer: {
    port: 9500,
  },
  devtools: { enabled: true },
  experimental: {
    payloadExtraction: true,
  },
})
