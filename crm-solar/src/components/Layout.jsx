import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  Sun,
  Moon,
  TrendingUp,
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  ShieldCheck,
  CheckCircle,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  Calculator,
  Flame
} from 'lucide-react'

export default function Layout({ children, activePage, setActivePage }) {
  const { profile, company, signOut } = useAuth()
  const { theme, toggleMode } = useTheme()
  const [collapsed, setCollapsed] = useState(false)

  // Ordem estrita do menu conforme solicitado:
  // 1. Dimensionamento Solar
  // 2. Viabilidade Financeira (entre Dimensionamento e Custos)
  // 3. Custos & Precificação
  // 4 a 8: CRM e Engenharia
  // Todos acima das Configurações Admin e Superadmin
  const menuItems = [
    { id: 'dimensionamento', name: 'Dimensionamento Solar', icon: Sun, tag: 'Engenharia' },
    { id: 'viabilidade', name: 'Viabilidade Financeira', icon: TrendingUp, tag: 'Payback' },
    { id: 'custos', name: 'Custos & Precificação', icon: Calculator, tag: 'DRE & Markup' },
    { id: 'leads', name: 'Gestão de Leads', icon: Users },
    { id: 'propostas', name: 'Propostas Comerciais', icon: FileText },
    { id: 'projetos', name: 'Projetos (Engenharia)', icon: Wrench },
    { id: 'homologacoes', name: 'Homologações', icon: ShieldCheck },
    { id: 'posvenda', name: 'Pós-Venda', icon: CheckCircle },
    { id: 'config_admin', name: 'Configurações Admin', icon: Settings, role: 'admin' },
    { id: 'config_superadmin', name: 'Painel Superadmin', icon: ShieldAlert, role: 'superadmin' }
  ]

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.role) return true
    if (item.role === 'superadmin' && profile?.role === 'superadmin') return true
    if (item.role === 'admin' && (profile?.role === 'admin' || profile?.role === 'superadmin')) return true
    return false
  })

  const companyDisplayName = theme?.companyDisplayName && theme.companyDisplayName !== 'CRM Solar' 
    ? theme.companyDisplayName 
    : 'B2W Energia'

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-[#F5F5F4] font-body overflow-hidden">
      
      {/* Sidebar */}
      <aside
        className={`bg-[#141310] border-r border-[#1E1C18] flex flex-col transition-all duration-300 relative z-20 ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-[var(--color-brand)] hover:brightness-110 text-white rounded-full p-1 shadow-lg shadow-[var(--color-brand)]/20 active:scale-90 transition-all cursor-pointer z-30"
          title={collapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          {collapsed ? <ChevronLeft size={16} className="rotate-180" /> : <ChevronLeft size={16} />}
        </button>

        {/* Brand Header: B2W Energia */}
        <div className="p-5 flex items-center gap-3.5 border-b border-[#1E1C18]">
          {theme?.logoUrl ? (
            <img 
              src={theme.logoUrl} 
              alt={companyDisplayName} 
              className="h-10 w-10 object-contain rounded-xl shrink-0 bg-white/5 p-1 border border-white/10"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = ''
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)] flex items-center justify-center shrink-0 shadow-lg shadow-[var(--color-brand)]/25">
              <Flame className="h-6 w-6 text-white" />
            </div>
          )}

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg tracking-tight text-white block truncate">
                  {companyDisplayName}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold block uppercase tracking-wider">
                CRM & Engenharia
              </span>
            </div>
          )}
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-[var(--color-brand)]/25'
                    : 'text-[#A8A49D] hover:text-white hover:bg-[#1E1C18]/60'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-[#A8A49D] group-hover:text-white'}`} />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.name}</span>
                    {item.tag && !isActive && (
                      <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#1E1C18] text-[#A8A49D] shrink-0">
                        {item.tag}
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-[#1E1C18] bg-[#0D0D0D]/60 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/30 flex items-center justify-center font-display font-black text-xs text-[var(--color-brand)] shrink-0 uppercase">
              {profile?.full_name ? profile.full_name.substring(0, 2) : 'B2W'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-white truncate font-display">
                  {profile?.full_name || 'Engenharia Solar'}
                </span>
                <span className="block text-[10px] text-emerald-400 font-mono font-semibold uppercase tracking-wider">
                  {profile?.role || 'Especialista'}
                </span>
              </div>
            )}
          </div>
          
          {/* Theme Mode Toggle */}
          <div className="flex bg-[#141310] p-1 rounded-xl border border-[#1E1C18] justify-between items-center">
            {collapsed ? (
              <button
                onClick={toggleMode}
                className="w-full flex items-center justify-center p-1.5 text-[var(--color-brand)] hover:brightness-125 transition-all active:scale-90 cursor-pointer"
                title={theme.mode === 'light' ? 'Mudar para Modo Escuro' : 'Mudar para Modo Claro'}
              >
                {theme.mode === 'light' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => theme.mode !== 'light' && toggleMode()}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                    theme.mode === 'light' 
                      ? 'bg-[var(--color-brand)] text-white shadow-sm' 
                      : 'text-[#A8A49D] hover:text-white'
                  }`}
                  title="Modo Claro"
                >
                  <Sun size={14} />
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  onClick={() => theme.mode !== 'dark' && toggleMode()}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                    theme.mode === 'dark' 
                      ? 'bg-[var(--color-brand)] text-white shadow-sm' 
                      : 'text-[#A8A49D] hover:text-white'
                  }`}
                  title="Modo Escuro"
                >
                  <Moon size={14} />
                  <span>Escuro</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            {!collapsed && <span>Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#0D0D0D]">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-brand)]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex-1 overflow-y-auto relative z-10 p-4 md:p-8">
          {children}
        </div>
      </main>

    </div>
  )
}
