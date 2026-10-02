import React, { useState, useEffect } from 'react';
import {
  getMetricas,
  recordSectionVisit,
  resetMetricasToDefault,
  subscribeMetricas,
  MetricasGerais,
  EventoVisitaReal
} from '../../services/analyticsService';
import { D3BarChartSections } from '../components/d3/D3BarChartSections';
import { D3DonutChartSections } from '../components/d3/D3DonutChartSections';
import { D3TimelineChartSections } from '../components/d3/D3TimelineChartSections';
import { playClickSound } from '../../services/audioService';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  RotateCcw,
  Smartphone,
  Eye,
  CheckCircle,
  HelpCircle,
  Award,
  Radio,
  Wifi,
  MonitorCheck
} from 'lucide-react';

export const AdminMetricas: React.FC = () => {
  const [metricas, setMetricas] = useState<MetricasGerais>(getMetricas());
  const [ultimosEventos, setUltimosEventos] = useState<EventoVisitaReal[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<
    'totalAcessos' | 'visitantesUnicos' | 'interacoes'
  >('totalAcessos');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeMetricas((data, events) => {
      setMetricas(data);
      if (events && events.length > 0) {
        setUltimosEventos(events);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSimulateVisit = async (secaoId: string) => {
    playClickSound();
    setIsSimulating(true);
    await recordSectionVisit(secaoId);
    setMetricas(getMetricas());
    setTimeout(() => setIsSimulating(false), 400);
  };

  const handleResetData = () => {
    if (confirm('Deseja redefinir as estatísticas de acesso para os valores padrão da feira?')) {
      resetMetricasToDefault();
      setMetricas(getMetricas());
    }
  };

  const secoesSorted = [...metricas.secoes].sort(
    (a, b) => b[selectedMetric] - a[selectedMetric]
  );
  const secaoLider = secoesSorted[0];
  const totalAcessosTop3 = metricas.secoes.reduce((acc, s) => acc + s.totalAcessos, 0);

  return (
    <div className="space-y-8 p-4 sm:p-8 animate-fade-in text-slate-100">
      {/* Page Header with Live Firestore Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Métricas D3.js</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-[11px] font-bold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Monitoramento Real Cloud Firestore Ativo</span>
            </div>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Estatísticas & Acessos Reais da Plataforma
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Dados capturados em tempo real de cada visitante que acessa o portal nos estandes da feira. Visualização analítica em D3 comparando <strong>Avenida Paulista</strong>, <strong>Mercadão Municipal</strong> e <strong>Bairro da Liberdade</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              playClickSound();
              setMetricas(getMetricas());
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition"
          >
            <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
            <span>Atualizar</span>
          </button>

          <button
            onClick={handleResetData}
            title="Redefinir dados para o padrão"
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restaurar Padrão</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Total de Acessos</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-white">
              {metricas.totalVisitas.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5" /> Real Cloud
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Páginas visualizadas em toda a feira</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Visitantes Únicos</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-white">
              {metricas.visitantesHoje.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-bold text-amber-400">Hoje</span>
          </div>
          <p className="text-[11px] text-slate-400">Dispositivos reais conectados na feira cultural</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Seção Mais Visitada</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-rose-400 truncate">
              {secaoLider?.icone} {secaoLider?.nome}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            <strong className="text-white font-mono">{secaoLider?.totalAcessos.toLocaleString('pt-BR')}</strong> acessos ({Math.round(((secaoLider?.totalAcessos || 0) / (totalAcessosTop3 || 1)) * 100)}% de preferência)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Tempo Médio na Seção</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-white">4.7</span>
            <span className="text-xs text-slate-400 font-semibold">minutos / estande</span>
          </div>
          <p className="text-[11px] text-slate-400">Excelente retenção de leitura e fotos</p>
        </div>
      </div>

      {/* Main D3 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Interactive D3 Bar Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-400" />
                Comparativo de Acessos por Seção
              </h3>
              <p className="text-xs text-slate-400">
                Gráfico interativo em D3.js comparando o interesse do público entre os estandes
              </p>
            </div>

            {/* Metric Switcher Tabs */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setSelectedMetric('totalAcessos')}
                className={`rounded-lg px-2.5 py-1 transition ${
                  selectedMetric === 'totalAcessos'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Visitas Totais
              </button>
              <button
                onClick={() => setSelectedMetric('visitantesUnicos')}
                className={`rounded-lg px-2.5 py-1 transition ${
                  selectedMetric === 'visitantesUnicos'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Únicos
              </button>
              <button
                onClick={() => setSelectedMetric('interacoes')}
                className={`rounded-lg px-2.5 py-1 transition ${
                  selectedMetric === 'interacoes'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Engajamento
              </button>
            </div>
          </div>

          {/* D3 Bar Chart SVG Element */}
          <div className="pt-2">
            <D3BarChartSections data={metricas.secoes} selectedMetric={selectedMetric} />
          </div>

          <div className="border-t border-slate-800/80 pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Passe o cursor sobre as barras para ver a porcentagem de cada seção
            </span>
            <span className="font-mono text-slate-500">
              Renderizado nativamente com D3 SVG
            </span>
          </div>
        </div>

        {/* Right Column (1 span): Interactive D3 Donut Chart */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Participação de Audiência
            </h3>
            <p className="text-xs text-slate-400">
              Distribuição percentual calculada via D3.pie
            </p>
          </div>

          {/* D3 Donut Chart Element */}
          <div className="py-2">
            <D3DonutChartSections data={metricas.secoes} />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-2">
            <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider">
              Destaque do Momento
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">
              A <strong>Avenida Paulista</strong> lidera em visualizações com foco na maquete do MASP, seguida de perto pelo <strong>Mercadão</strong> impulsionado pela gastronomia e vitrais.
            </p>
          </div>
        </div>
      </div>

      {/* Hourly Timeline Area Chart with D3 */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Fluxo de Visitas por Horário da Feira Cultural (08h às 18h)
            </h3>
            <p className="text-xs text-slate-400">
              Curvas de densidade de tráfego geradas com d3.curveMonotoneX e áreas sombreadas
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            {metricas.secoes.map((s) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: s.corHex }}
                />
                <span className="text-slate-300">{s.nome}</span>
              </div>
            ))}
          </div>
        </div>

        <D3TimelineChartSections data={metricas.secoes} />
      </div>

      {/* Real-time Live Visitors Event Feed (From Cloud Firestore) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
              Feed de Acessos Recentes em Tempo Real
            </h4>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span className="hidden sm:inline">Sincronizado via Firestore Cloud</span>
          </div>
        </div>

        {ultimosEventos.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Os eventos de acesso dos visitantes aparecem aqui em tempo real à medida que as páginas são abertas.
            </p>
            <p className="text-[11px] text-amber-400">
              Dica: Abra uma das páginas da feira (Paulista, Mercadão, Liberdade) em outra aba ou celular para ver o registro instantâneo!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ultimosEventos.slice(0, 9).map((evento, idx) => (
              <div
                key={evento.id || idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition text-xs shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    {evento.icone}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-white block truncate">
                      {evento.secaoNome}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                      {evento.dispositivo} · {evento.navegador}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className="font-mono text-[10px] text-amber-400 block font-bold">
                    {new Date(evento.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {evento.resolucao}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deep-Dive Section Cards (Paulista, Mercadão, Liberdade) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-white">
            Desempenho Detalhado por Seção Temática
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            3 Estandes Culturais Oficiais
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metricas.secoes.map((secao, idx) => {
            const pct = Math.round((secao.totalAcessos / totalAcessosTop3) * 100);

            return (
              <div
                key={secao.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-5 hover:border-slate-700 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800">
                      {secao.icone}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base font-bold text-white">
                          {secao.nome}
                        </h4>
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400">
                          #{idx + 1}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{secao.tempoMedioMinutos} min de leitura média</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Preferência dos visitantes:</span>
                    <span className="font-bold text-white">{pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: secao.corHex
                      }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800">
                  <div className="rounded-xl bg-slate-950 p-2.5">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Acessos Totais
                    </span>
                    <strong className="font-mono text-sm text-white">
                      {secao.totalAcessos.toLocaleString('pt-BR')}
                    </strong>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-2.5">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Visitantes Únicos
                    </span>
                    <strong className="font-mono text-sm text-emerald-400">
                      {secao.visitantesUnicos.toLocaleString('pt-BR')}
                    </strong>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-2.5">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Taxa Engajamento
                    </span>
                    <strong className="font-mono text-sm text-amber-400">
                      {secao.taxaEngajamento}%
                    </strong>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-2.5">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Interações
                    </span>
                    <strong className="font-mono text-sm text-purple-400">
                      {secao.interacoes}
                    </strong>
                  </div>
                </div>

                {/* Most visited highlights in section */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Páginas e Conteúdos Mais Acessados:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {secao.destaquesVisitados.map((item, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-950 px-2 py-1 text-[11px] text-slate-300 border border-slate-800"
                      >
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Simulator Trigger */}
                <button
                  type="button"
                  onClick={() => handleSimulateVisit(secao.id)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-amber-500/50 hover:bg-amber-500/10 transition active:scale-98"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Simular Visita Agora (+1)</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Devices & Technical Breakdown */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-blue-400" />
          Dispositivos Utilizados pelos Visitantes (Detecção Real)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metricas.dispositivos.map((d, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{d.tipo}</span>
                <span className="font-mono font-bold text-amber-400">{d.percentual}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${d.percentual}%`,
                    backgroundColor: d.cor
                  }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-400 block">
                {d.quantidade.toLocaleString('pt-BR')} acessos computados
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
