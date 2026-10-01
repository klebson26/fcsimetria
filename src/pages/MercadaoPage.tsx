import React, { useState, useEffect } from 'react';
import {
  getMercadaoHeader,
  getMercadao,
  getIdentidade,
  subscribeStorage
} from '../services/storageService';
import { MercadaoHeader, MercadaoProduto } from '../types/database';
import {
  ShoppingBag,
  ArrowLeft,
  Share2,
  Check,
  QrCode,
  Sparkles,
  Utensils,
  Award,
  Calendar,
  MapPin,
  Clock,
  Info,
  Tag
} from 'lucide-react';

interface MercadaoPageProps {
  onBackToHome: () => void;
  onNavigateToQuiz: () => void;
  onOpenQRCodeModal: (topic?: string) => void;
}

export const MercadaoPage: React.FC<MercadaoPageProps> = ({
  onBackToHome,
  onNavigateToQuiz,
  onOpenQRCodeModal
}) => {
  const [headerInfo, setHeaderInfo] = useState<MercadaoHeader>(getMercadaoHeader());
  const [produtos, setProdutos] = useState<MercadaoProduto[]>(getMercadao());
  const [identidade, setIdentidade] = useState(getIdentidade());
  const [copied, setCopied] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<string>('TODOS');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return subscribeStorage(() => {
      setHeaderInfo(getMercadaoHeader());
      setProdutos(getMercadao());
      setIdentidade(getIdentidade());
    });
  }, []);

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + '#mercadao';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const categorias = [
    'TODOS',
    ...Array.from(new Set(produtos.map((p) => p.categoria)))
  ];

  const filteredProdutos =
    selectedCategoria === 'TODOS'
      ? produtos
      : produtos.filter((p) => p.categoria === selectedCategoria);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner Navigation Bar */}
      <div className="sticky top-16 sm:top-[70px] z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-500/40 hover:text-white transition shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 text-amber-400" />
            <span>Voltar ao Portal</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copiar link desta página"
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 text-blue-400" />}
              <span className="hidden sm:inline">{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={() => onOpenQRCodeModal('mercadao')}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition shadow-sm"
            >
              <QrCode className="h-3.5 w-3.5 text-amber-400" />
              <span>QR Code Mesa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0">
          <img
            src={headerInfo.imagemPrincipal || '/images/mercadao_sp_1790701738265.jpg'}
            alt="Mercado Municipal de São Paulo"
            className="h-full w-full object-cover opacity-25 filter blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Página Exclusiva da Feira Cultural</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl text-balance">
            {headerInfo.titulo || 'Mercadão Municipal: O Templo da Gastronomia Paulista'}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {headerInfo.subtitulo || 'Inaugurado em 1933 com projeto de Ramos de Azevedo e 72 vitrais alemães de Conrado Sorgenicht.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>Inauguração: 25 de janeiro de 1933</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800">
              <MapPin className="h-3.5 w-3.5 text-blue-400" />
              <span>Rua da Cantareira, 306 — Centro Histórico</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>72 Vitrais Artísticos Alemães</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16 space-y-16">
        {/* Architecture & Heritage */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>História, Arquitetura e Cultura</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Um Palácio da Gastronomia no Coração de SP
            </h2>
            <div className="prose prose-invert text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                {headerInfo.historia || 'Inaugurado em 1933 com projeto assinado pelo renomado escritório de Ramos de Azevedo, o Mercadão é um dos cartões-postais gastronômicos mais famosos do país.'}
              </p>
              <p>
                A impressionante arquitetura em estilo neoclássico abriga um gigantesco vão livre com 72 vitrais coloridos, encomendados na Alemanha e criados pelo famoso mestre Conrado Sorgenicht Filho, retratando os ciclos agrícolas e a pecuária paulista da época.
              </p>
            </div>

            {headerInfo.iguarias && headerInfo.iguarias.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Iguarias e Atrativos Icônicos:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {headerInfo.iguarias.map((ig, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200"
                    >
                      {ig}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <img
                src={headerInfo.imagemPrincipal || '/images/mercadao_sp_1790701738265.jpg'}
                alt="Mercadão Municipal de São Paulo"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-slate-900/90 text-xs text-slate-400 border-t border-slate-800">
                <span className="font-semibold text-white">Patrimônio Histórico e Cultural:</span> Conhecido carinhosamente como Mercadão, atrai diariamente visitantes do mundo inteiro.
              </div>
            </div>
          </div>
        </section>

        {/* Famous Products & Delicacies Showcase */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Utensils className="h-5 w-5 text-amber-400" /> Pratos, Frutas & Produtos Típicos
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Conheça as estrelas gastronômicas do mezanino e dos boxes do Mercadão.
              </p>
            </div>

            {/* Category Filter */}
            {categorias.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoria(cat)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategoria === cat
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProdutos.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col hover:border-slate-700 transition group shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.imagem}
                    alt={item.titulo}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/mercadao_sp_1790701738265.jpg';
                    }}
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                    {item.categoria}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-400 transition">
                      {item.titulo}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.descricao}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
                    {item.curiosidade && (
                      <p className="italic">
                        <span className="font-bold text-amber-400 not-italic">Curiosidade: </span>
                        {item.curiosidade}
                      </p>
                    )}
                    {item.origem && (
                      <p>
                        <span className="font-bold text-slate-300">Origem: </span>
                        {item.origem}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Curiosities / Tips */}
        <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 space-y-4">
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Info className="h-5 w-5 text-amber-400" /> Dicas para a Feira Cultural & Visitação
          </h3>
          <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Degustação de Frutas Raras:</strong> No Mercadão é tradição os feirantes oferecerem pedaços de pitaia, atemoia, mangostão e granadilla diretamente para degustação.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>O Famoso Mezanino:</strong> Foi inaugurado em 2004 para abrigar uma praça de alimentação suspensa onde é possível saborear os pastéis e sanduíches admirando os vitrais.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Mais de 12.000 m²:</strong> O prédio recebe mais de 10 mil visitantes nos dias úteis e até 30 mil pessoas aos finais de semana.</span>
            </li>
          </ul>
        </section>

        {/* Call to Actions & Quiz */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Award className="h-7 w-7" />
          </div>

          <h3 className="font-serif text-2xl font-bold text-white">
            Gostou dos sabores do Mercadão?
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Teste seus conhecimentos no Quiz da Feira Cultural do Colégio Simetria e aprenda ainda mais sobre a rica culinária paulista.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToQuiz}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition"
            >
              Jogar o Quiz da Feira
            </button>
            <button
              onClick={onBackToHome}
              className="rounded-xl border border-slate-800 bg-slate-950 px-6 py-3 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              Voltar ao Portal Geral
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
