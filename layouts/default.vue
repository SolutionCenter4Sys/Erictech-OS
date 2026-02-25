<template>
  <QLayout view="lHh Lpr lFf" class="erictech-layout">
    <QHeader elevated class="erictech-header">
      <QToolbar>
        <QBtn
          flat
          dense
          round
          icon="mdi-menu"
          aria-label="Menu"
          @click="drawer = !drawer"
        />
        <QToolbarTitle class="text-weight-bold">
          ERICTECH
        </QToolbarTitle>
        <QSpace />
        <QBtn flat round dense icon="mdi-keyboard" aria-label="Atalhos de teclado" @click="showShortcuts = true">
          <QTooltip>Ver atalhos de teclado</QTooltip>
        </QBtn>
        <QBtn flat round dense icon="mdi-bell-outline" aria-label="Notificações">
          <QTooltip>Notificações</QTooltip>
        </QBtn>
        <QBtn flat round dense>
          <QAvatar size="32px" color="primary">
            <span class="text-white text-subtitle2">{{ userInitials }}</span>
          </QAvatar>
          <QMenu>
            <QList style="min-width: 200px">
              <QItem clickable v-close-popup>
                <QItemSection avatar>
                  <QIcon name="mdi-account" />
                </QItemSection>
                <QItemSection>Meu Perfil</QItemSection>
              </QItem>
              <QItem clickable v-close-popup @click="logout">
                <QItemSection avatar>
                  <QIcon name="mdi-logout" />
                </QItemSection>
                <QItemSection>Sair</QItemSection>
              </QItem>
            </QList>
          </QMenu>
        </QBtn>
      </QToolbar>
    </QHeader>

    <QDrawer
      v-model="drawer"
      show-if-above
      bordered
      :width="280"
      class="erictech-drawer"
    >
      <QList class="q-pa-md">
        <QItem
          v-for="item in navItems"
          :key="item.to"
          clickable
          :to="item.to"
          exact
          active-class="erictech-nav-active"
          class="erictech-nav-item"
        >
          <QItemSection avatar>
            <QIcon :name="item.icon" size="sm" />
          </QItemSection>
          <QItemSection>
            <QItemLabel>{{ item.label }}</QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </QDrawer>

    <QPageContainer>
      <NuxtPage />
    </QPageContainer>
    <QDialog v-model="showShortcuts" position="top">
      <QCard style="min-width: 320px">
        <QCardSection>
          <div class="text-h6">Atalhos de teclado</div>
        </QCardSection>
        <QCardSection class="q-pt-none">
          <QList dense>
            <QItem><QItemSection>Ctrl + N</QItemSection><QItemSection side>Nova OS</QItemSection></QItem>
            <QItem><QItemSection>Ctrl + /</QItemSection><QItemSection side>Buscar</QItemSection></QItem>
            <QItem><QItemSection>Esc</QItemSection><QItemSection side>Fechar diálogo</QItemSection></QItem>
          </QList>
        </QCardSection>
      </QCard>
    </QDialog>
  </QLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const drawer = ref(true)
const showShortcuts = ref(false)

const userInitials = computed(() => {
  const name = authStore.user?.name ?? 'Usuário'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
})

const navItems = computed(() => {
  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard' },
    { to: '/os', label: 'Ordens de Serviço', icon: 'mdi-clipboard-text' },
    { to: '/distribuicao', label: 'Distribuição', icon: 'mdi-account-switch' },
    { to: '/orcamentos', label: 'Orçamentos', icon: 'mdi-file-document-edit' },
    { to: '/estoque', label: 'Estoque', icon: 'mdi-package-variant' },
    { to: '/auditoria', label: 'Auditoria', icon: 'mdi-shield-check' },
  ]
  if (authStore.user?.role === 'admin') {
    items.push({ to: '/usuarios', label: 'Usuários', icon: 'mdi-account-group' })
  }
  return items
})

function logout() {
  authStore.logout()
  navigateTo('/login')
}

function setupShortcuts() {
  const handler = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault()
      navigateTo('/os/nova')
    }
  }
  onMounted(() => window.addEventListener('keydown', handler))
  onUnmounted(() => window.removeEventListener('keydown', handler))
}
setupShortcuts()
</script>
