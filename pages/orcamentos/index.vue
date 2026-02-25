<template>
  <div class="page-container">
    <QBreadcrumbs class="q-mb-md">
      <QBreadcrumbsEl label="Orçamentos" />
    </QBreadcrumbs>
    <QToolbar class="q-mb-md">
      <QToolbarTitle class="text-h6 text-weight-bold">Orçamentos</QToolbarTitle>
      <QSpace />
      <QBtn color="accent" icon="mdi-plus" label="Novo Orçamento" unelevated aria-label="Criar novo orçamento" to="/orcamentos/novo" />
    </QToolbar>
    <QBtnToggle v-model="viewMode" :options="[{label:'Lista', value:'list'},{label:'Pipeline', value:'pipeline'}]" spread no-caps class="q-mb-md" />
    <QCard v-if="viewMode==='list'" flat bordered>
      <div v-if="loading" class="q-pa-lg">
        <QSkeleton v-for="i in 6" :key="i" type="text" height="48px" class="q-mb-sm" />
      </div>
      <div v-else-if="mockEstimates.length === 0" class="q-pa-xl text-center empty-state">
        <QIcon name="mdi-file-document-outline" size="64px" color="grey-5" class="q-mb-md" />
        <p class="text-h6 text-grey-7 q-mb-sm">Nenhum orçamento encontrado</p>
        <p class="text-body2 text-grey-6">Clique em "Novo Orçamento" para criar o primeiro.</p>
      </div>
      <QTable v-else :rows="mockEstimates" :columns="orcCols" row-key="id" flat :loading="loading" class="erictech-table">
        <template #body-cell-status="props">
          <QTd :props="props"><QChip :color="statusColor(props.row.status)" dense size="sm">{{ props.row.status }}</QChip></QTd>
        </template>
        <template #body-cell-acoes="props">
          <QTd :props="props">
            <QBtn flat dense icon="mdi-eye" size="sm" aria-label="Visualizar">
              <QTooltip>Visualizar</QTooltip>
            </QBtn>
            <QBtn flat dense icon="mdi-pencil" size="sm" aria-label="Editar">
              <QTooltip>Editar</QTooltip>
            </QBtn>
          </QTd>
        </template>
      </QTable>
    </QCard>
    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-md-4" v-for="col in pipelineCols" :key="col.status">
        <QCard flat bordered>
          <QCardSection class="bg-grey-3">{{ col.label }}</QCardSection>
          <QCardSection><p class="text-grey-7">Kanban placeholder - {{ col.status }}</p></QCardSection>
        </QCard>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { mockEstimates } = useMockData()
const viewMode = ref('list')
const loading = ref(true)
onMounted(() => {
  setTimeout(() => { loading.value = false }, 800)
})
const orcCols = [
  { name: 'numero', label: 'Nº', field: 'numero' },
  { name: 'cliente', label: 'Cliente', field: 'cliente' },
  { name: 'status', label: 'Status', field: 'status' },
  { name: 'valorTotal', label: 'Valor Total', field: 'valorTotal' },
  { name: 'validade', label: 'Validade', field: 'validade' },
  { name: 'acoes', label: 'Acoes', align: 'center' },
]
const pipelineCols = [{ status: 'pendente', label: 'Pendente' }, { status: 'analise', label: 'Em Analise' }, { status: 'aprovado', label: 'Aprovado' }]
function statusColor(s: string) {
  if (s==='Aprovado') return 'positive'
  if (s==='Rejeitado') return 'negative'
  if (s==='Pendente') return 'warning'
  return 'grey'
}
</script>
