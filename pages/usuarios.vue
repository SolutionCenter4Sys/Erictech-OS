<template>
  <div class="page-container">
    <QBreadcrumbs class="q-mb-md" aria-label="Navegação">
      <QBreadcrumbsEl label="Usuários" />
    </QBreadcrumbs>
    <QToolbar class="q-mb-md">
      <QToolbarTitle class="text-h6 text-weight-bold" aria-label="Título da página">Gestão de Usuários</QToolbarTitle>
      <QSpace />
      <QBtn color="accent" icon="mdi-plus" label="Novo Usuário" unelevated aria-label="Criar novo usuário" @click="openDialog()" />
    </QToolbar>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-4">
        <QInput
          v-model="searchFilter"
          label="Buscar usuários"
          outlined
          dense
          clearable
          aria-label="Filtrar usuários por nome ou email"
        >
          <template #prepend>
            <QIcon name="mdi-magnify" />
          </template>
        </QInput>
      </div>
    </div>
    <QCard flat bordered>
      <div v-if="loading" class="q-pa-lg">
        <QSkeleton v-for="i in 6" :key="i" type="text" height="48px" class="q-mb-sm" />
      </div>
      <div v-else-if="filteredUsers.length === 0" class="q-pa-xl text-center empty-state">
        <QIcon name="mdi-account-group" size="64px" color="grey-5" class="q-mb-md" aria-hidden="true" />
        <p class="text-h6 text-grey-7 q-mb-sm">Nenhum usuário encontrado</p>
        <p class="text-body2 text-grey-6 q-mb-md">Ajuste o filtro de busca ou cadastre um novo usuário.</p>
        <QBtn color="accent" icon="mdi-plus" label="Novo Usuário" unelevated aria-label="Criar novo usuário" @click="openDialog()" />
      </div>
      <QTable
        v-else
        :rows="filteredUsers"
        :columns="columns"
        row-key="id"
        flat
        class="erictech-table"
        :loading="false"
        aria-label="Tabela de usuários"
      >
        <template #body-cell-role="props">
          <QTd :props="props">
            <QChip
              :color="getRoleColor(props.row.role)"
              text-color="white"
              dense
              size="sm"
              :aria-label="`Papel: ${props.row.role}`"
            >
              {{ props.row.role }}
            </QChip>
          </QTd>
        </template>
        <template #body-cell-ativo="props">
          <QTd :props="props">
            <QToggle
              :model-value="props.row.ativo"
              color="accent"
              :aria-label="`Usuário ${props.row.ativo ? 'ativo' : 'inativo'}`"
              @update:model-value="toggleAtivo(props.row)"
            />
          </QTd>
        </template>
        <template #body-cell-acoes="props">
          <QTd :props="props">
            <QBtn flat dense round icon="mdi-pencil" size="sm" aria-label="Editar usuário" @click="openDialog(props.row)">
              <QTooltip>Editar</QTooltip>
            </QBtn>
          </QTd>
        </template>
      </QTable>
    </QCard>

    <QDialog v-model="dialogOpen" persistent maximized="md" aria-label="Formulário de usuário">
      <QCard style="min-width: 400px">
        <QCardSection>
          <div class="text-h6">{{ editingUser ? 'Editar Usuário' : 'Novo Usuário' }}</div>
        </QCardSection>
        <QCardSection class="q-pt-none">
          <QForm class="q-gutter-md">
            <QInput
              v-model="form.nome"
              label="Nome"
              outlined
              dense
              :rules="[(v) => !!v || 'Nome é obrigatório']"
              aria-label="Nome do usuário"
            />
            <QInput
              v-model="form.email"
              label="Email"
              type="email"
              outlined
              dense
              :rules="[(v) => !!v || 'Email é obrigatório', (v) => /.+@.+\..+/.test(v) || 'Email inválido']"
              aria-label="Email do usuário"
            />
            <QSelect
              v-model="form.role"
              :options="roleOptions"
              label="Papel"
              outlined
              dense
              emit-value
              map-options
              :rules="[(v) => !!v || 'Papel é obrigatório']"
              aria-label="Papel do usuário"
            />
            <QToggle v-model="form.ativo" label="Ativo" color="accent" aria-label="Usuário ativo" />
          </QForm>
        </QCardSection>
        <QCardActions align="right">
          <QBtn flat label="Cancelar" aria-label="Cancelar" @click="dialogOpen = false" />
          <QBtn color="accent" label="Salvar" unelevated aria-label="Salvar usuário" @click="saveUser" />
        </QCardActions>
      </QCard>
    </QDialog>
  </div>
</template>

<script setup lang="ts">
import type { MockUser } from '~/composables/useMockData'

const { mockUsers } = useMockData()
const { success } = useNotify()

const loading = ref(true)
const searchFilter = ref('')
const dialogOpen = ref(false)
const editingUser = ref<MockUser | null>(null)

const form = ref({
  nome: '',
  email: '',
  role: 'Operador' as 'Admin' | 'Gestor' | 'Operador',
  ativo: true,
})

const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Gestor', value: 'Gestor' },
  { label: 'Operador', value: 'Operador' },
]

const columns = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
  { name: 'role', label: 'Role', field: 'role', align: 'left' as const },
  { name: 'ativo', label: 'Ativo', field: 'ativo', align: 'center' as const },
  { name: 'ultimoAcesso', label: 'Último Acesso', field: 'ultimoAcesso', align: 'left' as const },
  { name: 'acoes', label: 'Ações', align: 'center' as const },
]

const users = ref([...mockUsers])

const filteredUsers = computed(() => {
  if (!searchFilter.value) return users.value
  const q = searchFilter.value.toLowerCase()
  return users.value.filter((u) => u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
})

function getRoleColor(role: string) {
  if (role === 'Admin') return 'primary'
  if (role === 'Gestor') return 'info'
  return 'positive'
}

function openDialog(user?: MockUser) {
  editingUser.value = user ?? null
  form.value = {
    nome: user?.nome ?? '',
    email: user?.email ?? '',
    role: (user?.role ?? 'Operador') as 'Admin' | 'Gestor' | 'Operador',
    ativo: user?.ativo ?? true,
  }
  dialogOpen.value = true
}

function saveUser() {
  if (!form.value.nome || !form.value.email || !form.value.role) return
  if (editingUser.value) {
    const idx = users.value.findIndex((u) => u.id === editingUser.value!.id)
    if (idx >= 0) {
      users.value[idx] = {
        ...users.value[idx],
        nome: form.value.nome,
        email: form.value.email,
        role: form.value.role,
        ativo: form.value.ativo,
      }
    }
    success('Usuário atualizado com sucesso!')
  } else {
    users.value.push({
      id: String(users.value.length + 1),
      nome: form.value.nome,
      email: form.value.email,
      role: form.value.role,
      ativo: form.value.ativo,
      ultimoAcesso: '-',
    })
    success('Usuário criado com sucesso!')
  }
  dialogOpen.value = false
}

function toggleAtivo(user: MockUser) {
  const u = users.value.find((x) => x.id === user.id)
  if (u) u.ativo = !u.ativo
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>
