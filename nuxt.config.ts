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
      // Cores alinhadas ao Foursys Design System (design-toolkit-17-12.md)
      brand: {
        primary: '#0D2137',    // Navy Erictech
        secondary: '#18C964',  // Verde Erictech (alinhado Foursys accent)
        accent: '#18C964',     // Verde Erictech
        dark: '#0F172A',       // Foursys text-primary (dark surfaces)
        positive: '#16A34A',   // Foursys success
        negative: '#DC2626',   // Foursys error
        info: '#2563EB',       // Foursys info
        warning: '#F59E0B',    // Foursys warning (mantido)
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
