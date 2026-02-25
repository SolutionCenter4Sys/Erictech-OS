<template>
  <QCard class="auth-card">
    <QCardSection class="auth-card-header">
      <div class="auth-logo">ERICTECH</div>
      <div class="auth-subtitle">Gestão de Ordens de Serviço</div>
    </QCardSection>
    <QCardSection class="q-pa-lg">
      <QForm @submit="onSubmit" class="q-gutter-md">
        <QInput
          v-model="email"
          type="email"
          label="E-mail"
          outlined
          dense
          :rules="[val => !!val || 'E-mail obrigatório']"
          aria-label="E-mail"
        >
          <template #prepend>
            <QIcon name="mdi-email-outline" />
          </template>
        </QInput>
        <QInput
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Senha"
          outlined
          dense
          :rules="[val => !!val || 'Senha obrigatória']"
          aria-label="Senha"
        >
          <template #prepend>
            <QIcon name="mdi-lock-outline" />
          </template>
          <template #append>
            <QIcon
              :name="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              class="cursor-pointer"
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showPassword = !showPassword"
            />
          </template>
        </QInput>
        <div class="row justify-end">
          <a href="#" class="text-caption" style="color: var(--text-link)">Esqueci minha senha</a>
        </div>
        <QBtn
          type="submit"
          color="accent"
          label="Entrar"
          class="full-width q-mt-md"
          :loading="loading"
          unelevated
          size="md"
          no-caps
        />
      </QForm>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { login } = useAuth()
const { success, error } = useNotify()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    const ok = await login(email.value, password.value)
    if (ok) {
      success('Login realizado com sucesso!')
      await router.push('/dashboard')
    } else {
      error('E-mail ou senha inválidos.')
    }
  } catch (e) {
    error('Erro ao fazer login.')
  } finally {
    loading.value = false
  }
}
</script>
