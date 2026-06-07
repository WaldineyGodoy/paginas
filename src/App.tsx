import { useState, useEffect, SVGProps } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Building2, 
  Zap, 
  TrendingUp, 
  Home, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Scale, 
  FileText, 
  Star,
  BookOpen,
  DollarSign,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  // Configurações das Imagens (Customizável com caminhos relativos ou links diretos da Hotmart, LinkedIn etc)
  const [waldineyPhoto, setWaldineyPhoto] = useState("https://b2wenergia.com.br/wp-content/uploads/2026/06/foto-perfil.png");
  const [solarFarmPhoto, setSolarFarmPhoto] = useState("https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1600");
  const [waldineyImgError, setWaldineyImgError] = useState(false);
  const [solarFarmImgError, setSolarFarmImgError] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkoutUrl = "https://pay.hotmart.com/M106187459T?checkoutMode=2";
  const hotmartClassName = "hotmart-fb hotmart__button-checkout";

  return (
    <div className="min-h-screen bg-[#f6faff] text-[#171c20] font-sans overflow-x-hidden selection:bg-[#b2fe02] selection:text-[#171c20]">
      
      {/* Dynamic Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#171c20]/95 backdrop-blur-md py-3 shadow-lg border-b border-white/5 text-white' : 'bg-white py-4 text-[#171c20] border-b border-gray-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-display text-xl font-black tracking-tighter uppercase flex items-center">
              B2W <span className={scrolled ? "text-[#b2fe02]" : "text-[#476800] ml-1"}>INVEST</span>
              <span className="w-2 h-2 rounded-full bg-[#b2fe02] ml-1 animate-pulse"></span>
            </span>
          </div>
          
          <a
            href={checkoutUrl}
            className={`${hotmartClassName} flex items-center justify-center bg-[#b2fe02] hover:bg-[#9fd501] text-[#171c20] px-4 md:px-6 py-2.5 rounded-full font-display font-black text-xs md:text-sm tracking-wide shadow-[0_4px_14px_rgba(178,254,2,0.3)] hover:shadow-[0_6px_20px_rgba(178,254,2,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap`}
            style={{ textDecoration: 'none' }}
          >
            BAIXAR RELATÓRIO
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 bg-[#171c20] text-white overflow-hidden">
        {/* Subtle Background Solar Panel Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          {!solarFarmImgError && solarFarmPhoto ? (
            <img
              src={solarFarmPhoto}
              alt="Usinas Solares de Investimento"
              className="w-full h-full object-cover"
              onError={() => setSolarFarmImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#476800] to-[#171c20] opacity-80"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171c20] via-[#171c20]/75 to-transparent"></div>
        </div>

        {/* Decorative Top glow */}
        <div className="absolute -top-40 right-1/4 w-[35rem] h-[35rem] rounded-full bg-[#b2fe02]/10 blur-[120px] pointer-events-none z-0"></div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center z-10 flex flex-col items-center">
          
          {/* Explicit Capsule Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-[#b2fe02] text-[#171c20] font-sans font-extrabold text-[11px] md:text-xs tracking-wider uppercase px-4 py-1.5 rounded-full mb-8"
          >
            REPORT EXCLUSIVO
          </motion.div>

          {/* Hero Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl tracking-tight leading-[1.1] mb-6 max-w-3xl"
          >
            Guia completo para investir no setor de energia com segurança
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans text-gray-300 text-base md:text-lg lg:text-xl font-light mb-10 max-w-2xl leading-relaxed"
          >
            Descubra como investidores, comercializadoras e proprietários de usinas estão participando de uma das maiores transformações energéticas da história do Brasil.
          </motion.p>

          {/* Highlight Quotation Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 mb-10 text-left relative"
          >
            <div className="absolute top-0 left-6 transform -translate-y-1/2 bg-[#b2fe02] text-[#171c20] text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded">
              INSIGHT CHAVE
            </div>
            <p className="font-sans italic text-[#b2fe02] text-sm md:text-base md:leading-relaxed text-center font-normal">
              &ldquo;Entenda o mercado que está transformando energia em patrimônio. Baixe o relatório que revela como funcionam as usinas solares de investimento.&rdquo;
            </p>
          </motion.div>

          {/* Hero CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <a
              href={checkoutUrl}
              className={`${hotmartClassName} group inline-flex items-center space-x-3 bg-[#b2fe02] hover:bg-[#a1e600] text-[#171c20] font-display font-black text-sm md:text-base tracking-wide px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-[0_8px_25px_rgba(178,254,2,0.4)] hover:shadow-[0_12px_32px_rgba(178,254,2,0.6)]`}
              style={{ textDecoration: 'none' }}
            >
              <span>QUERO RECEBER O PAPER</span>
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300" />
            </a>
          </motion.div>

        </div>
      </section>

      {/* Infinite Continuous Ticker */}
      <div className="bg-[#171c20] border-y border-white/10 py-5 overflow-hidden">
        <div className="relative w-full flex items-center">
          <div className="animate-marquee whitespace-nowrap flex items-center space-x-8 md:space-x-12">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center space-x-8 md:space-x-12 text-xs md:text-sm font-display font-black tracking-widest text-[#edf1f6]/95 uppercase">
                <span>GERAÇÃO DISTRIBUÍDA</span>
                <span className="w-2 h-2 rounded-full bg-[#ffb2b2]"></span>
                <span>USINAS FOTOVOLTAICAS</span>
                <span className="w-2 h-2 rounded-full bg-[#ffb2b2]"></span>
                <span>ENERGIA SOLAR</span>
                <span className="w-2 h-2 rounded-full bg-[#ffb2b2]"></span>
                <span>INVESTIMENTOS SEGUROS</span>
                <span className="w-2 h-2 rounded-full bg-[#ffb2b2]"></span>
                <span>RENTABILIDADE</span>
                <span className="w-2 h-2 rounded-full bg-[#ffb2b2]"></span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: Despertar do Investidor */}
      <section className="py-20 md:py-28 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-4xl text-[#171c20] tracking-tight leading-[1.15] mb-6">
              A maioria dos investidores ainda não percebeu o que está acontecendo
            </h2>
            <div className="w-20 h-1.5 bg-[#b2fe02] rounded-full mb-10"></div>
            
            <div className="space-y-6 font-sans text-gray-600 text-base md:text-lg leading-relaxed">
              <p>
                Enquanto milhões de brasileiros continuam pagando contas, uma nova geração está aprendendo a participar do mercado de geração distribuída.
              </p>
              <p className="text-[#171c20] font-extrabold text-lg md:text-xl border-l-4 border-[#b2fe02] pl-4 py-1">
                A pergunta é: quem será dono dos ativos?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: O Airbnb da Geração de Energia */}
      <section className="py-20 md:py-28 bg-[#f6faff]">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-4xl lg:text-4xl leading-[1.2] tracking-tight text-[#171c20]">
              Uma transformação econômica comparável ao <span className="italic font-normal underline decoration-[#b2fe02] decoration-4 underline-offset-4">Airbnb</span> porém <span className="text-[#476800]">muito mais rentável</span>
            </h2>
          </div>

          {/* Grid Layout for Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Descentralização */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#b2fe02]/20 flex items-center justify-center text-[#476800] mb-6">
                <Zap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#171c20] mb-4">
                Descentralização
              </h3>
              <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed">
                A energia deixou de ser centralizada em grandes hidrelétricas para ser produzida em terrenos de 1.000 m2 virando negócio em usinas solares dedicadas.
              </p>
            </div>

            {/* Card 2: Ativos Reais (DESTAQUE ESCURO) */}
            <div className="bg-[#171c20] text-white rounded-2xl p-8 border border-white/5 shadow-xl md:scale-105 transform transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#b2fe02]/10 rounded-full blur-2xl"></div>
              <div className="w-12 h-12 rounded-xl bg-[#b2fe02] flex items-center justify-center text-[#171c20] mb-6 font-bold shadow-[0_0_15px_rgba(178,254,2,0.4)]">
                <Building2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-white mb-4 flex items-center">
                Ativos Reais
                <span className="ml-2 bg-[#b2fe02] text-[#171c20] text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase">FOCO</span>
              </h3>
              <p className="font-sans text-gray-300 text-sm md:text-base leading-relaxed">
                Investimento em energia tem atraído grandes volumes no mercado, com contratos de locação que trazem previsibilidade e segurança patrimonial ao investidor sênior.
              </p>
            </div>

            {/* Card 3: Escalabilidade */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#b2fe02]/20 flex items-center justify-center text-[#476800] mb-6">
                <TrendingUp className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#171c20] mb-4">
                Escalabilidade
              </h3>
              <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed">
                O modelo de assinatura permite que qualquer empresa reduza custos sem investir um centavo em Capex, criando demanda infinita para novas usinas de investimento.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Section 3: O que você vai aprender */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          
          {/* Header Section */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold tracking-widest text-gray-400 uppercase block mb-3">
              CONTEÚDO DO RELATÓRIO
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#171c20] tracking-tight">
              O que você vai aprender
            </h2>
          </div>

          {/* List Layout with exact elements from picture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            
            {[
              { id: "01", text: "O Cenário Atual da Energia no Brasil" },
              { id: "02", text: "Marcos Legais (Lei 14.300)" },
              { id: "03", text: "O Que é Geração Distribuída (GD)" },
              { id: "04", text: "O Modelo de Energia por Assinatura" },
              { id: "05", text: "Viabilidade de Usinas Solares" },
              { id: "06", text: "Custos de construção de uma usina" },
              { id: "07", text: "Rentabilidade e Payback" },
              { id: "08", text: "Estruturação Jurídica para fornecer energia por assinatura" },
            ].map((item) => (
              <div key={item.id} className="flex items-center space-x-4 bg-gray-50 hover:bg-gray-100/75 border border-gray-100 p-5 rounded-xl transition-all duration-200">
                <span className="font-mono text-base font-extrabold text-gray-400/80 tracking-wide w-8">
                  {item.id}
                </span>
                <span className="font-sans text-gray-800 font-medium text-sm md:text-base">
                  {item.text}
                </span>
              </div>
            ))}

            {/* Special Highlighted Item 13 exactly as in image screenshot */}
            <div className="md:col-span-2 bg-[#b2fe02] text-[#171c20] flex items-center space-x-4 p-6 rounded-xl border border-[#9edb01] shadow-md transform hover:scale-[1.01] transition-transform duration-200">
              <span className="font-mono text-lg font-black w-8">
                13
              </span>
              <div className="flex-1">
                <p className="font-display font-black text-sm md:text-base uppercase tracking-wider mb-0.5">
                  Case Study Principal
                </p>
                <p className="font-sans font-extrabold text-sm md:text-lg">
                  Da construção ao faturamento recorrente garantido em energia
                </p>
              </div>
              <Star className="w-6 h-6 fill-[#171c20] stroke-[#171c20] animate-spin-slow flex-shrink-0" />
            </div>

          </div>

        </div>
      </section>

      {/* Section 4: Waldiney Godoy Bio Section */}
      <section className="py-20 md:py-28 bg-[#f6faff] border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            {/* Photo Column */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative">
                <div className="w-[280px] h-[370px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-[#171c20] flex items-center justify-center">
                  {!waldineyImgError && waldineyPhoto ? (
                    <img
                      src={waldineyPhoto}
                      alt="Waldiney Godoy"
                      className="w-full h-full object-cover object-top"
                      onError={() => setWaldineyImgError(true)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    // Elegant fallback profile silhouette for Waldiney Godoy
                    <div className="w-full h-full bg-gradient-to-b from-[#1c2c35] to-[#12161a] p-6 flex flex-col items-center justify-center relative select-none">
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
                        <Building2 className="w-48 h-48 text-[#b2fe02]" />
                      </div>
                      
                      <div className="w-20 h-24 rounded-t-full border border-[#b2fe02]/20 bg-gradient-to-t from-[#b2fe02]/5 to-transparent flex flex-col items-center justify-center mb-4 overflow-hidden relative p-4">
                        <div className="w-10 h-10 rounded-full bg-gray-600 mb-2"></div>
                        <div className="w-16 h-8 rounded-t-full bg-gray-700"></div>
                      </div>

                      <span className="text-xs font-mono text-[#b2fe02] uppercase font-extrabold tracking-widest mb-1">Waldiney Godoy</span>
                      <p className="text-[10px] text-gray-500 font-sans text-center px-4 leading-tight mb-4">
                        Insira seu arquivo <span className="text-white font-mono bg-white/5 py-0.5 px-1 rounded">waldiney.jpg</span> na pasta pública ou cole o link no menu de mídias abaixo.
                      </p>
                    </div>
                  )}
                </div>
                {/* Visual Label Indicator from Screenshot */}
                <div className="absolute -bottom-4 -right-4 bg-[#171c20] text-white p-4 rounded-xl border border-white/10 shadow-lg text-center min-w-[150px]">
                  <p className="font-display text-xl font-black text-[#b2fe02] leading-none mb-1">+100</p>
                  <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-gray-400">Usinas Construídas</p>
                </div>
              </div>
            </div>

            {/* Biography Copy Column */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <h2 className="font-display font-black text-3xl md:text-4xl text-[#171c20] tracking-tight mb-2">
                Waldiney Godoy
              </h2>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#476800] mb-6">
                CEO e Fundador da B2W Invest
              </p>
              
              <p className="font-sans text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                Referência nacional no setor de energia solar, Waldiney Godoy construiu uma trajetória sólida com mais de 100 usinas entregues. É o criador da B2Wenergia, ecossistema que conecta investidores a oportunidades reais de geração distribuída.
              </p>

              {/* Verified Links to Portals from Screenshot */}
              <div className="space-y-3 font-mono text-xs md:text-sm font-semibold text-[#171c20]">
                <a 
                  href="https://b2wenergia.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-2.5 hover:text-[#476800] transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="underline decoration-1 decoration-gray-300">b2wenergia.com.br</span>
                </a>
                <a 
                  href="https://b2winvest.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-2.5 hover:text-[#476800] transition-colors"
                >
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="underline decoration-1 decoration-gray-300">b2winvest.com.br</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 5: O que torna este mercado diferente? (ESCURA) */}
      <section className="py-20 md:py-28 bg-[#171c20] text-white relative overflow-hidden">
        
        {/* Subtle glow background */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] rounded-full bg-[#b2fe02]/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10 text-center">
          
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-16">
            O que torna este mercado diferente?
          </h2>

          {/* Icons Grid exactly matching the layout: 2 cols mobile, 5 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            
            {[
              { label: "RESIDÊNCIAS", icon: Home },
              { label: "COMÉRCIOS", icon: Building2 },
              { label: "VEÍCULOS ELÉTRICOS", icon: Zap },
              { label: "DATA CENTERS", icon: Database },
              { label: "AI POWER", icon: Cpu }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#b2fe02] mb-4 hover:border-[#b2fe02]/30 hover:bg-white/10 transition-all duration-300">
                    <IconComponent className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <span className="font-display font-bold text-[11px] md:text-xs tracking-wider text-gray-300 uppercase">
                    {item.label}
                  </span>
                </div>
              );
            })}

          </div>

          {/* Inspirational Energy Philosophy Quote from Screenshot */}
          <div className="max-w-xl mx-auto border-t border-white/10 pt-10">
            <p className="font-sans italic text-sm md:text-base text-gray-400">
              &ldquo;Toda nova tecnologia consome energia. Quem controla a fonte, controla o futuro do valor.&rdquo;
            </p>
          </div>

        </div>
      </section>

      {/* Section 6: Pronto para dar o próximo passo? (FINAL CTA) */}
      <section className="py-20 md:py-28 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Checklist Column */}
            <div className="lg:col-span-7 bg-[#f6faff] rounded-2xl p-8 border border-gray-100">
              
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#b2fe02] flex items-center justify-center text-[#171c20]">
                  <Star className="w-4 h-4 fill-current stroke-current" />
                </div>
                <h3 className="font-display font-black text-lg md:text-xl text-[#171c20]">
                  BÔNUS: Checklist do Investidor
                </h3>
              </div>

              <div className="space-y-4 font-sans text-[#171c20]">
                {[
                  "01. Localização do terreno",
                  "02. Disponibilidade de Rede (Parecer de Acesso)",
                  "03. Quanto custa construir uma usina de investimento",
                  "04. Modelo de Comercialização",
                  "05. Custos de Manutenção",
                  "06. Estrutura Jurídica e Societária",
                  "07. Projeção de Geração e Faturamento"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#476800] mt-0.5 flex-shrink-0" />
                    <span className="text-sm md:text-base font-semibold text-gray-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Sleek Action Checkout Card (Right Column) */}
            <div className="lg:col-span-5">
              <div className="bg-[#171c20] text-white rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                
                {/* Rotated Price Tag badge styled after picture */}
                <div className="absolute top-4 right-[-32px] bg-[#b2fe02] text-[#171c20] text-center font-display font-black text-sm uppercase tracking-wide py-2 w-36 rotate-45 shadow-md">
                  R$ 47,00
                </div>

                <div className="mb-8">
                  <h3 className="font-display font-black text-xl md:text-2xl tracking-tight leading-snug pr-12">
                    Relatório do Guia completo para investir no setor de energia com segurança
                  </h3>
                </div>

                {/* Primary Purchase Button pointing to payment with widget checkout */}
                <div className="mb-6">
                  <a
                    href={checkoutUrl}
                    className={`${hotmartClassName} flex items-center justify-center space-x-2 bg-[#b2fe02] hover:bg-[#a1e600] text-[#171c20] w-full py-4 rounded-xl font-display font-black text-[13px] sm:text-sm md:text-base tracking-normal sm:tracking-wide uppercase transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(178,254,2,0.3)] hover:shadow-[0_6px_25px_rgba(178,254,2,0.5)] whitespace-nowrap`}
                    style={{ textDecoration: 'none' }}
                  >
                    <span>QUERO RECEBER O RELATÓRIO</span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  </a>
                </div>

                {/* Extra credibility seals */}
                <div className="text-center">
                  <p className="font-sans text-xs text-gray-400 font-medium mb-1 flex items-center justify-center space-x-1.5">
                    <Download className="w-4 h-4 text-[#b2fe02]" />
                    <span>Download imediato via PDF</span>
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-gray-500">
                    Ambiente de Pagamento Seguro Hotmart
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Elegant Corporate Footer */}
      <footer className="bg-[#171c20] text-white py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center border-b border-white/5 pb-10 mb-10 space-y-6">
            
            {/* Logo */}
            <div className="flex items-center justify-center space-x-2">
              <span className="font-display text-xl font-black tracking-tighter uppercase flex items-center">
                B2W <span className="text-[#b2fe02] ml-1">INVEST</span>
                <span className="w-2 h-2 rounded-full bg-[#b2fe02] ml-1"></span>
              </span>
            </div>

            {/* Links Block */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs md:text-sm text-gray-400 justify-center">
              <a href="#terms" className="hover:text-white transition-colors">Termos de Uso</a>
              <span className="text-white/10 hidden md:inline">|</span>
              <a href="#privacy" className="hover:text-white transition-colors">Política de Privacidade</a>
              <span className="text-white/10 hidden md:inline">|</span>
              <a href="https://b2wenergia.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-[#b2fe02] transition-colors">b2wenergia.com.br</a>
              <span className="text-white/10 hidden md:inline">|</span>
              <a href="https://b2winvest.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-[#b2fe02] transition-colors">b2winvest.com.br</a>
            </div>

          </div>

          {/* Legal / Copyright disclaimer */}
          <div className="text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between text-xs text-gray-500 font-sans space-y-4 md:space-y-0">
            <p>
              &copy; 2026 B2W Invest & B2W Energia. Todos os direitos reservados.
            </p>
            <p className="max-w-md md:text-right text-[10px] leading-relaxed">
              As informações apresentadas neste guia são de caráter informativo e educacional, não constituindo oferta pública ou recomendação direta de investimentos financeiros regulados pela CVM.
            </p>
          </div>

        </div>
      </footer>

      {/* Floating Media Configurator Panel (Sleek Professional Tooltip) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showConfig ? (
          <button
            onClick={() => setShowConfig(true)}
            className="w-12 h-12 rounded-full bg-[#171c20] hover:bg-[#2c3135] text-[#b2fe02] border border-[#b2fe02]/30 flex items-center justify-center shadow-2xl hover:shadow-[0_0_15px_rgba(178,254,2,0.4)] transition-all duration-300 pointer-events-auto cursor-pointer"
            title="Configurar Imagens"
          >
            <SettingsIcon className="w-5 h-5 animate-spin-slow" />
          </button>
        ) : (
          <div className="bg-[#171c20] text-white rounded-2xl border border-white/10 p-5 w-80 shadow-2xl animate-fade-in pointer-events-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="font-display font-black text-xs uppercase tracking-wider text-[#b2fe02] flex items-center space-x-1.5">
                <span>GERENCIADOR DE MÍDIAS</span>
              </span>
              <button
                onClick={() => setShowConfig(false)}
                className="text-gray-400 hover:text-white text-xs font-bold font-mono px-1.5 py-0.5 rounded hover:bg-white/5 cursor-pointer"
              >
                FECHAR
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5 font-bold">
                  Foto de Waldiney Godoy (URL / Local):
                </label>
                <input
                  type="text"
                  value={waldineyPhoto}
                  onChange={(e) => {
                    setWaldineyPhoto(e.target.value);
                    setWaldineyImgError(false);
                  }}
                  placeholder="Ex: waldiney.jpg ou link da imagem"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-[#b2fe02] transition-colors"
                />
                <span className="block text-[9px] text-[#b2fe02] mt-1 font-semibold">
                  Insira o link de qualquer foto ou use waldiney.jpg
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5 font-bold">
                  Imagem da Usina Solar (URL / Local):
                </label>
                <input
                  type="text"
                  value={solarFarmPhoto}
                  onChange={(e) => {
                    setSolarFarmPhoto(e.target.value);
                    setSolarFarmImgError(false);
                  }}
                  placeholder="Ex: solar-farm.jpg ou link"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-[#b2fe02] transition-colors"
                />
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-col space-y-2 text-[9px] text-gray-400 leading-normal">
                <p>
                  💡 <strong>Hospedagem (Hostinger/GitHub):</strong> Coloque as suas imagens na pasta <code className="bg-white/5 px-1 rounded text-white text-[8px]">public/</code> com os nomes configurados acima e elas serão compiladas perfeitamente.
                </p>
                <p>
                  🔗 <strong>Links Diretos:</strong> Você pode usá-los colando qualquer URL de imagem ativa na caixa de texto.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// Simple Settings Icon component for fallback
function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
