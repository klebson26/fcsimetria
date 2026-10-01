import React, { useState, useEffect } from 'react';
import { getLiberdade, getIdentidade, subscribeStorage } from '../services/storageService';
import { LiberdadeContent } from '../types/database';
import {
  Compass,
  ArrowLeft,
  Share2,
  Check,
  QrCode,
  Sparkles,
  Utensils,
  Award,
  Calendar,
  MapPin,
  Camera,
  Info,
  Heart
} from 'lucide-react';

interface LiberdadePageProps {
  onBackToHome: () => void;
  onNavigateToQuiz: () => void;
  onOpenQRCodeModal: (topic?: string) => void;
}

export const LiberdadePage: React.FC<LiberdadePageProps> = ({
  onBackToHome,
  onNavigateToQuiz,
  onOpenQRCodeModal
}) => {
  const [content, setContent] = useState<LiberdadeContent>(getLiberdade());
  const [identidade, setIdentidade] = useState(getIdentidade());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return subscribeStorage(() => {
      setContent(getLiberdade());
      setIdentidade(getIdentidade());
    });
  }, []);

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + '#liberdade';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
              onClick={() => onOpenQRCodeModal('liberdade')}
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
            src={content.imagemPrincipal || '/images/liberdade_japantown_1790701747719.jpg'}
            alt="Bairro da Liberdade em São Paulo"
            className="h-full w-full object-cover opacity-25 filter blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">
            <Compass className="h-3.5 w-3.5" />
            <span>Página Exclusiva da Feira Cultural</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl text-balance">
            {content.titulo || 'Bairro da Liberdade: Tradição e Modernidade Oriental'}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {content.subtitulo || 'Polo de vivência e encontro da cultura japonesa, chinesa e coreana no coração da capital paulista.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>Imigração: Desde 1908 (Kasato Maru)</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800">
              <MapPin className="h-3.5 w-3.5 text-blue-400" />
              <span>Praça da Liberdade — Centro de SP</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Maior comunidade nikkei do planeta fora do Japão</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16 space-y-16">
        {/* Cultural Identity & Heritage */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>Imersão Histórica & Tradições</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Do Kasato Maru à Maior Comunidade Oriental do Ocidente
            </h2>
            <div className="prose prose-invert text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                {content.historia || 'Inicialmente chamado de Campo da Forca no século XIX, mudou de nome em 1858 para Liberdade. Em 1908 aportou no Brasil o navio Kasato Maru, trazendo as primeiras famílias japonesas que se estabeleceram nas pensões da Rua Conde de Sarzedas.'}
              </p>
              <p>
                {content.descricao || 'Com suas luminárias vermelhas de estilo Suzuran e imponentes portais Torii, a Liberdade tornou-se um refúgio de preservação de rituais, artesanato, caligrafia shodo, ikebana, artes marciais e culinária asiática milenar.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <img
                src={content.imagemPrincipal || '/images/liberdade_japantown_1790701747719.jpg'}
                alt="Bairro da Liberdade"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-slate-900/90 text-xs text-slate-400 border-t border-slate-800">
                <span className="font-semibold text-white">Cenário Ícone:</span> As luminárias suzuran e o grande portal Torii vermelho sobre a Rua Galvão Bueno.
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pillars of Liberdade: Gastronomia, Festivais, Arquitetura, Cultura */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gastronomia */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-slate-700 transition">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <Utensils className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Gastronomia Autêntica</h3>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Sabores do Oriente</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {content.gastronomia || 'Lamen fumegante preparado com caldos de horas, guiozas crocantes, sushis tradicionais, takoyaki de polvo, kare raisu, doces recheados com feijão azuki (taiyaki) e chás orientais matcha.'}
            </p>
          </div>

          {/* Festivais */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-slate-700 transition">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Festivais Tradicionais</h3>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Celebrações e Rituais</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {content.festivais || 'Tanabata Matsuri (Festival das Estrelas em Julho onde se penduram pedidos em bambus), Hana Matsuri (Festival das Flores em Abril celebrando o nascimento de Buda) e Toyo Matsuri em Dezembro.'}
            </p>
          </div>

          {/* Arquitetura */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-slate-700 transition">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Arquitetura Urbana</h3>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Postes e Símbolos</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {content.arquitetura || 'Postes com luminárias suzuran orientais, grandes arcos torii vermelhos, fachadas com kanjis e caracteres chineses, pontes vermelhas e jardins com carpas ornamentais nishikigoi.'}
            </p>
          </div>

          {/* Cultura */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-slate-700 transition">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Cultura & Sociedade</h3>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Vida Comunitária</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {content.cultura || 'Celebração de datas tradicionais, livrarias com mangás originais, karaokês, lojas de cerâmica, templos budistas como o Busshinji e a famosa Feira de Artesanato da Praça da Liberdade aos finais de semana.'}
            </p>
          </div>
        </section>

        {/* Curiosidades */}
        {content.curiosidades && content.curiosidades.length > 0 && (
          <section className="space-y-6 rounded-3xl border border-purple-500/30 bg-purple-500/5 p-6 sm:p-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" /> Curiosidades do Bairro da Liberdade
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Fatos impressionantes investigados na pesquisa escolar do Colégio Simetria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.curiosidades.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300 leading-relaxed flex items-start gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold text-xs shrink-0 mt-0.5">
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
            Preparado para testar seus conhecimentos sobre a Liberdade?
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Responda o Quiz da Feira Cultural, descubra novos fatos sobre São Paulo e concorra ao certificado de Honra ao Mérito Cultural.
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
