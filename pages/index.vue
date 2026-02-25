<script setup lang="ts">
definePageMeta({ layout: false })

if (import.meta.server) {
  await navigateTo('/dashboard', { replace: true, redirectCode: 302 })
} else {
  await navigateTo('/dashboard', { replace: true })
}
</script>
<template><div /></template>
