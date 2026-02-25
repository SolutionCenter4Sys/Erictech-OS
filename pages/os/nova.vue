<template>
  <div class="page-container">
    <QBreadcrumbs class="q-mb-md">
      <QBreadcrumbsEl label="OS" to="/os" />
      <QBreadcrumbsEl label="Nova Ordem de Serviço" />
    </QBreadcrumbs>
    <h1 class="page-title q-mb-lg">Nova Ordem de Serviço</h1>
    <QCard flat bordered>
      <QCardSection>
        <QForm @submit="onSubmit" class="q-gutter-lg">
          <div class="text-h6 q-mb-md">Dados do Cliente</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6"><QInput v-model="form.nome" label="Nome *" outlined dense :rules="[v=>!!v||'Obrigatório']" /></div>
            <div class="col-12 col-md-6"><QInput v-model="form.telefone" label="Telefone" outlined dense /></div>
            <div class="col-12"><QInput v-model="form.endereco" label="Endereco" outlined dense /></div>
          </div>
          <QSeparator class="q-my-lg" />
          <div class="text-h6 q-mb-md">Dados da OS</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6"><QSelect v-model="form.tipo" :options="tipoOptions" label="Tipo *" outlined dense emit-value map-options :rules="[v=>!!v||'Obrigatório']" /></div>
            <div class="col-12 col-md-6"><QSelect v-model="form.prioridade" :options="prioridadeOptions" label="Prioridade *" outlined dense emit-value map-options :rules="[v=>!!v||'Obrigatório']" /></div>
            <div class="col-12"><QInput v-model="form.descricao" label="Descrição *" outlined dense type="textarea" :rules="[v=>!!v||'Obrigatório']" /></div>
            <div class="col-12 col-md-6"><QInput v-model="form.dataAgendamento" label="Data Agendamento" outlined dense type="date" /></div>
          </div>
          <QSeparator class="q-my-lg" />
          <div class="text-h6 q-mb-md">Pecas</div>
          <QTable :rows="form.pecas" :columns="pecaCols" row-key="codigo" flat>
            <template #body-cell-acoes="props"><QTd :props="props"><QBtn flat dense icon="mdi-delete" size="sm" aria-label="Remover peça" @click="confirmRemovePeca(props.rowIndex)" /></QTd></template>
          </QTable>
          <QBtn flat icon="mdi-plus" label="Adicionar peca" color="primary" class="q-mt-sm" @click="addPeca" />
          <div class="row q-mt-lg q-gutter-md justify-end">
            <QBtn outline label="Cancelar" @click="$router.push('/os')" />
            <QBtn color="primary" outline label="Salvar como Rascunho" :loading="savingDraft" @click="saveDraft" />
            <QBtn color="accent" label="Criar OS" type="submit" :loading="submitting" unelevated />
          </div>
        </QForm>
      </QCardSection>
    </QCard>
  </div>
</template>
<script setup lang="ts">
const router = useRouter()
const { success } = useNotify()
const { confirm } = useConfirm()
const form = reactive({ nome: '', telefone: '', endereco: '', tipo: '', descricao: '', prioridade: '', dataAgendamento: '', pecas: [{ nome: '', codigo: '', quantidade: 1 }] })
const tipoOptions = [{ label: 'Manutenção Preventiva', value: 'preventiva' }, { label: 'Corretiva', value: 'corretiva' }, { label: 'Instalação', value: 'instalacao' }, { label: 'Calibração', value: 'calibracao' }]
const prioridadeOptions = [{ label: 'Alta', value: 'Alta' }, { label: 'Média', value: 'Media' }, { label: 'Baixa', value: 'Baixa' }]
const pecaCols = [{ name: 'nome', label: 'Nome', field: 'nome' }, { name: 'codigo', label: 'Código', field: 'codigo' }, { name: 'quantidade', label: 'Qtd', field: 'quantidade' }, { name: 'acoes', label: '' }]
const submitting = ref(false)
const savingDraft = ref(false)
function addPeca() { form.pecas.push({ nome: '', codigo: '', quantidade: 1 }) }
async function confirmRemovePeca(i: number) {
  const ok = await confirm({ title: 'Remover peça', message: 'Deseja remover esta peça da lista?', okLabel: 'Remover', cancelLabel: 'Cancelar' })
  if (ok) form.pecas.splice(i, 1)
}
async function saveDraft() {
  savingDraft.value = true
  try {
    success('Rascunho salvo com sucesso!')
    await router.push('/os')
  } finally { savingDraft.value = false }
}
async function onSubmit() {
  submitting.value = true
  try {
    success('Ordem de serviço criada com sucesso!')
    await router.push('/os')
  } finally { submitting.value = false }
}
</script>
