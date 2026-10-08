
export interface DistributorProfile {
  name: string;
  uf: string;
  tariff: number;
  discount: number;
  minMono: number; // Tarifa Min. Mono -30 kwh + CIP
  minBi: number;   // Tarifa Min. Bifasico - 50 Kwh + CIP
  minTri: number;  // Tarifa Min. Trifásico 100 Kwh + CIP
}

// Default profiles for major distributors based on the provided data
// Values taken from the CSV rows provided
const PROFILES: Record<string, DistributorProfile> = {
  'Neoenergia Cosern': { name: 'Neoenergia Cosern', uf: 'RN', tariff: 0.98, discount: 0.15, minMono: 32.93, minBi: 54.88, minTri: 109.76 },
  'Energisa MT':       { name: 'Energisa MT',       uf: 'MT', tariff: 1.07, discount: 0.15, minMono: 35.79, minBi: 59.65, minTri: 119.30 },
  'Energisa MS':       { name: 'Energisa MS',       uf: 'MS', tariff: 1.10, discount: 0.15, minMono: 36.88, minBi: 61.47, minTri: 122.93 },
  'Copel-Dis':         { name: 'Copel',             uf: 'PR', tariff: 0.79, discount: 0.15, minMono: 26.46, minBi: 44.10, minTri: 88.20 },
  'Cemig-D':           { name: 'CEMIG',             uf: 'MG', tariff: 1.07, discount: 0.15, minMono: 36.06, minBi: 60.10, minTri: 120.20 }, // Discount varies, using conservative avg from prompt (15-30%)
  'Enel RJ':           { name: 'Enel RJ',           uf: 'RJ', tariff: 1.16, discount: 0.15, minMono: 38.87, minBi: 64.78, minTri: 129.55 },
  'Light':             { name: 'Light',             uf: 'RJ', tariff: 1.05, discount: 0.15, minMono: 35.00, minBi: 58.00, minTri: 116.00 }, // Estimated defaults if missing in snippet
  'CPFL Paulista':     { name: 'CPFL Paulista',     uf: 'SP', tariff: 0.84, discount: 0.15, minMono: 28.37, minBi: 47.29, minTri: 94.57 },
  'Neoenergia Elektro':{ name: 'Neoenergia Elektro',uf: 'SP', tariff: 0.89, discount: 0.15, minMono: 29.86, minBi: 49.77, minTri: 99.53 },
  'Enel SP':           { name: 'Enel SP',           uf: 'SP', tariff: 0.80, discount: 0.15, minMono: 26.72, minBi: 44.54, minTri: 89.07 },
  'EDP SP':            { name: 'EDP SP',            uf: 'SP', tariff: 0.85, discount: 0.15, minMono: 28.47, minBi: 47.45, minTri: 94.90 },
  'Equatorial GO':     { name: 'Equatorial GO',     uf: 'GO', tariff: 0.92, discount: 0.15, minMono: 30.00, minBi: 50.00, minTri: 100.00 },
  'Chesp':             { name: 'Chesp',             uf: 'GO', tariff: 0.85, discount: 0.15, minMono: 28.46, minBi: 47.43, minTri: 94.86 },
  'Energisa Sul-Sudeste': { name: 'Energisa Sul-Sudeste', uf: 'SP', tariff: 0.88, discount: 0.15, minMono: 29.50, minBi: 49.00, minTri: 98.00 },
  'CPFL Piratininga':  { name: 'CPFL Piratininga',  uf: 'SP', tariff: 0.87, discount: 0.15, minMono: 29.35, minBi: 48.91, minTri: 97.82 },
  'CPFL Santa Cruz':   { name: 'CPFL Santa Cruz',   uf: 'SP', tariff: 0.86, discount: 0.15, minMono: 28.93, minBi: 48.21, minTri: 96.42 },
  'RGE':               { name: 'RGE',               uf: 'RS', tariff: 0.90, discount: 0.15, minMono: 30.24, minBi: 50.40, minTri: 100.80 },
  'CEEE Equatorial':   { name: 'CEEE Equatorial',   uf: 'RS', tariff: 0.95, discount: 0.15, minMono: 31.00, minBi: 52.00, minTri: 104.00 },
  'Energisa PB':       { name: 'Energisa PB',       uf: 'PB', tariff: 0.74, discount: 0.15, minMono: 24.71, minBi: 41.18, minTri: 82.36 },
};

// Map of Specific Cities (IBGE Code) -> Distributor Key
// Used for states with multiple distributors (SP, RJ, MG, etc.)
const CITY_EXCEPTIONS: Record<string, string> = {
  // RJ
  '3304557': 'Light', '3300456': 'Light', '3303500': 'Light', '3306305': 'Light', '3300407': 'Light',
  '3301702': 'Enel RJ', '3304904': 'Enel RJ', '3303302': 'Enel RJ',
  // SP (Sample of major cities)
  '3550308': 'Enel SP', // São Paulo
  '3509502': 'CPFL Paulista', // Campinas
  '3543402': 'CPFL Paulista', // Ribeirão Preto
  '3548708': 'Enel SP', // São Bernardo
  '3518800': 'EDP SP', // Guarulhos
  '3549904': 'EDP SP', // SJ Campos
  '3552205': 'CPFL Piratininga', // Sorocaba
  '3548500': 'Neoenergia Elektro', // Santos
  '3526902': 'Neoenergia Elektro', // Limeira
  // MG (Sample)
  '3106200': 'Cemig-D', // Belo Horizonte
  '3170206': 'Cemig-D', // Uberlândia
};

// Default Distributor by State (Fallback)
const STATE_DEFAULTS: Record<string, string> = {
  'RN': 'Neoenergia Cosern',
  'MT': 'Energisa MT',
  'MS': 'Energisa MS',
  'PR': 'Copel-Dis',
  'GO': 'Equatorial GO',
  'MG': 'Cemig-D',
  'RJ': 'Enel RJ',
  'SP': 'CPFL Paulista',
  'PB': 'Energisa PB',
  'RS': 'RGE',
  'SC': 'Celesc-Dis', // Assumed from context
  'TO': 'Energisa TO', // Assumed
};

export const getDistributorData = (ibge: string, uf: string): DistributorProfile | null => {
  // 1. Try exact city match
  let key = CITY_EXCEPTIONS[ibge];
  
  // 2. If not found, use state default
  if (!key) {
    key = STATE_DEFAULTS[uf];
  }

  // 3. Special Logic for specific known prefixes/ranges if needed could go here
  
  if (key && PROFILES[key]) {
    return PROFILES[key];
  }

  return null;
};
