export interface MockOrder {
  id: string
  numero: string
  cliente: string
  tipo: string
  status: 'Draft' | 'Planned' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled'
  prioridade: 'Alta' | 'Media' | 'Baixa'
  tecnico: string
  data: string
  endereco?: string
  descricao?: string
  dataAgendamento?: string
  pecas?: { nome: string; codigo: string; quantidade: number }[]
}

export interface MockTechnician {
  id: string
  nome: string
  regiao: string
  osAtivas: number
  estoqueStatus: 'ok' | 'baixo' | 'critico'
}

export interface MockEstimate {
  id: string
  numero: string
  cliente: string
  status: string
  valorTotal: string
  validade: string
}

export interface MockAuditLog {
  id: string
  timestamp: string
  usuario: string
  acao: string
  entidade: string
  entidadeId: string
  detalhes: string
}

export interface MockUser {
  id: string
  nome: string
  email: string
  role: 'Admin' | 'Gestor' | 'Operador'
  ativo: boolean
  ultimoAcesso: string
}

export interface MockStockPart {
  id: string
  codigo: string
  peca: string
  quantidade: number
  minimo: number
  status: 'ok' | 'baixo' | 'critico'
  ultimaMovimentacao: string
}

export function useMockData() {
  const mockOrders: MockOrder[] = [
    { id: '1', numero: 'OS-001', cliente: 'Industria ABC Ltda', tipo: 'Manutencao Preventiva', status: 'InProgress', prioridade: 'Alta', tecnico: 'Carlos Silva', data: '2024-02-18' },
    { id: '2', numero: 'OS-002', cliente: 'Metalurgica XYZ', tipo: 'Corretiva', status: 'Scheduled', prioridade: 'Media', tecnico: 'Ana Costa', data: '2024-02-17' },
    { id: '3', numero: 'OS-003', cliente: 'Fabrica Norte', tipo: 'Instalacao', status: 'Planned', prioridade: 'Baixa', tecnico: '-', data: '2024-02-16' },
    { id: '4', numero: 'OS-004', cliente: 'Tech Solutions', tipo: 'Manutencao Preventiva', status: 'Completed', prioridade: 'Alta', tecnico: 'Pedro Santos', data: '2024-02-15' },
    { id: '5', numero: 'OS-005', cliente: 'Industria Sul', tipo: 'Corretiva', status: 'Draft', prioridade: 'Media', tecnico: '-', data: '2024-02-14' },
    { id: '6', numero: 'OS-006', cliente: 'Automotiva Plus', tipo: 'Calibracao', status: 'Cancelled', prioridade: 'Baixa', tecnico: '-', data: '2024-02-13' },
    { id: '7', numero: 'OS-007', cliente: 'Quimica Verde', tipo: 'Manutencao Preventiva', status: 'InProgress', prioridade: 'Alta', tecnico: 'Maria Oliveira', data: '2024-02-18' },
    { id: '8', numero: 'OS-008', cliente: 'Alimentos Premium', tipo: 'Corretiva', status: 'Scheduled', prioridade: 'Media', tecnico: 'Joao Ferreira', data: '2024-02-17' },
  ]
  const mockTechnicians: MockTechnician[] = [
    { id: '1', nome: 'Carlos Silva', regiao: 'Sul', osAtivas: 3, estoqueStatus: 'ok' },
    { id: '2', nome: 'Ana Costa', regiao: 'Norte', osAtivas: 2, estoqueStatus: 'baixo' },
    { id: '3', nome: 'Pedro Santos', regiao: 'Centro', osAtivas: 4, estoqueStatus: 'ok' },
    { id: '4', nome: 'Maria Oliveira', regiao: 'Sul', osAtivas: 1, estoqueStatus: 'critico' },
    { id: '5', nome: 'Joao Ferreira', regiao: 'Leste', osAtivas: 2, estoqueStatus: 'ok' },
  ]
  const mockEstimates: MockEstimate[] = [
    { id: '1', numero: 'ORC-001', cliente: 'Industria ABC Ltda', status: 'Aprovado', valorTotal: 'R$ 15.000', validade: '2024-03-15' },
    { id: '2', numero: 'ORC-002', cliente: 'Metalurgica XYZ', status: 'Pendente', valorTotal: 'R$ 8.500', validade: '2024-03-01' },
    { id: '3', numero: 'ORC-003', cliente: 'Fabrica Norte', status: 'Rejeitado', valorTotal: 'R$ 22.000', validade: '2024-02-28' },
    { id: '4', numero: 'ORC-004', cliente: 'Tech Solutions', status: 'Em analise', valorTotal: 'R$ 12.300', validade: '2024-03-10' },
  ]
  const mockAuditLogs: MockAuditLog[] = [
    { id: '1', timestamp: '2024-02-18 14:32:00', usuario: 'admin@erictech.com', acao: 'Criar', entidade: 'OS', entidadeId: 'OS-008', detalhes: 'Ordem de servico criada' },
    { id: '2', timestamp: '2024-02-18 13:15:00', usuario: 'carlos@erictech.com', acao: 'Atualizar', entidade: 'OS', entidadeId: 'OS-001', detalhes: 'Status alterado para Em Andamento' },
    { id: '3', timestamp: '2024-02-18 11:00:00', usuario: 'admin@erictech.com', acao: 'Atribuir', entidade: 'OS', entidadeId: 'OS-007', detalhes: 'OS atribuida a Maria Oliveira' },
    { id: '4', timestamp: '2024-02-18 09:45:00', usuario: 'ana@erictech.com', acao: 'Login', entidade: 'Sistema', entidadeId: '-', detalhes: 'Login realizado com sucesso' },
    { id: '5', timestamp: '2024-02-17 17:30:00', usuario: 'admin@erictech.com', acao: 'Criar', entidade: 'Orcamento', entidadeId: 'ORC-004', detalhes: 'Orcamento criado' },
    { id: '6', timestamp: '2024-02-17 16:00:00', usuario: 'pedro@erictech.com', acao: 'Concluir', entidade: 'OS', entidadeId: 'OS-004', detalhes: 'OS concluida e fechada' },
  ]
  const mockUsers: MockUser[] = [
    { id: '1', nome: 'Admin Sistema', email: 'admin@erictech.com', role: 'Admin', ativo: true, ultimoAcesso: '2024-02-18 14:30' },
    { id: '2', nome: 'Carlos Silva', email: 'carlos@erictech.com', role: 'Gestor', ativo: true, ultimoAcesso: '2024-02-18 13:15' },
    { id: '3', nome: 'Ana Costa', email: 'ana@erictech.com', role: 'Operador', ativo: true, ultimoAcesso: '2024-02-18 09:45' },
    { id: '4', nome: 'Pedro Santos', email: 'pedro@erictech.com', role: 'Operador', ativo: false, ultimoAcesso: '2024-02-15 17:00' },
    { id: '5', nome: 'Maria Oliveira', email: 'maria@erictech.com', role: 'Gestor', ativo: true, ultimoAcesso: '2024-02-18 11:20' },
  ]
  const mockStockParts: MockStockPart[] = [
    { id: '1', codigo: 'FIL-001', peca: 'Filtro de óleo', quantidade: 12, minimo: 5, status: 'ok', ultimaMovimentacao: '2024-02-18 10:00' },
    { id: '2', codigo: 'COR-002', peca: 'Correia dentada', quantidade: 3, minimo: 5, status: 'baixo', ultimaMovimentacao: '2024-02-17 14:30' },
    { id: '3', codigo: 'SEN-003', peca: 'Sensor de temperatura', quantidade: 8, minimo: 3, status: 'ok', ultimaMovimentacao: '2024-02-18 08:15' },
    { id: '4', codigo: 'VAL-004', peca: 'Válvula reguladora', quantidade: 0, minimo: 2, status: 'critico', ultimaMovimentacao: '2024-02-16 16:00' },
    { id: '5', codigo: 'BOM-005', peca: 'Bomba hidráulica', quantidade: 2, minimo: 2, status: 'ok', ultimaMovimentacao: '2024-02-18 09:00' },
    { id: '6', codigo: 'MOT-006', peca: 'Motor elétrico', quantidade: 1, minimo: 2, status: 'baixo', ultimaMovimentacao: '2024-02-15 11:20' },
    { id: '7', codigo: 'ROL-007', peca: 'Rolamento', quantidade: 15, minimo: 4, status: 'ok', ultimaMovimentacao: '2024-02-18 07:45' },
    { id: '8', codigo: 'JUN-008', peca: 'Junta de vedação', quantidade: 0, minimo: 3, status: 'critico', ultimaMovimentacao: '2024-02-14 13:00' },
  ]
  return { mockOrders, mockTechnicians, mockEstimates, mockAuditLogs, mockUsers, mockStockParts }
}
