<template>
  <div class="page-container">
    <QBreadcrumbs class="q-mb-md">
      <QBreadcrumbsEl label="Ordens de Serviço" />
    </QBreadcrumbs>
    <QToolbar class="q-mb-md">
      <QToolbarTitle class="text-h6 text-weight-bold">Ordens de Serviço</QToolbarTitle>
      <QSpace />
      <QBtn color="accent" icon="mdi-plus" label="Nova OS" :to="'/os/nova'" unelevated />
    </QToolbar>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-4 col-md-2">
        <QSelect v-model="filterStatus" :options="statusOptions" label="Status" outlined dense emit-value map-options clearable />
      </div>
      <div class="col-12 col-sm-4 col-md-3">
        <QInput v-model="filterSearch" label="Buscar" outlined dense clearable>
          <template #prepend><QIcon name="mdi-magnify" /></template>
        </QInput>
      </div>
      <div class="col-12 col-sm-4 col-md-2">
        <QSelect v-model="filterTech" :options="techOptions" label="Tecnico" outlined dense emit-value map-options clearable />
      </div>
      <div class="col-12 col-sm-4 col-md-2">
        <QBtn color="primary" icon="mdi-filter" label="Filtrar" outline />
      </div>
    </div>
    <QCard flat bordered>
      <div v-if="loading" class="q-pa-lg">
        <QSkeleton type="text" width="30%" height="32px" class="q-mb-md" />
        <QSkeleton v-for="i in 8" :key="i" type="text" height="48px" class="q-mb-sm" />
      </div>
      <div v-else-if="filteredOrders.length === 0" class="q-pa-xl text-center empty-state">
        <QIcon name="mdi-clipboard-text-outline" size="64px" color="grey-5" class="q-mb-md" />
        <p class="text-h6 text-grey-7 q-mb-sm">Nenhuma ordem encontrada</p>
        <p class="text-body2 text-grey-6 q-mb-md">Ajuste os filtros ou crie uma nova ordem de serviço.</p>
        <QBtn color="accent" icon="mdi-plus" label="Nova OS" :to="'/os/nova'" unelevated />
      </div>
      <QTable v-else :rows="filteredOrders" :columns="columns" row-key="id" flat :pagination="pagination" :loading="loading" class="erictech-table">
        <template #body-cell-status="props">
            <QTd :props="props">
            <QChip :style="{ backgroundColor: statusColors[props.row.status], color: 'white' }" dense size="sm">{{ props.row.status }}</QChip>
          </QTd>
        </template>
        <template #body-cell-prioridade="props">
          <QTd :props="props">
            <QChip :color="prioridadeColor(props.row.prioridade)" text-color="white" dense size="sm">{{ props.row.prioridade }}</QChip>
          </QTd>
        </template>
        <template #body-cell-acoes="props">
          <QTd :props="props">
            <QBtn flat dense round icon="mdi-eye" size="sm" :to="`/os/${props.row.id}`" aria-label="Ver detalhes">
              <QTooltip>Ver detalhes</QTooltip>
            </QBtn>
            <QBtn flat dense round icon="mdi-pencil" size="sm" aria-label="Editar">
              <QTooltip>Editar</QTooltip>
            </QBtn>
          </QTd>
        </template>
      </QTable>
    </QCard>
  </div>
</template>
<script setup lang="ts">
const { mockOrders } = useMockData()
const filterStatus = ref(null)
const filterSearch = ref('')
const filterTech = ref(null)
const statusOptions = [
  { label: 'Rascunho', value: 'Draft' },
  { label: 'Planejada', value: 'Planned' },
  { label: 'Agendada', value: 'Scheduled' },
  { label: 'Em Andamento', value: 'InProgress' },
  { label: 'Concluida', value: 'Completed' },
  { label: 'Cancelada', value: 'Cancelled' },
]
const techOptions = mockOrders.filter(o => o.tecnico !== '-').map(o => ({ label: o.tecnico, value: o.tecnico }))
const uniqueTechs = [...new Map(techOptions.map(t => [t.value, t])).values()]
const statusColors: Record<string, string> = { Draft: '#9CA3AF', Planned: '#3B82F6', Scheduled: '#F59E0B', InProgress: '#4CAF50', Completed: '#0D2137', Cancelled: '#EF4444' }
const columns = [
  { name: 'numero', label: 'Nº OS', field: 'numero', align: 'left' as const },
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' as const },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
  { name: 'prioridade', label: 'Prioridade', field: 'prioridade', align: 'left' as const },
  { name: 'tecnico', label: 'Tecnico', field: 'tecnico', align: 'left' as const },
  { name: 'data', label: 'Data', field: 'data', align: 'left' as const },
  { name: 'acoes', label: 'Acoes', align: 'center' as const },
]
const loading = ref(true)
const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })
const filteredOrders = computed(() => {
  let list = [...mockOrders]
  if (filterStatus.value) list = list.filter(o => o.status === filterStatus.value)
  if (filterSearch.value) list = list.filter(o => o.cliente.toLowerCase().includes(filterSearch.value.toLowerCase()) || o.numero.toLowerCase().includes(filterSearch.value.toLowerCase()))
  if (filterTech.value) list = list.filter(o => o.tecnico === filterTech.value)
  return list
})
function prioridadeColor(p: string) {
  if (p === 'Alta') return 'negative'
  if (p === 'Media' || p === 'Media') return 'warning'
  return 'positive'
}

onMounted(() => {
  setTimeout(() => { loading.value = false }, 800)
})
</script>
