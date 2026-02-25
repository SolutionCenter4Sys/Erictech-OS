<template>
  <div class="page-container">
    <QBreadcrumbs class="q-mb-md">
      <QBreadcrumbsEl label="Dashboard" />
    </QBreadcrumbs>
    <div class="row q-mb-lg items-center justify-between">
      <h1 class="page-title q-ma-none">Dashboard</h1>
      <QSelect v-model="dateRange" :options="dateOptions" dense outlined emit-value map-options style="min-width: 180px" aria-label="Período de dados" />
    </div>
    <div v-if="loading" class="row q-col-gutter-md q-mb-lg">
      <div v-for="i in 4" :key="i" class="col-12 col-sm-6 col-md-3">
        <QCard flat bordered>
          <QCardSection class="row items-center">
            <QSkeleton type="QAvatar" size="40px" class="q-mr-md" />
            <div class="col">
              <QSkeleton type="text" width="60%" class="q-mb-xs" />
              <QSkeleton type="text" width="80%" />
            </div>
          </QCardSection>
        </QCard>
      </div>
    </div>
    <div v-else class="row q-col-gutter-md q-mb-lg">
      <div v-for="kpi in kpis" :key="kpi.label" class="col-12 col-sm-6 col-md-3">
        <QCard class="erictech-kpi-card" flat bordered>
          <QCardSection class="row items-center">
            <QIcon :name="kpi.icon" :color="kpi.color" size="40px" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold">{{ kpi.value }}</div>
              <div class="text-caption text-grey-7">{{ kpi.label }}</div>
              <div v-if="kpi.trend" class="text-caption" :class="kpi.trend > 0 ? 'text-positive' : 'text-negative'">
                {{ kpi.trend > 0 ? '↑' : '↓' }} {{ Math.abs(kpi.trend) }}% vs periodo anterior
              </div>
            </div>
          </QCardSection>
        </QCard>
      </div>
    </div>
    <div v-if="loading" class="row q-col-gutter-md">
      <div class="col-12 col-md-7">
        <QCard flat bordered>
          <QCardSection>
            <QSkeleton type="text" width="40%" class="q-mb-md" />
            <QSkeleton v-for="i in 5" :key="i" type="text" height="24px" class="q-mb-sm" />
          </QCardSection>
        </QCard>
      </div>
      <div class="col-12 col-md-5">
        <QCard flat bordered>
          <QCardSection>
            <QSkeleton type="text" width="40%" class="q-mb-md" />
            <QSkeleton v-for="i in 6" :key="i" type="text" height="40px" class="q-mb-sm" />
          </QCardSection>
        </QCard>
      </div>
    </div>
    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-md-7">
        <QCard flat bordered>
          <QCardSection>
            <div class="text-h6 text-weight-bold q-mb-md">OS por Status</div>
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div v-for="bar in statusBars" :key="bar.label" class="chart-bar-row">
                  <span class="chart-label">{{ bar.label }}</span>
                  <div class="chart-bar-bg">
                    <div class="chart-bar-fill" :style="{ width: bar.percent + '%', backgroundColor: bar.color }" />
                  </div>
                  <span class="chart-value">{{ bar.count }}</span>
                </div>
              </div>
            </div>
          </QCardSection>
        </QCard>
      </div>
      <div class="col-12 col-md-5">
        <QCard flat bordered>
          <QCardSection>
            <div class="text-h6 text-weight-bold q-mb-md">OS Recentes</div>
            <QTable :rows="recentOrders" :columns="recentColumns" row-key="id" flat hide-pagination class="erictech-table">
              <template #body-cell-status="props">
                <QTd :props="props">
                  <QChip :color="getStatusColor(props.row.status)" text-color="white" dense size="sm">{{ props.row.status }}</QChip>
                </QTd>
              </template>
            </QTable>
          </QCardSection>
        </QCard>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { mockOrders } = useMockData()
const dateRange = ref('7d')
const dateOptions = [
  { label: 'Ultimos 7 dias', value: '7d' },
  { label: 'Ultimos 30 dias', value: '30d' },
  { label: 'Este mes', value: 'month' },
  { label: 'Este ano', value: 'year' },
]
const kpis = [
  { label: 'OS Abertas', value: '12', icon: 'mdi-clipboard-clock', color: 'info', trend: 5 },
  { label: 'OS Concluidas Hoje', value: '8', icon: 'mdi-clipboard-check', color: 'positive', trend: 12 },
  { label: 'Tempo Medio', value: '2.4h', icon: 'mdi-timer', color: 'warning', trend: -8 },
  { label: 'SLA Cumprido', value: '94%', icon: 'mdi-percent', color: 'primary', trend: 2 },
]
const statusBars = computed(() => {
  const counts: Record<string, number> = {}
  mockOrders.forEach(o => { counts[o.status] = (counts[o.status] ?? 0) + 1 })
  const total = mockOrders.length
  const colors: Record<string, string> = { Draft: '#9CA3AF', Planned: '#3B82F6', Scheduled: '#F59E0B', InProgress: '#4CAF50', Completed: '#0D2137', Cancelled: '#EF4444' }
  return Object.entries(counts).map(([label, count]) => ({ label, count, percent: total ? (count / total) * 100 : 0, color: colors[label] ?? '#9CA3AF' }))
})
const recentOrders = computed(() => mockOrders.slice(0, 5))
const recentColumns = [
  { name: 'numero', label: 'Nº', field: 'numero', align: 'left' as const },
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
  { name: 'tecnico', label: 'Tecnico', field: 'tecnico', align: 'left' as const },
  { name: 'data', label: 'Data', field: 'data', align: 'left' as const },
]
function getStatusColor(status: string) {
  const map: Record<string, string> = { Draft: '#9CA3AF', Planned: '#3B82F6', Scheduled: '#F59E0B', InProgress: '#4CAF50', Completed: '#0D2137', Cancelled: '#EF4444' }
  return map[status] ?? '#9CA3AF'
}

const loading = ref(true)
onMounted(() => {
  setTimeout(() => { loading.value = false }, 800)
})
</script>
<style scoped lang="scss">
.chart-placeholder { min-height: 200px; }
.chart-bars { display: flex; flex-direction: column; gap: 12px; }
.chart-bar-row { display: flex; align-items: center; gap: 12px; }
.chart-label { min-width: 80px; font-size: 0.875rem; }
.chart-bar-bg { flex: 1; height: 20px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
.chart-bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
.chart-value { min-width: 24px; font-weight: 600; font-size: 0.875rem; }
</style>
