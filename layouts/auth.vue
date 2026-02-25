<template>
  <div class="auth-layout">
    <div class="auth-background" />
    <div class="auth-content">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-800) 40%, var(--color-primary-500) 100%);
  z-index: 0;
}

.auth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: var(--space-4);
}
</style>
