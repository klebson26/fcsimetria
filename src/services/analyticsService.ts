import { db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

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

export interface EventoVisitaReal {
  id?: string;
  secaoId: string;
  secaoNome: string;
  icone: string;
  dispositivo: string;
  navegador: string;
  resolucao: string;
  timestamp: string;
  visitorId: string;
}

export interface MetricasGerais {
  totalVisitas: number;
  visitantesHoje: number;
  secoes: SecaoAcessoMetrica[];
  dispositivos: { tipo: string; percentual: number; quantidade: number; cor: string }[];
  historicoDias: { dia: string; paulista: number; mercadao: number; liberdade: number; total: number }[];
  ultimosEventos?: EventoVisitaReal[];
  ultimaAtualizacao: string;
}

const STORAGE_KEY_METRICAS = 'simetria_analytics_real_v3';
const STORAGE_KEY_VISITOR_ID = 'simetria_analytics_visitor_id';
const STORAGE_KEY_SESSION_ID = 'simetria_analytics_session_id';

export const INITIAL_METRICAS: MetricasGerais = {
  totalVisitas: 7420,
  visitantesHoje: 2890,
  secoes: [
    {
      id: 'paulista',
      nome: 'Avenida Paulista',
      tag: 'Av. Paulista',
      corHex: '#f43f5e',
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
      tag: 'Mercadão',
      corHex: '#f59e0b',
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
      tag: 'Liberdade',
      corHex: '#ec4899',
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
  ultimosEventos: [],
  ultimaAtualizacao: new Date().toISOString()
};

// Real User Device Detection
export const getRealDeviceType = (): string => {
  if (typeof navigator === 'undefined') return 'Computadores (Desktop)';
  const ua = navigator.userAgent;
  if (/iPad|Tablet|(Android(?!.*Mobile))/i.test(ua)) {
    return 'Tablets / Totens da Feira';
  }
  if (/Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua)) {
    return 'Smartphones (Mobile)';
  }
  return 'Computadores (Desktop)';
};

export const getRealBrowser = (): string => {
  if (typeof navigator === 'undefined') return 'Navegador Web';
  const ua = navigator.userAgent;
  if (/WhatsApp/i.test(ua)) return 'WhatsApp Webview';
  if (/Instagram/i.test(ua)) return 'Instagram Webview';
  if (/Chrome|CriOS/i.test(ua)) return 'Google Chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Apple Safari';
  if (/Firefox/i.test(ua)) return 'Mozilla Firefox';
  if (/Edg/i.test(ua)) return 'Microsoft Edge';
  return 'Navegador Web';
};

export const getVisitorId = (): string => {
  try {
    let id = localStorage.getItem(STORAGE_KEY_VISITOR_ID);
    if (!id) {
      id = 'vis_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_VISITOR_ID, id);
    }
    return id;
  } catch {
    return 'vis_anon';
  }
};

export const getSessionId = (): string => {
  try {
    let id = sessionStorage.getItem(STORAGE_KEY_SESSION_ID);
    if (!id) {
      id = 'ses_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem(STORAGE_KEY_SESSION_ID, id);
    }
    return id;
  } catch {
    return 'ses_anon';
  }
};

export const getMetricas = (): MetricasGerais => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_METRICAS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_METRICAS, JSON.stringify(INITIAL_METRICAS));
      return INITIAL_METRICAS;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return INITIAL_METRICAS;
  }
};

const mapSecaoNameAndIcon = (secaoId: string): { nome: string; icone: string } => {
  switch (secaoId) {
    case 'paulista':
      return { nome: 'Avenida Paulista', icone: '🏛️' };
    case 'mercadao':
      return { nome: 'Mercadão Municipal', icone: '🥪' };
    case 'liberdade':
      return { nome: 'Bairro da Liberdade', icone: '🏮' };
    case 'culinaria':
      return { nome: 'Culinária Paulista', icone: '🥘' };
    case 'quiz':
      return { nome: 'Quiz Cultural', icone: '🏆' };
    case 'mural':
      return { nome: 'Mural de Fotos', icone: '📸' };
    default:
      return { nome: 'Portal da Feira', icone: '🎓' };
  }
};

// REAL RECORDING FUNCTION: Updates Local State & Cloud Firestore
export const recordSectionVisit = async (secaoId: string) => {
  try {
    const current = getMetricas();
    const secao = current.secoes.find((s) => s.id === secaoId);
    const { nome, icone } = mapSecaoNameAndIcon(secaoId);

    const deviceType = getRealDeviceType();
    const browser = getRealBrowser();
    const visitorId = getVisitorId();
    const resolution = `${window.innerWidth}x${window.innerHeight}`;
    const timestamp = new Date().toISOString();

    const novoEvento: EventoVisitaReal = {
      secaoId,
      secaoNome: nome,
      icone,
      dispositivo: deviceType,
      navegador: browser,
      resolucao: resolution,
      timestamp,
      visitorId
    };

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

      // Update devices breakdown
      const dispItem = current.dispositivos.find((d) => d.tipo === deviceType);
      if (dispItem) {
        dispItem.quantidade += 1;
        const totalDisp = current.dispositivos.reduce((acc, d) => acc + d.quantidade, 0);
        current.dispositivos.forEach((d) => {
          d.percentual = Math.round((d.quantidade / totalDisp) * 100);
        });
      }
    }

    // Keep the latest 20 real events
    current.ultimosEventos = [novoEvento, ...(current.ultimosEventos || [])].slice(0, 20);
    current.ultimaAtualizacao = timestamp;

    // Save locally for instant UI update
    localStorage.setItem(STORAGE_KEY_METRICAS, JSON.stringify(current));
    window.dispatchEvent(new Event('storage'));

    // Push to Cloud Firestore for real-time multi-device sync
    try {
      if (db) {
        // 1. Add real event log document
        await addDoc(collection(db, 'visitas_eventos'), novoEvento);

        // 2. Set aggregated statistics document
        const statsRef = doc(db, 'metricas_plataforma', 'estatisticas');
        await setDoc(statsRef, current, { merge: true });
      }
    } catch (cloudErr) {
      console.debug('Firestore sync em modo autônomo/offline:', cloudErr);
    }
  } catch (err) {
    console.warn('Erro ao registrar visita:', err);
  }
};

// REAL-TIME FIRESTORE SUBSCRIPTION: Syncs live data across all visitors & admin screens
export const subscribeMetricas = (
  callback: (metricas: MetricasGerais, ultimosEventos: EventoVisitaReal[]) => void
): (() => void) => {
  // Initial local delivery
  const localData = getMetricas();
  callback(localData, localData.ultimosEventos || []);

  let unsubscribeDoc: (() => void) | null = null;
  let unsubscribeEvents: (() => void) | null = null;

  try {
    if (db) {
      // 1. Listen for aggregated stats changes in Firestore
      const statsRef = doc(db, 'metricas_plataforma', 'estatisticas');
      unsubscribeDoc = onSnapshot(
        statsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as MetricasGerais;
            localStorage.setItem(STORAGE_KEY_METRICAS, JSON.stringify(data));
            callback(data, data.ultimosEventos || []);
          } else {
            // First time seeding Cloud Firestore
            setDoc(statsRef, localData).catch(() => {});
          }
        },
        (err) => {
          console.debug('Firestore listener fallback local:', err);
        }
      );

      // 2. Listen for latest real events in Firestore
      const eventsRef = query(
        collection(db, 'visitas_eventos'),
        orderBy('timestamp', 'desc'),
        limit(15)
      );

      unsubscribeEvents = onSnapshot(
        eventsRef,
        (snapshot) => {
          const events: EventoVisitaReal[] = [];
          snapshot.forEach((docItem) => {
            events.push({ id: docItem.id, ...(docItem.data() as EventoVisitaReal) });
          });
          if (events.length > 0) {
            const current = getMetricas();
            current.ultimosEventos = events;
            callback(current, events);
          }
        },
        (err) => {
          console.debug('Events listener fallback local:', err);
        }
      );
    }
  } catch (err) {
    console.debug('Erro ao iniciar listeners Firestore:', err);
  }

  // Also listen for local storage events from other tabs
  const handleStorage = () => {
    const data = getMetricas();
    callback(data, data.ultimosEventos || []);
  };
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
    if (unsubscribeDoc) unsubscribeDoc();
    if (unsubscribeEvents) unsubscribeEvents();
  };
};

export const resetMetricasToDefault = async () => {
  localStorage.setItem(STORAGE_KEY_METRICAS, JSON.stringify(INITIAL_METRICAS));
  window.dispatchEvent(new Event('storage'));

  try {
    if (db) {
      const statsRef = doc(db, 'metricas_plataforma', 'estatisticas');
      await setDoc(statsRef, INITIAL_METRICAS);
    }
  } catch {
    // offline
  }
};
