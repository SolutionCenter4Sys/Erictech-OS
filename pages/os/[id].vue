<template>
  <div class="page-container">
    <QBreadcrumbs class="q-mb-md">
      <QBreadcrumbsEl label="OS" to="/os" />
      <QBreadcrumbsEl label="Detalhes" />
      <QBreadcrumbsEl :label="`#${order?.numero}`" />
    </QBreadcrumbs>
    <div class="row q-mb-md items-center justify-between">
      <div class="row items-center q-gutter-md">
        <h2 class="text-h5 q-ma-none">{{ order?.numero }}</h2>
        <QChip :style="{ backgroundColor: statusColor, color: 'white' }" dense>{{ order?.status }}</QChip>
        <QBtn v-if="order?.status === 'Draft'" color="primary" label="Planejar" size="sm" aria-label="Planejar OS" @click="confirmAction('Planejar', 'planejar esta OS')" />
        <QBtn v-if="order?.status === 'Planned'" color="warning" label="Agendar" size="sm" aria-label="Agendar OS" @click="confirmAction('Agendar', 'agendar esta OS')" />
        <QBtn v-if="order?.status === 'Scheduled'" color="accent" label="Iniciar" size="sm" aria-label="Iniciar OS" @click="confirmAction('Iniciar', 'iniciar esta OS')" />
        <QBtn v-if="order?.status === 'InProgress'" color="primary" label="Concluir" size="sm" aria-label="Concluir OS" @click="confirmAction('Concluir', 'concluir esta OS')" />
      </div>
    </div>
    <QCard flat bordered>
      <div v-if="loading" class="q-pa-lg">
        <QSkeleton type="text" width="60%" height="40px" class="q-mb-lg" />
        <QSkeleton v-for="i in 6" :key="i" type="text" height="48px" class="q-mb-sm" />
      </div>
      <template v-else>
      <QTabs v-model="tab" dense align="left">
        <QTab name="dados" label="Dados" />
        <QTab name="timeline" label="Timeline" />
        <QTab name="pecas" label="Pecas" />
        <QTab name="comentarios" label="Comentarios" />
      </QTabs>
      <QSeparator />
      <QTabPanels v-model="tab" animated>
        <QTabPanel name="dados" class="q-pa-lg">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6"><QInput :model-value="order?.cliente" label="Cliente" outlined readonly dense /></div>
            <div class="col-12 col-md-6"><QInput :model-value="order?.endereco || 'Rua Exemplo, 123'" label="Endereco" outlined readonly dense /></div>
            <div class="col-12 col-md-6"><QInput :model-value="order?.tipo" label="Tipo" outlined readonly dense /></div>
            <div class="col-12 col-md-6"><QInput :model-value="order?.prioridade" label="Prioridade" outlined readonly dense /></div>
            <div class="col-12"><QInput :model-value="order?.descricao || 'Descricao do servico'" label="Descricao" outlined readonly dense type="textarea" /></div>
            <div class="col-12 col-md-6"><QInput :model-value="order?.tecnico" label="Tecnico" outlined readonly dense /></div>
            <div class="col-12 col-md-6"><QInput :model-value="order?.dataAgendamento || order?.data" label="Data Agendamento" outlined readonly dense /></div>
          </div>
        </QTabPanel>
        <QTabPanel name="timeline" class="q-pa-lg">
          <QTimeline layout="dense" color="primary">
            <QTimelineEntry title="OS Criada" subtitle="2024-02-16 10:00" icon="mdi-clipboard-plus" />
            <QTimelineEntry title="Planejada" subtitle="2024-02-17 09:00" icon="mdi-calendar-check" />
            <QTimelineEntry title="Agendada" subtitle="2024-02-18 08:00" icon="mdi-clock-outline" />
          </QTimeline>
        </QTabPanel>
        <QTabPanel name="pecas" class="q-pa-lg">
          <QTable :rows="pecas" :columns="pecaColumns" row-key="codigo" flat class="erictech-table" />
        </QTabPanel>
        <QTabPanel name="comentarios" class="q-pa-lg">
          <div class="empty-state text-center q-py-xl">
            <QIcon name="mdi-comment-outline" size="48px" color="grey-5" class="q-mb-md" />
            <p class="text-body1 text-grey-7">Nenhum comentário ainda.</p>
            <p class="text-caption text-grey-6 q-mt-sm">Adicione comentários para acompanhar o andamento desta OS.</p>
          </div>
        </QTabPanel>
      </QTabPanels>
      </template>
    </QCard>
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const { mockOrders } = useMockData()
const { success } = useNotify()
const { confirm } = useConfirm()
const tab = ref('dados')
const loading = ref(true)
const order = computed(() => mockOrders.find(o => o.id === route.params.id))
onMounted(() => {
  setTimeout(() => { loading.value = false }, 800)
})
const statusColor = computed(() => {
  const map: Record<string, string> = { Draft: '#9CA3AF', Planned: '#3B82F6', Scheduled: '#F59E0B', InProgress: '#4CAF50', Completed: '#0D2137', Cancelled: '#EF4444' }
  return order.value ? (map[order.value.status] ?? '#9CA3AF') : '#9CA3AF'
})
const pecas = [{ nome: 'Filtro de oleo', codigo: 'FIL-001', quantidade: 2 }, { nome: 'Correia', codigo: 'COR-002', quantidade: 1 }]
const pecaColumns = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' as const },
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' as const },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'left' as const },
]
async function confirmAction(action: string, desc: string) {
  const ok = await confirm({ title: action, message: `Deseja ${desc}?`, okLabel: action, cancelLabel: 'Cancelar', color: 'primary' })
  if (ok) success(`${action} realizado com sucesso!`)
}
</script>

