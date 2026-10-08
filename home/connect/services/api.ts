
export interface SubscriptionData {
  name: string;
  phone: string;
  email: string;
  identification: string;
  distributorName: string;
  billValue: number;
  connectionType: string;
  document: string;
  socialReason: string;
  cep: string;
  fullAddress: string;
  monthlySavings: number;
  city: string;
  state: string;
}

export const createSubscription = async (data: SubscriptionData) => {
  // Normalização do Telefone
  // Remove tudo que não for número
  const cleanPhone = data.phone.replace(/\D/g, '');
  
  // Lógica para garantir formato 55 + DDD + 9 dígitos (Total 13 dígitos)
  // Se tiver 11 dígitos (11 99999-9999), adiciona 55 na frente
  // Se já tiver 13 dígitos (começando com 55), mantêm.
  const formattedPhone = cleanPhone.startsWith('55') && cleanPhone.length === 13 
    ? cleanPhone 
    : `55${cleanPhone}`;

  // Payload for NocoDB
  const nocodbPayload = {
    "Nome": data.name,
    "Telefone": formattedPhone,
    "identificação": data.identification,
    "Inbox ID": 0,
    "Source ID": "Site B2W",
    "Contact ID": 0,
    "Concessionaria": data.distributorName,
    "Valor da ultima conta": `R$ ${data.billValue}`,
    "Documento": data.document,
    "Razão social": data.socialReason,
    "CEP": data.cep,
    "Endereço completo": data.fullAddress,
    "URL Conta de energia": "",
    "RG": "",
    "email": data.email
  };

  // Evolution API Payload
  const messageText = `
*Novo Cliente Cadastrado!* 🚀

*Cliente:* ${data.name}
*Telefone:* ${formattedPhone}
*Email:* ${data.email}
*Cidade:* ${data.city}-${data.state}
*Concessionária:* ${data.distributorName}
*Valor Conta:* R$ ${data.billValue}
*Economia Est:* R$ ${data.monthlySavings.toFixed(2)}/mês

_Dados completos registrados no NocoDB._
  `.trim();

  const evolutionPayload = {
    number: "553399991234",
    text: messageText,
    delay: 1200,
    linkPreview: true,
    mentionsEveryOne: false
  };

  // 1. Send to NocoDB
  try {
    await fetch('https://nocodb.b2wenergiasolar.com.br/api/v2/tables/myku58ztvw0ezml/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': '1-2NYxm52Vslo7fyK2bUSbuNeSI9Z4FoCRyzuESZ'
      },
      body: JSON.stringify(nocodbPayload)
    });
  } catch (error) {
    console.error("Erro ao registrar no NocoDB:", error);
    // Continuing to notification even if NocoDB fails/warns
  }

  // 2. Send to Evolution API
  await fetch('https://evolutionv2.b2wenergiasolar.com.br/message/sendText/B2W Energia por Assinatura - 31995367744', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'E47D2B72F30D-4567-A8EF-D6B524E2B8D2'
    },
    body: JSON.stringify(evolutionPayload)
  });
};
