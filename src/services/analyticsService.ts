export interface SecaoAcessoMetrica {
  id: 'paulista' | 'mercadao' | 'liberdade' | 'culinaria' | 'quiz' | 'mural';
  nome: string;
  tag?: string;
  corHex: string;
  corSecundaria: string;
  icone: string;
  totalAcessos: number;
  visitantesUnicos: number;
  tempoMedioMinutos: number;
  taxaEngajamento: number;
  interacoes: number;
  destaquesVisitados: string[];
  historicoHoras: { hora: string; acessos: number }[];
}

export interface MetricasGerais {
  totalVisitas: number;
  visitantesHoje: number;
  secoes: SecaoAcessoMetrica[];
  dispositivos: { tipo: string; percentual: number; quantidade: number; cor: string }[];
  historicoDias: { dia: string; paulista: number; mercadao: number; liberdade: number; total: number }[];
  ultimaAtualizacao: string;
}

const STORAGE_KEY_METRICAS = 'simetria_analytics_metricas_v2';

const INITIAL_METRICAS: MetricasGerais = {
  totalVisitas: 7420,
  visitantesHoje: 2890,
  secoes: [
    {
      id: 'paulista',
      nome: 'Avenida Paulista',
      corHex: '#f43f5e', // rose-500
      corSecundaria: '#fb7185',
      icone: '🏛️',
      totalAcessos: 2780,
      visitantesUnicos: 1840,
      tempoMedioMinutos: 4.8,
      taxaEngajamento: 84,
      interacoes: 920,
      destaquesVisitados: ['Maquete do MASP', 'Ciclovia Virtual', 'História dos Barões do Café', 'Tour 360º'],
      historicoHoras: [
        { hora: '08h', acessos: 85 },
        { hora: '09h', acessos: 190 },
        { hora: '10h', acessos: 340 },
        { hora: '11h', acessos: 410 },
        { hora: '12h', acessos: 260 },
        { hora: '13h', acessos: 310 },
        { hora: '14h', acessos: 480 },
        { hora: '15h', acessos: 520 },
        { hora: '16h', acessos: 410 },
        { hora: '17h', acessos: 290 },
        { hora: '18h', acessos: 180 }
      ]
    },
    {
      id: 'mercadao',
      nome: 'Mercadão Municipal',
      corHex: '#f59e0b', // amber-500
      corSecundaria: '#fbbf24',
      icone: '🥪',
      totalAcessos: 2410,
      visitantesUnicos: 1620,
      tempoMedioMinutos: 4.2,
      taxaEngajamento: 79,
      interacoes: 780,
      destaquesVisitados: ['Vitrais de Conrado Sorgenicht', 'Sanduíche de Mortadela', 'Frutas Exóticas', 'História do Cantareira'],
      historicoHoras: [
        { hora: '08h', acessos: 60 },
        { hora: '09h', acessos: 140 },
        { hora: '10h', acessos: 280 },
        { hora: '11h', acessos: 460 },
        { hora: '12h', acessos: 510 },
        { hora: '13h', acessos: 440 },
        { hora: '14h', acessos: 390 },
        { hora: '15h', acessos: 350 },
        { hora: '16h', acessos: 270 },
        { hora: '17h', acessos: 210 },
        { hora: '18h', acessos: 120 }
      ]
    },
    {
      id: 'liberdade',
      nome: 'Bairro da Liberdade',
      corHex: '#ec4899', // pink-500
      corSecundaria: '#f472b6',
      icone: '🏮',
      totalAcessos: 2230,
      visitantesUnicos: 1530,
      tempoMedioMinutos: 5.1,
      taxaEngajamento: 88,
      interacoes: 890,
      destaquesVisitados: ['Torii Vermelho', 'Lanternas Suzuran', 'Oficina de Origami', 'Jardim Oriental'],
      historicoHoras: [
        { hora: '08h', acessos: 50 },
        { hora: '09h', acessos: 160 },
        { hora: '10h', acessos: 290 },
        { hora: '11h', acessos: 360 },
        { hora: '12h', acessos: 320 },
        { hora: '13h', acessos: 380 },
        { hora: '14h', acessos: 450 },
        { hora: '15h', acessos: 490 },
        { hora: '16h', acessos: 380 },
        { hora: '17h', acessos: 250 },
        { hora: '18h', acessos: 140 }
      ]
    }
  ],
  dispositivos: [
    { tipo: 'Smartphones (Mobile)', percentual: 72, quantidade: 5342, cor: '#3b82f6' },
    { tipo: 'Computadores (Desktop)', percentual: 21, quantidade: 1558, cor: '#10b981' },
    { tipo: 'Tablets / Totens da Feira', percentual: 7, quantidade: 520, cor: '#8b5cf6' }
  ],
  historicoDias: [
    { dia: 'Segunda', paulista: 410, mercadao: 320, liberdade: 290, total: 1020 },
    { dia: 'Terça', paulista: 480, mercadao: 390, liberdade: 340, total: 1210 },
    { dia: 'Quarta', paulista: 520, mercadao: 430, liberdade: 410, total: 1360 },
    { dia: 'Quinta', paulista: 610, mercadao: 540, liberdade: 510, total: 1660 },
    { dia: 'Hoje (Feira)', paulista: 760, mercadao: 730, liberdade: 680, total: 2170 }
  ],
  ultimaAtualizacao: new Date().toISOString()
};

export const getMetricas = (): MetricasGerais => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_METRICAS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_METRICAS, JSON.stringify(INITIAL_METRICAS));
      return INITIAL_METRICAS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_METRICAS;
  }
};

export const recordSectionVisit = (secaoId: string) => {
  try {
    const current = getMetricas();
    const secao = current.secoes.find((s) => s.id === secaoId);
    if (secao) {
      secao.totalAcessos += 1;
      secao.visitantesUnicos += 1;
      current.totalVisitas += 1;
      current.visitantesHoje += 1;

      // Update current hour
      const now = new Date();
      const horaStr = `${String(now.getHours()).padStart(2, '0')}h`;
      const horaItem = secao.historicoHoras.find((h) => h.hora === horaStr);
      if (horaItem) {
        horaItem.acessos += 1;
      }

      current.ultimaAtualizacao = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_METRICAS, JSON.stringify(current));

      // Dispatch custom storage event for live updates
      window.dispatchEvent(new Event('storage'));
    }
  } catch (err) {
    console.warn('Erro ao registrar visita:', err);
  }
};

export const resetMetricasToDefault = () => {
  localStorage.setItem(STORAGE_KEY_METRICAS, JSON.stringify(INITIAL_METRICAS));
  window.dispatchEvent(new Event('storage'));
};
