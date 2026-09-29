import React, { useState, useEffect } from 'react';
import {
  getCidades,
  getPontosTuristicos,
  getPaulistaContent,
  getMercadaoProdutos,
  getLiberdadeContent,
  getCulinaria,
  getHistoria,
  getCuriosidades,
  getModoFeira
} from '../services/storageService';
import { playClickSound } from '../services/audioService';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  Sparkles,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';

interface FairModeModalProps {
  onClose: () => void;
}

interface SlideItem {
  id: string;
  categoria: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  imagem: string;
  badge: string;
}

export const FairModeModal: React.FC<FairModeModalProps> = ({ onClose }) => {
  const modoFeiraConfig = getModoFeira();
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(modoFeiraConfig.autoplay);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Compile slides from active database entities
    const items: SlideItem[] = [];

    // Cities
    const cidades = getCidades().filter((c) => c.status === 'PUBLICADO');
    cidades.forEach((c) => {
      items.push({
        id: c.id,
        categoria: 'CIDADE PAULISTA',
        titulo: c.titulo,
        subtitulo: c.regiaoNome,
        descricao: c.descricao,
        imagem: c.imagemPrincipal,
        badge: `População: ${c.populacao || 'N/A'}`
      });
    });

    // Paulista
    const paulista = getPaulistaContent();
    items.push({
      id: paulista.id,
      categoria: 'ESPECIAL AV. PAULISTA',
      titulo: paulista.titulo,
      subtitulo: paulista.subtitulo,
      descricao: paulista.descricao,
      imagem: paulista.imagemPrincipal,
      badge: 'Coração Cultural de SP'
    });

    // Liberdade
    const liberdade = getLiberdadeContent();
    items.push({
      id: liberdade.id,
      categoria: 'BAIRRO DA LIBERDADE',
      titulo: liberdade.titulo,
      subtitulo: liberdade.subtitulo,
      descricao: liberdade.descricao,
      imagem: liberdade.imagemPrincipal,
      badge: 'Cultura Asiática'
    });

    // Culinária
    const culinaria = getCulinaria().filter((c) => c.status === 'PUBLICADO');
    culinaria.forEach((c) => {
      items.push({
        id: c.id,
        categoria: 'GASTRONOMIA PAULISTA',
        titulo: c.titulo,
        subtitulo: c.cidadeOuRegiao,
        descricao: c.descricao,
        imagem: c.imagemPrincipal,
        badge: c.categoria
      });
    });

    // Curiosidades
    const curiosidades = getCuriosidades().filter((c) => c.status === 'PUBLICADO');
    curiosidades.forEach((c) => {
      items.push({
        id: c.id,
        categoria: 'VOCÊ SABIA?',
        titulo: c.pergunta,
        subtitulo: c.cidadeOuRegiao,
        descricao: c.resposta,
        imagem: c.imagem || '/src/assets/images/sp_hero_banner_1790701710531.jpg',
        badge: c.categoria
      });
    });

    setSlides(items);
  }, []);

  // Timer interval loop
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;

    const intervalTime = (modoFeiraConfig.tempoTransicaoSegundos || 8) * 1000;
    const stepTime = 100;
    const stepProgress = (stepTime / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % slides.length);
          return 0;
        }
        return prev + stepProgress;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length, modoFeiraConfig.tempoTransicaoSegundos]);

  const handleNext = () => {
    playClickSound();
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    playClickSound();
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white select-none overflow-hidden animate-fade-in">
      {/* Top Bar Controls */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-white">
              FEIRA CULTURAL SIMETRIA — MODO APRESENTAÇÃO
            </h3>
            <p className="text-[10px] text-amber-400 font-mono">
              Slide {currentIndex + 1} de {slides.length} · Transição a cada {modoFeiraConfig.tempoTransicaoSegundos || 8}s
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            title="Tela Cheia"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700"
          >
            <Maximize className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-500 transition"
          >
            <X className="h-4 w-4" /> Sair
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-900">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Slide Content Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Background Blur Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-110 transition-all duration-1000"
          style={{ backgroundImage: `url(${currentSlide.imagem})` }}
        />

        <div key={currentSlide.id} className="relative z-10 mx-auto max-w-6xl w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
          {/* Left Text Presentation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              {currentSlide.categoria}
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider block">
                {currentSlide.subtitulo}
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                {currentSlide.titulo}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              {currentSlide.descricao}
            </p>

            <div className="inline-block rounded-xl bg-slate-900/90 border border-slate-700/80 px-4 py-2 text-xs font-mono text-amber-400 shadow-xl">
              ✦ {currentSlide.badge}
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative h-80 sm:h-96 w-full max-w-md overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-slate-900 shadow-2xl shadow-amber-500/10">
              <img
                src={currentSlide.imagem}
                alt={currentSlide.titulo}
                className="h-full w-full object-cover transform hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-amber-500 hover:text-slate-950 transition shadow-2xl"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-amber-500 hover:text-slate-950 transition shadow-2xl"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Bar Player Controls */}
      <div className="flex h-16 items-center justify-center border-t border-slate-800/80 bg-slate-950/90 gap-4">
        <button
          onClick={() => {
            playClickSound();
            setIsPlaying(!isPlaying);
          }}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 fill-slate-950" /> Pausar
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-slate-950" /> Continuar
            </>
          )}
        </button>
      </div>
    </div>
  );
};
