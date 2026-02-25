<template>
  <QLayout view="lHh Lpr lFf" class="erictech-layout">
    <QHeader elevated class="erictech-header">
      <QToolbar>
        <!-- Menu hambúrguer -->
        <QBtn flat dense round aria-label="Menu" class="header-icon-btn" @click="drawer = !drawer">
          <QIcon name="mdi-menu" class="header-icon" />
        </QBtn>

        <!-- Botões de ação logo ao lado do menu, extrema esquerda -->
        <QBtn flat round dense aria-label="Atalhos de teclado" class="header-icon-btn" @click="showShortcuts = true">
          <QIcon name="mdi-keyboard" class="header-icon" />
          <QTooltip>Ver atalhos de teclado</QTooltip>
        </QBtn>

        <QBtn flat round dense aria-label="Notificações" class="header-icon-btn">
          <QIcon name="mdi-bell-outline" class="header-icon" />
          <QTooltip>Notificações</QTooltip>
        </QBtn>

        <QBtn
          flat round dense
          :aria-label="isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'"
          class="header-icon-btn dark-toggle-btn"
          @click="toggleDark"
        >
          <QIcon :name="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" class="header-icon" />
          <QTooltip>{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</QTooltip>
        </QBtn>

        <!-- Título centralizado / ocupando espaço restante -->
        <QToolbarTitle class="text-weight-bold erictech-brand-title">
          ERICTECH
        </QToolbarTitle>

        <!-- Avatar do usuário à direita -->
        <QBtn flat round dense class="header-icon-btn">
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
              <QSeparator />
              <QItem clickable v-close-popup @click="toggleDark">
                <QItemSection avatar>
                  <QIcon :name="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
                </QItemSection>
                <QItemSection>{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</QItemSection>
              </QItem>
              <QSeparator />
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
      <!-- Logo compacto no topo da sidebar -->
      <div class="sidebar-logo">
        <span class="sidebar-logo-text">ET</span>
        <span class="sidebar-logo-dot">•</span>
      </div>

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

      <!-- Dark mode switch no rodapé da sidebar -->
      <div class="sidebar-footer">
        <div class="sidebar-dark-switch">
          <QIcon :name="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'" size="18px" />
          <span class="sidebar-dark-label">{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
          <QToggle
            :model-value="isDark"
            color="secondary"
            dense
            aria-label="Alternar dark mode"
            @update:model-value="toggleDark"
          />
        </div>
      </div>
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

const { $q } = useNuxtApp()
const authStore = useAuthStore()

const drawer = ref(true)
const showShortcuts = ref(false)

const isDark = computed(() => $q.dark.isActive)

function toggleDark() {
  $q.dark.toggle()
  if (import.meta.client) {
    localStorage.setItem('erictech-theme', $q.dark.isActive ? 'dark' : 'light')
  }
}

const userInitials = computed(() => {
  const name = authStore.user?.name ?? 'Usuário'
  return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
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

<style scoped lang="scss">
// Brand title: branco puro no header com gradiente roxo→índigo
.erictech-brand-title {
  color: #FFFFFF;
  letter-spacing: 0.1em;

  // Ponto verde (accent) no final do nome
  &::after {
    content: '.';
    color: #18C964;
  }
}

// Botão de toggle dark no header
.dark-toggle-btn {
  transition: transform 0.3s ease;

  &:hover { transform: rotate(20deg); }
}

// Ícones do header — branco direto, sem depender do sistema de cores do Quasar
:deep(.erictech-header) {
  .header-icon-btn {
    color: #FFFFFF !important;
    min-width: 40px;
    min-height: 40px;

    &:hover {
      background: rgba(255, 255, 255, 0.15) !important;
    }
  }

  .header-icon {
    color: #FFFFFF !important;
    font-size: 22px !important;
  }
}

// Logo compacto na sidebar
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 20px 20px 12px;
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: 0.12em;
  border-bottom: 1px solid var(--border-default);
  margin-bottom: 8px;
}

.sidebar-logo-text { color: var(--text-primary); }
.sidebar-logo-dot  { color: var(--accent); font-size: 1.5rem; line-height: 1; }

// Footer da sidebar com switch de dark mode
.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  border-top: 1px solid var(--border-default);
  background: inherit;
}

.sidebar-dark-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.sidebar-dark-label {
  flex: 1;
  font-weight: 500;
}
</style>
