<template>
  <div class="page-container">
    <QBreadcrumbs class="q-mb-md" aria-label="Navegação">
      <QBreadcrumbsEl label="Estoque" />
    </QBreadcrumbs>
    <QToolbar class="q-mb-md">
      <QToolbarTitle class="text-h6 text-weight-bold" aria-label="Título da página">Gestão de Estoque (Maleta)</QToolbarTitle>
      <QSpace />
      <QSelect
        v-model="selectedTech"
        :options="techOptions"
        label="Técnico"
        outlined
        dense
        emit-value
        map-options
        style="min-width: 200px"
        aria-label="Filtrar por técnico"
      />
    </QToolbar>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-6 col-sm-3">
        <QCard flat bordered class="erictech-kpi-card">
          <QCardSection class="row items-center">
            <QIcon name="mdi-package-variant" color="primary" size="32px" class="q-mr-sm" />
            <div>
              <div class="text-h5 text-weight-bold">{{ summary.total }}</div>
              <div class="text-caption text-grey-7">Total Peças</div>
            </div>
          </QCardSection>
        </QCard>
      </div>
      <div class="col-6 col-sm-3">
        <QCard flat bordered class="erictech-kpi-card">
          <QCardSection class="row items-center">
            <QIcon name="mdi-check-circle" color="positive" size="32px" class="q-mr-sm" />
            <div>
              <div class="text-h5 text-weight-bold">{{ summary.ok }}</div>
              <div class="text-caption text-grey-7">Peças OK</div>
            </div>
          </QCardSection>
        </QCard>
      </div>
      <div class="col-6 col-sm-3">
        <QCard flat bordered class="erictech-kpi-card">
          <QCardSection class="row items-center">
            <QIcon name="mdi-alert" color="warning" size="32px" class="q-mr-sm" />
            <div>
              <div class="text-h5 text-weight-bold">{{ summary.baixo }}</div>
              <div class="text-caption text-grey-7">Estoque Baixo</div>
            </div>
          </QCardSection>
        </QCard>
      </div>
      <div class="col-6 col-sm-3">
        <QCard flat bordered class="erictech-kpi-card">
          <QCardSection class="row items-center">
            <QIcon name="mdi-alert-circle" color="negative" size="32px" class="q-mr-sm" />
            <div>
              <div class="text-h5 text-weight-bold">{{ summary.critico }}</div>
              <div class="text-caption text-grey-7">Sem Estoque</div>
            </div>
          </QCardSection>
        </QCard>
      </div>
    </div>

    <QCard flat bordered>
      <div v-if="loading" class="q-pa-lg">
        <QSkeleton v-for="i in 8" :key="i" type="text" height="48px" class="q-mb-sm" />
      </div>
      <div v-else-if="stockParts.length === 0" class="q-pa-xl text-center empty-state">
        <QIcon name="mdi-package-variant-closed" size="64px" color="grey-5" class="q-mb-md" aria-hidden="true" />
        <p class="text-h6 text-grey-7 q-mb-sm">Nenhuma peça no estoque</p>
        <p class="text-body2 text-grey-6 q-mb-md">Selecione um técnico ou registre movimentações para visualizar o estoque.</p>
      </div>
      <QTable
        v-else
        :rows="stockParts"
        :columns="columns"
        row-key="id"
        flat
        class="erictech-table"
        :loading="false"
        aria-label="Tabela de estoque"
      >
        <template #body-cell-status="props">
          <QTd :props="props">
            <QChip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              dense
              size="sm"
              :aria-label="`Status: ${props.row.status === 'ok' ? 'OK' : props.row.status === 'baixo' ? 'Baixo' : 'Crítico'}`"
            >
              {{ props.row.status === 'ok' ? 'OK' : props.row.status === 'baixo' ? 'Baixo' : 'Crítico' }}
            </QChip>
          </QTd>
        </template>
        <template #body-cell-acoes="props">
          <QTd :props="props">
            <QBtn flat dense round icon="mdi-swap-horizontal" size="sm" aria-label="Registrar movimentação" @click="openMovementDialog(props.row)">
              <QTooltip>Movimentar</QTooltip>
            </QBtn>
          </QTd>
        </template>
      </QTable>
    </QCard>

    <QDialog v-model="movementDialogOpen" persistent maximized="md" aria-label="Registrar movimentação de estoque">
      <QCard style="min-width: 400px">
        <QCardSection>
          <div class="text-h6">Movimentação de Estoque</div>
          <div v-if="selectedPart" class="text-caption text-grey-7 q-mt-xs">{{ selectedPart.peca }} ({{ selectedPart.codigo }})</div>
        </QCardSection>
        <QCardSection class="q-pt-none">
          <QForm class="q-gutter-md">
            <QSelect
              v-model="movementForm.tipo"
              :options="movementTypes"
              label="Tipo"
              outlined
              dense
              emit-value
              map-options
              aria-label="Tipo de movimentação"
            />
            <QInput
              v-model.number="movementForm.quantidade"
              label="Quantidade"
              type="number"
              outlined
              dense
              min="1"
              :rules="[(v) => (v && v > 0) || 'Quantidade deve ser maior que zero']"
              aria-label="Quantidade"
            />
            <QInput v-model="movementForm.observacao" label="Observação" outlined dense type="textarea" aria-label="Observação da movimentação" />
          </QForm>
        </QCardSection>
        <QCardActions align="right">
          <QBtn flat label="Cancelar" aria-label="Cancelar" @click="movementDialogOpen = false" />
          <QBtn color="accent" label="Registrar" unelevated aria-label="Registrar movimentação" @click="saveMovement" />
        </QCardActions>
      </QCard>
    </QDialog>
  </div>
</template>

<script setup lang="ts">
import type { MockStockPart } from '~/composables/useMockData'

const { mockTechnicians, mockStockParts } = useMockData()
const { success } = useNotify()

const loading = ref(true)
const selectedTech = ref<string | null>(null)
const movementDialogOpen = ref(false)
const selectedPart = ref<MockStockPart | null>(null)

const stockParts = ref([...mockStockParts])

const techOptions = computed(() => [
  { label: 'Todos os técnicos', value: null },
  ...mockTechnicians.map((t) => ({ label: t.nome, value: t.id })),
])

const movementForm = ref({
  tipo: 'entrada' as 'entrada' | 'saida' | 'transferencia',
  quantidade: 1,
  observacao: '',
})

const movementTypes = [
  { label: 'Entrada', value: 'entrada' },
  { label: 'Saída', value: 'saida' },
  { label: 'Transferência', value: 'transferencia' },
]

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' as const },
  { name: 'peca', label: 'Peça', field: 'peca', align: 'left' as const },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade', align: 'left' as const },
  { name: 'minimo', label: 'Mín.', field: 'minimo', align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
  { name: 'ultimaMovimentacao', label: 'Última Movimentação', field: 'ultimaMovimentacao', align: 'left' as const },
  { name: 'acoes', label: 'Ações', align: 'center' as const },
]

const summary = computed(() => {
  const parts = stockParts.value
  return {
    total: parts.length,
    ok: parts.filter((p) => p.status === 'ok').length,
    baixo: parts.filter((p) => p.status === 'baixo').length,
    critico: parts.filter((p) => p.status === 'critico').length,
  }
})

function getStatusColor(status: string) {
  if (status === 'ok') return 'positive'
  if (status === 'baixo') return 'warning'
  return 'negative'
}

function openMovementDialog(part: MockStockPart) {
  selectedPart.value = part
  movementForm.value = { tipo: 'entrada', quantidade: 1, observacao: '' }
  movementDialogOpen.value = true
}

function saveMovement() {
  if (!selectedPart.value || !movementForm.value.quantidade || movementForm.value.quantidade < 1) return
  const part = stockParts.value.find((p) => p.id === selectedPart.value!.id)
  if (part) {
    if (movementForm.value.tipo === 'entrada') {
      part.quantidade += movementForm.value.quantidade
    } else if (movementForm.value.tipo === 'saida') {
      part.quantidade = Math.max(0, part.quantidade - movementForm.value.quantidade)
    }
    part.ultimaMovimentacao = new Date().toISOString().slice(0, 16).replace('T', ' ')
    part.status = part.quantidade === 0 ? 'critico' : part.quantidade <= part.minimo ? 'baixo' : 'ok'
  }
  success(`Movimentação de ${movementForm.value.tipo} registrada com sucesso!`)
  movementDialogOpen.value = false
}

onMounted(() => {
  selectedTech.value = mockTechnicians[0]?.id ?? null
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>
