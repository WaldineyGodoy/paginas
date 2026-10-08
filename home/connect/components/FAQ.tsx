
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FaqItem } from '../types';
import { Button } from './Button';

const faqData: FaqItem[] = [
  {
    category: "Energia Solar por Assinatura",
    question: "Onde a assinatura de energia solar B2W está disponível?",
    answer: "Atendemos atualmente em diversos estados brasileiros, incluindo SP (CPFL Paulista), RN (Cosern), RJ (Enel), PR (Copel), MT (Energisa), MS (Energisa), MG (Cemig) e GO (Equatorial). Nossa rede de usinas solares está em constante expansão para levar economia de energia a todo o Brasil."
  },
  {
    category: "Economia na Conta de Luz",
    question: "Como funciona o desconto na conta de luz?",
    answer: "O modelo de energia solar por assinatura permite que você utilize créditos de energia gerados em nossas usinas. Você continua recebendo a fatura da sua distribuidora local (com taxas mínimas) e uma fatura da B2W com o consumo de energia solar já com desconto aplicado, garantindo uma redução real nos seus custos mensais."
  },
  {
    category: "Investimento e Obras",
    question: "Preciso investir em painéis solares ou fazer obras?",
    answer: "Não! Essa é a grande vantagem da B2W Energia. Você aproveita os benefícios da energia solar fotovoltaica sem precisar instalar placas no seu telhado, sem obras e sem qualquer investimento inicial. É a forma mais simples e barata de ter energia limpa."
  },
  {
    category: "Cancelamento e Fidelidade",
    question: "A assinatura de energia possui fidelidade?",
    answer: "Não trabalhamos com contratos de fidelidade. Você tem total liberdade para cancelar sua assinatura de energia solar a qualquer momento, respeitando apenas o prazo de 90 dias exigido pelas distribuidoras para o processamento técnico do desligamento dos créditos."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleGarantirDesconto = () => {
    window.location.href = 'https://b2wenergia.com.br/contrato';
  };

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-blue mb-4">
            Dúvidas Frequentes
          </h2>
          <p className="text-gray-600">
            Transparência total. Entenda como funciona o modelo de duas faturas e sua economia.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl overflow-hidden transition-shadow duration-300 ${openIndex === index ? 'shadow-lg ring-1 ring-brand-orange/30' : 'shadow-sm border border-gray-100'}`}
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <div>
                   {item.category && (
                     <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block mb-1">
                       {item.category}
                     </span>
                   )}
                   <span className={`font-bold text-lg ${openIndex === index ? 'text-brand-blue' : 'text-gray-700'}`}>
                     {item.question}
                   </span>
                </div>
                <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  {openIndex === index ? <Minus className="text-brand-orange" /> : <Plus className="text-gray-400" />}
                </span>
              </button>
              
              <div 
                className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center flex flex-col items-center">
          <p className="text-gray-600 mb-2">Ainda tem dúvidas?</p>
          <a 
            href="https://wa.me/5531995367744" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-brand-orange font-bold hover:underline mb-8"
          >
            Fale com um especialista: (31) 99536-7744
          </a>

          <Button 
            onClick={handleGarantirDesconto}
            className="px-10 py-4 text-lg shadow-xl hover:scale-105"
          >
            GARANTIR O MEU DESCONTO
          </Button>
        </div>
      </div>
    </section>
  );
};
