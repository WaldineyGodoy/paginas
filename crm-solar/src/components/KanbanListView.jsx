import React, { useState } from 'react'
import { LayoutGrid, List, Search, ArrowUpDown, Plus } from 'lucide-react'

export default function KanbanListView({
  title,
  data,
  columns,
  onAddClick,
  onCardClick,
  renderCard,
  renderRow,
  headers
}) {
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' ou 'list'
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  // Filtro
  const filteredData = data.filter(item =>
    Object.values(item).some(
      val => val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Ordenação
  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortBy]
    let valB = b[sortBy]
    
    if (typeof valA === 'string') {
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA)
    }
    
    return sortOrder === 'asc' ? valA - valB : valB - valA
  })

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-slate-400 text-sm mt-1">Gerencie e acompanhe seus processos e oportunidades.</p>
        </div>

        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl active:scale-95"
          style={{ backgroundColor: 'var(--primary-color)', color: '#000' }}
        >
          <Plus size={18} />
          Adicionar Novo
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Buscar registros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Ordenação dropdown */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
            <span className="text-xs text-slate-500">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm text-slate-300 focus:outline-none border-none cursor-pointer"
            >
              <option value="created_at" className="bg-slate-950">Data de Criação</option>
              <option value="name" className="bg-slate-950">Nome</option>
              <option value="status" className="bg-slate-950">Status</option>
            </select>
            <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="text-slate-400 hover:text-white">
              <ArrowUpDown size={14} />
            </button>
          </div>

          {/* Toggle de Visualização */}
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-slate-850 text-yellow-500 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              title="Visualização Kanban"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-850 text-yellow-500 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              title="Visualização Lista"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Renderização */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col) => {
            const colItems = sortedData.filter(item => item.status === col.id)
            return (
              <div key={col.id} className="flex flex-col bg-slate-950/40 border border-slate-900 rounded-2xl p-4 min-h-[500px]">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color || 'var(--primary-color)' }}></span>
                    <h3 className="font-semibold text-white text-sm tracking-wide">{col.name}</h3>
                  </div>
                  <span className="text-xs bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                    {colItems.length}
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                  {colItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onCardClick?.(item)}
                      className="cursor-pointer"
                    >
                      {renderCard(item)}
                    </div>
                  ))}
                  {colItems.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-900 rounded-xl p-8">
                      <p className="text-xs text-slate-650 text-center">Nenhum registro nesta etapa</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80">
                  {headers.map((h, idx) => (
                    <th key={idx} className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedData.map((item) => renderRow(item, onCardClick))}
                {sortedData.length === 0 && (
                  <tr>
                    <td colSpan={headers.length + 1} className="p-8 text-center text-slate-500">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
