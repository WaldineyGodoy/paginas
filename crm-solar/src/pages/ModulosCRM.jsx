import React, { useState } from 'react'
import KanbanListView from '../components/KanbanListView'
import { FileText, Award, AlertCircle, Wrench, Shield, CheckCircle } from 'lucide-react'

// 1. MÓDULO DE PROPOSTAS
export function Propostas() {
  const [propostas, setPropostas] = useState([
    { id: 1, name: 'Usina Solar - Condomínio Alpha', valor: 'R$ 280.000', status: 'analise', created_at: Date.now() - 86400000 },
    { id: 2, name: 'Projeto Comercial - Supermercado TodoDia', valor: 'R$ 640.000', status: 'aprovado', created_at: Date.now() }
  ])
  
  const columns = [
    { id: 'elaboracao', name: 'Em Elaboração', color: '#64748b' },
    { id: 'analise', name: 'Sob Análise do Cliente', color: '#eab308' },
    { id: 'revisao', name: 'Necessita Revisão', color: '#ef4444' },
    { id: 'aprovado', name: 'Aprovada / Fechada', color: '#22c55e' }
  ]

  const renderCard = (p) => (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
        <FileText size={14} className="text-yellow-500" />
        {p.name}
      </h4>
      <div className="text-xs text-slate-400">
        <span>Valor: <strong className="text-white">{p.valor}</strong></span>
      </div>
    </div>
  )

  const renderRow = (p, onClick) => (
    <tr key={p.id} className="hover:bg-slate-850/40 transition-colors cursor-pointer" onClick={() => onClick?.(p)}>
      <td className="p-4 font-semibold text-white text-sm">{p.name}</td>
      <td className="p-4 text-slate-300 text-sm">{p.valor}</td>
      <td className="p-4 text-sm">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
          {columns.find(c => c.id === p.status)?.name}
        </span>
      </td>
      <td className="p-4 text-right text-slate-500 text-xs">Ações</td>
    </tr>
  )

  return (
    <KanbanListView
      title="Propostas Comerciais"
      data={propostas}
      columns={columns}
      onAddClick={() => alert('Nova Proposta criada com sucesso (Simulado)')}
      renderCard={renderCard}
      renderRow={renderRow}
      headers={['Projeto', 'Valor Orçado', 'Status']}
    />
  )
}

// 2. MÓDULO DE PROJETOS
export function Projetos() {
  const [projetos, setProjetos] = useState([
    { id: 1, name: 'Instalação Usina - Fazenda Pôr do Sol', status: 'instalacao', progresso: '65%', created_at: Date.now() }
  ])

  const columns = [
    { id: 'planejamento', name: 'Planejamento / Logística', color: '#3b82f6' },
    { id: 'infraestrutura', name: 'Estruturas / Fixação', color: '#a855f7' },
    { id: 'instalacao', name: 'Instalação Elétrica', color: '#eab308' },
    { id: 'concluido', name: 'Instalação Concluída', color: '#22c55e' }
  ]

  const renderCard = (p) => (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
        <Wrench size={14} className="text-yellow-500" />
        {p.name}
      </h4>
      <div className="w-full bg-slate-950 rounded-full h-1.5 mt-1 overflow-hidden">
        <div className="bg-yellow-500 h-1.5" style={{ width: p.progresso }}></div>
      </div>
      <span className="text-xs text-slate-550 self-end">Progresso: {p.progresso}</span>
    </div>
  )

  const renderRow = (p, onClick) => (
    <tr key={p.id} className="hover:bg-slate-850/40 transition-colors cursor-pointer" onClick={() => onClick?.(p)}>
      <td className="p-4 font-semibold text-white text-sm">{p.name}</td>
      <td className="p-4 text-slate-300 text-sm">{p.progresso}</td>
      <td className="p-4 text-sm">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
          {columns.find(c => c.id === p.status)?.name}
        </span>
      </td>
      <td className="p-4 text-right text-slate-500 text-xs">Ações</td>
    </tr>
  )

  return (
    <KanbanListView
      title="Projetos (Engenharia e Logística)"
      data={projetos}
      columns={columns}
      onAddClick={() => alert('Novo Projeto inicializado (Simulado)')}
      renderCard={renderCard}
      renderRow={renderRow}
      headers={['Projeto', 'Progresso', 'Fase Atual']}
    />
  )
}

// 3. MÓDULO DE HOMOLOGAÇÕES
export function Homologacoes() {
  const [homologacoes, setHomologacoes] = useState([
    { id: 1, name: 'Parecer de Acesso Coelba - Usina Camaçari', status: 'analise_concessionaria', created_at: Date.now() }
  ])

  const columns = [
    { id: 'solicitacao', name: 'Documentação Enviada', color: '#64748b' },
    { id: 'analise_concessionaria', name: 'Análise da Concessionária', color: '#eab308' },
    { id: 'vistoria', name: 'Aguardando Vistoria', color: '#a855f7' },
    { id: 'aprovado', name: 'Homologado / Conectado', color: '#22c55e' }
  ]

  const renderCard = (h) => (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
        <Shield size={14} className="text-yellow-500" />
        {h.name}
      </h4>
      <span className="text-[10px] text-slate-500">Trâmite Burossocial</span>
    </div>
  )

  const renderRow = (h, onClick) => (
    <tr key={h.id} className="hover:bg-slate-850/40 transition-colors cursor-pointer" onClick={() => onClick?.(h)}>
      <td className="p-4 font-semibold text-white text-sm">{h.name}</td>
      <td className="p-4 text-sm">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500">
          {columns.find(c => c.id === h.status)?.name}
        </span>
      </td>
      <td className="p-4 text-right text-slate-500 text-xs">Ações</td>
    </tr>
  )

  return (
    <KanbanListView
      title="Homologações de Usinas"
      data={homologacoes}
      columns={columns}
      onAddClick={() => alert('Novo trâmite de homologação criado (Simulado)')}
      renderCard={renderCard}
      renderRow={renderRow}
      headers={['Concessionária / Unidade', 'Status do Parecer']}
    />
  )
}

// 4. MÓDULO DE PÓS-VENDA
export function PosVenda() {
  const [tickets, setTickets] = useState([
    { id: 1, name: 'Análise de Geração Mensal - Usina Lauro', status: 'monitoramento', created_at: Date.now() }
  ])

  const columns = [
    { id: 'onboarding', name: 'Onboarding de Monitoramento', color: '#3b82f6' },
    { id: 'monitoramento', name: 'Monitoramento de Geração', color: '#eab308' },
    { id: 'suporte', name: 'Chamado Técnico Ativo', color: '#ef4444' },
    { id: 'sucesso', name: 'Sucesso do Cliente', color: '#22c55e' }
  ]

  const renderCard = (t) => (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
        <CheckCircle size={14} className="text-yellow-500" />
        {t.name}
      </h4>
      <span className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">Usina Ativa</span>
    </div>
  )

  const renderRow = (t, onClick) => (
    <tr key={t.id} className="hover:bg-slate-850/40 transition-colors cursor-pointer" onClick={() => onClick?.(t)}>
      <td className="p-4 font-semibold text-white text-sm">{t.name}</td>
      <td className="p-4 text-sm">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
          {columns.find(c => c.id === t.status)?.name}
        </span>
      </td>
      <td className="p-4 text-right text-slate-500 text-xs">Ações</td>
    </tr>
  )

  return (
    <KanbanListView
      title="Pós-Venda e Relacionamento"
      data={tickets}
      columns={columns}
      onAddClick={() => alert('Nova ficha de pós-venda gerada (Simulado)')}
      renderCard={renderCard}
      renderRow={renderRow}
      headers={['Cliente / Usina', 'Fase Pós-Ativação']}
    />
  )
}
