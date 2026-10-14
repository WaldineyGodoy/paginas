import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { SolarProjectProvider } from './context/SolarProjectContext'
import Login from './pages/Login'
import Layout from './components/Layout'
import DimensionamentoSolar from './pages/DimensionamentoSolar'
import ViabilidadeFinanceira from './pages/ViabilidadeFinanceira'
import CustosPrecificacao from './pages/CustosPrecificacao'
import Leads from './pages/Leads'
import { Propostas, Projetos, Homologacoes, PosVenda } from './pages/ModulosCRM'
import ConfigAdmin from './pages/ConfigAdmin'
import ConfigSuperadmin from './pages/ConfigSuperadmin'

function MainAppContent() {
  const { user, loading } = useAuth()
  const [activePage, setActivePage] = useState('dimensionamento')

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-brand)] mb-4"></div>
        <p className="text-sm font-medium tracking-wide text-ink-300 font-mono">Carregando B2W Energia...</p>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  // Roteamento condicional das telas
  const renderContent = () => {
    switch (activePage) {
      case 'dimensionamento':
        return <DimensionamentoSolar onNavigate={(page) => setActivePage(page)} />
      case 'viabilidade':
        return <ViabilidadeFinanceira onNavigate={(page) => setActivePage(page)} />
      case 'custos':
        return <CustosPrecificacao onNavigate={(page) => setActivePage(page)} />
      case 'leads':
        return <Leads />
      case 'propostas':
        return <Propostas />
      case 'projetos':
        return <Projetos />
      case 'homologacoes':
        return <Homologacoes />
      case 'posvenda':
        return <PosVenda />
      case 'config_admin':
        return <ConfigAdmin />
      case 'config_superadmin':
        return <ConfigSuperadmin />
      default:
        return <DimensionamentoSolar onNavigate={(page) => setActivePage(page)} />
    }
  }

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderContent()}
    </Layout>
  )
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center p-6 text-center font-body">
          <div className="bg-[#141310] border border-red-500/40 p-8 rounded-3xl max-w-lg shadow-2xl space-y-4">
            <h2 className="text-xl font-display font-bold text-red-400">Aviso no Carregamento</h2>
            <p className="text-sm text-ink-300">{this.state.error?.message || 'Erro inesperado na renderização.'}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="btn-brand-primary px-6 py-2.5 text-sm"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <SolarProjectProvider>
            <MainAppContent />
          </SolarProjectProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
