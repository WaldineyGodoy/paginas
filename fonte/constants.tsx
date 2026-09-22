
import React from 'react';
import {
  FileText,
  Zap,
  LogIn,
  Lock,
  HandCoins,
  Percent,
  BarChart3,
  AlertTriangle,
  Calendar,
  LogOut,
  UserX,
  RefreshCw,
  Briefcase,
  Coins,
  ShieldCheck,
  ShieldAlert,
  Scale,
  Receipt,
  Landmark,
  SlidersHorizontal,
  IdCard,
  FileSignature
} from 'lucide-react';
import { Clause } from './types';

export const CLAUSES: Clause[] = [
  {
    id: '1',
    number: '01',
    title: 'Objeto',
    description: 'Define o ingresso do cliente em uma associação de geração compartilhada via créditos de energia (Lei 14.300/22).',
    whyExists: 'Evita interpretação como venda de energia ou investimento, reduzindo riscos regulatórios.',
    icon: 'file-text',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    number: '02',
    title: 'Natureza da Operação',
    description: 'Esclarece que não há compra de energia, mas compensação de créditos de usinas parceiras.',
    whyExists: 'Protege contra alegações de propaganda enganosa ou promessa de economia fixa indevida.',
    icon: 'zap',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    number: '03',
    title: 'Ingresso e Elegibilidade',
    description: 'O início depende de análise técnica, cadastral e aceite formal da sua distribuidora.',
    whyExists: 'Impede expectativa de benefício imediato sem a devida aprovação técnica da rede.',
    icon: 'login',
    imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    number: '04',
    title: 'Exclusividade Regulatória',
    description: 'O cliente não pode participar de mais de uma associação de geração compartilhada simultaneamente.',
    whyExists: 'Exigência legal para evitar duplicidade de créditos e glosas pela distribuidora.',
    icon: 'lock',
    imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '5',
    number: '05',
    title: 'Contribuição Associativa',
    description: 'A cobrança é proporcional à energia efetivamente compensada no ciclo; sem compensação, nada é cobrado.',
    whyExists: 'Formaliza a remuneração do serviço sem caracterizar comercialização direta de energia.',
    icon: 'hand-coins',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '6',
    number: '06',
    title: 'Desconto por Pagamento Pontual',
    description: 'O desconto é um benefício pela pontualidade sobre o valor cheio da contribuição, não uma redução de preço; pagando após o vencimento, é devido o valor cheio, sem multa ou sanção. O desconto volta automaticamente no ciclo seguinte.',
    whyExists: 'Materializa o benefício econômico como bonificação, e não como penalidade disfarçada por atraso.',
    icon: 'percent',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '7',
    number: '07',
    title: 'Faturamento e Pagamento',
    description: 'O boleto ou PIX é disponibilizado por meio eletrônico com pelo menos 5 dias de antecedência do vencimento; a falta do boleto não isenta o pagamento, cabendo pedir a 2ª via.',
    whyExists: 'Deixa claro o meio, o prazo e a responsabilidade de cobrança da via de pagamento.',
    icon: 'receipt',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '8',
    number: '08',
    title: 'Base de Cálculo e Encargos Não Compensáveis',
    description: 'O desconto incide só sobre o que a fatura da distribuidora mostrar como compensado; custo de disponibilidade, parcela não compensável da TUSD Fio B, iluminação pública e bandeiras seguem devidos à distribuidora, sem desconto.',
    whyExists: 'Evita a expectativa de que o desconto elimina cobranças que são sempre da distribuidora.',
    icon: 'landmark',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '9',
    number: '09',
    title: 'Transparência e Demonstrativo',
    description: 'Obriga o envio mensal de um demonstrativo com consumo, energia compensada, valores cobrados e economia obtida.',
    whyExists: 'Aumenta a confiança do cliente e mitiga reclamações por falta de informação.',
    icon: 'barchart',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '10',
    number: '10',
    title: 'Mora e Inadimplência',
    description: 'Atraso gera, além da perda do desconto, multa de 2%, juros de 1% ao mês e correção monetária; a inadimplência persistente leva à exclusão do rateio (30 dias), negativação (45 dias) e rescisão (60 dias), sempre com aviso prévio.',
    whyExists: 'Protege o fluxo financeiro da associação com encargos proporcionais, e não abusivos.',
    icon: 'alert',
    imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '11',
    number: '11',
    title: 'Prazo',
    description: 'Vigência indeterminada, iniciando na confirmação da compensação pela distribuidora.',
    whyExists: 'Garante flexibilidade e evita a percepção de fidelidade compulsória restritiva.',
    icon: 'calendar',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '12',
    number: '12',
    title: 'Rescisão pelo Associado',
    description: 'O cliente pode sair com aviso prévio mínimo de 90 dias ou 3 ciclos de compensação, sem multa rescisória.',
    whyExists: 'Protege o planejamento energético da associação enquanto garante o direito de saída.',
    icon: 'logout',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '13',
    number: '13',
    title: 'Rescisão pela Associação',
    description: 'Autoriza o encerramento em descumprimentos ou inviabilidade regulatória, mediante comunicação prévia.',
    whyExists: 'Mecanismo de defesa contra mudanças bruscas na legislação ou riscos técnicos.',
    icon: 'user-x',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '14',
    number: '14',
    title: 'Revisão do Percentual de Desconto',
    description: 'Mudanças regulatórias ou tributárias relevantes podem levar a associação a propor uma revisão do desconto, avisando com 60 dias; discordando, o cliente pode sair sem multa nem aviso prévio.',
    whyExists: 'Distribui o risco de mudanças legais sem travar o cliente num desconto inviável.',
    icon: 'sliders',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '15',
    number: '15',
    title: 'Realocação Operacional',
    description: 'Permite mover o cliente entre usinas vinculadas à associação, próprias ou de terceiros, mantidas as condições comerciais.',
    whyExists: 'Garante que o desconto continue mesmo se uma usina entrar em manutenção ou sair da rede.',
    icon: 'refresh',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '16',
    number: '16',
    title: 'Unidade Consumidora e Titularidade',
    description: 'O cliente declara ser o titular da unidade (ou estar autorizado) e deve avisar em até 30 dias qualquer troca de titularidade, desocupação ou pedido de desligamento; sem aviso, segue responsável pelo compensado.',
    whyExists: 'Evita cobrança em nome errado e mantém a associação informada sobre a unidade.',
    icon: 'id-card',
    imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '17',
    number: '17',
    title: 'Representação Operacional',
    description: 'A associação representa o cliente junto à distribuidora apenas para fins técnicos ligados à compensação.',
    whyExists: 'Agiliza a gestão dos créditos sem dar poderes irrestritos sobre a conta do cliente.',
    icon: 'briefcase',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '18',
    number: '18',
    title: 'Ausência de Investimento',
    description: 'O cliente não está investindo em ativos; é apenas um consumidor de créditos.',
    whyExists: 'Afasta interpretações de valores mobiliários ou promessas de retorno financeiro.',
    icon: 'coins',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '19',
    number: '19',
    title: 'Limites da Obrigação da Associação',
    description: 'A associação não garante volume ou continuidade de compensação e não responde por interrupções por manutenção, sinistro ou força maior; nesses casos, não há cobrança no período.',
    whyExists: 'Isola a associação de fatores externos fora do seu controle direto.',
    icon: 'shield-alert',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '20',
    number: '20',
    title: 'Proteção de Dados (LGPD)',
    description: 'Regula o tratamento dos dados pessoais para execução do contrato, faturamento e cobrança, incluindo o compartilhamento necessário com a usina e com prestadores de pagamento.',
    whyExists: 'Atendimento legal obrigatório para proteção da privacidade do associado.',
    icon: 'shield-check',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '21',
    number: '21',
    title: 'Assinatura Eletrônica',
    description: 'As partes reconhecem a validade da assinatura eletrônica, com registros de auditoria (data, hora, IP) como prova do aceite.',
    whyExists: 'Dá segurança jurídica à adesão feita 100% digital, sem papel.',
    icon: 'signature',
    imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '22',
    number: '22',
    title: 'Foro',
    description: 'Define que disputas legais serão resolvidas no domicílio do consumidor.',
    whyExists: 'Reforça a boa-fé e cumpre as normas do Código de Defesa do Consumidor (CDC).',
    icon: 'scale',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600'
  }
];

export const getIcon = (name: string) => {
  const iconProps = { className: "w-6 h-6" };
  switch (name) {
    case 'file-text': return <FileText {...iconProps} />;
    case 'zap': return <Zap {...iconProps} />;
    case 'login': return <LogIn {...iconProps} />;
    case 'lock': return <Lock {...iconProps} />;
    case 'hand-coins': return <HandCoins {...iconProps} />;
    case 'percent': return <Percent {...iconProps} />;
    case 'barchart': return <BarChart3 {...iconProps} />;
    case 'alert': return <AlertTriangle {...iconProps} />;
    case 'calendar': return <Calendar {...iconProps} />;
    case 'logout': return <LogOut {...iconProps} />;
    case 'user-x': return <UserX {...iconProps} />;
    case 'refresh': return <RefreshCw {...iconProps} />;
    case 'briefcase': return <Briefcase {...iconProps} />;
    case 'coins': return <Coins {...iconProps} />;
    case 'shield-check': return <ShieldCheck {...iconProps} />;
    case 'shield-alert': return <ShieldAlert {...iconProps} />;
    case 'scale': return <Scale {...iconProps} />;
    case 'receipt': return <Receipt {...iconProps} />;
    case 'landmark': return <Landmark {...iconProps} />;
    case 'sliders': return <SlidersHorizontal {...iconProps} />;
    case 'id-card': return <IdCard {...iconProps} />;
    case 'signature': return <FileSignature {...iconProps} />;
    default: return <FileText {...iconProps} />;
  }
};
