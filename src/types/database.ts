export type ContentStatus = 'PUBLICADO' | 'RASCUNHO' | 'DESATIVADO';
export type UserRole = 'SUPER_ADMIN' | 'EDITOR';
export type ThemeStyle = 'FUTURISTA' | 'CULTURAL' | 'MODERNO' | 'MINIMALISTA';

export interface BaseEntity {
  id: string;
  titulo: string;
  descricao: string;
  status: ContentStatus;
  ordem: number;
  dataCriacao: string;
  dataAtualizacao: string;
  inLixeira?: boolean;
}

export interface Regiao {
  id: string;
  nome: string;
  descricao: string;
  corHex: string;
  pathSvg?: string;
}

export interface Cidade extends BaseEntity {
  regiaoId: string;
  regiaoNome: string;
  imagemPrincipal: string;
  galeria: string[];
  historia: string;
  cultura: string;
  gastronomia: string;
  turismo: string;
  curiosidades: string[];
  populacao?: string;
  distanciaCapital?: string;
  posicaoMapa?: { x: number; y: number }; // Percentage positions on SP SVG Map (0-100)
}

export interface PontoTuristico extends BaseEntity {
  cidadeId: string;
  cidadeNome: string;
  regiaoNome: string;
  categoria: 'História' | 'Cultura' | 'Natureza' | 'Turismo' | 'Arquitetura' | 'Lazer';
  imagemPrincipal: string;
  galeria: string[];
  historia: string;
  curiosidade: string;
  endereco?: string;
  siteExterno?: string;
  latitude?: number;
  longitude?: number;
  posicaoMapa?: { x: number; y: number };
}

export interface PaulistaMilestone {
  id: string;
  ano: number;
  titulo: string;
  descricao: string;
  imagem?: string;
  ordem: number;
}

export interface PaulistaContent extends BaseEntity {
  subtitulo: string;
  imagemPrincipal: string;
  galeria: string[];
  videoUrl?: string;
  curiosidades: string[];
  linhaDoTempo: PaulistaMilestone[];
  pontosDeInteresse: string[];
}

export interface MercadaoHeader extends BaseEntity {
  subtitulo: string;
  imagemPrincipal: string;
  historia: string;
  iguarias: string[];
}

export interface MercadaoProduto extends BaseEntity {
  categoria: 'Frutas' | 'Temperos' | 'Queijos' | 'Doces' | 'Carnes' | 'Bebidas' | 'Produtos regionais' | 'Lanches';
  imagem: string;
  curiosidade: string;
  origem: string;
  utilizacao: string;
  galeria?: string[];
}

export interface LiberdadeContent extends BaseEntity {
  subtitulo: string;
  imagemPrincipal: string;
  historia: string;
  cultura: string;
  gastronomia: string;
  arquitetura: string;
  festivais: string;
  curiosidades: string[];
  galeria: string[];
}

export interface PratoCulinaria extends BaseEntity {
  imagemPrincipal: string;
  galeria: string[];
  historia: string;
  ingredientes: string[];
  modoApresentacao: string;
  origemCultural: string;
  cidadeOuRegiao: string;
  curiosidade: string;
  categoria: 'Comida tradicional' | 'Comida de rua' | 'Doces' | 'Lanches' | 'Culinária caipira' | 'Culinária caiçara' | 'Influências culturais';
}

export interface ItemArtesanato extends BaseEntity {
  imagem: string;
  galeria: string[];
  cidade: string;
  regiao: string;
  material: string;
  historia: string;
  curiosidade: string;
  categoria: 'Cerâmica' | 'Madeira' | 'Tecido' | 'Bordado' | 'Cestaria' | 'Escultura' | 'Arte popular' | 'Artesanato indígena';
}

export interface ItemCultura extends BaseEntity {
  imagem: string;
  galeria: string[];
  cidadeOuRegiao: string;
  categoria: 'música' | 'dança' | 'festas' | 'tradições' | 'literatura' | 'cinema' | 'teatro' | 'arte urbana' | 'cultura caipira' | 'cultura caiçara' | 'manifestações culturais';
  destaque: string;
}

export interface EventoHistorico extends BaseEntity {
  periodo: string;
  dataOuAno: string;
  imagem: string;
  galeria?: string[];
  curiosidade?: string;
}

export interface CuriosidadeVoceSabia extends BaseEntity {
  pergunta: string;
  resposta: string;
  imagem?: string;
  categoria: string;
  cidadeOuRegiao: string;
}

export interface PerguntaQuiz {
  id: string;
  pergunta: string;
  imagem?: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  respostaCorreta: 'A' | 'B' | 'C' | 'D';
  explicacao: string;
  categoria: 'História' | 'Cultura' | 'Gastronomia' | 'Turismo' | 'Cidades' | 'Natureza';
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  status: ContentStatus;
  ordem: number;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icone: string;
  ordem: number;
  status: ContentStatus;
  submenu?: { id: string; label: string; path: string }[];
}

export interface Banner {
  id: string;
  titulo: string;
  subtitulo: string;
  imagem: string;
  botaoTexto: string;
  botaoLink: string;
  ordem: number;
  status: ContentStatus;
}

export interface SecaoSite {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  imagem?: string;
  icone: string;
  ordem: number;
  status: ContentStatus;
  cor: string;
  layout: 'GRID' | 'CAROUSEL' | 'LISTA' | 'DESTAQUE_HERO';
  chaveSecao: string; // e.g. 'cidades', 'paulista', 'mercadao', 'liberdade', 'culinaria', 'artesanato', 'cultura', 'historia', 'curiosidades', 'quiz'
}

export interface ConfigAparencia {
  modoTema?: 'escuro' | 'claro';
  tema: ThemeStyle;
  corPrimaria: string;
  corSecundaria: string;
  corFundo: string;
  corBotoes: string;
  tipografia: 'Plus Jakarta Sans' | 'Cinzel' | 'Cormorant Garamond' | 'Syne';
  tamanhoFonte: 'Padrão' | 'Grande' | 'Compacto';
  estiloBorda: 'Suave' | 'Marcada' | 'Reta';
  estiloCard: 'Glassmorphism' | 'Sólido' | 'Editorial Paper' | 'Neon Border';
  intensidadeEfeitos: 'Baixa' | 'Média' | 'Alta';
  animacoesAtivas: boolean;
}

export interface ConfigIdentidade {
  nomeColegio: string;
  logoUrl: string;
  logoCarregamentoUrl: string;
  faviconUrl: string;
  nomeFeira: string;
  anoFeira: string;
  tituloPrincipal: string;
  subtituloPrincipal: string;
  textoInstitucional: string;
}

export interface SlideCustomizadoModoFeira {
  id: string;
  categoria: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  imagem: string;
  badge: string;
  ativo: boolean;
  ordem: number;
}

export interface ConfigModoFeira {
  ativo: boolean;
  tempoTransicaoSegundos: number;
  secoesExibidas: string[];
  slidesCustomizados?: SlideCustomizadoModoFeira[];
  velocidadeAnimacoes: 'Lenta' | 'Normal' | 'Rápida';
  telaCheiaAuto: boolean;
  autoplay: boolean;
  intervaloConteudosSegundos: number;
  efeitosSonorosAtivos: boolean;
  audioVolume: number;
}

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
  dataCriacao: string;
  ultimoAcesso?: string;
}

export interface LogAlteracao {
  id: string;
  usuarioEmail: string;
  usuarioNome: string;
  acao: string;
  conteudoAfetado: string;
  tipoEntidade: string;
  dataHora: string;
}

export interface MediaItem {
  id: string;
  nome: string;
  url: string;
  tamanhoKb: number;
  formato: 'JPG' | 'PNG' | 'WEBP' | 'SVG';
  categoria: string;
  cidadeOuRegiao?: string;
  textoAlternativo: string;
  legenda?: string;
  dataUpload: string;
}

export interface FotoMural {
  id: string;
  autorNome: string;
  turmaOuRelacao: string; // 'Visitante', 'Família', 'Estudante', 'Professor', 'Ex-Aluno'
  mensagem: string;
  fotoUrl: string;
  curtidas: number;
  dataCriacao: string;
  localFeira?: string; // 'Estande Av. Paulista', 'Mercadão', 'Bairro da Liberdade', 'Área Geral'
  cenarioFundo?: 'paulista' | 'mercadao' | 'liberdade' | 'padrao';
  destaque?: boolean;
}

