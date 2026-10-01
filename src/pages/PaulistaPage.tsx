import React, { useState, useEffect } from 'react';
import { getPaulista, getIdentidade, subscribeStorage } from '../services/storageService';
import { PaulistaContent } from '../types/database';
import {
  Landmark,
  ArrowLeft,
  Calendar,
  Sparkles,
  QrCode,
  Share2,
  Check,
  Award,
  Building,
  MapPin,
  Camera,
  Compass,
  Info
} from 'lucide-react';

interface PaulistaPageProps {
  onBackToHome: () => void;
  onNavigateToQuiz: () => void;
  onOpenQRCodeModal: (topic?: string) => void;
}

export const PaulistaPage: React.FC<PaulistaPageProps> = ({
  onBackToHome,
  onNavigateToQuiz,
  onOpenQRCodeModal
}) => {
  const [content, setContent] = useState<PaulistaContent>(getPaulista());
  const [identidade, setIdentidade] = useState(getIdentidade());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return subscribeStorage(() => {
      setContent(getPaulista());
      setIdentidade(getIdentidade());
    });
  }, []);

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + '#paulista';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sortedMilestones = [...(content.linhaDoTempo || [])].sort((a, b) => a.ano - b.ano);

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
              onClick={() => onOpenQRCodeModal('paulista')}
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
            src={content.imagemPrincipal || '/images/paulista_avenue_1790701728460.jpg'}
            alt="Avenida Paulista"
            className="h-full w-full object-cover opacity-25 filter blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-rose-400 mb-4">
            <Landmark className="h-3.5 w-3.5" />
            <span>Página Exclusiva da Feira Cultural</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl text-balance">
            {content.titulo || 'Avenida Paulista: O Coração Pulsante de São Paulo'}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {content.subtitulo || 'Conheça a história, os marcos arquitetônicos, os centros culturais e a vibrante transformação da avenida mais emblemática do Brasil.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>Inaugurada em 8 de dezembro de 1891</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800">
              <MapPin className="h-3.5 w-3.5 text-blue-400" />
              <span>Extensão: 2,8 km</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800">
              <Building className="h-3.5 w-3.5 text-emerald-400" />
              <span>Idealizador: Joaquim Eugênio de Lima</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16 space-y-16">
        {/* Context & Description */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>Memória e Significado Cultural</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Do Café aos Centros Culturais Contemporâneos
            </h2>
            <div className="prose prose-invert text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                {content.descricao || 'Projetada pelo engenheiro uruguaio Joaquim Eugênio de Lima no final do século XIX, a Paulista nasceu como um elegante refúgio residencial para os barões do café e grandes industriais da época.'}
              </p>
              <p>
                Com o passar das décadas, os imponentes palacetes deram lugar a modernos arranha-céus espelhados, transformando a via no centro financeiro da América Latina e, subsequentemente, no mais diversificado polo cultural, artístico e de lazer a céu aberto do país.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <img
                src={content.imagemPrincipal || '/images/paulista_avenue_1790701728460.jpg'}
                alt="Avenida Paulista em Perspectiva"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-slate-900/90 text-xs text-slate-400 border-t border-slate-800">
                <span className="font-semibold text-white">Cartão-postal de São Paulo:</span> Um dos mais importantes centros de expressão social, cultural e econômica do continente.
              </div>
            </div>
          </div>
        </section>

        {/* Linha do Tempo dos Marcos Históricos */}
        {sortedMilestones.length > 0 && (
          <section className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-400" /> Linha do Tempo: A Evolução da Paulista
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Acompanhe os principais momentos que transformaram a avenida em patrimônio de todos os paulistas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMilestones.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-amber-400">
                      {m.ano}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                      Marco #{m.ordem}
                    </span>
                  </div>

                  {m.imagem && (
                    <div className="overflow-hidden rounded-xl border border-slate-800 h-36">
                      <img src={m.imagem} alt={m.titulo} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="font-serif text-base font-bold text-white">
                    {m.titulo}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {m.descricao}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Curiosidades e Fatos Impressionantes */}
        {content.curiosidades && content.curiosidades.length > 0 && (
          <section className="space-y-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" /> Você Sabia? Curiosidades da Av. Paulista
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Fatos interessantes levantados pelos estudantes na pesquisa da Feira Cultural.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.curiosidades.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300 leading-relaxed flex items-start gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>{c}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call to Actions & Quiz */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Award className="h-7 w-7" />
          </div>

          <h3 className="font-serif text-2xl font-bold text-white">
            Teste seus conhecimentos sobre a Avenida Paulista!
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Participe do Quiz Oficial da Feira Cultural do Colégio Simetria, acumule pontos e conquiste seu certificado de participação.
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
              Explorar Outras Seções
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
