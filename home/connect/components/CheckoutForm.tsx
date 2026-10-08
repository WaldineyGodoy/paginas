
import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, AlertCircle, Building2, User } from 'lucide-react';
import { Button } from './Button';
import { validateCPF, formatCPF, formatCNPJ, formatPhone } from '../utils/validators';
import { DistributorProfile } from '../data/tariffs';
import { createSubscription } from '../services/api';

interface CheckoutFormProps {
  onClose: () => void;
  initialAddress: any; // Full ViaCep object
  cep: string;
  distributor: DistributorProfile;
  savingsData: {
    monthly: number;
    annual: number;
    totalNewBill: number;
  };
  billValue: number;
  connectionType: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onClose,
  initialAddress,
  cep,
  distributor,
  savingsData,
  billValue,
  connectionType
}) => {
  // Steps: 1 = Form, 2 = Success (Redirecting)
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    docType: 'cpf' as 'cpf' | 'cnpj',
    document: '',
    socialReason: '',
    adminName: '', // For CNPJ
    street: '',
    neighborhood: '',
    number: '',
    complement: '',
  });

  const [addressLocked, setAddressLocked] = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);

  // Initialize Address from props
  useEffect(() => {
    if (initialAddress) {
      const hasStreet = !!initialAddress.logradouro;
      setFormData(prev => ({
        ...prev,
        street: initialAddress.logradouro || '',
        neighborhood: initialAddress.bairro || '',
      }));
      setAddressLocked(hasStreet);
    }
  }, [initialAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'phone') formattedValue = formatPhone(value);
    if (name === 'document') {
      formattedValue = formData.docType === 'cpf' ? formatCPF(value) : formatCNPJ(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleDocumentBlur = async () => {
    if (formData.docType === 'cnpj' && formData.document.length >= 14) {
      const cleanCnpj = formData.document.replace(/\D/g, '');
      if (cleanCnpj.length === 14) {
        setCnpjLoading(true);
        try {
          const response = await fetch(`https://api.opencnpj.org/v1/${cleanCnpj}`);
          const data = await response.json();
          if (data && data.nome) {
            setFormData(prev => ({
              ...prev,
              socialReason: data.nome,
              adminName: data.qsa && data.qsa.length > 0 ? data.qsa[0].nome : ''
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar CNPJ", error);
        } finally {
          setCnpjLoading(false);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (formData.docType === 'cpf') {
      if (!validateCPF(formData.document)) {
        setErrorMessage("CPF inválido. Por favor verifique.");
        return;
      }
    }

    // Phone Validation (DDD + 9 digits = 11 digits)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 11) {
      setErrorMessage("Por favor, informe o número de celular completo com DDD e 9 dígitos (Ex: 11 99999-9999).");
      return;
    }

    if (!formData.name || !formData.phone || !formData.email || !formData.street || !formData.number || !formData.document) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const fullAddress = `${formData.street}, ${formData.number} ${formData.complement ? `- ${formData.complement}` : ''}, ${formData.neighborhood}, ${initialAddress?.localidade || ''} - ${initialAddress?.uf || ''}, CEP: ${cep}`;
    const identification = formData.docType === 'cpf' ? formData.name : `${formData.socialReason} (Sócio: ${formData.adminName || formData.name})`;

    try {
      // 1. Tenta salvar no CRM (API), mas não impede o fluxo se falhar
      try {
        await createSubscription({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          identification,
          distributorName: distributor.name,
          billValue,
          connectionType,
          document: formData.document,
          socialReason: formData.socialReason,
          cep,
          fullAddress,
          monthlySavings: savingsData.monthly,
          city: initialAddress?.localidade || '',
          state: initialAddress?.uf || ''
        });
      } catch (apiError) {
        console.error("Erro ao salvar lead no CRM, prosseguindo para checkout:", apiError);
        // Não fazemos throw aqui para permitir que o usuário continue para o contrato
      }

      // 2. Calcula consumo estimado em kWh
      // Evita divisão por zero caso tariff venha zerado por algum motivo
      const safeTariff = distributor.tariff > 0 ? distributor.tariff : 0.85; 
      const estimatedKwh = Math.round(billValue / safeTariff);

      // 3. Monta URL com Query Parameters
      const params = new URLSearchParams({
        nome: formData.name,
        cpf: formData.document,
        endereco: fullAddress,
        concessionaria: distributor.name,
        valor_conta: billValue.toFixed(2),
        desconto: (distributor.discount * 100).toFixed(0), // Ex: 15
        economia_mensal: savingsData.monthly.toFixed(2),
        economia_anual: savingsData.annual.toFixed(2),
        consumo_kwh: estimatedKwh.toString()
      });

      // 4. Redireciona para o Checkout
      window.location.href = `https://www.b2wenergia.com.br/contrato/?${params.toString()}`;

    } catch (error) {
      // Esse catch pega apenas erros graves de lógica local, não da API (pois tratamos acima)
      console.error(error);
      setErrorMessage("Ocorreu um erro inesperado. Por favor, tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-blue/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 flex flex-col relative animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
             <h3 className="text-xl font-heading font-bold text-brand-blue">Finalizar Assinatura</h3>
             <p className="text-sm text-gray-500">Preencha seus dados para acessar o contrato.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} />
                {errorMessage}
              </div>
            )}

            {/* Personal Data */}
            <div className="space-y-4">
              <h4 className="font-bold text-brand-orange uppercase text-xs tracking-wider flex items-center gap-2">
                <User size={14} /> Dados Pessoais
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange/50 outline-none"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange/50 outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange/50 outline-none"
                    placeholder="seu@email.com"
                  />
              </div>
            </div>

            {/* Document Data */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
               <h4 className="font-bold text-brand-orange uppercase text-xs tracking-wider flex items-center gap-2">
                <Building2 size={14} /> Documentação
              </h4>

              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="docType" value="cpf" checked={formData.docType === 'cpf'} onChange={() => setFormData(prev => ({ ...prev, docType: 'cpf', document: '', socialReason: '', adminName: '' }))} className="accent-brand-orange" />
                  <span className="text-sm font-medium">CPF</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="docType" value="cnpj" checked={formData.docType === 'cnpj'} onChange={() => setFormData(prev => ({ ...prev, docType: 'cnpj', document: '', socialReason: '', adminName: '' }))} className="accent-brand-orange" />
                  <span className="text-sm font-medium">CNPJ</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.docType === 'cpf' ? 'CPF' : 'CNPJ'}
                </label>
                <div className="relative">
                  <input 
                    name="document"
                    value={formData.document}
                    onChange={handleChange}
                    onBlur={handleDocumentBlur}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange/50 outline-none"
                    placeholder={formData.docType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                  />
                  {cnpjLoading && <Loader2 className="absolute right-3 top-2.5 animate-spin text-gray-400" size={18} />}
                </div>
              </div>

              {formData.docType === 'cnpj' && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                    <input 
                      name="socialReason"
                      value={formData.socialReason}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white"
                      placeholder="Carregando..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sócio Administrador</label>
                    <input 
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white"
                      placeholder="Nome do responsável"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Address Data */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
               <div className="flex justify-between items-center">
                 <h4 className="font-bold text-brand-orange uppercase text-xs tracking-wider">Endereço da Instalação</h4>
                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">CEP: {cep}</span>
               </div>

               <div className="grid md:grid-cols-3 gap-4">
                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Rua / Logradouro</label>
                   <input 
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      readOnly={addressLocked} // Read only if returned from ViaCep
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 outline-none ${addressLocked ? 'bg-gray-100 text-gray-500' : 'focus:ring-2 focus:ring-brand-orange/50'}`}
                      placeholder="Rua..."
                    />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                   <input 
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      readOnly={addressLocked}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 outline-none ${addressLocked ? 'bg-gray-100 text-gray-500' : 'focus:ring-2 focus:ring-brand-orange/50'}`}
                      placeholder="Bairro"
                    />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                   <input 
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange/50 outline-none"
                      placeholder="Nº"
                    />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                   <input 
                      name="complement"
                      value={formData.complement}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange/50 outline-none"
                      placeholder="Apto, Bloco..."
                    />
                 </div>
               </div>
               
               <div className="text-xs text-gray-500 pt-1">
                 {initialAddress?.localidade} - {initialAddress?.uf}
               </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirmar e Assinar'}
              </Button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
