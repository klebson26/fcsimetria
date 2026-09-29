import {
  Cidade,
  PontoTuristico,
  PaulistaContent,
  MercadaoProduto,
  LiberdadeContent,
  PratoCulinaria,
  ItemArtesanato,
  ItemCultura,
  EventoHistorico,
  CuriosidadeVoceSabia,
  PerguntaQuiz,
  MenuItem,
  Banner,
  SecaoSite,
  ConfigAparencia,
  ConfigIdentidade,
  ConfigModoFeira,
  AdminUser,
  LogAlteracao,
  MediaItem,
  Regiao
} from '../types/database';

import {
  INITIAL_REGIOES,
  INITIAL_CIDADES,
  INITIAL_PONTOS_TURISTICOS,
  INITIAL_PAULISTA,
  INITIAL_MERCADAO,
  INITIAL_LIBERDADE,
  INITIAL_CULINARIA,
  INITIAL_ARTESANATO,
  INITIAL_CULTURA,
  INITIAL_HISTORIA,
  INITIAL_CURIOSIDADES,
  INITIAL_QUIZ,
  INITIAL_MENU,
  INITIAL_BANNERS,
  INITIAL_SECOES,
  INITIAL_APARENCIA,
  INITIAL_IDENTIDADE,
  INITIAL_MODO_FEIRA,
  INITIAL_ADMINS,
  INITIAL_LOGS,
  INITIAL_MEDIA
} from '../data/initialData';

const KEYS = {
  REGIOES: 'simetria_sp_regioes',
  CIDADES: 'simetria_sp_cidades',
  PONTOS: 'simetria_sp_pontos',
  PAULISTA: 'simetria_sp_paulista',
  MERCADAO: 'simetria_sp_mercadao',
  LIBERDADE: 'simetria_sp_liberdade',
  CULINARIA: 'simetria_sp_culinaria',
  ARTESANATO: 'simetria_sp_artesanato',
  CULTURA: 'simetria_sp_cultura',
  HISTORIA: 'simetria_sp_historia',
  CURIOSIDADES: 'simetria_sp_curiosidades',
  QUIZ: 'simetria_sp_quiz',
  MENU: 'simetria_sp_menu',
  BANNERS: 'simetria_sp_banners',
  SECOES: 'simetria_sp_secoes',
  APARENCIA: 'simetria_sp_aparencia',
  IDENTIDADE: 'simetria_sp_identidade',
  MODO_FEIRA: 'simetria_sp_modo_feira',
  ADMINS: 'simetria_sp_admins',
  LOGS: 'simetria_sp_logs',
  MEDIA: 'simetria_sp_media',
  AUTH_SESSION: 'simetria_sp_auth_session'
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeStorage(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifySubscribers() {
  listeners.forEach((l) => l());
}

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    if (data.includes('/src/assets/images/')) {
      const sanitized = data.replaceAll('/src/assets/images/', '/images/');
      localStorage.setItem(key, sanitized);
      return JSON.parse(sanitized) as T;
    }
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifySubscribers();
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Initializer
export function initStorage() {
  if (!localStorage.getItem(KEYS.CIDADES)) {
    localStorage.setItem(KEYS.REGIOES, JSON.stringify(INITIAL_REGIOES));
    localStorage.setItem(KEYS.CIDADES, JSON.stringify(INITIAL_CIDADES));
    localStorage.setItem(KEYS.PONTOS, JSON.stringify(INITIAL_PONTOS_TURISTICOS));
    localStorage.setItem(KEYS.PAULISTA, JSON.stringify(INITIAL_PAULISTA));
    localStorage.setItem(KEYS.MERCADAO, JSON.stringify(INITIAL_MERCADAO));
    localStorage.setItem(KEYS.LIBERDADE, JSON.stringify(INITIAL_LIBERDADE));
    localStorage.setItem(KEYS.CULINARIA, JSON.stringify(INITIAL_CULINARIA));
    localStorage.setItem(KEYS.ARTESANATO, JSON.stringify(INITIAL_ARTESANATO));
    localStorage.setItem(KEYS.CULTURA, JSON.stringify(INITIAL_CULTURA));
    localStorage.setItem(KEYS.HISTORIA, JSON.stringify(INITIAL_HISTORIA));
    localStorage.setItem(KEYS.CURIOSIDADES, JSON.stringify(INITIAL_CURIOSIDADES));
    localStorage.setItem(KEYS.QUIZ, JSON.stringify(INITIAL_QUIZ));
    localStorage.setItem(KEYS.MENU, JSON.stringify(INITIAL_MENU));
    localStorage.setItem(KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
    localStorage.setItem(KEYS.SECOES, JSON.stringify(INITIAL_SECOES));
    localStorage.setItem(KEYS.APARENCIA, JSON.stringify(INITIAL_APARENCIA));
    localStorage.setItem(KEYS.IDENTIDADE, JSON.stringify(INITIAL_IDENTIDADE));
    localStorage.setItem(KEYS.MODO_FEIRA, JSON.stringify(INITIAL_MODO_FEIRA));
    localStorage.setItem(KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
    localStorage.setItem(KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
    localStorage.setItem(KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA));
  }
}

// Log Action Helper
export function logAuditAction(acao: string, conteudoAfetado: string, tipoEntidade: string) {
  const session = getAuthSession();
  const logs = getItem<LogAlteracao[]>(KEYS.LOGS, INITIAL_LOGS);
  const newLog: LogAlteracao = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    usuarioEmail: session ? session.email : 'admin@simetria.edu.br',
    usuarioNome: session ? session.nome : 'Administrador',
    acao,
    conteudoAfetado,
    tipoEntidade,
    dataHora: new Date().toISOString()
  };
  setItem(KEYS.LOGS, [newLog, ...logs]);
}

// AUTH SERVICES
export function getAuthSession(): AdminUser | null {
  return getItem<AdminUser | null>(KEYS.AUTH_SESSION, null);
}

export function setAuthSession(user: AdminUser | null) {
  setItem(KEYS.AUTH_SESSION, user);
}

export function getAdmins(): AdminUser[] {
  return getItem<AdminUser[]>(KEYS.ADMINS, INITIAL_ADMINS);
}

export function saveAdmin(user: AdminUser) {
  const admins = getAdmins();
  const index = admins.findIndex((a) => a.id === user.id);
  let updated: AdminUser[];
  if (index >= 0) {
    updated = [...admins];
    updated[index] = user;
    logAuditAction(`Editou perfil/permissões do usuário ${user.email}`, user.nome, 'Usuário');
  } else {
    updated = [user, ...admins];
    logAuditAction(`Cadastrou novo usuário administrador ${user.email}`, user.nome, 'Usuário');
  }
  setItem(KEYS.ADMINS, updated);
}

export function deleteAdmin(id: string) {
  const admins = getAdmins();
  const target = admins.find((a) => a.id === id);
  const updated = admins.filter((a) => a.id !== id);
  setItem(KEYS.ADMINS, updated);
  if (target) {
    logAuditAction(`Excluiu o usuário administrador ${target.email}`, target.nome, 'Usuário');
  }
}

// GETTERS
export function getRegioes(): Regiao[] {
  return getItem<Regiao[]>(KEYS.REGIOES, INITIAL_REGIOES);
}

export function getCidades(includeLixeira = false): Cidade[] {
  const items = getItem<Cidade[]>(KEYS.CIDADES, INITIAL_CIDADES);
  return includeLixeira ? items : items.filter((i) => !i.inLixeira);
}

export function getPontosTuristicos(includeLixeira = false): PontoTuristico[] {
  const items = getItem<PontoTuristico[]>(KEYS.PONTOS, INITIAL_PONTOS_TURISTICOS);
  return includeLixeira ? items : items.filter((i) => !i.inLixeira);
}

export function getPaulistaContent(): PaulistaContent {
  return getItem<PaulistaContent>(KEYS.PAULISTA, INITIAL_PAULISTA);
}

export function getMercadaoProdutos(includeLixeira = false): MercadaoProduto[] {
  const items = getItem<MercadaoProduto[]>(KEYS.MERCADAO, INITIAL_MERCADAO);
  return includeLixeira ? items : items.filter((i) => !i.inLixeira);
}

export function getLiberdadeContent(): LiberdadeContent {
  return getItem<LiberdadeContent>(KEYS.LIBERDADE, INITIAL_LIBERDADE);
}

export function getCulinaria(includeLixeira = false): PratoCulinaria[] {
  const items = getItem<PratoCulinaria[]>(KEYS.CULINARIA, INITIAL_CULINARIA);
  return includeLixeira ? items : items.filter((i) => !i.inLixeira);
}

export function getArtesanato(includeLixeira = false): ItemArtesanato[] {
  const items = getItem<ItemArtesanato[]>(KEYS.ARTESANATO, INITIAL_ARTESANATO);
  return includeLixeira ? items : items.filter((i) => !i.inLixeira);
}

export function getCultura(includeLixeira = false): ItemCultura[] {
  const items = getItem<ItemCultura[]>(KEYS.CULTURA, INITIAL_CULTURA);
  return includeLixeira ? items : items.filter((i) => !i.inLixeira);
}

export function getHistoria(includeLixeira = false): EventoHistorico[] {
  const items = getItem<EventoHistorico[]>(KEYS.HISTORIA, INITIAL_HISTORIA);
  return includeLixeira ? items : items.filter((i) => !i.inLixeira);
}

export function getCuriosidades(includeLixeira = false): CuriosidadeVoceSabia[] {
  const items = getItem<CuriosidadeVoceSabia[]>(KEYS.CURIOSIDADES, INITIAL_CURIOSIDADES);
  return includeLixeira ? items : items.filter((i) => !i.inLixeira);
}

export function getQuiz(): PerguntaQuiz[] {
  return getItem<PerguntaQuiz[]>(KEYS.QUIZ, INITIAL_QUIZ);
}

export function getMenu(): MenuItem[] {
  return getItem<MenuItem[]>(KEYS.MENU, INITIAL_MENU);
}

export function getBanners(): Banner[] {
  return getItem<Banner[]>(KEYS.BANNERS, INITIAL_BANNERS);
}

export function getSecoes(): SecaoSite[] {
  return getItem<SecaoSite[]>(KEYS.SECOES, INITIAL_SECOES);
}

export function getAparencia(): ConfigAparencia {
  return getItem<ConfigAparencia>(KEYS.APARENCIA, INITIAL_APARENCIA);
}

export function getIdentidade(): ConfigIdentidade {
  const current = getItem<ConfigIdentidade>(KEYS.IDENTIDADE, INITIAL_IDENTIDADE);
  if (current.logoUrl && (current.logoUrl.includes('simetria_logo_badge_1790701719844') || !current.logoUrl.includes('logo-simetria'))) {
    current.logoUrl = '/logo-simetria.jpg';
    current.logoCarregamentoUrl = '/logo-simetria.jpg';
    current.faviconUrl = '/logo-simetria.jpg';
    setItem(KEYS.IDENTIDADE, current);
  }
  return current;
}

export function getModoFeira(): ConfigModoFeira {
  return getItem<ConfigModoFeira>(KEYS.MODO_FEIRA, INITIAL_MODO_FEIRA);
}

export function getLogs(): LogAlteracao[] {
  return getItem<LogAlteracao[]>(KEYS.LOGS, INITIAL_LOGS);
}

export function getMedia(): MediaItem[] {
  return getItem<MediaItem[]>(KEYS.MEDIA, INITIAL_MEDIA);
}

// GENERIC CRUD SAVE (Soft Create / Update)
export function saveEntity<T extends { id: string; titulo?: string; status?: any; dataCriacao?: string; dataAtualizacao?: string; inLixeira?: boolean }>(
  storageKey: string,
  entity: T,
  entityTypeLabel: string
) {
  const list = getItem<T[]>(storageKey, []);
  const now = new Date().toISOString();
  const index = list.findIndex((item) => item.id === entity.id);

  let updatedList: T[];
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = {
      ...entity,
      dataAtualizacao: now
    };
    logAuditAction(`Atualizou ${entityTypeLabel.toLowerCase()}`, entity.titulo || entity.id, entityTypeLabel);
  } else {
    const newItem = {
      ...entity,
      dataCriacao: entity.dataCriacao || now,
      dataAtualizacao: now,
      inLixeira: false
    };
    updatedList = [newItem, ...list];
    logAuditAction(`Criou novo(a) ${entityTypeLabel.toLowerCase()}`, entity.titulo || entity.id, entityTypeLabel);
  }

  setItem(storageKey, updatedList);
}

// SOFT DELETE TO TRASH (Lixeira)
export function moveToTrash(storageKey: string, id: string, entityTypeLabel: string) {
  const list = getItem<any[]>(storageKey, []);
  const updated = list.map((item) => {
    if (item.id === id) {
      logAuditAction(`Moveu para a lixeira`, item.titulo || item.pergunta || item.nome || id, entityTypeLabel);
      return { ...item, inLixeira: true, dataAtualizacao: new Date().toISOString() };
    }
    return item;
  });
  setItem(storageKey, updated);
}

// RESTORE FROM TRASH
export function restoreFromTrash(storageKey: string, id: string, entityTypeLabel: string) {
  const list = getItem<any[]>(storageKey, []);
  const updated = list.map((item) => {
    if (item.id === id) {
      logAuditAction(`Restaurou da lixeira`, item.titulo || item.pergunta || item.nome || id, entityTypeLabel);
      return { ...item, inLixeira: false, dataAtualizacao: new Date().toISOString() };
    }
    return item;
  });
  setItem(storageKey, updated);
}

// PERMANENT DELETE
export function permanentDelete(storageKey: string, id: string, entityTypeLabel: string) {
  const list = getItem<any[]>(storageKey, []);
  const itemToDelete = list.find((i) => i.id === id);
  const updated = list.filter((item) => item.id !== id);
  if (itemToDelete) {
    logAuditAction(`Excluiu permanentemente`, itemToDelete.titulo || itemToDelete.pergunta || itemToDelete.nome || id, entityTypeLabel);
  }
  setItem(storageKey, updated);
}

// REORDER ITEMS
export function reorderEntities<T extends { id: string; ordem?: number }>(
  storageKey: string,
  itemsInOrder: T[]
) {
  const reordered = itemsInOrder.map((item, index) => ({
    ...item,
    ordem: index + 1
  }));
  setItem(storageKey, reordered);
  logAuditAction('Alterou a ordem dos elementos', `${reordered.length} itens`, 'Organização');
}

// SPECIFIC SAVERS
export function savePaulista(content: PaulistaContent) {
  setItem(KEYS.PAULISTA, content);
  logAuditAction('Atualizou o conteúdo especial da Avenida Paulista', content.titulo, 'Av. Paulista');
}

export function saveLiberdade(content: LiberdadeContent) {
  setItem(KEYS.LIBERDADE, content);
  logAuditAction('Atualizou o conteúdo do Bairro da Liberdade', content.titulo, 'Liberdade');
}

export function saveAparencia(config: ConfigAparencia) {
  setItem(KEYS.APARENCIA, config);
  logAuditAction('Atualizou o tema e aparência do site', config.tema, 'Aparência');
}

export function saveIdentidade(config: ConfigIdentidade) {
  setItem(KEYS.IDENTIDADE, config);
  logAuditAction('Atualizou os dados de identidade da feira', config.nomeFeira, 'Identidade');
}

export function saveModoFeira(config: ConfigModoFeira) {
  setItem(KEYS.MODO_FEIRA, config);
  logAuditAction('Atualizou as configurações do Modo Feira / Apresentação', config.ativo ? 'Ativo' : 'Desativado', 'Modo Feira');
}

export function saveMediaItem(media: MediaItem) {
  const list = getMedia();
  setItem(KEYS.MEDIA, [media, ...list]);
  logAuditAction('Upload/Adicionou nova imagem na galeria', media.nome, 'Mídia');
}

export function deleteMediaItem(id: string) {
  const list = getMedia();
  const target = list.find((m) => m.id === id);
  setItem(KEYS.MEDIA, list.filter((m) => m.id !== id));
  if (target) {
    logAuditAction('Excluiu imagem da biblioteca de mídia', target.nome, 'Mídia');
  }
}

// Helper to get ALL items in trash across all entity types for the Lixeira view!
export function getAllTrashItems(): { id: string; titulo: string; tipo: string; key: string; dataAtualizacao: string }[] {
  const trash: { id: string; titulo: string; tipo: string; key: string; dataAtualizacao: string }[] = [];

  const checkKey = (key: string, label: string) => {
    const list = getItem<any[]>(key, []);
    list.forEach((item) => {
      if (item.inLixeira) {
        trash.push({
          id: item.id,
          titulo: item.titulo || item.pergunta || item.nome || item.label || 'Sem título',
          tipo: label,
          key: key,
          dataAtualizacao: item.dataAtualizacao || new Date().toISOString()
        });
      }
    });
  };

  checkKey(KEYS.CIDADES, 'Cidade');
  checkKey(KEYS.PONTOS, 'Ponto Turístico');
  checkKey(KEYS.MERCADAO, 'Produto Mercadão');
  checkKey(KEYS.CULINARIA, 'Prato Culinária');
  checkKey(KEYS.ARTESANATO, 'Item Artesanato');
  checkKey(KEYS.CULTURA, 'Item Cultura');
  checkKey(KEYS.HISTORIA, 'Evento Histórico');
  checkKey(KEYS.CURIOSIDADES, 'Curiosidade');

  return trash.sort((a, b) => new Date(b.dataAtualizacao).getTime() - new Date(a.dataAtualizacao).getTime());
}

export { KEYS };
