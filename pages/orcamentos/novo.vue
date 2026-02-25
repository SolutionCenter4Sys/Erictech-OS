<template>
  <div class="page-container">
    <QBreadcrumbs class="q-mb-md">
      <QBreadcrumbsEl label="Orçamentos" to="/orcamentos" />
      <QBreadcrumbsEl label="Novo Orçamento" />
    </QBreadcrumbs>
    <h1 class="page-title q-mb-lg">Novo Orçamento</h1>

    <QForm @submit="onSubmit" greedy>
      <QCard flat bordered class="q-mb-md">
        <QCardSection>
          <div class="text-subtitle1 text-weight-bold q-mb-md">Dados do Cliente</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <QInput
                v-model="form.cliente"
                label="Nome do Cliente *"
                outlined
                dense
                :rules="[v => !!v || 'Cliente é obrigatório']"
                aria-label="Nome do cliente"
              />
            </div>
            <div class="col-12 col-md-3">
              <QInput
                v-model="form.telefone"
                label="Telefone"
                outlined
                dense
                mask="(##) #####-####"
                aria-label="Telefone do cliente"
              />
            </div>
            <div class="col-12 col-md-3">
              <QInput
                v-model="form.email"
                label="E-mail"
                type="email"
                outlined
                dense
                aria-label="E-mail do cliente"
              />
            </div>
            <div class="col-12">
              <QInput
                v-model="form.endereco"
                label="Endereço"
                outlined
                dense
                aria-label="Endereço do cliente"
              />
            </div>
          </div>
        </QCardSection>
      </QCard>

      <QCard flat bordered class="q-mb-md">
        <QCardSection>
          <div class="text-subtitle1 text-weight-bold q-mb-md">Dados do Orçamento</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <QInput
                v-model="form.validade"
                label="Validade *"
                type="date"
                outlined
                dense
                :rules="[v => !!v || 'Data de validade é obrigatória']"
                aria-label="Data de validade"
              />
            </div>
            <div class="col-12 col-md-4">
              <QSelect
                v-model="form.osVinculada"
                :options="osOptions"
                label="Vincular a OS (opcional)"
                outlined
                dense
                emit-value
                map-options
                clearable
                aria-label="OS vinculada"
              />
            </div>
            <div class="col-12 col-md-4">
              <QInput
                v-model.number="form.descontoPct"
                label="Desconto (%)"
                type="number"
                outlined
                dense
                min="0"
                max="100"
                aria-label="Percentual de desconto"
              />
            </div>
            <div class="col-12">
              <QInput
                v-model="form.condicoes"
                label="Condições Comerciais"
                outlined
                dense
                type="textarea"
                rows="2"
                aria-label="Condições comerciais"
              />
            </div>
            <div class="col-12">
              <QInput
                v-model="form.observacoes"
                label="Observações"
                outlined
                dense
                type="textarea"
                rows="2"
                aria-label="Observações"
              />
            </div>
          </div>
        </QCardSection>
      </QCard>

      <QCard flat bordered class="q-mb-md">
        <QCardSection>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Itens do Orçamento</div>
            <QBtn flat icon="mdi-plus" label="Adicionar Item" color="accent" size="sm" @click="addItem" aria-label="Adicionar item ao orçamento" />
          </div>

          <div v-if="form.itens.length === 0" class="text-center q-pa-lg">
            <QIcon name="mdi-package-variant-closed" size="48px" color="grey-4" class="q-mb-sm" />
            <p class="text-body2 text-grey-6">Nenhum item adicionado. Clique em "Adicionar Item" para começar.</p>
          </div>

          <QTable
            v-else
            :rows="form.itens"
            :columns="itemColumns"
            row-key="tempId"
            flat
            hide-pagination
            :pagination="{ rowsPerPage: 0 }"
            class="erictech-table"
          >
            <template #body-cell-tipo="props">
              <QTd :props="props">
                <QSelect
                  v-model="props.row.tipo"
                  :options="tipoItemOptions"
                  dense
                  borderless
                  emit-value
                  map-options
                  style="min-width: 120px"
                  aria-label="Tipo do item"
                />
              </QTd>
            </template>
            <template #body-cell-descricao="props">
              <QTd :props="props">
                <QInput
                  v-model="props.row.descricao"
                  dense
                  borderless
                  placeholder="Descrição do item"
                  aria-label="Descrição do item"
                />
              </QTd>
            </template>
            <template #body-cell-quantidade="props">
              <QTd :props="props">
                <QInput
                  v-model.number="props.row.quantidade"
                  type="number"
                  dense
                  borderless
                  min="1"
                  style="max-width: 80px"
                  aria-label="Quantidade"
                  @update:model-value="recalcItem(props.row)"
                />
              </QTd>
            </template>
            <template #body-cell-valorUnitario="props">
              <QTd :props="props">
                <QInput
                  v-model.number="props.row.valorUnitario"
                  type="number"
                  dense
                  borderless
                  prefix="R$"
                  min="0"
                  step="0.01"
                  style="max-width: 130px"
                  aria-label="Valor unitário"
                  @update:model-value="recalcItem(props.row)"
                />
              </QTd>
            </template>
            <template #body-cell-subtotal="props">
              <QTd :props="props">
                <span class="text-weight-medium">R$ {{ formatNumber(props.row.subtotal) }}</span>
              </QTd>
            </template>
            <template #body-cell-acoes="props">
              <QTd :props="props">
                <QBtn
                  flat
                  dense
                  round
                  icon="mdi-delete"
                  color="negative"
                  size="sm"
                  aria-label="Remover item"
                  @click="removeItem(props.rowIndex)"
                >
                  <QTooltip>Remover</QTooltip>
                </QBtn>
              </QTd>
            </template>
          </QTable>
        </QCardSection>

        <QSeparator v-if="form.itens.length > 0" />

        <QCardSection v-if="form.itens.length > 0">
          <div class="row justify-end">
            <div style="min-width: 280px">
              <div class="row justify-between q-mb-xs">
                <span class="text-body2 text-grey-7">Subtotal:</span>
                <span class="text-body2">R$ {{ formatNumber(totals.subtotal) }}</span>
              </div>
              <div v-if="form.descontoPct > 0" class="row justify-between q-mb-xs">
                <span class="text-body2 text-grey-7">Desconto ({{ form.descontoPct }}%):</span>
                <span class="text-body2 text-negative">- R$ {{ formatNumber(totals.desconto) }}</span>
              </div>
              <QSeparator class="q-my-sm" />
              <div class="row justify-between">
                <span class="text-subtitle1 text-weight-bold">Total:</span>
                <span class="text-subtitle1 text-weight-bold text-accent">R$ {{ formatNumber(totals.total) }}</span>
              </div>
            </div>
          </div>
        </QCardSection>
      </QCard>

      <div class="row q-gutter-md justify-end q-mt-md">
        <QBtn outline label="Cancelar" @click="onCancel" aria-label="Cancelar" />
        <QBtn
          color="primary"
          outline
          label="Salvar como Rascunho"
          icon="mdi-content-save-outline"
          :loading="savingDraft"
          @click="onSaveDraft"
          aria-label="Salvar como rascunho"
        />
        <QBtn
          color="accent"
          label="Criar e Enviar"
          icon="mdi-send"
          type="submit"
          :loading="submitting"
          unelevated
          aria-label="Criar e enviar orçamento"
        />
      </div>
    </QForm>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { mockOrders } = useMockData()
const { success, error } = useNotify()
const { confirm } = useConfirm()

const submitting = ref(false)
const savingDraft = ref(false)
let itemCounter = 0

const form = reactive({
  cliente: '',
  telefone: '',
  email: '',
  endereco: '',
  validade: '',
  osVinculada: null as string | null,
  descontoPct: 0,
  condicoes: 'Pagamento em até 30 dias após aprovação. Validade conforme data indicada.',
  observacoes: '',
  itens: [] as Array<{
    tempId: number
    tipo: 'Serviço' | 'Peça'
    descricao: string
    quantidade: number
    valorUnitario: number
    subtotal: number
  }>,
})

const osOptions = mockOrders
  .filter(o => o.status !== 'Cancelled' && o.status !== 'Completed')
  .map(o => ({ label: `${o.numero} — ${o.cliente}`, value: o.id }))

const tipoItemOptions = [
  { label: 'Serviço', value: 'Serviço' },
  { label: 'Peça', value: 'Peça' },
]

const itemColumns = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' as const, style: 'width: 140px' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' as const },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'center' as const, style: 'width: 90px' },
  { name: 'valorUnitario', label: 'Valor Unit.', field: 'valorUnitario', align: 'right' as const, style: 'width: 140px' },
  { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'right' as const, style: 'width: 130px' },
  { name: 'acoes', label: '', align: 'center' as const, style: 'width: 60px' },
]

const totals = computed(() => {
  const subtotal = form.itens.reduce((sum, item) => sum + (item.subtotal || 0), 0)
  const desconto = subtotal * (form.descontoPct || 0) / 100
  return {
    subtotal,
    desconto,
    total: subtotal - desconto,
  }
})

function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function addItem() {
  itemCounter++
  form.itens.push({
    tempId: itemCounter,
    tipo: 'Serviço',
    descricao: '',
    quantidade: 1,
    valorUnitario: 0,
    subtotal: 0,
  })
}

function recalcItem(item: typeof form.itens[number]) {
  item.subtotal = (item.quantidade || 0) * (item.valorUnitario || 0)
}

async function removeItem(index: number) {
  const ok = await confirm({
    title: 'Remover item',
    message: 'Deseja remover este item do orçamento?',
    okLabel: 'Remover',
    cancelLabel: 'Cancelar',
  })
  if (ok) form.itens.splice(index, 1)
}

function validate(): boolean {
  if (!form.cliente.trim()) {
    error('Informe o nome do cliente.')
    return false
  }
  if (!form.validade) {
    error('Informe a data de validade.')
    return false
  }
  if (form.itens.length === 0) {
    error('Adicione pelo menos um item ao orçamento.')
    return false
  }
  const emptyItems = form.itens.filter(i => !i.descricao.trim() || i.valorUnitario <= 0)
  if (emptyItems.length > 0) {
    error('Preencha a descrição e valor de todos os itens.')
    return false
  }
  return true
}

async function onSaveDraft() {
  if (!form.cliente.trim()) {
    error('Informe ao menos o nome do cliente para salvar o rascunho.')
    return
  }
  savingDraft.value = true
  try {
    await new Promise(r => setTimeout(r, 500))
    success('Rascunho salvo com sucesso!')
    await router.push('/orcamentos')
  } finally {
    savingDraft.value = false
  }
}

async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    await new Promise(r => setTimeout(r, 800))
    success(`Orçamento criado com sucesso! Total: R$ ${formatNumber(totals.value.total)}`)
    await router.push('/orcamentos')
  } finally {
    submitting.value = false
  }
}

async function onCancel() {
  if (form.cliente || form.itens.length > 0) {
    const ok = await confirm({
      title: 'Descartar orçamento?',
      message: 'Você tem dados preenchidos. Deseja sair sem salvar?',
      okLabel: 'Descartar',
      cancelLabel: 'Continuar editando',
    })
    if (!ok) return
  }
  await router.push('/orcamentos')
}
</script>
