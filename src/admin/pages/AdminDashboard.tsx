import React, { useState, useEffect } from 'react';
import {
  getCidades,
  getPontosTuristicos,
  getCulinaria,
  getArtesanato,
  getCuriosidades,
  getQuiz,
  getSecoes,
  getMedia,
  getLogs,
  subscribeStorage
} from '../../services/storageService';
import {
  Building2,
  Camera,
  Utensils,
  Palette,
  HelpCircle,
  Award,
  Layers,
  Image,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateToTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToTab }) => {
  const [cidades, setCidades] = useState(getCidades());
  const [pontos, setPontos] = useState(getPontosTuristicos());
  const [culinaria, setCulinaria] = useState(getCulinaria());
  const [artesanato, setArtesanato] = useState(getArtesanato());
  const [curiosidades, setCuriosidades] = useState(getCuriosidades());
  const [quiz, setQuiz] = useState(getQuiz());
  const [secoes, setSecoes] = useState(getSecoes());
  const [media, setMedia] = useState(getMedia());
  const [logs, setLogs] = useState(getLogs());

  useEffect(() => {
    return subscribeStorage(() => {
      setCidades(getCidades());
      setPontos(getPontosTuristicos());
      setCulinaria(getCulinaria());
      setArtesanato(getArtesanato());
      setCuriosidades(getCuriosidades());
      setQuiz(getQuiz());
      setSecoes(getSecoes());
      setMedia(getMedia());
      setLogs(getLogs());
    });
  }, []);

  const totalPublicados =
    cidades.filter((c) => c.status === 'PUBLICADO').length +
    pontos.filter((p) => p.status === 'PUBLICADO').length +
    culinaria.filter((c) => c.status === 'PUBLICADO').length +
    artesanato.filter((a) => a.status === 'PUBLICADO').length +
    curiosidades.filter((c) => c.status === 'PUBLICADO').length +
    quiz.filter((q) => q.status === 'PUBLICADO').length;

  const totalDesativados =
    cidades.filter((c) => c.status === 'DESATIVADO').length +
    pontos.filter((p) => p.status === 'DESATIVADO').length +
    culinaria.filter((c) => c.status === 'DESATIVADO').length +
    artesanato.filter((a) => a.status === 'DESATIVADO').length +
    curiosidades.filter((c) => c.status === 'DESATIVADO').length +
    quiz.filter((q) => q.status === 'DESATIVADO').length;

  const statsCards = [
    { title: 'TOTAL DE CIDADES', value: cidades.length, icon: Building2, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', tab: 'cidades' },
    { title: 'PONTOS TURÍSTICOS', value: pontos.length, icon: Camera, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', tab: 'pontos' },
    { title: 'RECEITAS CULINÁRIAS', value: culinaria.length, icon: Utensils, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', tab: 'culinaria' },
    { title: 'ARTESANATOS', value: artesanato.length, icon: Palette, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', tab: 'artesanato' },
    { title: 'IMAGENS CADASTRADAS', value: media.length, icon: Image, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', tab: 'media' },
    { title: 'CURIOSIDADES', value: curiosidades.length, icon: HelpCircle, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', tab: 'curiosidades' },
    { title: 'PERGUNTAS DO QUIZ', value: quiz.length, icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', tab: 'quiz' },
    { title: 'SEÇÕES DO SITE', value: secoes.length, icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', tab: 'secoes' }
  ];

  const shortcuts = [
    { label: 'NOVA CIDADE', tab: 'cidades', color: 'bg-amber-500 text-slate-950 hover:bg-amber-400' },
    { label: 'NOVO PONTO TURÍSTICO', tab: 'pontos', color: 'bg-blue-600 text-white hover:bg-blue-500' },
    { label: 'NOVA RECEITA', tab: 'culinaria', color: 'bg-orange-600 text-white hover:bg-orange-500' },
    { label: 'NOVO ARTESANATO', tab: 'artesanato', color: 'bg-emerald-600 text-white hover:bg-emerald-500' },
    { label: 'NOVA CURIOSIDADE', tab: 'curiosidades', color: 'bg-purple-600 text-white hover:bg-purple-500' },
    { label: 'NOVA IMAGEM', tab: 'media', color: 'bg-cyan-600 text-white hover:bg-cyan-500' },
    { label: 'NOVA PERGUNTA', tab: 'quiz', color: 'bg-yellow-600 text-white hover:bg-yellow-500' }
  ];

  return (
    <div className="space-y-8 p-4 sm:p-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Painel de Controle Visão Geral
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Gerenciamento de 100% dos conteúdos e configurações da Feira Cultural.
        </p>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
          <CheckCircle className="h-6 w-6 shrink-0" />
          <div>
            <span className="font-mono text-xl font-bold">{totalPublicados}</span>
            <p className="text-xs font-semibold uppercase tracking-wider">Conteúdos Publicados</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-400">
          <XCircle className="h-6 w-6 shrink-0" />
          <div>
            <span className="font-mono text-xl font-bold text-slate-200">{totalDesativados}</span>
            <p className="text-xs font-semibold uppercase tracking-wider">Conteúdos Desativados</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-cyan-300">
          <Image className="h-6 w-6 shrink-0" />
          <div>
            <span className="font-mono text-xl font-bold">{media.length}</span>
            <p className="text-xs font-semibold uppercase tracking-wider">Imagens Cadastradas</p>
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Atalhos de Cadastro Rápido
        </h3>
        <div className="flex flex-wrap gap-2">
          {shortcuts.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => onNavigateToTab(sc.tab)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-md ${sc.color}`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{sc.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Totals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateToTab(card.tab)}
              className={`rounded-2xl border ${card.border} ${card.bg} p-5 space-y-2 cursor-pointer hover:scale-105 transition transform`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-6 w-6 ${card.color}`} />
                <span className={`font-mono text-2xl font-bold ${card.color}`}>
                  {card.value < 10 ? `0${card.value}` : card.value}
                </span>
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                {card.title}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-white">
              Atividades Recentes (Histórico)
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('historico')}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            Ver Todos os Logs →
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.slice(0, 6).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs"
            >
              <div>
                <span className="font-bold text-white">{log.acao}</span>
                <p className="text-slate-400 text-[11px]">
                  {log.conteudoAfetado} ({log.tipoEntidade}) · por {log.usuarioNome}
                </p>
              </div>
              <span className="font-mono text-[10px] text-slate-500 shrink-0">
                {new Date(log.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
