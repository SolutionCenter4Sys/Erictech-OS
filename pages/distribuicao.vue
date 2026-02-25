<template>
  <div class="page-container">
    <QBreadcrumbs class="q-mb-md" aria-label="Navegação">
      <QBreadcrumbsEl label="Distribuição" />
    </QBreadcrumbs>
    <h1 class="page-title q-mb-lg">Distribuição de OS</h1>
    <QBanner v-if="stockIncompatible" class="bg-warning text-dark q-mb-md" icon="mdi-alert" aria-label="Aviso de estoque incompatível">
      Estoque do tecnico incompativel com as pecas necessarias para esta OS.
    </QBanner>

    <div v-if="loading" class="row q-col-gutter-md">
      <div class="col-12 col-md-7">
        <QCard flat bordered>
          <QCardSection>
            <QSkeleton type="text" width="40%" class="q-mb-md" />
            <QSkeleton v-for="i in 5" :key="i" type="text" height="48px" class="q-mb-sm" />
          </QCardSection>
        </QCard>
      </div>
      <div class="col-12 col-md-5">
        <QCard flat bordered>
          <QCardSection>
            <QSkeleton type="text" width="40%" class="q-mb-md" />
            <QSkeleton v-for="i in 6" :key="i" type="text" height="56px" class="q-mb-sm" />
          </QCardSection>
        </QCard>
      </div>
    </div>

    <div v-else class="row q-col-gutter-md distribuicao-responsive">
      <div class="col-12 col-md-7">
        <QCard flat bordered class="full-height">
          <QCardSection>
            <div class="text-h6 q-mb-md">OS Não Atribuídas</div>
            <div v-if="unassigned.length === 0" class="q-pa-lg text-center empty-state">
              <QIcon name="mdi-check-all" size="48px" color="positive" class="q-mb-md" aria-hidden="true" />
              <p class="text-body1 text-grey-7">Todas as OS estão atribuídas</p>
            </div>
            <QTable
              v-else
              :rows="unassigned"
              :columns="osCols"
              row-key="id"
              flat
              selection="single"
              v-model:selected="selectedOs"
              class="erictech-table"
              :loading="false"
              aria-label="Ordens de serviço não atribuídas"
            >
              <template #body-cell-prioridade="props">
                <QTd :props="props">
                  <QChip :color="props.row.prioridade==='Alta'?'negative':'warning'" size="sm" dense>{{ props.row.prioridade }}</QChip>
                </QTd>
              </template>
            </QTable>
          </QCardSection>
        </QCard>
      </div>
      <div class="col-12 col-md-5">
        <QCard flat bordered class="full-height">
          <QCardSection>
            <div class="text-h6 q-mb-md">Técnicos Disponíveis</div>
            <QList aria-label="Lista de técnicos disponíveis">
              <QItem
                v-for="t in technicians"
                :key="t.id"
                clickable
                :active="selectedTech?.id===t.id"
                @click="selectedTech=t"
                :aria-label="`Selecionar técnico ${t.nome}`"
              >
                <QItemSection avatar>
                  <QIcon :name="t.estoqueStatus==='ok'?'mdi-check-circle':'mdi-alert-circle'" :color="t.estoqueStatus==='ok'?'positive':(t.estoqueStatus==='baixo'?'warning':'negative')" />
                </QItemSection>
                <QItemSection>
                  <QItemLabel>{{ t.nome }}</QItemLabel>
                  <QItemLabel caption>Regiao: {{ t.regiao }} | OS ativas: {{ t.osAtivas }}</QItemLabel>
                </QItemSection>
              </QItem>
            </QList>
            <div v-if="selectedOs.length && selectedTech" class="q-mt-md">
              <QBtn color="accent" label="Atribuir" icon="mdi-account-plus" class="full-width" :loading="atribuindo" unelevated aria-label="Atribuir OS ao técnico selecionado" @click="confirmAtribuir" />
            </div>
          </QCardSection>
        </QCard>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { mockOrders, mockTechnicians } = useMockData()
const { success } = useNotify()
const { confirm } = useConfirm()
const loading = ref(true)
const selectedOs = ref([])
const selectedTech = ref(null)
const stockIncompatible = ref(false)
const atribuindo = ref(false)
const unassigned = computed(() => mockOrders.filter(o => o.tecnico === '-' || o.status === 'Planned'))
const technicians = mockTechnicians
const osCols = [
  { name: 'numero', label: 'Nº', field: 'numero' },
  { name: 'cliente', label: 'Cliente', field: 'cliente' },
  { name: 'tipo', label: 'Tipo', field: 'tipo' },
  { name: 'prioridade', label: 'Prioridade', field: 'prioridade' },
]
async function confirmAtribuir() {
  const osNum = selectedOs.value[0]?.numero ?? 'OS'
  const techName = selectedTech.value?.nome ?? ''
  const ok = await confirm({ title: 'Atribuir OS', message: `Deseja atribuir ${osNum} ao técnico ${techName}?`, okLabel: 'Atribuir', cancelLabel: 'Cancelar', color: 'accent' })
  if (ok) {
    atribuindo.value = true
    try {
      success(`OS ${osNum} atribuída a ${techName} com sucesso!`)
      selectedOs.value = []
      selectedTech.value = null
    } finally { atribuindo.value = false }
  }
}
onMounted(() => {
  setTimeout(() => { loading.value = false }, 800)
})
</script>
<style scoped>
.full-height { min-height: 300px; }
@media (min-width: 1024px) {
  .full-height { min-height: 400px; }
}
.distribuicao-responsive .col-12 { margin-bottom: 1rem; }
@media (min-width: 1024px) {
  .distribuicao-responsive .col-12 { margin-bottom: 0; }
}
</style>
