import React, { useState, useEffect } from 'react';
import {
  getCidades,
  getPontosTuristicos,
  getPaulistaContent,
  getMercadaoProdutos,
  getLiberdadeContent,
  getCulinaria,
  getArtesanato,
  getCultura,
  getHistoria,
  getCuriosidades,
  getSecoes,
  getIdentidade,
  getRegioes,
  subscribeStorage
} from '../services/storageService';
import { Cidade, PontoTuristico } from '../types/database';
import { InteractiveMap } from '../components/InteractiveMap';
import { FadeIn } from '../components/FadeIn';
import {
  Sparkles,
  MapPin,
  Utensils,
  Palette,
  Landmark,
  ShoppingBag,
  Compass,
  History as HistoryIcon,
  HelpCircle,
  Award,
  ArrowRight,
  Eye,
  Info,
  Clock,
  Play,
  QrCode,
  Building2,
  Camera,
  X
} from 'lucide-react';

interface HomeViewProps {
  onNavigateToQuiz: () => void;
  onOpenFairMode: () => void;
  onOpenQRCodeModal: (topic?: 'geral' | 'paulista' | 'mercadao' | 'liberdade' | 'quiz') => void;
  onSelectCidade: (cidade: Cidade) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToQuiz,
  onOpenFairMode,
  onOpenQRCodeModal,
  onSelectCidade
}) => {
  const [cidades, setCidades] = useState(getCidades());
  const [pontos, setPontos] = useState(getPontosTuristicos());
  const [paulista, setPaulista] = useState(getPaulistaContent());
  const [mercadao, setMercadao] = useState(getMercadaoProdutos());
  const [liberdade, setLiberdade] = useState(getLiberdadeContent());
  const [culinaria, setCulinaria] = useState(getCulinaria());
  const [artesanato, setArtesanato] = useState(getArtesanato());
  const [cultura, setCultura] = useState(getCultura());
  const [historia, setHistoria] = useState(getHistoria());
  const [curiosidades, setCuriosidades] = useState(getCuriosidades());
  const [secoes, setSecoes] = useState(getSecoes());
  const [identidade, setIdentidade] = useState(getIdentidade());
  const [regioes, setRegioes] = useState(getRegioes());

  const [activeFlippedCard, setActiveFlippedCard] = useState<string | null>(null);
  const [selectedCityDetail, setSelectedCityDetail] = useState<Cidade | null>(null);
  const [selectedPontoDetail, setSelectedPontoDetail] = useState<PontoTuristico | null>(null);

  useEffect(() => {
    return subscribeStorage(() => {
      setCidades(getCidades());
      setPontos(getPontosTuristicos());
      setPaulista(getPaulistaContent());
      setMercadao(getMercadaoProdutos());
      setLiberdade(getLiberdadeContent());
      setCulinaria(getCulinaria());
      setArtesanato(getArtesanato());
      setCultura(getCultura());
      setHistoria(getHistoria());
      setCuriosidades(getCuriosidades());
      setSecoes(getSecoes());
      setIdentidade(getIdentidade());
      setRegioes(getRegioes());
    });
  }, []);

  const publishedCidades = cidades.filter((c) => c.status === 'PUBLICADO');
  const publishedPontos = pontos.filter((p) => p.status === 'PUBLICADO');
  const publishedMercadao = mercadao.filter((m) => m.status === 'PUBLICADO');
  const publishedCulinaria = culinaria.filter((c) => c.status === 'PUBLICADO');
  const publishedArtesanato = artesanato.filter((a) => a.status === 'PUBLICADO');
  const publishedHistoria = historia.filter((h) => h.status === 'PUBLICADO').sort((a, b) => a.ordem - b.ordem);
  const publishedCuriosidades = curiosidades.filter((c) => c.status === 'PUBLICADO');

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Banner Section */}
      <FadeIn direction="up" durationMs={800}>
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/sp_hero_banner_1790701710531.jpg"
              alt="São Paulo Hero"
              className="h-full w-full object-cover opacity-40 blur-[2px] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-12 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/40 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Sparkles className="h-4 w-4" />
              {identidade.nomeFeira} · {identidade.anoFeira}
            </div>

            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-3xl leading-[1.15]">
              {identidade.tituloPrincipal}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {identidade.subtituloPrincipal}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#mapa"
                className="rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
              >
                Explorar Mapa do Estado
              </a>
              <button
                onClick={onOpenFairMode}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-700 transition"
              >
                <Play className="h-4 w-4 fill-white" /> Iniciar Apresentação
              </button>
            </div>

            {/* Key Metrics Counter Strip */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl pt-8 border-t border-slate-800/80">
              <div>
                <span className="font-mono text-2xl font-bold text-amber-400">
                  {publishedCidades.length}
                </span>
                <p className="text-xs text-slate-400">Cidades em Destaque</p>
              </div>
              <div>
                <span className="font-mono text-2xl font-bold text-blue-400">
                  {publishedPontos.length}
                </span>
                <p className="text-xs text-slate-400">Pontos Turísticos</p>
              </div>
              <div>
                <span className="font-mono text-2xl font-bold text-orange-400">
                  {publishedCulinaria.length}
                </span>
                <p className="text-xs text-slate-400">Pratos Típicos</p>
              </div>
              <div>
                <span className="font-mono text-2xl font-bold text-purple-400">
                  {publishedCuriosidades.length}
                </span>
                <p className="text-xs text-slate-400">Curiosidades "Você Sabia?"</p>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 3 Main Highlighted Topics Cards Bar */}
      <FadeIn delayMs={100} durationMs={700}>
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Sparkles className="h-4 w-4" /> PRINCIPAIS TÓPICOS DA FEIRA CULTURAL
              </div>
              <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                Os 3 Ícones de São Paulo
              </h2>
            </div>
            <button
              onClick={() => onOpenQRCodeModal('geral')}
              className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition self-start sm:self-auto"
            >
              <QrCode className="h-4 w-4 text-amber-400" />
              <span>Imprimir QR Code Geral de Mesa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Av Paulista */}
            <FadeIn delayMs={150} durationMs={650}>
              <div className="group relative h-full rounded-3xl border border-rose-500/40 bg-slate-900/90 p-6 shadow-xl hover:border-rose-500/80 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="h-44 w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
                    <img
                      src={paulista.imagemPrincipal}
                      alt="Avenida Paulista"
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/30">
                      🏛️ TÓPICO 1 · CAPITAL & ARQUITETURA
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Desde 1891</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Avenida Paulista
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    O coração financeiro e cultural de SP: abriga o MASP com seu vão livre de 74m, centros culturais, casarões históricos e ciclovia aberta aos domingos.
                  </p>

                  {/* Informative tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['MASP', 'Casa das Rosas', '2,8 km de extensão', '1,5 mi visitantes/dia'].map((tag, i) => (
                      <span key={i} className="text-[10px] bg-slate-950/80 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <a
                    href="#paulista"
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
                  >
                    <span>Explorar Seção</span> <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => onOpenQRCodeModal('paulista')}
                    className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
                  >
                    <QrCode className="h-3.5 w-3.5" /> QR Code
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Card 2: Mercadão */}
            <FadeIn delayMs={250} durationMs={650}>
              <div className="group relative h-full rounded-3xl border border-amber-500/40 bg-slate-900/90 p-6 shadow-xl hover:border-amber-500/80 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="h-44 w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
                    <img
                      src={mercadao[0]?.imagem || '/images/mercadao_sp_1790701738265.jpg'}
                      alt="Mercadão de São Paulo"
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                      🥪 TÓPICO 2 · GASTRONOMIA PAULISTANA
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Desde 1933</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Mercadão de São Paulo
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Templo gastronômico com 72 vitrais alemães de Conrado Sorgenicht, os lendários sanduíches de mortadela de 400g, pastéis de bacalhau e frutas raras do mundo.
                  </p>

                  {/* Informative tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['72 Vitrais Alemães', 'Sanduíche 400g', 'Ramos de Azevedo', 'Frutas Exóticas'].map((tag, i) => (
                      <span key={i} className="text-[10px] bg-slate-950/80 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <a
                    href="#mercadao"
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                  >
                    <span>Explorar Seção</span> <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => onOpenQRCodeModal('mercadao')}
                    className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
                  >
                    <QrCode className="h-3.5 w-3.5" /> QR Code
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Card 3: Liberdade */}
            <FadeIn delayMs={350} durationMs={650}>
              <div className="group relative h-full rounded-3xl border border-purple-500/40 bg-slate-900/90 p-6 shadow-xl hover:border-purple-500/80 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="h-44 w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
                    <img
                      src={liberdade.imagemPrincipal}
                      alt="Bairro da Liberdade"
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/30">
                      ⛩️ TÓPICO 3 · CULTURA & IMIGRAÇÃO
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Desde 1908</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Bairro da Liberdade
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A maior colônia japonesa fora do Japão: portal Torii de 9 metros, luminárias Suzuran, feira tradicional na praça, culinária autêntica e festivais milenares.
                  </p>

                  {/* Informative tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Portal Torii 9m', 'Luminárias Suzuran', 'Kasato Maru 1908', 'Feira Tradicional'].map((tag, i) => (
                      <span key={i} className="text-[10px] bg-slate-950/80 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <a
                    href="#liberdade"
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition"
                  >
                    <span>Explorar Seção</span> <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => onOpenQRCodeModal('liberdade')}
                    className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
                  >
                    <QrCode className="h-3.5 w-3.5" /> QR Code
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </FadeIn>

      {/* Section 1: Interactive Map */}
      <FadeIn direction="up">
        <section id="mapa" className="scroll-mt-24">
          <InteractiveMap
            regioes={regioes}
            cidades={publishedCidades}
            pontos={publishedPontos}
            onSelectCidade={onSelectCidade}
            onSelectPonto={(ponto) => setSelectedPontoDetail(ponto)}
          />
        </section>
      </FadeIn>

      {/* Section: Cidades Paulistas */}
      <FadeIn direction="up">
        <section id="cidades" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Building2 className="h-4 w-4" /> MUNICÍPIOS DE SÃO PAULO
              </div>
              <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                Cidades em Destaque no Estado
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Conheça os municípios que compõem a rica diversidade cultural, turística e econômica paulista.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedCidades.map((city, idx) => (
              <FadeIn key={city.id} delayMs={(idx % 3) * 100} durationMs={600}>
                <div
                  onClick={() => setSelectedCityDetail(city)}
                  className="group cursor-pointer h-full rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl hover:border-amber-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 w-full overflow-hidden bg-slate-950 relative">
                      <img
                        src={city.imagemPrincipal}
                        alt={city.titulo}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 rounded-md bg-slate-950/80 border border-slate-700/80 px-2 py-0.5 text-[10px] font-mono text-amber-300 backdrop-blur-sm">
                        {city.regiaoNome.split('&')[0]}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-400 transition">
                        {city.titulo}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {city.descricao}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 mt-2">
                    <span className="font-mono text-[11px] text-amber-400/90">
                      {city.populacao ? `Pop: ${city.populacao}` : 'SP'}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-400 group-hover:translate-x-1 transition">
                      Ver Ficha <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Section: Pontos Turísticos */}
      <FadeIn direction="up">
        <section id="pontos" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
                <Camera className="h-4 w-4" /> TURISMO & PATRIMÔNIO
              </div>
              <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                Pontos Turísticos Emblemáticos
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Monumentos, museus, basílicas, parques e cartões-postais imperdíveis do Estado de São Paulo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedPontos.map((ponto, idx) => (
              <FadeIn key={ponto.id} delayMs={(idx % 3) * 100} durationMs={600}>
                <div
                  onClick={() => setSelectedPontoDetail(ponto)}
                  className="group cursor-pointer h-full rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl hover:border-blue-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 w-full overflow-hidden bg-slate-950 relative">
                      <img
                        src={ponto.imagemPrincipal}
                        alt={ponto.titulo}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 rounded-md bg-blue-950/80 border border-blue-500/40 px-2 py-0.5 text-[10px] font-mono text-blue-200 backdrop-blur-sm">
                        {ponto.categoria}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {ponto.cidadeNome}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-blue-400 transition">
                        {ponto.titulo}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {ponto.descricao}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 mt-2">
                    <span className="truncate max-w-[180px] text-[11px] text-slate-500">
                      {ponto.endereco ? ponto.endereco.split('-')[0] : 'São Paulo'}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-blue-400 group-hover:translate-x-1 transition shrink-0">
                      Explorar <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Section 2: Especial Avenida Paulista */}
      <FadeIn direction="up">
        <section id="paulista" className="scroll-mt-24 rounded-3xl border border-rose-500/30 bg-slate-900/90 p-6 sm:p-10 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-400">
                <Landmark className="h-4 w-4" /> ESPECIAL
              </div>
              <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
                {paulista.titulo}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {paulista.descricao}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-2">
                  Pontos de Interesse de Destaque
                </h4>
                <div className="flex flex-wrap gap-2">
                  {paulista.pontosDeInteresse.map((ponto, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-300"
                    >
                      📍 {ponto}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline Milestones preview */}
              <div className="pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Marcos Históricos da Avenida
                </h4>
                <div className="space-y-2">
                  {paulista.linhaDoTempo.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-3 rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {item.ano}
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-white">{item.titulo}</h5>
                        <p className="text-[11px] text-slate-400">{item.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-rose-500/30 shadow-2xl">
                <img
                  src={paulista.imagemPrincipal}
                  alt="Avenida Paulista"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Section 3: Especial Mercadão Municipal de São Paulo */}
      <FadeIn direction="up">
        <section id="mercadao" className="scroll-mt-24 rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-10 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <ShoppingBag className="h-4 w-4" /> ESPECIAL MERCADÃO MUNICIPAL
              </div>
              <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
                Mercado Municipal Paulistano: O Templo da Gastronomia Paulista
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Inaugurado em 1933 com projeto assinado pelo renomado escritório de Ramos de Azevedo, o Mercadão é um dos cartões-postais gastronômicos mais famosos do país. Abriga 72 vitrais alemães do artista Conrado Sorgenicht Filho ilustrando a agropecuária paulista e oferece iguarias, frutas raras e a famosa gastronomia do centro histórico.
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                  Iguarias & Sabores de Destaque
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    '🥪 Sanduíche de Mortadela Fartíssimo (400g)',
                    '🥟 Pastel de Bacalhau do Hocca (Desde 1952)',
                    '🥭 Frutas Exóticas & Tropicais Raras',
                    '🧀 Queijos Finos & Embutidos Artesanais',
                    '🏛️ 72 Vitrais Alemães Ilustrando SP'
                  ].map((item, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline Sub-cards for Mercadão (Matching Paulista and Liberdade) */}
              <div className="pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Marcos Históricos do Mercado Municipal
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      ano: 1933,
                      titulo: 'Inauguração Oficial por Ramos de Azevedo',
                      desc: 'Abertura do majestoso edifício com 72 vitrais alemães que se tornou o centro de abastecimento de SP.'
                    },
                    {
                      ano: 1952,
                      titulo: 'Criação do Tradicional Pastel de Bacalhau',
                      desc: 'O imigrante português Horácio Ferreira funda o Hocca Bar e lança a receita que virou patrimônio gastronômico.'
                    },
                    {
                      ano: 2004,
                      titulo: 'Grande Restauro & Construção do Mezanino',
                      desc: 'Recuperação minuciosa dos vitrais alemães e inauguração do mezanino com restaurantes tradicionais.'
                    },
                    {
                      ano: 2026,
                      titulo: 'Patrimônio Histórico & Turístico Global',
                      desc: 'Consagrado como um dos mercados municipais mais visitados e fotografados do planeta.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {item.ano}
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-white">{item.titulo}</h5>
                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-cards of Products */}
              <div className="pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Produtos & Tradições Emblemáticas
                </h4>
                <div className="space-y-2">
                  {publishedMercadao.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800 border border-amber-500/20">
                        <img src={item.imagem} alt={item.titulo} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white">{item.titulo}</h5>
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.2 rounded">
                            {item.categoria}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{item.descricao}</p>
                        {item.curiosidade && (
                          <p className="text-[10px] text-amber-300/80 font-mono mt-1">
                            💡 {item.curiosidade}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
                <img
                  src={publishedMercadao[0]?.imagem || '/images/mercadao_sp_1790701738265.jpg'}
                  alt="Mercadão de São Paulo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Section 4: Especial Bairro da Liberdade */}
      <FadeIn direction="up">
        <section id="liberdade" className="scroll-mt-24 rounded-3xl border border-purple-500/30 bg-slate-900/90 p-6 sm:p-10 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-400">
                <Compass className="h-4 w-4" /> ESPECIAL BAIRRO DA LIBERDADE
              </div>
              <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
                {liberdade.titulo}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {liberdade.descricao} A partir da chegada do navio Kasato Maru em 1908, a Liberdade transformou-se no maior reduto da cultura e imigração oriental das Américas, integrando tradições japonesas, chinesas e coreanas com portais Torii, feiras de rua e alta gastronomia asiática.
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
                  Símbolos & Atrativos da Liberdade
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    '⛩️ Portal Torii Vermelho de 9 Metros',
                    '🏮 Luminárias Suzuran Orientais nas Ruas',
                    '🍜 Lamen Fumegante, Guioza & Sushi Artesanal',
                    '🎎 Feira de Artesanato da Praça da Liberdade',
                    '🌸 Festivais Tanabata Matsuri & Hana Matsuri'
                  ].map((item, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline Sub-cards for Liberdade */}
              <div className="pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Marcos Históricos da Imigração Oriental em SP
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      ano: 1908,
                      titulo: 'Chegada do Navio Kasato Maru',
                      desc: 'Chegam a Santos os primeiros 781 imigrantes japoneses que estabeleceram residência no centro da capital.'
                    },
                    {
                      ano: 1912,
                      titulo: 'Fixação na Rua Conde de Sarzedas',
                      desc: 'Início do comércio e hospedarias japonesas que deram origem à expansão do bairro da Liberdade.'
                    },
                    {
                      ano: 1975,
                      titulo: 'Inauguração da Feira da Liberdade',
                      desc: 'Criação oficial da feira de artesanato e culinária que atrai milhares de visitantes aos finais de semana.'
                    },
                    {
                      ano: 2018,
                      titulo: 'Estação Japão-Liberdade do Metrô',
                      desc: 'Homenagem oficial da Linha 1-Azul à valiosa herança e contribuição nipônica para São Paulo.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                      <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {item.ano}
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-white">{item.titulo}</h5>
                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl">
                <img
                  src={liberdade.imagemPrincipal}
                  alt="Bairro da Liberdade"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Section 4: Culinária & Gastronômia */}
      <FadeIn direction="up">
        <section id="culinaria" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400">
                <Utensils className="h-4 w-4" /> GASTRONOMIA PAULISTA
              </div>
              <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                Culinária Caipira, Caiçara e Urbana
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedCulinaria.map((prato, idx) => (
              <FadeIn key={prato.id} delayMs={(idx % 3) * 100} durationMs={550}>
                <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl hover:border-orange-500/40 transition">
                  <div className="h-48 w-full overflow-hidden bg-slate-950">
                    <img src={prato.imagemPrincipal} alt={prato.titulo} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                      {prato.categoria} · {prato.cidadeOuRegiao}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {prato.titulo}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3">
                      {prato.descricao}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Section: Artesanato Paulista */}
      <FadeIn direction="up">
        <section id="artesanato" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Palette className="h-4 w-4" /> ARTESANATO & TRADIÇÕES
              </div>
              <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                Artesanato & Saber Fazer Popular
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Peças em cerâmica de alta temperatura de Cunha, tecelagem tradicional, esculturas em madeira e arte caiçara.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedArtesanato.map((item, idx) => (
              <FadeIn key={item.id} delayMs={(idx % 3) * 100} durationMs={550}>
                <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl hover:border-amber-500/40 transition flex flex-col justify-between">
                  <div>
                    <div className="h-48 w-full overflow-hidden bg-slate-950 relative">
                      <img src={item.imagem} alt={item.titulo} className="h-full w-full object-cover" />
                      <span className="absolute top-3 left-3 rounded-md bg-amber-500/90 border border-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                        {item.categoria}
                      </span>
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {item.cidade} · {item.regiao}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white">
                        {item.titulo}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-3">
                        {item.descricao}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400 pt-1">
                        <strong>Material:</strong> {item.material}
                      </p>
                    </div>
                  </div>

                  {item.curiosidade && (
                    <div className="p-5 pt-0">
                      <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-[11px] text-amber-300/80 font-mono">
                        💡 {item.curiosidade}
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Section 5: "Você Sabia?" Flip Curiosidades */}
      <FadeIn direction="up">
        <section id="curiosidades" className="scroll-mt-24 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-400">
              <HelpCircle className="h-4 w-4" /> CURIOSIDADES PAULISTAS
            </div>
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              Você Sabia? — Clique no Card para Revelar a Resposta
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedCuriosidades.map((cur, idx) => {
              const isFlipped = activeFlippedCard === cur.id;

              return (
                <FadeIn key={cur.id} delayMs={(idx % 3) * 100} durationMs={550}>
                  <div
                    onClick={() => setActiveFlippedCard(isFlipped ? null : cur.id)}
                    className="group relative h-64 w-full cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl hover:border-purple-500/50 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">
                        {cur.categoria}
                      </span>
                      <h3 className="font-serif text-base font-bold text-white leading-snug">
                        {isFlipped ? '💡 RESPOSTA:' : cur.pergunta}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isFlipped ? cur.resposta : 'Clique no card para virar e descobrir a resposta!'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 pt-4 border-t border-slate-800">
                      <span>{cur.cidadeOuRegiao}</span>
                      <span>{isFlipped ? '↩ Ocultar' : '✦ Virar Card'}</span>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>
      </FadeIn>

      {/* Section 6: SP History Timeline */}
      <FadeIn direction="up">
        <section id="historia" className="scroll-mt-24 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <HistoryIcon className="h-4 w-4" /> LINHA DO TEMPO
          </div>
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Marcos Decisivos da História de São Paulo
          </h2>

          <div className="space-y-4">
            {publishedHistoria.map((evento, index) => (
              <FadeIn key={evento.id} delayMs={index * 60} durationMs={500}>
                <div className="relative pl-6 border-l-2 border-indigo-500/40 space-y-1">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-indigo-500 border-2 border-slate-900" />
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                      {evento.dataOuAno} ({evento.periodo})
                    </span>
                    <h3 className="text-base font-bold text-white">{evento.titulo}</h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                    {evento.descricao}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Section 7: Quiz Banner Call To Action */}
      <FadeIn direction="up" durationMs={750}>
        <section id="quiz" className="scroll-mt-24 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-500/10 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-lg">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl max-w-xl mx-auto">
            Pronto para testar seus conhecimentos no Quiz da Feira Cultural?
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Responda o questionário oficial, acumule pontos e conquiste seu Certificado de Participação do Colégio Simetria!
          </p>
          <div>
            <button
              onClick={onNavigateToQuiz}
              className="rounded-xl bg-amber-500 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition shadow-xl shadow-amber-500/20"
            >
              Iniciar Quiz Agora
            </button>
          </div>
        </section>
      </FadeIn>

      {/* City Detail Modal */}
      {selectedCityDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in-scale">
            <button
              onClick={() => setSelectedCityDetail(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-36 w-full sm:w-52 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-500/40 shadow-xl">
                <img
                  src={selectedCityDetail.imagemPrincipal}
                  alt={selectedCityDetail.titulo}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                  {selectedCityDetail.regiaoNome}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {selectedCityDetail.titulo}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCityDetail.descricao}
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <span>População: {selectedCityDetail.populacao || 'N/A'}</span>
                  <span>·</span>
                  <span>Distância da Capital: {selectedCityDetail.distanciaCapital || '0 km'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                História & Destaques Culturais
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedCityDetail.historia}
              </p>

              {selectedCityDetail.gastronomia && (
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-300">
                  <strong className="text-amber-400 block mb-1">Gastronomia Típica:</strong>
                  {selectedCityDetail.gastronomia}
                </div>
              )}

              {selectedCityDetail.curiosidades && selectedCityDetail.curiosidades.length > 0 && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                    <Info className="h-3.5 w-3.5" /> Curiosidade
                  </div>
                  <p className="text-xs text-amber-200/90">
                    {selectedCityDetail.curiosidades[0]}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCityDetail(null)}
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ponto Turistico Detail Modal */}
      {selectedPontoDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-blue-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in-scale">
            <button
              onClick={() => setSelectedPontoDetail(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-36 w-full sm:w-52 shrink-0 overflow-hidden rounded-2xl border-2 border-blue-500/40 shadow-xl">
                <img
                  src={selectedPontoDetail.imagemPrincipal}
                  alt={selectedPontoDetail.titulo}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded">
                  {selectedPontoDetail.categoria} · {selectedPontoDetail.cidadeNome}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {selectedPontoDetail.titulo}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedPontoDetail.descricao}
                </p>
                {selectedPontoDetail.endereco && (
                  <p className="text-[11px] font-mono text-slate-400 pt-1">
                    📍 {selectedPontoDetail.endereco}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                História e Importância
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedPontoDetail.historia}
              </p>

              {selectedPontoDetail.curiosidade && (
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 mb-1">
                    <Info className="h-3.5 w-3.5" /> Curiosidade Histórica
                  </div>
                  <p className="text-xs text-blue-200/90">
                    {selectedPontoDetail.curiosidade}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPontoDetail(null)}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
