<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Restaura preferência de dark mode salva pelo usuário
// Usa o CheckIn-Audiencias-Banco DS como paleta dark (dark-first)
const { $q } = useNuxtApp()

onMounted(() => {
  const saved = localStorage.getItem('erictech-theme')
  if (saved === 'dark') {
    $q.dark.set(true)
  } else if (saved === 'light') {
    $q.dark.set(false)
  } else {
    // Respeita preferência do sistema se nenhuma salva
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    $q.dark.set(prefersDark)
  }
})
</script>
