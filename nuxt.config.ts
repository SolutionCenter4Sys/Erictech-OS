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
      brand: {
        primary: '#0D2137',
        secondary: '#4CAF50',
        accent: '#4CAF50',
        dark: '#0D2137',
        positive: '#4CAF50',
        negative: '#EF4444',
        info: '#3B82F6',
        warning: '#F59E0B',
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
