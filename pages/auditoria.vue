<template>
  <div class="page-container">
    <QBreadcrumbs class="q-mb-md">
      <QBreadcrumbsEl label="Auditoria" />
    </QBreadcrumbs>
    <h1 class="page-title q-mb-lg">Auditoria e Logs</h1>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3"><QInput v-model="filterSearch" label="Buscar" outlined dense clearable><template #prepend><QIcon name="mdi-magnify" /></template></QInput></div>
      <div class="col-12 col-sm-6 col-md-2"><QSelect v-model="filterEntity" :options="entityOptions" label="Entidade" outlined dense emit-value map-options clearable /></div>
      <div class="col-12 col-sm-6 col-md-2"><QSelect v-model="filterAction" :options="actionOptions" label="Acao" outlined dense emit-value map-options clearable /></div>
      <div class="col-12 col-sm-6 col-md-2"><QInput v-model="filterDateFrom" label="De" outlined dense type="date" /></div>
      <div class="col-12 col-sm-6 col-md-2"><QInput v-model="filterDateTo" label="Ate" outlined dense type="date" /></div>
    </div>
    <QCard flat bordered>
      <div v-if="loading" class="q-pa-lg">
        <QSkeleton v-for="i in 8" :key="i" type="text" height="48px" class="q-mb-sm" />
      </div>
      <div v-else-if="filteredLogs.length === 0" class="q-pa-xl text-center empty-state">
        <QIcon name="mdi-shield-search" size="64px" color="grey-5" class="q-mb-md" />
        <p class="text-h6 text-grey-7 q-mb-sm">Nenhum registro encontrado</p>
        <p class="text-body2 text-grey-6">Ajuste os filtros para ver os logs de auditoria.</p>
      </div>
      <QTable v-else :rows="filteredLogs" :columns="auditCols" row-key="id" flat :loading="loading" class="erictech-table">
        <template #body-cell-detalhes="props">
          <QTd :props="props">
            <QBtn flat dense size="sm" icon="mdi-chevron-down" aria-label="Expandir detalhes" @click="expandRow(props.row.id)" />
            <span>{{ props.row.detalhes }}</span>
          </QTd>
        </template>
      </QTable>
    </QCard>
  </div>
</template>
<script setup lang="ts">
const { mockAuditLogs } = useMockData()
const filterSearch = ref('')
const filterEntity = ref(null)
const filterAction = ref(null)
const filterDateFrom = ref('')
const filterDateTo = ref('')
const loading = ref(true)
onMounted(() => {
  setTimeout(() => { loading.value = false }, 800)
})
const entityOptions = [{ label: 'OS', value: 'OS' }, { label: 'Orcamento', value: 'Orcamento' }, { label: 'Sistema', value: 'Sistema' }]
const actionOptions = [{ label: 'Criar', value: 'Criar' }, { label: 'Atualizar', value: 'Atualizar' }, { label: 'Login', value: 'Login' }, { label: 'Concluir', value: 'Concluir' }]
const auditCols = [
  { name: 'timestamp', label: 'Data/Hora', field: 'timestamp' },
  { name: 'usuario', label: 'Usuario', field: 'usuario' },
  { name: 'acao', label: 'Acao', field: 'acao' },
  { name: 'entidade', label: 'Entidade', field: 'entidade' },
  { name: 'entidadeId', label: 'ID', field: 'entidadeId' },
  { name: 'detalhes', label: 'Detalhes', field: 'detalhes' },
]
const filteredLogs = computed(() => {
  let list = [...mockAuditLogs]
  if (filterSearch.value) list = list.filter(l => l.usuario.toLowerCase().includes(filterSearch.value.toLowerCase()) || l.detalhes.toLowerCase().includes(filterSearch.value.toLowerCase()) || l.entidadeId.toLowerCase().includes(filterSearch.value.toLowerCase()))
  if (filterEntity.value) list = list.filter(l => l.entidade === filterEntity.value)
  if (filterAction.value) list = list.filter(l => l.acao === filterAction.value)
  if (filterDateFrom.value) list = list.filter(l => l.timestamp.slice(0, 10) >= filterDateFrom.value)
  if (filterDateTo.value) list = list.filter(l => l.timestamp.slice(0, 10) <= filterDateTo.value)
  return list
})
function expandRow(id: string) { /* TODO: expand row details */ }
</script>
